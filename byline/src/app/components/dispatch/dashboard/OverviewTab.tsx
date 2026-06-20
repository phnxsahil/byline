import React from "react";
import {
  IconArrowRight,
  IconBolt,
  IconBrain,
  IconCode,
  IconGitBranch,
  IconSparkles,
  IconUsers,
} from "@tabler/icons-react";

interface OverviewTabProps {
  onPublish: (text: string) => void;
  isMobile: boolean;
}

const STATS = [
  { label: "Milestones", value: "12", note: "+3 this week", icon: IconBolt },
  { label: "Projects", value: "5", note: "2 active arcs", icon: IconCode },
  { label: "AI Runs", value: "47", note: "8 queued ideas", icon: IconBrain },
  { label: "Commits Watched", value: "89", note: "mostly product work", icon: IconGitBranch },
  { label: "Platforms", value: "4", note: "voice-tuned", icon: IconUsers },
];

const RECENT = [
  { project: "byline", milestone: "Shipped semantic search using pgvector", time: "2h ago", status: "ready" },
  { project: "fltrd.tech", milestone: "Added feedback loop to filtering pipeline", time: "1d ago", status: "ready" },
  { project: "byline", milestone: "Fixed LangGraph state serialization bug", time: "2d ago", status: "draft" },
];

const WATCHER = [
  "github watcher picked up 3 meaningful commits in the last 24h",
  "reddit is still blocked until the lesson has enough technical depth",
  "linkedin voice profile is drifting longer than your current average",
];

export function OverviewTab({ onPublish, isMobile }: OverviewTabProps) {
  const [input, setInput] = React.useState(
    "shipped a cleaner landing page for byline and the real challenge was making the product feel obvious in five seconds"
  );

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: isMobile ? "16px" : "24px",
        display: "flex",
        flexDirection: "column",
        gap: 18,
        background:
          "radial-gradient(circle at top right, rgba(232,94,44,0.06), transparent 28%), var(--by-bg)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1.15fr) minmax(320px, 0.85fr)",
          gap: 16,
        }}
      >
        <div
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
            border: "0.5px solid rgba(255,255,255,0.08)",
            borderRadius: 18,
            padding: isMobile ? "18px" : "22px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 10px",
              borderRadius: 999,
              background: "rgba(232,94,44,0.08)",
              color: "var(--by-accent)",
              fontFamily: "DM Mono, monospace",
              fontSize: 11,
              alignSelf: "flex-start",
            }}
          >
            <IconSparkles size={13} stroke={1.8} />
            signal in
          </div>

          <div>
            <div
              style={{
                fontFamily: "Space Grotesk, Inter, sans-serif",
                fontSize: isMobile ? 28 : 34,
                lineHeight: 1,
                letterSpacing: "-0.05em",
                color: "var(--by-text)",
              }}
            >
              Put the work in once.
              <br />
              Let the system find the angle.
            </div>
            <p
              style={{
                margin: "12px 0 0",
                color: "var(--by-text-2)",
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                lineHeight: 1.7,
                maxWidth: 560,
              }}
            >
              This desk is strongest when the milestone is specific. The strategist can only choose a sharp
              angle if the raw signal has enough texture to work with.
            </p>
          </div>

          <div
            style={{
              borderRadius: 16,
              border: "0.5px solid rgba(255,255,255,0.07)",
              background: "rgba(10,10,12,0.3)",
              padding: 14,
            }}
          >
            <div
              style={{
                fontFamily: "DM Mono, monospace",
                fontSize: 10,
                color: "var(--by-text-3)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 10,
              }}
            >
              new milestone
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={4}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.025)",
                border: "0.5px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                padding: "12px 14px",
                color: "var(--by-text)",
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                resize: "vertical",
                outline: "none",
                lineHeight: 1.65,
                boxSizing: "border-box",
              }}
            />
            <div
              style={{
                marginTop: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <span style={{ color: "var(--by-text-3)", fontFamily: "DM Mono, monospace", fontSize: 11 }}>
                better inputs {"->"} better platform decisions
              </span>
              <button
                onClick={() => {
                  if (input.trim()) {
                    onPublish(input.trim());
                  }
                }}
                style={{
                  fontFamily: "DM Mono, monospace",
                  fontSize: 11,
                  padding: "9px 14px",
                  background: "var(--by-accent)",
                  color: "#F5F2EC",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <IconBolt size={12} stroke={2} />
                run dispatch
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "0.5px solid rgba(255,255,255,0.08)",
            borderRadius: 18,
            padding: isMobile ? "18px" : "22px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div
            style={{
              fontFamily: "DM Mono, monospace",
              fontSize: 10,
              color: "var(--by-text-3)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            watcher notes
          </div>
          {WATCHER.map((note) => (
            <div
              key={note}
              style={{
                padding: "12px 14px",
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
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(5, 1fr)",
          gap: 12,
        }}
      >
        {STATS.map((s) => (
          <div
            key={s.label}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "0.5px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: "16px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <s.icon size={16} stroke={1.6} color="var(--by-accent)" />
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: 24, fontWeight: 600, color: "var(--by-text)", lineHeight: 1 }}>
              {s.value}
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "var(--by-text-2)" }}>{s.label}</div>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: 10, color: "var(--by-text-3)" }}>{s.note}</div>
          </div>
        ))}
      </div>

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
            padding: "14px 18px",
            borderBottom: "0.5px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ fontFamily: "DM Mono, monospace", fontSize: 10, color: "var(--by-text-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            recent milestones
          </div>
          <button
            style={{
              background: "transparent",
              border: "none",
              color: "var(--by-text-2)",
              fontFamily: "DM Mono, monospace",
              fontSize: 11,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            view all
            <IconArrowRight size={12} stroke={1.8} />
          </button>
        </div>

        {RECENT.map((r, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 18px",
              borderBottom: i < RECENT.length - 1 ? "0.5px solid rgba(255,255,255,0.08)" : "none",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
              <div style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: "var(--by-text)", fontWeight: 500 }}>{r.project}</div>
              <div style={{ fontSize: 13, color: "var(--by-text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {r.milestone}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              <span style={{ fontSize: 11, color: "var(--by-text-3)", fontFamily: "DM Mono, monospace" }}>{r.time}</span>
              <div
                style={{
                  padding: "4px 8px",
                  borderRadius: 999,
                  fontSize: 10,
                  fontFamily: "DM Mono, monospace",
                  background: r.status === "ready" ? "rgba(59,165,84,0.14)" : "rgba(232,94,44,0.1)",
                  color: r.status === "ready" ? "var(--by-green)" : "var(--by-accent)",
                }}
              >
                {r.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
