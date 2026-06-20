import React from "react";
import { IconBolt, IconCode, IconBrain, IconGitBranch, IconUsers } from "@tabler/icons-react";

interface OverviewTabProps {
  onPublish: (text: string) => void;
  isMobile: boolean;
}

const STATS = [
  { label: "Dispatches", value: "12", icon: IconBolt },
  { label: "Active Projects", value: "5", icon: IconCode },
  { label: "AI Runs", value: "47", icon: IconBrain },
  { label: "Commits Watched", value: "89", icon: IconGitBranch },
  { label: "Platforms", value: "4", icon: IconUsers },
];

const RECENT = [
  { project: "byline", milestone: "Shipped semantic search using pgvector", time: "2h ago", status: "ready" },
  { project: "fltrd.tech", milestone: "Added user feedback loop to filtering pipeline", time: "1d ago", status: "ready" },
  { project: "byline", milestone: "Fixed LangGraph state serialization bug", time: "2d ago", status: "draft" },
];

export function OverviewTab({ onPublish, isMobile }: OverviewTabProps) {
  const [input, setInput] = React.useState("");

  return (
    <div style={{
      flex: 1, overflowY: "auto", padding: isMobile ? "16px" : "24px",
      display: "flex", flexDirection: "column", gap: 20,
    }}>
      <div style={{
        background: "var(--by-bg-2)", border: "0.5px solid var(--by-border)",
        borderRadius: 6, padding: "14px 16px",
        display: "flex", flexDirection: "column", gap: 10,
      }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--by-text-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          New Milestone
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What did you just ship or learn?"
          rows={2}
          style={{
            width: "100%", background: "rgba(255,255,255,0.02)",
            border: "0.5px solid var(--by-border)", borderRadius: 4,
            padding: "8px 10px", color: "var(--by-text)",
            fontFamily: "'Inter', sans-serif", fontSize: 13,
            resize: "vertical", outline: "none", lineHeight: 1.5,
            boxSizing: "border-box",
          }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={() => { if (input.trim()) { onPublish(input.trim()); setInput(""); } }}
            style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
              padding: "5px 14px", background: "var(--by-accent)", color: "#F5F2EC",
              border: "none", borderRadius: 4, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
            }}>
            <IconBolt size={12} stroke={2} />
            Dispatch
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(5, 1fr)", gap: 10 }}>
        {STATS.map((s) => (
          <div key={s.label} style={{
            background: "var(--by-bg-2)", border: "0.5px solid var(--by-border)",
            borderRadius: 6, padding: "14px 12px",
            display: "flex", flexDirection: "column", gap: 8,
          }}>
            <s.icon size={16} stroke={1.5} color="var(--by-accent)" />
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 600, color: "var(--by-text)", lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "var(--by-text-3)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{
        background: "var(--by-bg-2)", border: "0.5px solid var(--by-border)",
        borderRadius: 6, overflow: "hidden",
      }}>
        <div style={{ padding: "12px 16px", borderBottom: "0.5px solid var(--by-border)", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--by-text-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Recent Dispatches
        </div>
        {RECENT.map((r, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 16px", borderBottom: i < RECENT.length - 1 ? "0.5px solid var(--by-border)" : "none",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--by-text)", fontWeight: 500 }}>{r.project}</div>
              <div style={{ fontSize: 12, color: "var(--by-text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.milestone}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 10, color: "var(--by-text-3)" }}>{r.time}</span>
              <div style={{
                padding: "1px 6px", borderRadius: 3, fontSize: 9,
                fontFamily: "'JetBrains Mono', monospace",
                background: r.status === "ready" ? "rgba(59,165,84,0.12)" : "rgba(232,94,44,0.08)",
                color: r.status === "ready" ? "var(--by-green)" : "var(--by-accent)",
              }}>
                {r.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
