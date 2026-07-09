import React from "react";
import { IconMessageCircle } from "@tabler/icons-react";

interface StatusBarProps {
  isRunning: boolean;
  onOpenChat: () => void;
  chatOpen: boolean;
}

export function StatusBar({ isRunning, onOpenChat, chatOpen }: StatusBarProps) {
  return (
    <div
      style={{
        height: 28,
        background: "var(--by-bg-2)",
        borderTop: "0.5px solid var(--by-border)",
        display: "flex",
        alignItems: "center",
        padding: "0 14px",
        flexShrink: 0,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
        color: "#8A8A86",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: isRunning ? "var(--by-amber)" : "var(--by-green)",
          }}
        />
        <span>{isRunning ? "Pipeline running..." : "Idle"}</span>
      </div>

      <div style={{ flex: 1 }} />

      <button
        onClick={onOpenChat}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: chatOpen ? "var(--by-accent)" : "#8A8A86",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          padding: "2px 6px",
        }}
      >
        <IconMessageCircle size={12} stroke={1.5} aria-hidden="true" />
        <span>{chatOpen ? "Rail open" : "Open rail"}</span>
      </button>

      <span>⌘K command palette</span>
      <span>⌘⇧A fullscreen rail</span>
    </div>
  );
}
