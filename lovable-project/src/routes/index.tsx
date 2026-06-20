import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";

/* ─────────────────────────────────────────── BYLINE STAMP ─────────────────────────────────────────── */

function BylineStamp({ show, onComplete }: { show: boolean; onComplete?: () => void }) {
  const [displayText, setDisplayText] = useState("");
  const fullText = "By Sahil — ";
  
  useEffect(() => {
    if (!show) {
      setDisplayText("");
      return;
    }
    
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        if (onComplete) {
          setTimeout(onComplete, 1000);
        }
      }
    }, 80);
    
    return () => clearInterval(interval);
  }, [show, onComplete]);
  
  if (!show) return null;
  
  return (
    <div className="px-5 pt-4 pb-2 font-mono text-sm text-stamp">
      {displayText}
      {displayText.length < fullText.length && <span className="animate-pulse">_</span>}
    </div>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dispatch — Your personal wire service for building in public" },
      {
        name: "description",
        content:
          "Ship things. Dispatch remembers what you built, writes platform-perfect posts in your voice, and broadcasts to LinkedIn, X, Reddit & Threads. Open source, self-hostable.",
      },
      { property: "og:title", content: "Dispatch — Ship things. Dispatch the rest." },
      {
        property: "og:description",
        content: "One dispatch in, four platform-perfect posts out. Open source. Self-hosted.",
      },
    ],
  }),
  component: LandingPage,
});

/* ─────────────────────────────────────────── NAV ─────────────────────────────────────────── */

