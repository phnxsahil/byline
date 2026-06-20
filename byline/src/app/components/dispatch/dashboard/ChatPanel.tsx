import React, { useState, useRef, useEffect } from "react";
import { IconMessageCircle, IconX, IconSend, IconPhoto, IconArrowUp } from "@tabler/icons-react";

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onRunMilestone: (text: string, images?: string[]) => void;
  isRunning: boolean;
  onNavigate: (tab: string) => void;
}

interface Message {
  role: "user" | "assistant";
  text: string;
}

const QUICK_ACTIONS = [
  { label: "What just shipped?", tab: "activity" },
  { label: "Review drafts", tab: "desk" },
  { label: "Check signals", tab: "signal" },
];

export function ChatPanel({ isOpen, onClose, onRunMilestone, isRunning, onNavigate }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hey, I'm the Wire Agent. What's your latest milestone?" },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isRunning) return;
    setMessages(m => [...m, { role: "user", text }]);
    setInput("");

    if (text.length > 15) {
      setTimeout(() => {
        setMessages(m => [...m, { role: "assistant", text: "Got it. Running the pipeline with that milestone. Check the logs for progress." }]);
        onRunMilestone(text);
      }, 400);
    } else {
      setTimeout(() => {
        setMessages(m => [...m, { role: "assistant", text: "Short signal noted. Add more detail if you want a full post." }]);
      }, 400);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: "absolute", bottom: 0, right: 0, zIndex: 39,
      width: 380, maxHeight: 400,
      background: "var(--by-bg-2)", border: "0.5px solid var(--by-border)",
      borderRight: "none", borderBottom: "none",
      borderRadius: "8px 0 0 0",
      display: "flex", flexDirection: "column",
      fontFamily: "'Inter', sans-serif", fontSize: 12,
      boxShadow: "-4px 0 20px rgba(0,0,0,0.3)",
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "8px 12px", borderBottom: "0.5px solid var(--by-border)", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <IconMessageCircle size={14} stroke={1.5} color="var(--by-accent)" />
          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--by-text)" }}>Chat</span>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--by-text-3)", padding: 2 }}>
          <IconX size={14} stroke={1.5} />
        </button>
      </div>

      <div ref={scrollRef} style={{
        flex: 1, overflowY: "auto", padding: "8px 12px",
        display: "flex", flexDirection: "column", gap: 8, minHeight: 100,
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start",
          }}>
            <div style={{
              maxWidth: "85%",
              padding: "6px 10px",
              borderRadius: msg.role === "user" ? "10px 10px 2px 10px" : "10px 10px 10px 2px",
              background: msg.role === "user" ? "rgba(232,94,44,0.12)" : "rgba(255,255,255,0.03)",
              color: "var(--by-text)",
              lineHeight: 1.5,
              wordBreak: "break-word",
            }}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {messages.length === 1 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: "0 12px 8px" }}>
          {QUICK_ACTIONS.map((qa) => (
            <button key={qa.label} onClick={() => onNavigate(qa.tab)}
              style={{
                padding: "3px 8px", borderRadius: 4,
                background: "rgba(232,94,44,0.06)", border: "0.5px solid rgba(232,94,44,0.15)",
                color: "var(--by-text-2)", fontFamily: "'Inter', sans-serif",
                fontSize: 10, cursor: "pointer",
              }}>
              {qa.label}
            </button>
          ))}
        </div>
      )}

      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "8px 12px", borderTop: "0.5px solid var(--by-border)", flexShrink: 0,
      }}>
        <button style={{
          background: "none", border: "0.5px solid var(--by-border)",
          borderRadius: 4, color: "var(--by-text-3)", cursor: "pointer",
          padding: "4px 6px", display: "flex", flexShrink: 0,
        }}>
          <IconPhoto size={14} stroke={1.5} />
        </button>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Signal a milestone..."
          rows={1}
          style={{
            flex: 1, background: "rgba(255,255,255,0.03)", border: "0.5px solid var(--by-border)",
            borderRadius: 4, padding: "5px 8px", color: "var(--by-text)",
            fontFamily: "'Inter', sans-serif", fontSize: 12,
            resize: "none", outline: "none", lineHeight: 1.4,
          }}
        />
        <button onClick={handleSend} disabled={!input.trim() || isRunning}
          style={{
            background: input.trim() && !isRunning ? "var(--by-accent)" : "var(--by-bg-3)",
            border: "none", borderRadius: 4, cursor: input.trim() && !isRunning ? "pointer" : "default",
            color: input.trim() && !isRunning ? "#F5F2EC" : "var(--by-text-3)",
            padding: "4px 6px", display: "flex", flexShrink: 0,
          }}>
          <IconArrowUp size={14} stroke={1.5} />
        </button>
      </div>
    </div>
  );
}
