import React from "react";
import { IconRadio, IconGitCommit, IconMessageCircle, IconCode } from "@tabler/icons-react";

interface SignalTabProps {
  isMobile: boolean;
}

const SIGNALS = [
  { type: "github", icon: IconGitCommit, project: "byline", message: "feat: add pgvector similarity search", time: "30m ago", worth: true },
  { type: "github", icon: IconGitCommit, project: "fltrd.tech", message: "fix: handle empty query results in search endpoint", time: "3h ago", worth: false },
  { type: "voice", icon: IconMessageCircle, project: "byline", message: "Voice note: Thinking about adding RAG to the pipeline", time: "5h ago", worth: true },
  { type: "commit", icon: IconCode, project: "miryn", message: "Initial project scaffold", time: "1d ago", worth: false },
];

export function SignalTab({ isMobile }: SignalTabProps) {
  return (
    <div style={{
      flex: 1, overflowY: "auto", padding: isMobile ? "16px" : "24px",
      display: "flex", flexDirection: "column", gap: 16,
    }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--by-text-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        SIGNAL FEED
      </div>

      <div style={{
        background: "var(--by-bg-2)", border: "0.5px solid var(--by-border)",
        borderRadius: 6, overflow: "hidden",
      }}>
        {SIGNALS.map((s, i) => (
          <div key={i}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 16px",
              borderBottom: i < SIGNALS.length - 1 ? "0.5px solid var(--by-border)" : "none",
            }}>
            <s.icon size={16} stroke={1.5} color="var(--by-accent)" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--by-text)", fontWeight: 500 }}>{s.project}</span>
                <span style={{
                  fontSize: 9, padding: "1px 5px", borderRadius: 3,
                  background: s.worth ? "rgba(59,165,84,0.12)" : "rgba(255,255,255,0.04)",
                  color: s.worth ? "var(--by-green)" : "var(--by-text-3)",
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {s.worth ? "post-worthy" : "skip"}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "var(--by-text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.message}</div>
            </div>
            <span style={{ fontSize: 10, color: "var(--by-text-3)", flexShrink: 0 }}>{s.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
