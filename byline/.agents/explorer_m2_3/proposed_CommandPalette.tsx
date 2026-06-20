import React, { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface Command {
  id: string;
  label: string;
  shortcut?: string;
  group: string;
  action: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  commands: Command[];
  runPipeline?: (query: string) => void;
}

// ─── Simple fuzzy match ─────────────────────────────────────────────────────

function fuzzyMatch(query: string, text: string): boolean {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  return qi === q.length;
}

// ─── Command Palette ────────────────────────────────────────────────────────

export function CommandPalette({ open, onClose, commands, runPipeline }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Filter commands
  const filtered = query
    ? commands.filter((c) => fuzzyMatch(query, c.label))
    : commands;

  // Check if there are any matches in Navigation or Documentation groups
  const hasNavOrDocMatches = filtered.some(
    (c) => c.group === "Navigation" || c.group === "Documentation"
  );

  // Build the final items list, injecting a fallback dispatch command if no nav/doc matches
  const finalItems = [...filtered];
  const isFallbackActive = query.trim() !== "" && !hasNavOrDocMatches;

  if (isFallbackActive) {
    finalItems.push({
      id: "fallback-dispatch",
      label: `Dispatch: '${query}'`,
      group: "Actions",
      action: () => {
        if (runPipeline) {
          runPipeline(query);
        }
      },
    });
  }

  // Group items for rendering
  const grouped = finalItems.reduce<{ group: string; items: Command[] }[]>(
    (acc, cmd) => {
      const last = acc[acc.length - 1];
      if (last && last.group === cmd.group) {
        last.items.push(cmd);
      } else {
        acc.push({ group: cmd.group, items: [cmd] });
      }
      return acc;
    },
    []
  );

  // Reset selection index when query changes
  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Escape key global listener for safety
  useEffect(() => {
    if (!open) return;
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [open, onClose]);

  // Keyboard navigation handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((prev) => Math.min(prev + 1, finalItems.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((prev) => Math.max(prev - 1, 0));
      }
      if (e.key === "Enter" && finalItems[selectedIdx]) {
        finalItems[selectedIdx].action();
        onClose();
      }
    },
    [finalItems, selectedIdx, onClose]
  );

  // Click outside to close overlay
  const overlayRef = useRef<HTMLDivElement>(null);
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) onClose();
    },
    [onClose]
  );

  // Scroll selected into view
  useEffect(() => {
    const el = listRef.current?.querySelector("[data-selected=true]") as HTMLElement | null;
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIdx]);

  if (!open) return null;

  let flatCounter = 0;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center", // Centered modal overlay vertically
        justifyContent: "center", // Centered modal overlay horizontally
        padding: "16px",
        backgroundColor: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 560, // Requirement 1: max-width 560px
          backgroundColor: "var(--by-bg-2)", // Requirement 1: background var(--by-bg-2)
          border: "1px solid var(--by-border)", // Requirement 1: border var(--by-border)
          borderRadius: 10,
          boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3)",
          overflow: "hidden",
          animation: "cp-scale-in 0.12s ease-out",
        }}
      >
        <style>{`
          @keyframes cp-scale-in {
            from { opacity: 0; transform: scale(0.96) translateY(-4px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes cp-fade-in {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          .cp-overlay { animation: cp-fade-in 0.1s ease-out; }
        `}</style>

        {/* ── Search input ──────────────────────────────── */}
        <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--by-border)" }}>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands…"
            style={{
              width: "100%",
              boxSizing: "border-box",
              backgroundColor: "transparent",
              border: "none",
              outline: "none",
              color: "var(--by-text)",
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 14,
              lineHeight: "28px",
            }}
          />
        </div>

        {/* ── Results ───────────────────────────────────── */}
        <div
          ref={listRef}
          style={{
            maxHeight: 320,
            overflowY: "auto",
            padding: "6px 0",
          }}
        >
          {grouped.length === 0 && (
            <div style={{ padding: "20px 14px", textAlign: "center", fontFamily: "'Inter'", fontSize: 13, color: "var(--by-text-3)" }}>
              No results for <span style={{ color: "var(--by-text-2)" }}>"{query}"</span>
            </div>
          )}
          {grouped.map((group) => (
            <div key={group.group}>
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace", // Requirement 2: IBM Plex Mono for all keyboard hints/stamps
                  fontSize: 9,
                  color: "var(--by-text-3)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "8px 14px 4px",
                }}
              >
                {group.group}
              </div>
              {group.items.map((cmd) => {
                const idx = flatCounter++;
                const isSelected = idx === selectedIdx;
                return (
                  <div
                    key={cmd.id}
                    data-selected={isSelected}
                    onClick={() => {
                      cmd.action();
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIdx(idx)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "7px 14px",
                      cursor: "pointer",
                      backgroundColor: isSelected ? "rgba(240,165,0,0.08)" : "transparent",
                      borderLeft: isSelected ? "2px solid #F0A500" : "2px solid transparent",
                      transition: "background-color 0.08s ease",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Inter', system-ui, sans-serif",
                        fontSize: 13,
                        color: isSelected ? "var(--by-text)" : "var(--by-text-2)",
                        fontWeight: isSelected ? 500 : 400,
                      }}
                    >
                      {cmd.label}
                    </span>
                    {cmd.shortcut && (
                      <kbd
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace", // Requirement 2: IBM Plex Mono for all keyboard hints
                          fontSize: 9,
                          color: "var(--by-text-3)",
                          padding: "1px 5px",
                          borderRadius: 3,
                          border: "0.5px solid var(--by-border)",
                          backgroundColor: "rgba(255,255,255,0.03)",
                          lineHeight: "16px",
                        }}
                      >
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* ── Footer hint ───────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "6px 14px",
            borderTop: "1px solid var(--by-border)",
            fontFamily: "'IBM Plex Mono', monospace", // Requirement 2: IBM Plex Mono for all keyboard hints
            fontSize: 9,
            color: "var(--by-text-3)",
          }}
        >
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
