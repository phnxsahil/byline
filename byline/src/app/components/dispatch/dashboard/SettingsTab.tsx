import React from "react";
import {
  IconApi,
  IconBrandGithub,
  IconBulb,
  IconKey,
  IconMicrophone,
  IconRefresh,
  IconShieldX,
  IconSparkles,
  IconAlertCircle,
} from "@tabler/icons-react";

import { getVoiceProfile, type Project as ApiProject, type DraftRead } from "../../../api";

interface SettingsTabProps {
  isMobile: boolean;
  projects?: ApiProject[];
  drafts?: DraftRead[];
}

type SettingsSection = {
  id: "connect" | "voice" | "behavior" | "developer" | "danger";
  label: string;
  icon: React.ComponentType<{ size?: number; stroke?: number }>;
  description: string;
};

const SECTIONS: SettingsSection[] = [
  { id: "connect", label: "Connect", icon: IconBrandGithub, description: "Providers, webhooks, and outlet connections." },
  { id: "voice", label: "Voice & Brand", icon: IconMicrophone, description: "Voice profile, banned phrases, and platform tone." },
  { id: "behavior", label: "Pipeline Behavior", icon: IconSparkles, description: "Approval rules and agent preferences." },
  { id: "developer", label: "API & Developer", icon: IconApi, description: "Keys, self-host status, and automation hooks." },
  { id: "danger", label: "Danger Zone", icon: IconShieldX, description: "Export data or reset pipeline state." },
];

const APPROVAL_ROWS = ["LinkedIn", "X", "Reddit", "Threads"];

const APPROVAL_MODES = [
  { id: "auto-post", label: "auto-post", color: "var(--by-green)", background: "rgba(63,185,80,0.12)" },
  { id: "review required", label: "review required", color: "var(--by-amber)", background: "rgba(245,158,11,0.12)" },
  { id: "drafts only", label: "drafts only", color: "var(--by-text-2)", background: "rgba(234,229,220,0.06)" },
] as const;

const DEFAULT_APPROVAL_MODE: (typeof APPROVAL_MODES)[number]["id"] = "review required";
const DEFAULT_OVERRIDES: Record<string, typeof APPROVAL_MODES[number]["id"]> = {
  LinkedIn: "auto-post",
  X: "review required",
  Reddit: "drafts only",
  Threads: "review required",
};

