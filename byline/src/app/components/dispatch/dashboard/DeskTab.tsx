import React from "react";
import { IconCheck, IconEdit, IconMessage2Share, IconSend, IconSparkles } from "@tabler/icons-react";

interface DeskTabProps {
  isMobile: boolean;
}

const DRAFTS = [
  {
    platform: "LinkedIn",
    content:
      "I spent the last 3 days rebuilding Byline's landing page and the hard part was not the motion.\n\nIt was product clarity.\n\nA nicer hero means nothing if someone still cannot tell whether you're a writing tool or an agent system in five seconds.\n\nThe newer version finally leads with what the product actually does:\n\nOne milestone in. A strategist, four platform writers, and a critic run in parallel. You review the output in one desk before it goes anywhere.\n\nThe UI got calmer. The promise got sharper. That mattered more than adding another flashy section.",
    score: 8.9,
    status: "ready",
    note: "strong clarity, tighten final line",
  },
  {
    platform: "X",
    content:
      "most product pages don't have a design problem.\n\nthey have a 'what does this actually do?' problem.\n\nreworked byline today so the hero explains the system before it tries to impress you.",
    score: 9.1,
    status: "draft",
    note: "best hook of the set",
  },
  {
    platform: "Reddit",
    content:
      "I rebuilt the landing page for my multi-agent writing tool and realized the design wasn't the real blocker.\n\nThe actual issue was that the homepage described aesthetics better than workflow...\n\nIf I turn this into a post, it needs a more educational breakdown of the decisions and mistakes.",
    score: 7.7,
    status: "blocked",
    note: "needs more educational depth",
  },
  {
    platform: "Threads",
    content:
      "rebuilt byline's hero today. way calmer now. the product finally explains itself before it starts flexing.",
    score: 8.3,
    status: "approved",
    note: "light and casual, fits platform",
  },
];

const CRITIC = [
  "LinkedIn is closest to founder voice right now.",
  "X has the strongest opener but can get one click more specific.",
  "Reddit should stay blocked unless we add process detail and what failed first.",
];

export function DeskTab({ isMobile }: DeskTabProps) {
  const [activePlatform, setActivePlatform] = React.useState(0);
  const [draftValue, setDraftValue] = React.useState(DRAFTS[0].content);

  React.useEffect(() => {
    setDraftValue(DRAFTS[activePlatform].content);
  }, [activePlatform]);

  const draft = DRAFTS[activePlatform];

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: isMobile ? "16px" : "24px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1.12fr) minmax(280px, 0.88fr)",
          gap: 16,
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "0.5px solid rgba(255,255,255,0.08)",
            borderRadius: 18,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              borderBottom: "0.5px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ fontFamily: "DM Mono, monospace", fontSize: 10, color: "var(--by-text-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                the desk
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "var(--by-text-2)", marginTop: 4 }}>
                review, tighten, approve, then post
              </div>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 10px",
                borderRadius: 999,
                background: "rgba(232,94,44,0.1)",
                color: "var(--by-accent)",
                fontFamily: "DM Mono, monospace",
                fontSize: 11,
              }}
            >
              <IconSparkles size={13} stroke={1.8} />
              critic score {draft.score}/10
            </div>
          </div>

          <div
            style={{
              display: "flex",
              borderBottom: "0.5px solid rgba(255,255,255,0.08)",
              overflowX: "auto",
            }}
          >
            {DRAFTS.map((item, i) => (
              <button
                key={item.platform}
                onClick={() => setActivePlatform(i)}
                style={{
                  flex: 1,
                  minWidth: 110,
                  padding: "14px 14px 13px",
                  background: i === activePlatform ? "rgba(255,255,255,0.03)" : "transparent",
                  border: "none",
                  borderBottom: i === activePlatform ? "1.5px solid var(--by-accent)" : "1.5px solid transparent",
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  color: i === activePlatform ? "var(--by-text)" : "var(--by-text-3)",
                  fontWeight: i === activePlatform ? 600 : 500,
                }}
              >
                {item.platform}
              </button>
            ))}
          </div>

          <div style={{ padding: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
                marginBottom: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: "var(--by-text-3)" }}>
                  platform: <span style={{ color: "var(--by-text)" }}>{draft.platform}</span>
                </span>
                <span style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: "var(--by-text-3)" }}>
                  status:{" "}
                  <span
                    style={{
                      color:
                        draft.status === "approved"
                          ? "var(--by-green)"
                          : draft.status === "blocked"
                            ? "var(--by-accent)"
                            : "var(--by-text)",
                    }}
                  >
                    {draft.status}
                  </span>
                </span>
              </div>
              <span style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: "var(--by-text-3)" }}>{draft.note}</span>
            </div>

            <textarea
              value={draftValue}
              onChange={(e) => setDraftValue(e.target.value)}
              style={{
                width: "100%",
                minHeight: 310,
                background: "rgba(255,255,255,0.025)",
                border: "0.5px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: "14px 16px",
                color: "var(--by-text)",
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                resize: "vertical",
                outline: "none",
                lineHeight: 1.75,
                boxSizing: "border-box",
              }}
            />

            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 14,
                justifyContent: "flex-end",
                flexWrap: "wrap",
              }}
            >
              {[
                { label: "Edit", icon: IconEdit, solid: false },
                { label: "Approve", icon: IconCheck, solid: false },
                { label: "Post", icon: IconSend, solid: true },
              ].map((action) => (
                <button
                  key={action.label}
                  style={{
                    fontFamily: "DM Mono, monospace",
                    fontSize: 11,
                    padding: "9px 14px",
                    border: action.solid ? "none" : "0.5px solid rgba(255,255,255,0.08)",
                    background: action.solid ? "var(--by-accent)" : "rgba(255,255,255,0.02)",
                    color: action.solid ? "#F5F2EC" : "var(--by-text)",
                    borderRadius: 10,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <action.icon size={12} stroke={1.8} />
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "0.5px solid rgba(255,255,255,0.08)",
              borderRadius: 18,
              padding: "16px",
            }}
          >
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: 10, color: "var(--by-text-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
              critic notes
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {CRITIC.map((note) => (
                <div
                  key={note}
                  style={{
                    padding: "12px 12px",
                    borderRadius: 14,
                    background: "rgba(255,255,255,0.03)",
                    border: "0.5px solid rgba(255,255,255,0.06)",
                    color: "var(--by-text-2)",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13,
                    lineHeight: 1.65,
                  }}
                >
                  {note}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "0.5px solid rgba(255,255,255,0.08)",
              borderRadius: 18,
              padding: "16px",
            }}
          >
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: 10, color: "var(--by-text-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
              approval flow
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                { label: "voice match", value: "strong" },
                { label: "platform fit", value: "high" },
                { label: "self promo risk", value: draft.platform === "Reddit" ? "medium" : "low" },
              ].map((row) => (
                <div
                  key={row.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "11px 12px",
                    borderRadius: 14,
                    background: "rgba(10,10,12,0.24)",
                    border: "0.5px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <span style={{ color: "var(--by-text-3)", fontFamily: "DM Mono, monospace", fontSize: 11 }}>{row.label}</span>
                  <span style={{ color: "var(--by-text)", fontFamily: "'Inter', sans-serif", fontSize: 13 }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 14,
              border: "0.5px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
              color: "var(--by-text)",
              fontFamily: "DM Mono, monospace",
              fontSize: 11,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <IconMessage2Share size={14} stroke={1.7} />
            send back to strategist
          </button>
        </div>
      </div>
    </div>
  );
}
