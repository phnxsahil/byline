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
} from "@tabler/icons-react";

interface SettingsTabProps {
  isMobile: boolean;
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

const APPROVAL_OVERRIDES: Record<string, typeof APPROVAL_MODES[number]["id"]> = {
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

export function SettingsTab({ isMobile }: SettingsTabProps) {
  const [activeSection, setActiveSection] = React.useState<SettingsSection["id"]>("behavior");
  const [approvalMode, setApprovalMode] = React.useState<(typeof APPROVAL_MODES)[number]["id"]>("review required");
  const [overrides, setOverrides] = React.useState<Record<string, typeof APPROVAL_MODES[number]["id"]>>({
    LinkedIn: "auto-post",
    X: "review required",
    Reddit: "drafts only",
    Threads: "review required",
  });
  const [confirmReset, setConfirmReset] = React.useState(false);

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
      projects: ["fltrd-tech", "miryn", "stash", "chaipanni", "byline"],
      voiceProfile: {
        avg_post_length: 220,
        opener_patterns: ["I spent X days on Y and Z was the hard part", "Here's what nobody tells you about..."],
        banned_phrases: ["excited to announce", "humbled", "thrilled to share", "game-changer"],
      },
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
    window.location.reload();
  };

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: isMobile ? "16px" : "24px",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "240px minmax(0, 1fr)",
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
          <SectionShell title="Connect your stack" eyebrow="Connect">
            <TokenRow label="Anthropic" value="configured" meta="Primary LLM provider for the Strategist, Writers, and Critic." />
            <TokenRow label="GitHub webhook" value="watching 3 repos" meta="fltrd.tech, byline, and stash are already mapped as signal sources." />
            <TokenRow label="Platform outlets" value="linkedin · x · reddit" meta="Threads stays manual until the posting layer is turned on." />
          </SectionShell>
        )}

        {activeSection === "voice" && (
          <SectionShell title="Voice & brand guardrails" eyebrow="Voice">
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.4fr 0.9fr", gap: 14 }}>
              <div style={{ background: "var(--by-bg-3)", borderRadius: 6, padding: 14, border: "0.5px solid var(--by-border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <IconBulb size={16} stroke={1.7} color="var(--by-accent)" />
                  <span style={{ fontSize: 13, color: "var(--by-text)" }}>Active voice profile</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--by-text-2)", lineHeight: 1.6 }}>
                  lowercase on casual channels, sentence case on LinkedIn, hook-led openings, short paragraphs, no corporate filler.
                </div>
                <button
                  style={{
                    marginTop: 12,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 10px",
                    borderRadius: 5,
                    border: "0.5px solid var(--by-border)",
                    background: "transparent",
                    color: "var(--by-text)",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    cursor: "pointer",
                  }}
                >
                  <IconRefresh size={12} stroke={1.6} />
                  retrain voice
                </button>
              </div>
              <div style={{ background: "var(--by-bg-3)", borderRadius: 6, padding: 14, border: "0.5px solid var(--by-border)" }}>
                <div style={{ fontSize: 12, color: "var(--by-text-3)", marginBottom: 8 }}>Blocked phrases</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {["excited to announce", "humbled", "thrilled to share", "game-changer"].map((phrase) => (
                    <span
                      key={phrase}
                      style={{
                        padding: "4px 7px",
                        borderRadius: 999,
                        background: "rgba(248,113,113,0.1)",
                        color: "var(--by-red)",
                        fontSize: 11,
                      }}
                    >
                      {phrase}
                    </span>
                  ))}
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
                  const token = APPROVAL_MODES.find((entry) => entry.id === mode)!;
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
    </div>
  );
}