function SectionShell({
  title,
  eyebrow,
  children,
  danger = false,
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <section
      style={{
        background: "var(--by-bg-2)",
        border: `0.5px solid ${danger ? "color-mix(in srgb, var(--by-red) 45%, var(--by-border))" : "var(--by-border)"}`,
        borderRadius: 8,
        padding: 18,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            color: danger ? "var(--by-red)" : "var(--by-text-3)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {eyebrow}
        </span>
        <h2 style={{ margin: 0, fontSize: 18, color: "var(--by-text)" }}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function TokenRow({ label, value, meta }: { label: string; value: string; meta: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        padding: "10px 0",
        borderBottom: "0.5px solid var(--by-border)",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, color: "var(--by-text)" }}>{label}</div>
        <div style={{ fontSize: 11, color: "var(--by-text-3)", marginTop: 3 }}>{meta}</div>
      </div>
      <code
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          color: "var(--by-text-2)",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </code>
    </div>
  );
}

function SettingsPreviewPanel({ activeSection, approvalMode, overrides, realVoiceProfile }: {
  activeSection: string;
  approvalMode: string;
  overrides: Record<string, string>;
  realVoiceProfile: any;
}) {
  return (
    <div style={{
      background: "var(--by-bg-2)",
      border: "0.5px solid var(--by-border)",
      borderRadius: 8,
      padding: 16,
      display: "flex",
      flexDirection: "column",
      gap: 16,
      alignSelf: "stretch",
    }}>
      {activeSection === "connect" && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "var(--text-secondary)", opacity: 0.6, textTransform: "uppercase" }}>
              Stack Connections
            </span>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>Status Monitor</div>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 10, background: "rgba(255,255,255,0.01)", padding: 12, borderRadius: 6, border: "0.5px solid var(--by-border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "var(--by-text-2)" }}>Anthropic (LLM)</span>
              <span style={{ fontSize: 10, padding: "2px 6px", background: "rgba(63,185,80,0.1)", color: "var(--by-green)", borderRadius: 4 }}>Connected</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "0.5px solid var(--by-border)", paddingTop: 8 }}>
              <span style={{ fontSize: 11, color: "var(--by-text-2)" }}>OpenAI (Whisper)</span>
              <span style={{ fontSize: 10, padding: "2px 6px", background: "rgba(63,185,80,0.1)", color: "var(--by-green)", borderRadius: 4 }}>Connected</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "0.5px solid var(--by-border)", paddingTop: 8 }}>
              <span style={{ fontSize: 11, color: "var(--by-text-2)" }}>GitHub Webhooks</span>
              <span style={{ fontSize: 10, padding: "2px 6px", background: "rgba(245,158,11,0.1)", color: "var(--by-amber)", borderRadius: 4 }}>Listening</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "0.5px solid var(--by-border)", paddingTop: 8 }}>
              <span style={{ fontSize: 11, color: "var(--by-text-2)" }}>Composio OAuth</span>
              <span style={{ fontSize: 10, padding: "2px 6px", background: "rgba(63,185,80,0.1)", color: "var(--by-green)", borderRadius: 4 }}>Connected</span>
            </div>
          </div>
          
          <div style={{ fontSize: 11, color: "var(--by-text-3)", lineHeight: 1.5 }}>
            GitHub commits are automatically monitored. If a pushed commit matches the target project repository, Byline immediately schedules a draft generation pipeline run.
          </div>
        </>
      )}

      {activeSection === "voice" && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "var(--text-secondary)", opacity: 0.6, textTransform: "uppercase" }}>
              Brand & Voice Profile
            </span>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>Active Heuristics</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, background: "rgba(255,255,255,0.01)", padding: 12, borderRadius: 6, border: "0.5px solid var(--by-border)" }}>
            <div>
              <div style={{ fontSize: 11, color: "var(--by-text-2)" }}>Target Length</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--by-accent)", marginTop: 2 }}>
                {realVoiceProfile?.avg_post_length || 220} words avg
              </div>
            </div>
            <div style={{ borderTop: "0.5px solid var(--by-border)", paddingTop: 8 }}>
              <div style={{ fontSize: 11, color: "var(--by-text-3)", marginBottom: 4 }}>Scrubbed Phrases</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {(realVoiceProfile?.banned_phrases || ["excited to announce", "humbled", "game-changer"]).map((phrase: string) => (
                  <span
                    key={phrase}
                    style={{
                      padding: "2px 6px",
                      borderRadius: 4,
                      background: "rgba(248,113,113,0.08)",
                      color: "var(--by-red)",
                      fontSize: 10,
                    }}
                  >
                    {phrase}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ fontSize: 11, color: "var(--by-text-3)", lineHeight: 1.5 }}>
            Byline automatically strips corporate filler during drafting. The Critic agent rejects any posts that fail the anti-slop guidelines.
          </div>
        </>
      )}

      {activeSection === "behavior" && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "var(--text-secondary)", opacity: 0.6, textTransform: "uppercase" }}>
              Pipeline Routing
            </span>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>Active Flow Mode</div>
          </div>

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            background: "rgba(255,255,255,0.01)",
            padding: 14,
            borderRadius: 6,
            border: "0.5px solid var(--by-border)",
            fontSize: 11,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ padding: "4px 8px", background: "var(--by-accent)", color: "#fff", borderRadius: 4, fontSize: 9, fontWeight: "bold" }}>INGEST</div>
              <span style={{ color: "var(--by-text-3)" }}>→</span>
              <div style={{ padding: "4px 8px", background: "var(--by-bg-3)", color: "var(--by-text)", borderRadius: 4, fontSize: 9 }}>GRAPH</div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6, paddingLeft: 20 }}>
              <span style={{ color: "var(--by-text-3)" }}>↳</span>
              <div style={{
                padding: "6px 10px",
                background: "rgba(245,158,11,0.08)",
                color: "var(--by-amber)",
                border: "0.5px solid var(--by-amber)",
                borderRadius: 4,
                fontSize: 10,
                fontWeight: 600,
                textTransform: "uppercase",
              }}>
                {approvalMode}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6, paddingLeft: 40 }}>
              <span style={{ color: "var(--by-text-3)" }}>→</span>
              <div style={{ padding: "4px 8px", background: "#3FB950", color: "#fff", borderRadius: 4, fontSize: 9, fontWeight: "bold" }}>PUBLISH</div>
            </div>
          </div>

          <div style={{ fontSize: 11, color: "var(--by-text-3)", lineHeight: 1.5 }}>
            Approval mode controls whether drafts require explicit human review on The Desk before posting or bypass it.
          </div>
        </>
      )}

      {activeSection === "developer" && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "var(--text-secondary)", opacity: 0.6, textTransform: "uppercase" }}>
              API Test Suite
            </span>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>Quick Test cURL</div>
          </div>

          <div style={{
            background: "#0A0A0A",
            border: "0.5px solid var(--by-border)",
            borderRadius: 6,
            padding: 10,
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 9,
            color: "rgba(255,255,255,0.8)",
            lineHeight: 1.5,
            overflowX: "auto"
          }}>
            curl -X POST http://localhost:8000/api/voice \<br />
            &nbsp;&nbsp;-F "project_id=PROJECT_ID" \<br />
            &nbsp;&nbsp;-F "file=@voice.webm"
          </div>

          <div style={{ fontSize: 11, color: "var(--by-text-3)", lineHeight: 1.5 }}>
            Use the `/api/dispatch` and `/api/voice` endpoints to integrate Byline into your customized shell scripts.
          </div>
        </>
      )}

      {activeSection === "danger" && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "var(--text-secondary)", opacity: 0.6, textTransform: "uppercase" }}>
              Danger Zone
            </span>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--by-red)" }}>System Warning</div>
          </div>

          <div style={{
            background: "rgba(248,81,73,0.05)",
            border: "0.5px solid rgba(248,81,73,0.2)",
            borderRadius: 6,
            padding: 12,
            display: "flex",
            flexDirection: "column",
            gap: 10
          }}>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <IconAlertCircle size={16} color="var(--by-red)" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: 11, color: "var(--by-text)", lineHeight: 1.4 }}>
                Resetting the database clears all vector indexes, voice version profiles, and platform drafts.
              </div>
            </div>
          </div>

          <div style={{ fontSize: 11, color: "var(--by-text-3)", lineHeight: 1.5 }}>
            Ensure you export your projects and drafts before initiating a reset. Data recovery is not possible.
          </div>
        </>
      )}
    </div>
  );
}