function Navbar() {
  const [condensed, setCondensed] = useState(false);
  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed left-1/2 z-50 -translate-x-1/2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        condensed ? "top-3 w-[calc(100%-1.5rem)] max-w-3xl" : "top-6 w-[calc(100%-3rem)] max-w-5xl"
      }`}
    >
      <div
        className={`flex items-center justify-between rounded-full border border-ink/10 bg-paper/80 backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          condensed ? "px-4 py-2 shadow-lg shadow-ink/5" : "px-6 py-3 shadow-sm"
        }`}
      >
        <a href="#top" className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-stamp" />
          <span className="font-display text-base font-semibold tracking-tight uppercase">
            Dispatch
          </span>
        </a>
        <div className="hidden items-center gap-7 text-sm font-medium text-carbon md:flex">
          <a href="#problem" className="transition-colors hover:text-ink">
            Problem
          </a>
          <a href="#features" className="transition-colors hover:text-ink">
            Features
          </a>
          <a href="#preview" className="transition-colors hover:text-ink">
            The Desk
          </a>
          <Link to="/try" className="transition-colors hover:text-ink">
            Demo
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/try"
            className="rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-paper transition-colors hover:bg-wire"
          >
            Try the demo
          </Link>
        </div>
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────── HERO ─────────────────────────────────────────── */

type PlayPlatform = "LinkedIn" | "X" | "Reddit" | "Threads";

function Hero() {
  return (
    <section id="top" className="px-6 pt-40 pb-24 relative overflow-hidden">
      {/* Blueprint dotted mesh overlay */}
      <div className="absolute inset-0 bg-grid-dots opacity-70 pointer-events-none" />

      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2 relative z-10">
        <div className="animate-reveal">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-stamp/20 bg-stamp/5 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-stamp">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-stamp opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-stamp" />
            </span>
            Live wire feed active
          </div>
          <h1 className="mb-8 font-display text-6xl leading-[0.9] tracking-tighter text-balance md:text-7xl xl:text-8xl">
            Ship things.
            <br />
            <span className="text-stamp">Dispatch the rest.</span>
          </h1>
          <p className="mb-10 max-w-lg text-pretty text-base leading-relaxed text-carbon md:text-lg">
            The personal wire service for builders. Log a raw update about what you built. Dispatch
            remembers your projects and writes platform-perfect posts in your exact voice.
          </p>
          <p className="mb-10 max-w-lg text-sm leading-relaxed text-carbon/70">
            Or connect your GitHub — Byline watches your commits and surfaces drafts before you even think to post.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#preview"
              className="inline-flex items-center gap-2 rounded-full bg-stamp px-7 py-3.5 font-medium text-paper transition-all hover:-translate-y-0.5 hover:shadow-xl cursor-pointer"
            >
              See how it works
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </a>
            <Link
              to="/try"
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-7 py-3.5 font-medium text-ink transition-all hover:bg-ink/5 cursor-pointer"
            >
              Open client desk
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-8 border-t border-ink/5 pt-8">
            <MetaItem label="License" value="MIT Open Source" />
            <MetaItem label="Stack" value="LangGraph + Claude" />
            <MetaItem label="Deploy" value="Self-hostable" />
          </div>
        </div>

        {/* Live Interactive Hero Sandbox / Playground */}
        <HeroPlayground />
      </div>
    </section>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-mono text-[10px] uppercase tracking-widest text-carbon">{label}</span>
      <span className="text-sm font-medium text-ink">{value}</span>
    </div>
  );
}

function HeroPlayground() {
  const [project, setProject] = useState("Acme SaaS");
  const [dispatchText, setDispatchText] = useState(
    "Shipped full-text search index on Postgres. CPU load dropped from 80% to 5%.",
  );
  const [tone, setTone] = useState<"Builder" | "Wry">("Builder");
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<PlayPlatform>("LinkedIn");
  const [done, setDone] = useState(false);
  const [showStamp, setShowStamp] = useState(false);

  const drafts = useMemo(() => {
    if (!dispatchText.trim()) return { LinkedIn: "", X: "", Reddit: "", Threads: "" };
    const first = dispatchText
      .trim()
      .split(/[.!?]\s/)[0]
      .slice(0, 150);
    return {
      LinkedIn: `Quick build note — ${first}.\n\nContext: I'm building ${project} in public. Here's what changed and why it matters:\n\n• ${dispatchText.trim()}\n• CPU bottleneck resolved successfully.\n• Next: write unit tests and release v1.0.\n\nIf you're working on index optimizations, let's compare notes!`,
      X: `${first}.\n\nbuilding ${project} in public → database logs incoming. CPU load dropped from 80% to 5% after pg index rebuild.`,
      Reddit: `**${project} — db optimization logs**\n\n${dispatchText.trim()}\n\nInitially we struggled with CPU load spiking under full-text query load. Replaced the simple like filters with a proper Postgres index. Latency and load dropped immediately. AMA!`,
      Threads: `shipped full-text search index today on ${project.toLowerCase()}. CPU load is down to 5%. smaller, faster, cleaner.`,
    };
  }, [dispatchText, project]);

  function handleSend() {
    if (!dispatchText.trim()) return;
    setRunning(true);
    setLogs([]);
    setDone(false);
    setShowStamp(false);

    const steps = [
      { delay: 0, text: `> initiating pipeline for project [${project}]...` },
      {
        delay: 200,
        text: `> similarity search: fetched project context & past voice fingerprints...`,
      },
      { delay: 450, text: `> strategist: chosen technical-update angle` },
      { delay: 700, text: `> writer drafted 4 platform-perfect posts...` },
      { delay: 900, text: `> critic: evaluated all drafts successfully` },
      { delay: 1050, text: `> success: platform seals LI, X, RD, TH stamped.` },
    ];

    steps.forEach((step) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, step.text]);
      }, step.delay);
    });

    setTimeout(() => {
      setRunning(false);
      setShowStamp(true);
    }, 1150);
  }

  function resetPlayground() {
    setDone(false);
    setLogs([]);
    setDispatchText("");
    setShowStamp(false);
  }

  return (
    <div className="relative animate-reveal" style={{ animationDelay: "150ms" }}>
      <div className="flex aspect-[4/5] md:aspect-auto md:h-[500px] flex-col overflow-hidden rounded-xl border border-ink/15 bg-white shadow-2xl shadow-ink/10">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-ink/10 bg-ink/[0.02] px-4 py-3">
          <div className="flex gap-1.5">
            <div className="size-2.5 rounded-full bg-stamp/20" />
            <div className="size-2.5 rounded-full bg-wire/20" />
            <div className="size-2.5 rounded-full bg-mint/20" />
          </div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-carbon">
            dispatch.sandbox · playground
          </span>
          <span className="w-10" />
        </div>

        {/* Content Split Pane */}
        {!done && !running ? (
          /* INPUT DESK */
          <div className="flex-1 flex flex-col justify-between p-6 space-y-4 font-mono text-xs">
            <div className="space-y-4">
              <div>
                <span className="block font-mono text-[9px] uppercase tracking-widest text-carbon mb-1">
                  1. select template project
                </span>
                <select
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="w-full rounded border border-ink/15 bg-paper px-3 py-2 focus:outline-none cursor-pointer"
                >
                  <option value="Acme SaaS">Acme SaaS (React Application)</option>
                  <option value="Engine API">Engine API (Backend Service)</option>
                  <option value="Extension Kit">Extension Kit (Browser Tool)</option>
                </select>
              </div>

              <div>
                <span className="block font-mono text-[9px] uppercase tracking-widest text-carbon mb-1">
                  2. raw dispatch log
                </span>
                <textarea
                  value={dispatchText}
                  onChange={(e) => setDispatchText(e.target.value)}
                  rows={4}
                  className="w-full rounded border border-ink/15 bg-white p-3 leading-relaxed focus:outline-none focus:border-wire"
                  placeholder="Type what you shipped today..."
                />
              </div>

              <div>
                <span className="block font-mono text-[9px] uppercase tracking-widest text-carbon mb-1">
                  3. voice profile
                </span>
                <div className="flex gap-2">
                  {["Builder", "Wry"].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setTone(v as "Builder" | "Wry")}
                      className={`flex-1 rounded border py-1.5 text-[10px] font-bold cursor-pointer transition-colors ${
                        tone === v
                          ? "bg-ink text-paper border-ink"
                          : "border-ink/15 text-ink hover:bg-ink/5"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleSend}
              disabled={!dispatchText.trim()}
              className="w-full rounded-full bg-stamp py-3 text-xs font-bold text-paper transition-all hover:bg-stamp/95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
            >
              Send down the wire ➔
            </button>
          </div>
        ) : (
          /* LIVE TELETYPE SIMULATOR & COMPOSER */
          <div className="flex-1 flex flex-col justify-between">
            {/* Top tabs */}
            {done && (
              <div className="flex border-b border-ink/10 bg-ink/[0.01]">
                {(["LinkedIn", "X", "Reddit", "Threads"] as PlayPlatform[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2 font-mono text-[10px] uppercase border-b-2 transition-all cursor-pointer ${
                      activeTab === tab
                        ? "border-stamp text-ink font-bold"
                        : "border-transparent text-carbon hover:text-ink"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            )}

            {/* Output Draft Text */}
            <div className="flex-1 p-5 overflow-y-auto min-h-[160px]">
              {running ? (
                <div className="font-mono text-xs text-carbon space-y-1 pr-1">
                  {logs.map((log, i) => (
                    <div key={i} className="animate-tick">
                      {log}
                    </div>
                  ))}
                  <div className="terminal-cursor text-stamp pt-2">transmitting wire...</div>
                </div>
              ) : (
                <div className="font-sans text-xs leading-relaxed text-ink whitespace-pre-wrap select-all">
                  {drafts[activeTab]}
                </div>
              )}
            </div>

            {/* Teletype status log strip */}
            {done && (
              <div className="border-t border-ink/10 bg-ink p-4 font-mono text-[10px] text-paper/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-mint animate-stamp" />
                  <span>Stamps: LI, X, RD, TH punched successfully</span>
                </div>
                <button
                  onClick={resetPlayground}
                  className="text-[9px] uppercase tracking-wider text-stamp hover:underline cursor-pointer"
                >
                  [Reset Sandbox]
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="animate-stamp absolute -bottom-6 -right-4 rotate-12 rounded-md border-4 border-paper bg-stamp px-5 py-3 font-display text-sm font-bold uppercase tracking-widest text-paper shadow-xl z-20 pointer-events-none">
        Live Wire
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────── PROBLEM ─────────────────────────────────────────── */

function ProblemSection() {
  const items = [
    {
      n: "01",
      h: "The Memory Gap",
      p: "You ship at 2 AM. By 9 AM, the details worth posting about have evaporated.",
    },
    {
      n: "02",
      h: "Voice Decay",
      p: "AI writing sounds like AI. Existing tools have no memory of how you actually write.",
    },
    {
      n: "03",
      h: "Format Fatigue",
      p: "LinkedIn wants stories. X wants punch. Reddit hates anything that smells like an ad.",
    },
    {
      n: "04",
      h: "Zero Context",
      p: "Every tool starts from scratch. No knowledge of your projects, stack, or arcs.",
    },
  ];
  return (
    <section id="problem" className="border-y border-ink/5 bg-ink/[0.015] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 max-w-2xl">
          <span className="font-mono text-[11px] uppercase tracking-widest text-stamp">
            The Problem
          </span>
          <h2 className="mt-4 font-display text-4xl tracking-tight md:text-5xl">
            Building in public
            <br />
            shouldn't be a second job.
          </h2>
          <p className="mt-5 max-w-xl text-carbon">
            Existing tools solve scheduling. None solve memory, voice, or judgement — the actual
            bottleneck.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-px border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div key={it.n} className="bg-paper p-8">
              <span className="mb-4 block font-mono text-sm text-stamp">{it.n}</span>
              <h3 className="mb-2 font-display text-base font-semibold uppercase tracking-wider">
                {it.h}
              </h3>
              <p className="text-sm leading-relaxed text-carbon">{it.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────── FEATURES BENTO ─────────────────────────────────────────── */

function FeaturesSection() {
  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16">
          <span className="font-mono text-[11px] uppercase tracking-widest text-stamp">
            Features
          </span>
          <h2 className="mt-4 font-display text-4xl tracking-tight md:text-5xl">
            A wire room for
            <br />
            everything you ship.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Project Memory — span 2 */}
          <div className="flex flex-col justify-between rounded-2xl border border-ink/10 bg-white p-8 md:col-span-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-ink/[0.02] hover:border-ink/20">
            <div>
              <BentoIcon color="wire" letter="M" />
              <h3 className="mb-3 font-display text-2xl tracking-tight">
                Persistent project memory
              </h3>
              <p className="max-w-md text-carbon">
                Dispatch keeps a live graph of every project you're building — stack, status,
                history. Every dispatch is grounded in real context, not generic AI filler.
              </p>
            </div>
            <div className="mt-8 rounded-xl border border-ink/5 bg-ink/[0.02] p-4 font-mono text-xs">
              <div className="mb-3 flex items-center gap-2">
                <div className="size-2 rounded-full bg-mint" />
                <span className="text-carbon">projects.indexed</span>
              </div>
              <div className="space-y-1.5 text-ink/70">
                <div>
                  fltrd.tech <span className="text-carbon">· React + FastAPI · shipped</span>
                </div>
                <div>
                  Miryn <span className="text-carbon">· Python RAG · active</span>
                </div>
                <div>
                  Stash <span className="text-carbon">· Chrome ext · beta</span>
                </div>
                <div>
                  ChaiPaani <span className="text-carbon">· React Native · live</span>
                </div>
                <div>
                  Dispatch <span className="text-carbon">· LangGraph · building</span>
                </div>
              </div>
            </div>
          </div>

          {/* Voice */}
          <BentoCard
            iconColor="stamp"
            letter="V"
            title="Your voice, not AI voice"
            body="Import past posts to build a voice fingerprint. Every draft sounds like you wrote it — because the system learned how you write."
          />

          {/* Critic */}
          <BentoCard
            iconColor="mint"
            letter="C"
            title="Built-in critic"
            body="Each draft is reviewed by an editorial agent. Direct, specific notes: 'Cut the first two sentences — they restate the title.'"
          />

          {/* Multi-platform */}
          <BentoCard
            iconColor="wire"
            letter="4"
            title="4 platforms, 1 dispatch"
            body="Log once. Get LinkedIn-professional, X-punchy, Reddit-safe, and Threads-casual drafts — each adapted to platform norms."
          />

          {/* Narrative arcs — inverted */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-ink p-8 text-paper md:col-span-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-ink/[0.05]">
            <div>
              <div className="mb-6 inline-flex size-10 items-center justify-center rounded-md bg-stamp text-paper">
                <span className="font-mono text-sm font-bold">↗</span>
              </div>
              <h3 className="mb-3 font-display text-2xl tracking-tight">Narrative arcs</h3>
              <p className="max-w-md text-paper/60">
                Tag dispatches to storylines — "Job search 2026", "Building Dispatch in public".
                Posts build a series instead of disconnected announcements.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              <span className="rounded border border-paper/15 px-3 py-1 font-mono text-[11px] uppercase tracking-wider">
                DevLog #4
              </span>
              <span className="rounded border border-paper/15 px-3 py-1 font-mono text-[11px] uppercase tracking-wider">
                Job Search 2026
              </span>
              <span className="rounded border border-paper/15 px-3 py-1 font-mono text-[11px] uppercase tracking-wider">
                Shipping Dispatch
              </span>
            </div>
          </div>

          {/* Ambient capture — span 2 */}
          <div className="flex flex-col justify-between rounded-2xl border border-ink/10 bg-paper p-8 md:col-span-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-ink/[0.02] hover:border-ink/20">
            <div>
              <BentoIcon color="mint" letter="$" />
              <h3 className="mb-3 font-display text-2xl tracking-tight">Capture from anywhere</h3>
              <p className="max-w-md text-carbon">
                GitHub commits auto-draft dispatches. Voice notes transcribe in. Or use the CLI —
                opening a dashboard to log a 10-word update is friction you don't need.
              </p>
            </div>
            <div className="mt-8 rounded-xl bg-ink p-4 font-mono text-xs leading-relaxed text-paper/80">
              <div>
                <span className="text-mint">$</span> dispatch log "semantic search shipped on fltrd"
              </div>
              <div className="text-paper/40">→ Logged. 4 drafts generating…</div>
              <div className="text-paper/40">→ LI ✓ X ✓ RD ✓ TH ⏳</div>
            </div>
          </div>

          {/* Distribute */}
          <BentoCard
            iconColor="stamp"
            letter="→"
            title="One-tap distribute"
            body="Approve drafts and they fan out to every platform via Composio. Or schedule, edit, or hold — your call."
          />
        </div>
      </div>
    </section>
  );
}

function BentoIcon({ color, letter }: { color: "wire" | "stamp" | "mint"; letter: string }) {
  const map = {
    wire: "bg-wire/10 text-wire",
    stamp: "bg-stamp/10 text-stamp",
    mint: "bg-mint/10 text-mint",
  };
  return (
    <div
      className={`mb-6 inline-flex size-10 items-center justify-center rounded-md font-mono font-bold ${map[color]}`}
    >
      {letter}
    </div>
  );
}

function BentoCard({
  iconColor,
  letter,
  title,
  body,
}: {
  iconColor: "wire" | "stamp" | "mint";
  letter: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-paper p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-ink/[0.02] hover:border-ink/20">
      <BentoIcon color={iconColor} letter={letter} />
      <h3 className="mb-3 font-display text-xl tracking-tight">{title}</h3>
      <p className="text-sm leading-relaxed text-carbon">{body}</p>
    </div>
  );
}

/* ─────────────────────────────────────────── WIRE + DESK PREVIEW ─────────────────────────────────────────── */

function WireDeskPreview() {
  const [activePlatform, setActivePlatform] = useState<"LinkedIn" | "X" | "Reddit" | "Threads">(
    "LinkedIn",
  );

  const draftsData = {
    LinkedIn: {
      angle: "technical deep-dive",
      score: "8/10 · PASS",
      voice: "voice: builder_raw · 98% match",
      critic:
        "Critic 8/10 — Strong hook. Cut 'changes how content filtering works' — show, don't tell. The latency stat is your strongest proof; move it earlier.",
      content: (
        <>
          <p className="mb-4 text-[15px] leading-relaxed text-ink">
            Just shipped semantic search on fltrd.tech — and it changes how content filtering works.
          </p>
          <p className="mb-4 text-[15px] leading-relaxed text-ink/80">
            Instead of rigid keyword matching, filters now understand <em>meaning</em>. A filter for
            "toxic gaming comments" catches creative misspellings, coded language, and contextual
            toxicity that rule-based systems miss.
          </p>
          <p className="mb-4 text-[15px] leading-relaxed text-ink/80">
            The technical bet: pgvector embeddings with hybrid retrieval (dense + sparse). Latency
            stayed under 50ms at p99.
          </p>
          <p className="text-[13px] font-mono text-carbon">#BuildingInPublic #AI</p>
        </>
      ),
    },
    X: {
      angle: "punchy updates",
      score: "7/10 · PASS",
      voice: "voice: builder_raw · 95% match",
      critic:
        "Critic 7/10 — Fits X culture well. Opener is very low-key. Consider moving the p99 latency stat to the first line to trigger more clicks.",
      content: (
        <>
          <p className="mb-4 text-[15px] leading-relaxed text-ink">
            shipped semantic search on fltrd.tech.
          </p>
          <p className="mb-4 text-[15px] leading-relaxed text-ink/80">
            filters now understand meaning, not just letters. "toxic gaming comments" catch spelling
            bypasses & code words instantly.
          </p>
          <p className="mb-4 text-[15px] leading-relaxed text-ink/80">
            tech bet: pgvector + hybrid retrieval (dense + sparse). p99 latency &lt; 50ms.
          </p>
          <p className="text-[13px] font-mono text-carbon">building in public → thread incoming.</p>
        </>
      ),
    },
    Reddit: {
      angle: "developer discussion",
      score: "9/10 · PASS",
      voice: "voice: builder_raw · 92% match",
      critic:
        "Critic 9/10 — Excellent approach. Non-promotional, highly informative. Added value through the 800ms -> 50ms backstory. Safe to post.",
      content: (
        <>
          <p className="mb-2 text-[15px] font-bold text-ink">
            How we got our pgvector RAG filter latency under 50ms at p99
          </p>
          <p className="mb-4 text-[15px] leading-relaxed text-ink/80">
            We recently replaced our simple keyword content filters on fltrd.tech with semantic
            search to catch toxic comments. The transition was rough. Initially, latency was around
            800ms, which was a deal-breaker for live chat filtering.
          </p>
          <p className="mb-4 text-[15px] leading-relaxed text-ink/80">
            Here's what solved it:
            <br />
            1. Switching to pgvector with HNSW index.
            <br />
            2. Implementing hybrid search (combining dense vector search with tsvector sparse
            search).
            <br />
            3. Caching hot queries.
          </p>
          <p className="text-[13px] font-mono text-carbon">
            Happy to go deep on the index setup or the embedding pipeline in the comments. AMA!
          </p>
        </>
      ),
    },
    Threads: {
      angle: "casual log",
      score: "8/10 · PASS",
      voice: "voice: builder_raw · 97% match",
      critic: "Critic 8/10 — Casual and punchy. Fits the current developer threads meta perfectly.",
      content: (
        <>
          <p className="mb-4 text-[15px] leading-relaxed text-ink">
            quick build note: shipped semantic search on fltrd.tech today.
          </p>
          <p className="mb-4 text-[15px] leading-relaxed text-ink/80">
            no more getting bypassed by creative spelling or coded toxicity. we're embedding
            comments and matching meaning.
          </p>
          <p className="mb-4 text-[15px] leading-relaxed text-ink/80">
            pgvector + hybrid search keeping latency under 50ms. it's smaller, meaner, faster. back
            to the desk.
          </p>
        </>
      ),
    },
  };

  const activeDraft = draftsData[activePlatform];

  return (
    <section id="preview" className="bg-ink/[0.015] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <span className="font-mono text-[11px] uppercase tracking-widest text-stamp">
            The Interface
          </span>
          <h2 className="mt-4 font-display text-4xl tracking-tight md:text-5xl">
            The Wire &amp; The Desk
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-carbon">
            A live feed of dispatches on one side. A desk for composing each report on the other.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-ink/15 bg-white shadow-2xl shadow-ink/10">
          <div className="flex items-center justify-between border-b border-ink/10 bg-ink/[0.02] px-5 py-3">
            <div className="flex gap-1.5">
              <div className="size-2.5 rounded-full bg-ink/15" />
              <div className="size-2.5 rounded-full bg-ink/15" />
              <div className="size-2.5 rounded-full bg-ink/15" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-carbon">
              dispatch.local · the wire room
            </span>
            <span className="w-12" />
          </div>

          <div className="grid lg:grid-cols-5">
            {/* Wire pane */}
            <div className="flex h-[560px] flex-col border-b border-ink/10 bg-ink/[0.02] lg:border-b-0 lg:border-r lg:col-span-2">
              <div className="flex items-center justify-between border-b border-ink/10 p-5">
                <h4 className="font-mono text-[11px] font-bold uppercase tracking-widest">
                  The Wire
                </h4>
                <div className="flex items-center gap-1.5">
                  <div className="size-1.5 animate-pulse rounded-full bg-stamp" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-stamp">
                    live
                  </span>
                </div>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                <WireDeskItem
                  time="14:02 UTC"
                  project="FLTRD"
                  text="Shipped semantic search"
                  active
                />
                <WireDeskItem time="09:40 UTC" project="MIRYN" text="Fixed RAG memory leak" />
                <WireDeskItem
                  time="Yesterday"
                  project="STASH"
                  text="Chrome ext beta to 50 testers"
                />
                <WireDeskItem
                  time="2 days ago"
                  project="CHAIPAANI"
                  text="First UPI transaction live"
                />
              </div>
            </div>

            {/* Desk pane */}
            <div className="flex h-[560px] flex-col bg-white lg:col-span-3">
              <div className="border-b border-ink/10 p-5">
                <div className="mb-3 flex items-center gap-3 text-[11px]">
                  <span className="rounded border border-ink/10 bg-ink/5 px-2 py-0.5 font-mono">
                    DRAFT · fltrd.tech
                  </span>
                  <span className="font-mono text-carbon">angle: {activeDraft.angle}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {(["LinkedIn", "X", "Reddit", "Threads"] as const).map((p) => {
                      const isActive = activePlatform === p;
                      return (
                        <button
                          key={p}
                          onClick={() => setActivePlatform(p)}
                          className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors cursor-pointer ${
                            isActive
                              ? "border-b-2 border-wire text-ink"
                              : "border-b-2 border-transparent text-carbon hover:text-ink"
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                  <span className="rounded bg-mint/10 px-2 py-0.5 font-mono text-[10px] font-bold text-mint animate-stamp">
                    {activeDraft.score}
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-7">
                {activeDraft.content}

                <div className="mt-6 border-l-2 border-stamp bg-stamp/5 p-4 text-[12px] italic text-stamp">
                  {activeDraft.critic}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-ink/10 bg-paper px-6 py-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-carbon">
                  {activeDraft.voice}
                </span>
                <div className="flex gap-3">
                  <button className="rounded-md border border-ink/10 px-4 py-2 text-xs font-medium text-ink transition-colors hover:bg-ink/5 cursor-pointer">
                    Regenerate
                  </button>
                  <button className="rounded-md bg-wire px-5 py-2 text-xs font-medium text-paper transition-all hover:bg-wire/90 cursor-pointer">
                    Approve &amp; dispatch
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WireDeskItem({
  time,
  project,
  text,
  active,
}: {
  time: string;
  project: string;
  text: string;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-md p-3 transition-colors ${
        active ? "bg-ink text-paper" : "border border-ink/10 bg-paper hover:border-ink/20"
      }`}
    >
      <div
        className={`mb-1 flex justify-between font-mono text-[10px] ${active ? "text-paper/60" : "text-carbon"}`}
      >
        <span>{time}</span>
        <span>{project}</span>
      </div>
      <div className="text-sm font-medium">{text}</div>
    </div>
  );
}

/* ─────────────────────────────────────────── STORY ─────────────────────────────────────────── */

function StorySection() {
  const projects = [
    { name: "Acme SaaS", desc: "Web applications" },
    { name: "Engine API", desc: "Backend API services" },
    { name: "Extension Kit", desc: "Browser extensions" },
    { name: "Portal Mobile", desc: "Mobile applications" },
    { name: "Dispatch", desc: "This platform", highlight: true },
  ];
  return (
    <section id="story" className="px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <span className="font-mono text-[11px] uppercase tracking-widest text-stamp">
            Open Source
          </span>
          <h2 className="mt-4 font-display text-4xl tracking-tight md:text-5xl">
            Built in public,
            <br />
            for builders who build in public.
          </h2>
        </div>

        <blockquote className="mx-auto max-w-2xl border-l-2 border-stamp pl-6 font-display text-xl italic leading-relaxed text-ink md:text-2xl">
          "I was shipping features at 2am and forgetting to post about them by morning. Existing
          tools had zero memory of my projects. So I built the thing I needed: a system that already
          knows my work and writes like I do."
        </blockquote>
        <div className="mt-4 text-center font-mono text-[11px] uppercase tracking-widest text-carbon">
          — the builder behind Dispatch
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-3">
          {projects.map((p) => (
            <div
              key={p.name}
              className={`flex items-center gap-3 rounded-full border px-4 py-2 text-sm ${
                p.highlight
                  ? "border-stamp/30 bg-stamp/5 text-stamp"
                  : "border-ink/10 bg-paper text-ink"
              }`}
            >
              <span className="font-display font-semibold">{p.name}</span>
              <span className={p.highlight ? "text-stamp/70" : "text-carbon"}>{p.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────── CTA ─────────────────────────────────────────── */

function CTASection() {
  const [copied, setCopied] = useState(false);
  const cmd = "docker compose up -d";
  return (
    <section className="px-6 pb-24 pt-12">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-4xl tracking-tight md:text-5xl">
          Stop choosing between
          <br />
          shipping and being visible.
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-carbon">
          Self-host in minutes. MIT licensed. Contributions welcome.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-medium text-paper transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            Star on GitHub
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-7 py-3.5 font-medium text-ink transition-all hover:bg-ink/5"
          >
            Read the docs
          </a>
        </div>

        <button
          onClick={() => {
            navigator.clipboard?.writeText(cmd).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            });
          }}
          className="group mx-auto mt-10 flex items-center gap-3 rounded-lg bg-ink px-6 py-3.5 font-mono text-sm text-paper shadow-xl transition-transform hover:-translate-y-0.5"
        >
          <span className="text-paper/40">$</span>
          <span>{cmd}</span>
          <span className="ml-3 rounded bg-paper/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-paper/60 transition-colors group-hover:text-paper">
            {copied ? "copied" : "copy"}
          </span>
        </button>

        <div className="mt-8 flex flex-wrap justify-center gap-2 text-[11px] font-mono uppercase tracking-wider text-carbon">
          <span className="rounded-full border border-ink/10 px-3 py-1">MIT Licensed</span>
          <span className="rounded-full border border-ink/10 px-3 py-1">Self-hostable</span>
          <span className="rounded-full border border-ink/10 px-3 py-1">LangGraph + Claude</span>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────── FOOTER ─────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="border-t border-ink/10 px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-stamp" />
          <span className="font-display font-semibold uppercase tracking-tight">Dispatch</span>
        </div>
        <div className="flex gap-7 text-sm text-carbon">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink"
          >
            GitHub
          </a>
          <a href="#" className="hover:text-ink">
            Documentation
          </a>
          <a href="#" className="hover:text-ink">
            Changelog
          </a>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-carbon">
          MIT · 2026 · no cookies · no trackers
        </p>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────── PAGE ─────────────────────────────────────────── */

function LandingPage() {
  return (
    <main className="min-h-screen bg-paper bg-grid-dots font-body text-ink selection:bg-wire/20 selection:text-wire">
      <Navbar />
      <Hero />
      <ProblemSection />
      <FeaturesSection />
      <WireDeskPreview />
      <StorySection />
      <CTASection />
      <Footer />
    </main>
  );
}
