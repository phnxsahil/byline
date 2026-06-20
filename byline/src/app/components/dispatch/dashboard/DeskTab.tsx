import React from "react";
import { IconInbox, IconCheck, IconEdit, IconSend } from "@tabler/icons-react";

interface DeskTabProps {
  isMobile: boolean;
}

const DRAFTS = [
  { platform: "LinkedIn", content: "I spent the last 3 days shipping semantic search for fltrd.tech. The chunking strategy took longer to nail than the pgvector setup...", score: 8.5, status: "ready" },
  { platform: "X", content: "pgvector is easy.\nFiguring out how to chunk your content so search actually works?\nThat's the hard part.\nA thread 🧵", score: 9.0, status: "draft" },
  { platform: "Reddit", content: "I learned a lot building semantic search with pgvector. Here are the things I wish someone had told me before I started...", score: 7.8, status: "draft" },
  { platform: "Threads", content: "just shipped pgvector search on fltrd.tech. harder than i thought: chunking the content so embeddings actually match.", score: 8.2, status: "approved" },
];

export function DeskTab({ isMobile }: DeskTabProps) {
  const [activePlatform, setActivePlatform] = React.useState(0);
  const draft = DRAFTS[activePlatform];

  return (
    <div style={{
      flex: 1, overflowY: "auto", padding: isMobile ? "16px" : "24px",
      display: "flex", flexDirection: "column", gap: 16,
    }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--by-text-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        The Desk — Review drafts before posting
      </div>

      <div style={{
        background: "var(--by-bg-2)", border: "0.5px solid var(--by-border)",
        borderRadius: 6, overflow: "hidden",
      }}>
        <div style={{
          display: "flex", borderBottom: "0.5px solid var(--by-border)",
          overflowX: "auto",
        }}>
          {DRAFTS.map((d, i) => (
            <button key={d.platform} onClick={() => setActivePlatform(i)}
              style={{
                flex: 1, padding: "10px 14px", background: "none", border: "none",
                borderBottom: i === activePlatform ? "1.5px solid var(--by-accent)" : "0.5px solid transparent",
                cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: 11,
                color: i === activePlatform ? "var(--by-text)" : "var(--by-text-3)",
                fontWeight: i === activePlatform ? 600 : 400,
                transition: "all 120ms", whiteSpace: "nowrap",
              }}>
              {d.platform}
            </button>
          ))}
        </div>

        <div style={{ padding: "16px" }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
            color: "var(--by-text-3)", marginBottom: 8,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span>Score: <span style={{ color: "var(--by-accent)", fontWeight: 600 }}>{draft.score}/10</span></span>
            <span>Status: <span style={{ color: draft.status === "approved" ? "var(--by-green)" : draft.status === "ready" ? "var(--by-amber)" : "var(--by-text-3)" }}>{draft.status}</span></span>
          </div>
          <textarea
            defaultValue={draft.content}
            style={{
              width: "100%", minHeight: 120,
              background: "rgba(255,255,255,0.02)", border: "0.5px solid var(--by-border)",
              borderRadius: 4, padding: "10px 12px", color: "var(--by-text)",
              fontFamily: "'Inter', sans-serif", fontSize: 12,
              resize: "vertical", outline: "none", lineHeight: 1.6,
              boxSizing: "border-box",
            }}
          />
          <div style={{ display: "flex", gap: 6, marginTop: 10, justifyContent: "flex-end" }}>
            {["Edit", "Approve", "Post"].map((action) => (
              <button key={action}
                style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                  padding: "5px 12px", border: "0.5px solid var(--by-border)",
                  background: action === "Post" ? "var(--by-accent)" : "transparent",
                  color: action === "Post" ? "#F5F2EC" : "var(--by-text)",
                  borderRadius: 4, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                {action === "Edit" && <IconEdit size={11} stroke={1.5} />}
                {action === "Approve" && <IconCheck size={11} stroke={1.5} />}
                {action === "Post" && <IconSend size={11} stroke={1.5} />}
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
