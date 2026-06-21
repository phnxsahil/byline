import React from "react";
import { IconRadio, IconGitCommit, IconMessageCircle, IconCode, IconBolt } from "@tabler/icons-react";
import { type DispatchRead } from "../../../api";

interface SignalTabProps {
  isMobile: boolean;
  dispatches: DispatchRead[];
  onSelectDispatch: (dispatch: DispatchRead) => void;
  onNavigate: (tab: string) => void;
}

export function SignalTab({ isMobile, dispatches, onSelectDispatch, onNavigate }: SignalTabProps) {
  const getSourceIcon = (source: string) => {
    switch (source?.toLowerCase()) {
      case "github":
        return IconGitCommit;
      case "voice_note":
      case "voice":
        return IconMessageCircle;
      case "cli":
        return IconCode;
      default:
        return IconBolt;
    }
  };

  const handleRowClick = (d: DispatchRead) => {
    onSelectDispatch(d);
    onNavigate("desk");
  };

  return (
    <div style={{
      flex: 1, overflowY: "auto", padding: isMobile ? "16px" : "24px",
      display: "flex", flexDirection: "column", gap: 16,
    }}>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "var(--by-text-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        SIGNAL FEED
      </div>

      {dispatches.length === 0 ? (
        <div style={{
          background: "var(--by-bg-2)", border: "0.5px solid var(--by-border)",
          borderRadius: 8, padding: "48px 24px", textAlign: "center",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 12
        }}>
          <IconRadio size={32} stroke={1.5} color="var(--by-text-3)" />
          <div style={{ fontFamily: "var(--font-display), sans-serif", fontSize: 16, color: "var(--by-text)" }}>
            No signals tracked yet
          </div>
          <p style={{ margin: 0, fontSize: 12, color: "var(--by-text-2)", maxWidth: 360, lineHeight: 1.5 }}>
            Milestones and webhooks will appear in this log as they feed into Byline. Try dispatching a milestone to see it here.
          </p>
          <button
            onClick={() => onNavigate("overview")}
            style={{
              marginTop: 8,
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              padding: "8px 14px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--by-border)",
              borderRadius: 4,
              color: "var(--by-text)",
              cursor: "pointer",
            }}
          >
            Go to Overview
          </button>
        </div>
      ) : (
        <div style={{
          background: "var(--by-bg-2)", border: "0.5px solid var(--by-border)",
          borderRadius: 6, overflow: "hidden",
        }}>
          {dispatches.map((s, i) => {
            const SourceIcon = getSourceIcon(s.source);
            const timeStr = new Date(s.created_at).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            });

            // Worthiness styling parameters
            let badgeText = "evaluating";
            let badgeBg = "rgba(245,158,11,0.12)";
            let badgeColor = "var(--by-amber)";

            if (s.is_post_worthy === true) {
              badgeText = "post-worthy";
              badgeBg = "rgba(63,185,80,0.12)";
              badgeColor = "var(--by-green)";
            } else if (s.is_post_worthy === false) {
              badgeText = "skip";
              badgeBg = "rgba(248,113,113,0.1)";
              badgeColor = "var(--by-red)";
            }

            return (
              <div key={s.id}
                onClick={() => handleRowClick(s)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 16px",
                  borderBottom: i < dispatches.length - 1 ? "0.5px solid var(--by-border)" : "none",
                  cursor: "pointer",
                  transition: "background-color 150ms ease",
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <SourceIcon size={16} stroke={1.5} color="var(--by-accent)" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "var(--by-text)", fontWeight: 500 }}>
                      {s.project_name.toLowerCase()}
                    </span>
                    <span style={{
                      fontSize: 9, padding: "1px 5px", borderRadius: 3,
                      background: badgeBg,
                      color: badgeColor,
                      fontFamily: "'IBM Plex Mono', monospace",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em"
                    }}>
                      {badgeText}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--by-text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {s.body}
                  </div>
                </div>
                <span style={{ fontSize: 10, color: "var(--by-text-3)", flexShrink: 0, fontFamily: "'IBM Plex Mono', monospace" }}>{timeStr}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
