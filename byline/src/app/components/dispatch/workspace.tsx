import {
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
  Plus,
  RefreshCcw,
  Save,
  Send,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { startTransition, useEffect, useMemo, useRef, useState } from "react";

import {
  createDispatch,
  getDispatches,
  getDrafts,
  getNarrativeArcs,
  getProjects,
  getVoiceProfile,
  openGenerationStream,
  patchDraft,
} from "@/lib/dispatch/api";
import type {
  Dispatch,
  Draft,
  NarrativeArc,
  Platform,
  Project,
  StampEvent,
  StampState,
  StampStatus,
  VoiceProfile,
} from "@/lib/dispatch/types";

const PLATFORM_ORDER: Platform[] = ["linkedin", "x", "reddit", "threads"];
const PLATFORM_LABELS: Record<Platform, string> = {
  linkedin: "LI",
  x: "X",
  reddit: "RD",
  threads: "TH",
};

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function summarize(text: string) {
  return text.length > 92 ? `${text.slice(0, 92)}…` : text;
}

function sortDrafts(drafts: Draft[]) {
  return [...drafts].sort(
    (left, right) => PLATFORM_ORDER.indexOf(left.platform) - PLATFORM_ORDER.indexOf(right.platform),
  );
}

type LiveStampMap = Record<string, Partial<Record<Platform, StampState>>>;

interface DispatchWorkspaceProps {
  onLandingClick: () => void;
}

export function DispatchWorkspace({ onLandingClick }: DispatchWorkspaceProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [arcs, setArcs] = useState<NarrativeArc[]>([]);
  const [dispatches, setDispatches] = useState<Dispatch[]>([]);
  const [voiceProfile, setVoiceProfile] = useState<VoiceProfile | null>(null);
  const [activeDispatchId, setActiveDispatchId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [activePlatform, setActivePlatform] = useState<Platform>("linkedin");
  const [editorValue, setEditorValue] = useState("");
  const [showComposer, setShowComposer] = useState(false);
  const [composerProjectId, setComposerProjectId] = useState("");
  const [composerArcId, setComposerArcId] = useState("");
  const [composerBody, setComposerBody] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [liveStamps, setLiveStamps] = useState<LiveStampMap>({});
  const [stampAnimationNonce, setStampAnimationNonce] = useState<Record<string, number>>({});
  const generationSourceRef = useRef<EventSource | null>(null);

  async function loadWorkspace() {
    setIsLoading(true);
    try {
      const [projectsResult, arcsResult, dispatchesResult, voiceProfileResult] = await Promise.all([
        getProjects(),
        getNarrativeArcs(),
        getDispatches(),
        getVoiceProfile(),
      ]);
      startTransition(() => {
        setProjects(projectsResult);
        setArcs(arcsResult);
        setDispatches(dispatchesResult);
        setVoiceProfile(voiceProfileResult);
        setComposerProjectId((current) => current || projectsResult[0]?.id || "");
        setComposerArcId((current) => current || arcsResult[0]?.id || "");
        setActiveDispatchId((current) => current || dispatchesResult[0]?.id || null);
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadWorkspace();
    return () => generationSourceRef.current?.close();
  }, []);

  useEffect(() => {
    if (!activeDispatchId) {
      setDrafts([]);
      setEditorValue("");
      return;
    }

    void getDrafts(activeDispatchId).then((result) => {
      const ordered = sortDrafts(result);
      setDrafts(ordered);
    });
  }, [activeDispatchId]);

  useEffect(() => {
    if (!drafts.length) {
      return;
    }
    if (!drafts.find((item) => item.platform === activePlatform)) {
      setActivePlatform(drafts[0].platform);
    }
  }, [activePlatform, drafts]);

  const activeDispatch = useMemo(
    () => dispatches.find((item) => item.id === activeDispatchId) ?? null,
    [activeDispatchId, dispatches],
  );

  const activeDraft = useMemo(
    () => drafts.find((item) => item.platform === activePlatform) ?? null,
    [activePlatform, drafts],
  );

  useEffect(() => {
    setEditorValue(activeDraft?.body ?? "");
  }, [activeDraft?.body, activeDraft?.id]);

  function effectiveStamps(dispatch: Dispatch) {
    const live = liveStamps[dispatch.id] ?? {};
    return PLATFORM_ORDER.map((platform) => {
      return live[platform] ?? dispatch.stamps.find((stamp) => stamp.platform === platform) ?? {
        platform,
        status: "pending",
        draft_id: null,
        critic_score: null,
        critic_note: null,
      };
    });
  }

  function registerStampAnimation(dispatchId: string, platform: Platform) {
    const key = `${dispatchId}:${platform}`;
    setStampAnimationNonce((current) => ({ ...current, [key]: (current[key] ?? 0) + 1 }));
  }

  function mergeLiveEvent(dispatchId: string, event: StampEvent) {
    if (event.status === "error") {
      return;
    }
    setLiveStamps((current) => ({
      ...current,
      [dispatchId]: {
        ...(current[dispatchId] ?? {}),
        [event.platform]: {
          platform: event.platform,
          status: event.status,
          draft_id: event.draft_id ?? current[dispatchId]?.[event.platform]?.draft_id ?? null,
          critic_score: event.critic_score ?? current[dispatchId]?.[event.platform]?.critic_score ?? null,
          critic_note: event.critic_note ?? current[dispatchId]?.[event.platform]?.critic_note ?? null,
        },
      },
    }));
    registerStampAnimation(dispatchId, event.platform);
  }

  async function refreshAfterGeneration(dispatchId: string) {
    const [dispatchesResult, draftsResult] = await Promise.all([getDispatches(), getDrafts(dispatchId)]);
    setDispatches(dispatchesResult);
    setDrafts(sortDrafts(draftsResult));
    setIsDispatching(false);
  }

  function beginGeneration(dispatchId: string) {
    generationSourceRef.current?.close();
    setIsDispatching(true);
    generationSourceRef.current = openGenerationStream(dispatchId, {
      onMessage: (event) => {
        mergeLiveEvent(dispatchId, event);
        if ((event.status === "ready" || event.status === "flagged") && dispatchId === activeDispatchId) {
          void getDrafts(dispatchId).then((result) => setDrafts(sortDrafts(result)));
        }
      },
      onClose: () => {
        void refreshAfterGeneration(dispatchId);
      },
      onError: () => {
        void refreshAfterGeneration(dispatchId);
      },
    });
  }

  async function handleCreateDispatch() {
    if (!composerProjectId || !composerBody.trim()) {
      return;
    }
    setIsDispatching(true);
    const created = await createDispatch({
      project_id: composerProjectId,
      arc_id: composerArcId || null,
      body: composerBody.trim(),
    });
    setShowComposer(false);
    setComposerBody("");
    setActiveDispatchId(created.id);
    await loadWorkspace();
    beginGeneration(created.id);
  }

  async function persistDraft(status?: string) {
    if (!activeDraft) {
      return;
    }
    setIsSaving(true);
    try {
      const updated = await patchDraft(activeDraft.id, {
        body: editorValue,
        status,
      });
      setDrafts((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      await loadWorkspace();
    } finally {
      setIsSaving(false);
    }
  }

  async function handleApprove() {
    await persistDraft("approved");
  }

  function handleRegenerate() {
    if (!activeDispatch) {
      return;
    }
    beginGeneration(activeDispatch.id);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-paper text-ink">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-carbon">
            <LoaderCircle className="size-4 animate-spin" />
            Loading the desk
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-paper text-ink">
      <div className="mx-auto max-w-[1500px] px-4 py-4 sm:px-6">
        <header className="mb-4 flex flex-col gap-4 rounded-[28px] border border-ink/10 bg-paper-raised/70 px-5 py-4 backdrop-blur-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-stamp">
              <span className="size-2 rounded-full bg-stamp" />
              Byline desk
            </div>
            <h1 className="font-display text-3xl tracking-[-0.04em]">The Wire & The Desk</h1>
            <p className="mt-1 max-w-2xl text-sm text-carbon">
              Log one real update, stream platform stamps as the pipeline runs, and edit the resulting drafts from a single desk.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onLandingClick}
              className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm text-carbon transition-colors hover:text-ink cursor-pointer"
            >
              Back to landing
            </button>
            <button
              type="button"
              onClick={() => setShowComposer(true)}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-wire cursor-pointer"
            >
              <Plus className="size-4" />
              New milestone
            </button>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="rounded-[28px] border border-ink/10 bg-white/85 p-4 shadow-[0_16px_60px_rgba(26,25,22,0.06)]">
            <div className="mb-4 flex items-center justify-between border-b border-ink/8 pb-3">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-carbon">The Wire</div>
                <p className="mt-1 text-sm text-carbon">{dispatches.length} logged dispatches</p>
              </div>
              {isDispatching ? (
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-wire">
                  <LoaderCircle className="size-3 animate-spin" />
                  Generating
                </div>
              ) : null}
            </div>

            <div className="space-y-3">
              {dispatches.length === 0 ? (
                <button
                  type="button"
                  onClick={() => setShowComposer(true)}
                  className="flex w-full flex-col items-start gap-3 rounded-[22px] border border-dashed border-ink/15 bg-paper px-4 py-5 text-left transition-colors hover:border-wire/30 cursor-pointer"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-carbon">Nothing in the wire</span>
                  <span className="text-sm text-ink">Log a milestone to start the first real pipeline run.</span>
                </button>
              ) : null}

              {dispatches.map((dispatch) => {
                const stamps = effectiveStamps(dispatch);
                const isActive = dispatch.id === activeDispatchId;
                return (
                  <button
                    key={dispatch.id}
                    type="button"
                    onClick={() => setActiveDispatchId(dispatch.id)}
                    className={`w-full rounded-[22px] border px-4 py-4 text-left transition-all cursor-pointer ${
                      isActive
                        ? "border-wire/35 bg-wire-light shadow-[0_20px_50px_rgba(82,71,204,0.08)]"
                        : "border-ink/8 bg-paper hover:border-ink/16"
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em] text-carbon">
                      <span>{formatTimestamp(dispatch.created_at)}</span>
                      <span>{dispatch.project_name}</span>
                    </div>
                    <p className="text-sm leading-6 text-ink">{summarize(dispatch.body)}</p>
                    <div className="mt-4 flex items-center gap-2">
                      {stamps.map((stamp) => (
                        <OutletStamp
                          key={`${dispatch.id}:${stamp.platform}:${stampAnimationNonce[`${dispatch.id}:${stamp.platform}`] ?? 0}`}
                          label={PLATFORM_LABELS[stamp.platform]}
                          status={stamp.status}
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            {voiceProfile ? (
              <div className="mt-4 rounded-[20px] border border-ink/8 bg-paper px-4 py-4">
                <div className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-carbon">
                  <Sparkles className="size-3.5 text-stamp" />
                  Voice profile
                </div>
                <p className="line-clamp-5 text-sm leading-6 text-carbon">{voiceProfile.body}</p>
              </div>
            ) : null}
          </aside>

          <section className="rounded-[32px] border border-ink/10 bg-white/90 p-5 shadow-[0_24px_80px_rgba(26,25,22,0.08)]">
            {activeDispatch ? (
              <>
                <div className="flex flex-col gap-4 border-b border-ink/8 pb-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-carbon">
                      <span>{activeDispatch.project_name}</span>
                      <span className="text-ink/20">/</span>
                      <span>{formatTimestamp(activeDispatch.created_at)}</span>
                      {activeDispatch.angle ? (
                        <>
                          <span className="text-ink/20">/</span>
                          <span className="text-wire">{activeDispatch.angle}</span>
                        </>
                      ) : null}
                    </div>
                    <h2 className="max-w-4xl font-display text-3xl leading-[1.02] tracking-[-0.04em]">
                      {summarize(activeDispatch.body)}
                    </h2>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-carbon">
                      {activeDispatch.arc_name
                        ? `Arc: ${activeDispatch.arc_name}. `
                        : ""}
                      {activeDispatch.hold_reason ?? "Edit the current platform draft, approve it when it feels right, or regenerate a fresh pass."}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {PLATFORM_ORDER.map((platform) => {
                      const stamp = effectiveStamps(activeDispatch).find((item) => item.platform === platform);
                      return (
                        <button
                          key={platform}
                          type="button"
                          onClick={() => setActivePlatform(platform)}
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.24em] transition-colors cursor-pointer ${
                            activePlatform === platform
                              ? "border-wire/35 bg-wire-light text-ink"
                              : "border-ink/10 bg-paper text-carbon hover:text-ink"
                          }`}
                        >
                          <OutletStamp label={PLATFORM_LABELS[platform]} status={stamp?.status ?? "pending"} compact />
                          {PLATFORM_LABELS[platform]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
                  <div>
                    <textarea
                      value={editorValue}
                      onChange={(event) => setEditorValue(event.target.value)}
                      onBlur={() => {
                        if (activeDraft && editorValue !== activeDraft.body) {
                          void persistDraft();
                        }
                      }}
                      className="min-h-[420px] w-full rounded-[24px] border border-ink/10 bg-paper px-5 py-5 font-body text-[15px] leading-7 text-ink outline-none transition-colors focus:border-wire"
                      placeholder="Draft body will appear here once generation starts."
                    />
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => void persistDraft()}
                        disabled={!activeDraft || isSaving}
                        className="inline-flex items-center gap-2 rounded-full border border-ink/12 bg-white px-4 py-2 text-sm text-carbon transition-colors hover:text-ink disabled:opacity-50 cursor-pointer"
                      >
                        <Save className="size-4" />
                        Save draft
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleApprove()}
                        disabled={!activeDraft || isSaving}
                        className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-wire disabled:opacity-50 cursor-pointer"
                      >
                        <Send className="size-4" />
                        Approve &amp; queue
                      </button>
                      <button
                        type="button"
                        onClick={handleRegenerate}
                        disabled={!activeDispatch || isDispatching}
                        className="inline-flex items-center gap-2 rounded-full border border-ink/12 bg-white px-4 py-2 text-sm text-carbon transition-colors hover:text-ink disabled:opacity-50 cursor-pointer"
                      >
                        <RefreshCcw className={`size-4 ${isDispatching ? "animate-spin" : ""}`} />
                        Regenerate
                      </button>
                    </div>
                  </div>

                  <aside className="space-y-4">
                    <div className="rounded-[24px] border border-ink/10 bg-paper px-4 py-4">
                      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-carbon">
                        Critic note
                      </div>
                      {activeDraft?.critic_note ? (
                        <p className="border-l-2 border-stamp pl-3 text-sm italic leading-6 text-carbon">
                          {activeDraft.critic_note}
                        </p>
                      ) : (
                        <p className="text-sm leading-6 text-carbon">
                          {activeDraft
                            ? "Passed without an extra editorial note."
                            : "No draft for this platform yet."}
                        </p>
                      )}
                    </div>

                    <div className="rounded-[24px] border border-ink/10 bg-paper px-4 py-4">
                      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-carbon">
                        Draft status
                      </div>
                      <div className="space-y-3 text-sm leading-6 text-carbon">
                        <StatusRow
                          icon={activeDraft?.status === "approved" ? CheckCircle2 : AlertCircle}
                          label="Status"
                          value={activeDraft?.status ?? "pending"}
                          accent={activeDraft?.status === "approved" ? "text-mint" : "text-stamp"}
                        />
                        <StatusRow
                          icon={Sparkles}
                          label="Critic score"
                          value={activeDraft?.critic_score ? `${activeDraft.critic_score}/10` : "pending"}
                          accent="text-wire"
                        />
                        <StatusRow
                          icon={LoaderCircle}
                          label="Generation"
                          value={activeDraft ? `v${activeDraft.generation}` : "none"}
                          accent="text-carbon"
                        />
                        {activeDraft?.reddit_subreddit ? (
                          <StatusRow
                            icon={Send}
                            label="Subreddit"
                            value={activeDraft.reddit_subreddit}
                            accent="text-stamp"
                          />
                        ) : null}
                      </div>
                    </div>
                  </aside>
                </div>
              </>
            ) : (
              <div className="grid min-h-[520px] place-items-center rounded-[28px] border border-dashed border-ink/12 bg-paper">
                <div className="max-w-md text-center">
                  <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-carbon">Nothing in the desk</div>
                  <h2 className="font-display text-3xl tracking-[-0.04em]">Nothing in the wire.</h2>
                  <p className="mt-3 text-sm leading-6 text-carbon">
                    Log a milestone to start the real Phase 0 loop and watch platform stamps land in sequence.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowComposer(true)}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-wire cursor-pointer"
                  >
                    <Plus className="size-4" />
                    New milestone
                  </button>
                </div>
              </div>
            )}
          </section>
        </section>
      </div>

      {showComposer ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[30px] border border-ink/10 bg-paper p-5 shadow-[0_30px_100px_rgba(26,25,22,0.22)]">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.28em] text-carbon">New milestone</div>
                <h3 className="font-display text-3xl tracking-[-0.04em]">Send a fresh update down the wire</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowComposer(false)}
                className="rounded-full border border-ink/10 px-3 py-1.5 text-sm text-carbon transition-colors hover:text-ink cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-carbon">Project</span>
                <select
                  value={composerProjectId}
                  onChange={(event) => setComposerProjectId(event.target.value)}
                  className="w-full rounded-[18px] border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-wire"
                >
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-carbon">Narrative arc</span>
                <select
                  value={composerArcId}
                  onChange={(event) => setComposerArcId(event.target.value)}
                  className="w-full rounded-[18px] border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-wire"
                >
                  <option value="">No arc</option>
                  {arcs.map((arc) => (
                    <option key={arc.id} value={arc.id}>
                      {arc.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="mt-4 block space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-carbon">Raw milestone</span>
              <textarea
                value={composerBody}
                onChange={(event) => setComposerBody(event.target.value)}
                className="min-h-[180px] w-full rounded-[22px] border border-ink/10 bg-white px-4 py-4 text-sm leading-7 text-ink outline-none focus:border-wire"
                placeholder="Shipped pgvector retrieval for milestone memory. Draft quality improved because the pipeline now remembers the actual project context."
              />
            </label>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="max-w-xl text-sm leading-6 text-carbon">
                The desk will open the new milestone immediately and stream per-platform stamp updates as each writer completes.
              </p>
              <button
                type="button"
                onClick={() => void handleCreateDispatch()}
                disabled={!composerProjectId || !composerBody.trim() || isDispatching}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-wire disabled:opacity-50 cursor-pointer"
              >
                <Send className="size-4" />
                Log milestone
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function StatusRow({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Icon className={`size-4 ${accent}`} />
        <span>{label}</span>
      </div>
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink">{value}</span>
    </div>
  );
}

function OutletStamp({
  label,
  status,
  compact = false,
}: {
  label: string;
  status: StampStatus;
  compact?: boolean;
}) {
  const palette =
    status === "ready"
      ? "border-wire bg-wire text-paper ring-wire/22 stamp-badge-animating"
      : status === "flagged"
        ? "border-stamp bg-stamp text-paper ring-stamp/24 stamp-badge-animating"
        : status === "posted" || status === "approved"
          ? "border-mint bg-mint text-paper ring-mint/24 stamp-badge-animating"
          : status === "writing"
            ? "border-wire/40 bg-white text-wire animate-[pulse_1.5s_ease-in-out_infinite]"
            : "border-ink/14 bg-paper text-carbon";

  return (
    <span
      className={`grid place-items-center rounded-full border font-mono text-[10px] uppercase tracking-[0.18em] shadow-[0_0_0_0_var(--tw-ring-color)] ${
        compact ? "size-7" : "size-8"
      } ${palette}`}
    >
      {label}
    </span>
  );
}
