import React, { useEffect, useRef } from "react";
import { IconTerminal2, IconX, IconChevronRight } from "@tabler/icons-react";

interface RunLogPanelProps {
  isOpen: boolean;
  isRunning: boolean;
  runningAgent: number;
  onClose: () => void;
}

const AGENT_NAMES = ["Strategist", "LinkedIn Writer", "X Writer", "Reddit Writer", "Critic"];

export function RunLogPanel({ isOpen, isRunning, runningAgent, onClose }: RunLogPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const logs = [
    { time: "0.0s", text: "Pipeline started", agent: -1 },
    { time: "0.3s", text: "Strategist received milestone", agent: 0 },
    { time: "1.2s", text: "Strategist: Angle determined (lesson_learned)", agent: 0 },
    { time: "1.8s", text: "LinkedIn Writer: Drafting post...", agent: 1 },
    { time: "2.5s", text: "LinkedIn Writer: Draft complete (247 chars)", agent: 1 },
    { time: "2.6s", text: "X Writer: Building thread...", agent: 2 },
    { time: "3.2s", text: "X Writer: Thread complete (4 tweets)", agent: 2 },
    { time: "3.3s", text: "Reddit Writer: Writing educational post...", agent: 3 },
    { time: "4.1s", text: "Reddit Writer: Draft complete (412 chars)", agent: 3 },
    { time: "4.2s", text: "Critic: Reviewing all drafts...", agent: 4 },
    { time: "5.0s", text: "Critic: All drafts approved", agent: 4 },
    { time: "5.1s", text: "Pipeline complete", agent: -1 },
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [isOpen, isRunning, runningAgent]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 40,
      height: 200, background: "var(--by-bg-2)",
      borderTop: "0.5px solid var(--by-border)",
      display: "flex", flexDirection: "column",
      fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "8px 14px", borderBottom: "0.5px solid var(--by-border)",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <IconTerminal2 size={14} stroke={1.5} color="var(--by-accent)" />
          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--by-text)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Run Log
          </span>
          {isRunning && (
            <span style={{ color: "var(--by-amber)", fontSize: 10, animation: "pulse 1.2s infinite" }}>
              {AGENT_NAMES[runningAgent] || "Running"}...
            </span>
          )}
        </div>
        <button onClick={onClose} style={{
          background: "none", border: "none", cursor: "pointer",
          color: "var(--by-text-3)", display: "flex", padding: 4,
        }}>
          <IconX size={14} stroke={1.5} />
        </button>
      </div>

      <div ref={scrollRef} style={{
        flex: 1, overflowY: "auto", padding: "8px 14px",
        display: "flex", flexDirection: "column", gap: 2,
      }}>
        {logs.map((log, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 8,
            color: log.agent === runningAgent && isRunning ? "var(--by-text)" : "var(--by-text-3)",
            opacity: log.agent >= 0 && log.agent <= runningAgent ? 1 : 0.5,
          }}>
            <span style={{ color: "var(--by-text-3)", width: 32, flexShrink: 0 }}>{log.time}</span>
            <IconChevronRight size={8} stroke={2} style={{ flexShrink: 0, opacity: 0.5 }} />
            <span>{log.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
