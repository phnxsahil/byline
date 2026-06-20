import React from "react";
import { IconActivity, IconBolt, IconEdit, IconCheck } from "@tabler/icons-react";

interface ActivityTabProps {
  isMobile: boolean;
}

const EVENTS = [
  { action: "dispatch", icon: IconBolt, text: "Pipeline ran for milestone 'Semantic search with pgvector'", platform: "LinkedIn, X, Reddit", time: "2h ago" },
  { action: "edit", icon: IconEdit, text: "You edited the LinkedIn draft", platform: "LinkedIn", time: "1h ago" },
  { action: "approve", icon: IconCheck, text: "X thread approved for posting", platform: "X", time: "45m ago" },
  { action: "dispatch", icon: IconBolt, text: "Pipeline ran for milestone 'Added user feedback loop'", platform: "Threads", time: "1d ago" },
];

export function ActivityTab({ isMobile }: ActivityTabProps) {
  return (
    <div style={{
      flex: 1, overflowY: "auto", padding: isMobile ? "16px" : "24px",
      display: "flex", flexDirection: "column", gap: 16,
    }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--by-text-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        Activity Log
      </div>

      <div style={{
        background: "var(--by-bg-2)", border: "0.5px solid var(--by-border)",
        borderRadius: 6, overflow: "hidden",
      }}>
        {EVENTS.map((e, i) => (
          <div key={i}
            style={{
              display: "flex", alignItems: "flex-start", gap: 12,
              padding: "12px 16px",
              borderBottom: i < EVENTS.length - 1 ? "0.5px solid var(--by-border)" : "none",
            }}>
            <e.icon size={14} stroke={1.5} color="var(--by-accent)" style={{ marginTop: 2, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, color: "var(--by-text)", marginBottom: 2 }}>{e.text}</div>
              <div style={{ fontSize: 10, color: "var(--by-text-3)" }}>{e.platform} · {e.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