export function SettingsTab({ isMobile, projects = [], drafts = [] }: SettingsTabProps) {
  const [activeSection, setActiveSection] = React.useState<SettingsSection["id"]>("behavior");
  const [approvalMode, setApprovalMode] = React.useState<(typeof APPROVAL_MODES)[number]["id"]>(() => {
    try {
      const saved = localStorage.getItem("byline.settings.approvalMode");
      if (saved && APPROVAL_MODES.some(m => m.id === saved)) {
        return saved as any;
      }
    } catch {}
    return DEFAULT_APPROVAL_MODE;
  });
  const [overrides, setOverrides] = React.useState<Record<string, typeof APPROVAL_MODES[number]["id"]>>(() => {
    try {
      const saved = localStorage.getItem("byline.settings.overrides");
      if (saved) {
        const parsed = JSON.parse(saved);
        const validated: any = {};
        for (const platform of APPROVAL_ROWS) {
          const val = parsed[platform];
          if (val && APPROVAL_MODES.some(m => m.id === val)) {
            validated[platform] = val;
          } else {
            validated[platform] = DEFAULT_OVERRIDES[platform as keyof typeof DEFAULT_OVERRIDES] || DEFAULT_APPROVAL_MODE;
          }
        }
        return validated;
      }
    } catch {}
    return { ...DEFAULT_OVERRIDES };
  });
  const [confirmReset, setConfirmReset] = React.useState(false);
  const [realVoiceProfile, setRealVoiceProfile] = React.useState<any>(null);

  React.useEffect(() => {
    getVoiceProfile()
      .then(profile => setRealVoiceProfile(profile))
      .catch(err => console.warn("Failed to load voice profile for export", err));
  }, []);

  // Persist on change
  React.useEffect(() => {
    try {
      localStorage.setItem("byline.settings.approvalMode", approvalMode);
    } catch {}
  }, [approvalMode]);

  React.useEffect(() => {
    try {
      localStorage.setItem("byline.settings.overrides", JSON.stringify(overrides));
    } catch {}
  }, [overrides]);

  const handleToggleOverride = (platform: string) => {
    const currentMode = overrides[platform];
    const currentIndex = APPROVAL_MODES.findIndex(m => m.id === currentMode);
    const nextIndex = (currentIndex + 1) % APPROVAL_MODES.length;
    const nextMode = APPROVAL_MODES[nextIndex].id;
    setOverrides(prev => ({
      ...prev,
      [platform]: nextMode
    }));
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      projects: projects,
      voiceProfile: realVoiceProfile || {
        avg_post_length: 220,
        opener_patterns: ["I spent X days on Y and Z was the hard part", "Here's what nobody tells you about..."],
        banned_phrases: ["excited to announce", "humbled", "thrilled to share", "game-changer"],
      },
      drafts: drafts,
      approvalMode,
      overrides,
    }, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "byline_settings_export.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleReset = () => {
    setConfirmReset(false);
    try {
      localStorage.removeItem("byline.settings.approvalMode");
      localStorage.removeItem("byline.settings.overrides");
    } catch {}
    setApprovalMode(DEFAULT_APPROVAL_MODE);
    setOverrides({ ...DEFAULT_OVERRIDES });
  };

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: isMobile ? "16px" : "24px",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "240px minmax(0, 1fr) 300px",
        gap: 18,
        alignItems: "start",
      }}
    >
      <aside
        style={{
          background: "var(--by-bg-2)",
          border: "0.5px solid var(--by-border)",
          borderRadius: 8,
          padding: 10,
          display: "flex",
          flexDirection: isMobile ? "row" : "column",
          gap: 6,
          overflowX: isMobile ? "auto" : "visible",
        }}
      >
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          const active = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => {
                setActiveSection(section.id);
                setConfirmReset(false);
              }}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                width: isMobile ? "auto" : "100%",
                minWidth: isMobile ? 180 : undefined,
                padding: "10px 12px",
                borderRadius: 6,
                border: "none",
                background: active ? "rgba(232,94,44,0.12)" : "transparent",
                color: active ? "var(--by-text)" : "var(--by-text-2)",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <Icon size={16} stroke={1.7} />
              <span style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{section.label}</span>
                <span style={{ fontSize: 11, color: "var(--by-text-3)", lineHeight: 1.4 }}>
                  {section.description}
                </span>
              </span>
            </button>
          );
        })}
      </aside>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {activeSection === "connect" && (
          <SectionShell title="Platform Integrations" eyebrow="Connect">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", background: "var(--by-bg-3)", borderRadius: 6, border: "0.5px solid var(--by-border)", transition: "border-color 100ms ease" }} onMouseEnter={e => e.currentTarget.style.borderColor="var(--by-text-3)"} onMouseLeave={e => e.currentTarget.style.borderColor="var(--by-border)"}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <IconBrandGithub size={24} color="var(--by-text)" />
                  <div>
                    <div style={{ fontSize: 13, color: "var(--by-text)", fontWeight: 600 }}>GitHub Source Monitor</div>
                    <div style={{ fontSize: 11, color: "var(--by-text-3)", marginTop: 4 }}>Watching <span style={{ color: "var(--by-text-2)" }}>fltrd.tech, byline, stash</span> for code milestones.</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 10, color: "var(--by-green)", background: "rgba(63,185,80,0.1)", padding: "2px 6px", borderRadius: 4, fontWeight: 600 }}>Active</span>
                  <button style={{ background: "rgba(255,255,255,0.05)", border: "0.5px solid var(--by-border)", color: "var(--by-text)", padding: "6px 12px", borderRadius: 4, fontSize: 11, cursor: "pointer", transition: "background 100ms" }} onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.1)"} onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.05)"}>Configure</button>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", background: "var(--by-bg-3)", borderRadius: 6, border: "0.5px solid var(--by-border)", transition: "border-color 100ms ease" }} onMouseEnter={e => e.currentTarget.style.borderColor="var(--by-text-3)"} onMouseLeave={e => e.currentTarget.style.borderColor="var(--by-border)"}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", background: "#0A66C2", borderRadius: 4, color: "#fff", fontWeight: "bold", fontSize: 14 }}>in</div>
                  <div>
                    <div style={{ fontSize: 13, color: "var(--by-text)", fontWeight: 600 }}>LinkedIn</div>
                    <div style={{ fontSize: 11, color: "var(--by-text-3)", marginTop: 4 }}>Composio OAuth token valid. Ready to post.</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 10, color: "var(--by-green)", background: "rgba(63,185,80,0.1)", padding: "2px 6px", borderRadius: 4, fontWeight: 600 }}>Active</span>
                  <button style={{ background: "rgba(255,255,255,0.05)", border: "0.5px solid var(--by-border)", color: "var(--by-text)", padding: "6px 12px", borderRadius: 4, fontSize: 11, cursor: "pointer", transition: "background 100ms" }} onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.1)"} onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.05)"}>Disconnect</button>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", background: "var(--by-bg-3)", borderRadius: 6, border: "0.5px solid var(--by-border)", transition: "border-color 100ms ease" }} onMouseEnter={e => e.currentTarget.style.borderColor="var(--by-text-3)"} onMouseLeave={e => e.currentTarget.style.borderColor="var(--by-border)"}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, opacity: 0.6 }}>
                  <div style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", background: "#000", borderRadius: 4, color: "#fff", fontWeight: "bold", fontSize: 14, border: "1px solid rgba(255,255,255,0.2)" }}>𝕏</div>
                  <div>
                    <div style={{ fontSize: 13, color: "var(--by-text)", fontWeight: 600 }}>X (Twitter)</div>
                    <div style={{ fontSize: 11, color: "var(--by-text-3)", marginTop: 4 }}>Connect to unlock thread publishing.</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button style={{ background: "var(--by-accent)", border: "none", color: "#fff", padding: "6px 12px", borderRadius: 4, fontSize: 11, cursor: "pointer", fontWeight: 600, transition: "opacity 100ms" }} onMouseEnter={e => e.currentTarget.style.opacity="0.8"} onMouseLeave={e => e.currentTarget.style.opacity="1"}>Connect</button>
                </div>
              </div>
            </div>
          </SectionShell>
        )}

        {activeSection === "voice" && (
          <SectionShell title="Voice & Brand Guardrails" eyebrow="Voice">
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.4fr 1fr", gap: 14 }}>
                <div style={{ background: "var(--by-bg-3)", borderRadius: 8, padding: 16, border: "0.5px solid var(--by-border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,102,0,0.1)", borderRadius: 6 }}>
                      <IconBulb size={16} stroke={1.7} color="var(--by-accent)" />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, color: "var(--by-text)", fontWeight: 600 }}>Active Voice Profile</div>
                      <div style={{ fontSize: 11, color: "var(--by-text-3)" }}>Learned from your past posts</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--by-text)", lineHeight: 1.6, background: "rgba(255,255,255,0.02)", padding: 12, borderRadius: 6, border: "0.5px solid var(--by-border)" }}>
                    "lowercase on casual channels, sentence case on LinkedIn, hook-led openings, short paragraphs, no corporate filler."
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                    <button style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "0.5px solid var(--by-border)", background: "rgba(255,255,255,0.05)", color: "var(--by-text)", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, cursor: "pointer", transition: "background 100ms", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }} onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.1)"} onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.05)"}>
                      <IconRefresh size={14} stroke={1.6} />
                      Retrain Voice
                    </button>
                  </div>
                </div>
                <div style={{ background: "var(--by-bg-3)", borderRadius: 8, padding: 16, border: "0.5px solid var(--by-border)", display: "flex", flexDirection: "column" }}>
                  <div style={{ fontSize: 13, color: "var(--by-text)", fontWeight: 600, marginBottom: 4 }}>Banned Phrases</div>
                  <div style={{ fontSize: 11, color: "var(--by-text-3)", marginBottom: 12 }}>Critic agent will reject drafts using these.</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, flex: 1, alignContent: "flex-start" }}>
                    {["excited to announce", "humbled", "thrilled to share", "game-changer", "synergy", "delve"].map((phrase) => (
                      <span
                        key={phrase}
                        style={{ padding: "4px 8px", borderRadius: 4, background: "rgba(248,81,73,0.1)", border: "0.5px solid rgba(248,81,73,0.2)", color: "var(--by-red)", fontSize: 11 }}
                      >
                        {phrase}
                      </span>
                    ))}
                  </div>
                  <button style={{ marginTop: 12, width: "100%", padding: "6px 0", borderRadius: 4, border: "0.5px dashed var(--by-border)", background: "transparent", color: "var(--by-text-3)", fontSize: 11, cursor: "pointer" }}>+ Add Phrase</button>
                </div>
              </div>
            </div>
          </SectionShell>
        )}

        {activeSection === "behavior" && (
          <SectionShell title="Pipeline behavior" eyebrow="Behavior">
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "0.5px solid var(--by-border)" }}>
                <div>
                  <div style={{ fontSize: 13, color: "var(--by-text)" }}>Approval Mode</div>
                  <div style={{ fontSize: 11, color: "var(--by-text-3)", marginTop: 3 }}>Choose how strict the critic should be before drafts move forward.</div>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  {APPROVAL_MODES.map((mode) => {
                    const active = approvalMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => setApprovalMode(mode.id)}
                        style={{
                          border: `0.5px solid ${active ? mode.color : "var(--by-border)"}`,
                          background: active ? mode.background : "transparent",
                          color: mode.color,
                          borderRadius: 999,
                          padding: "6px 10px",
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: 10,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          cursor: "pointer",
                        }}
                      >
                        {mode.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div style={{ background: "var(--by-bg-3)", borderRadius: 6, border: "0.5px solid var(--by-border)", overflow: "hidden" }}>
                <div style={{ padding: "12px 14px", borderBottom: "0.5px solid var(--by-border)", fontSize: 12, color: "var(--by-text)" }}>
                  Per-platform approval overrides (click badge to toggle)
                </div>
                {APPROVAL_ROWS.map((row, index) => {
                  const mode = overrides[row];
                  const token = APPROVAL_MODES.find((entry) => entry.id === mode) || APPROVAL_MODES.find(m => m.id === "review required")!;
                  return (
                    <div
                      key={row}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto",
                        gap: 12,
                        padding: "10px 14px",
                        borderBottom: index < APPROVAL_ROWS.length - 1 ? "0.5px solid var(--by-border)" : "none",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: 12, color: "var(--by-text-2)" }}>{row}</span>
                      <button
                        onClick={() => handleToggleOverride(row)}
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: 10,
                          color: token.color,
                          padding: "4px 10px",
                          borderRadius: 999,
                          border: `0.5px solid ${token.color}`,
                          background: token.background,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                        title="Click to cycle approval override mode"
                      >
                        {token.label}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </SectionShell>
        )}

        {activeSection === "developer" && (
          <SectionShell title="API & developer tools" eyebrow="Developer">
            <TokenRow label="Local API" value="http://localhost:8000" meta="FastAPI dispatch endpoints backing the dashboard and CLI." />
            <TokenRow label="Frontend runtime" value="vite dev server" meta="Hot-reload is active while the dashboard shell is being rebuilt." />
            <TokenRow label="Secret keys" value="managed in .env" meta="Anthropic, GitHub, Threads, and Composio credentials live outside the UI." />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button style={{ padding: "6px 10px", borderRadius: 5, border: "0.5px solid var(--by-border)", background: "transparent", color: "var(--by-text)", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, cursor: "pointer" }}>
                <IconKey size={12} stroke={1.6} style={{ marginRight: 6 }} />
                create api key
              </button>
            </div>
          </SectionShell>
        )}

        {activeSection === "danger" && (
          <SectionShell title="Danger zone" eyebrow="Danger" danger>
            <div style={{ display: "grid", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 13, color: "var(--by-text)" }}>Export all data</div>
                  <div style={{ fontSize: 11, color: "var(--by-text-3)", marginTop: 3 }}>Download projects, voice profile, and drafts as JSON before bigger migrations.</div>
                </div>
                <button
                  onClick={handleExport}
                  style={{
                    padding: "7px 10px",
                    borderRadius: 5,
                    border: "0.5px solid var(--by-border)",
                    background: "transparent",
                    color: "var(--by-text)",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    cursor: "pointer"
                  }}
                >
                  export
                </button>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 13, color: "var(--by-text)" }}>Reset pipeline</div>
                  <div style={{ fontSize: 11, color: "var(--by-text-3)", marginTop: 3 }}>Clear simulated agent state and return the dashboard to an idle shell.</div>
                </div>
                {confirmReset ? (
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button
                      onClick={handleReset}
                      style={{
                        padding: "7px 10px",
                        borderRadius: 5,
                        border: "0.5px solid var(--by-red)",
                        background: "rgba(248,113,113,0.15)",
                        color: "var(--by-red)",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 10,
                        fontWeight: "bold",
                        cursor: "pointer"
                      }}
                    >
                      confirm reset
                    </button>
                    <button
                      onClick={() => setConfirmReset(false)}
                      style={{
                        padding: "7px 10px",
                        borderRadius: 5,
                        border: "0.5px solid var(--by-border)",
                        background: "transparent",
                        color: "var(--by-text)",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 10,
                        cursor: "pointer"
                      }}
                    >
                      cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmReset(true)}
                    style={{
                      padding: "7px 10px",
                      borderRadius: 5,
                      border: "0.5px solid color-mix(in srgb, var(--by-red) 55%, transparent)",
                      background: "rgba(248,113,113,0.08)",
                      color: "var(--by-red)",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10,
                      cursor: "pointer"
                    }}
                  >
                    reset
                  </button>
                )}
              </div>
            </div>
          </SectionShell>
        )}
      </div>

      {!isMobile && (
        <SettingsPreviewPanel
          activeSection={activeSection}
          approvalMode={approvalMode}
          overrides={overrides}
          realVoiceProfile={realVoiceProfile}
        />
      )}
    </div>
  );
}
