import React, { useState, useRef, useEffect } from "react";
import { IconBolt, IconTerminal2, IconMenu2, IconChevronDown, IconSearch } from "@tabler/icons-react";
import Avatar from "boring-avatars";

export type DashTab = "overview" | "desk" | "signal" | "activity" | "settings" | "docs";

interface Project {
  name: string;
  stack: string;
  arc: string;
}

interface TopBarProps {
  activeTab: DashTab;
  onTabChange: (tab: DashTab) => void;
  onPublish: () => void;
  onLandingClick: () => void;
  logOpen: boolean;
  onToggleLog: () => void;
  isRunning: boolean;
  isMobile: boolean;
  onMenuClick: () => void;
  projects: Project[];
  activeProject: number;
  setActiveProject: (idx: number) => void;
  onSearchClick: () => void;
}

export function TopBar({
  activeTab,
  onPublish,
  onLandingClick,
  logOpen,
  onToggleLog,
  isRunning,
  isMobile,
  onMenuClick,
  projects,
  activeProject,
  setActiveProject,
  onSearchClick,
}: TopBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentProject = projects[activeProject];

  return (
    <div style={{
      height: 44, background: "var(--by-bg-2)", borderBottom: "0.5px solid var(--by-border)",
      display: "flex", alignItems: "center", padding: "0 14px", flexShrink: 0,
      position: "sticky", top: 0, zIndex: 50, gap: 12,
    }}>
      {!isMobile && (
        <div style={{ display: "flex", gap: 6, marginRight: 6, flexShrink: 0 }}>
          {[["#FF5F57", "#FF3B30"], ["#FFBD2E", "#FF9F0A"], ["#28C840", "#30D158"]].map(([bg, hover], i) => (
            <div key={i}
              style={{ width: 11, height: 11, borderRadius: "50%", background: bg, cursor: "pointer", transition: "background 150ms", flexShrink: 0 }}
              onClick={i === 2 ? undefined : i === 0 ? onLandingClick : undefined}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = hover; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = bg; }}
              title={i === 0 ? "Back to site" : i === 1 ? "Minimize" : "Full screen"}
            />
          ))}
        </div>
      )}

      {isMobile && (
        <button onClick={onMenuClick} style={{ width: 32, height: 32, borderRadius: 6, background: "none", border: "none", cursor: "pointer", color: "var(--by-text-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <IconMenu2 size={18} stroke={1.5} />
        </button>
      )}

      <button onClick={onLandingClick} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, color: "var(--by-text)", letterSpacing: "-0.04em", display: "flex", alignItems: "center" }}>
        byline_
      </button>

      {!isMobile && (
        <div ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "4px 8px", borderRadius: 4,
              border: "1px solid var(--by-border)",
              background: "rgba(255,255,255,0.02)", color: "var(--by-text)",
              fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
              cursor: "pointer", transition: "all 120ms ease",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--by-text-3)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--by-border)"}
          >
            {currentProject && (
              <Avatar name={currentProject.name} variant="marble" colors={["#E8593C", "#2C2C2A", "#F0EDE8"]} size={16} />
            )}
            <span>{currentProject?.name}</span>
            <IconChevronDown size={12} stroke={1.5} color="var(--by-text-3)" />
          </button>

          {dropdownOpen && (
            <div style={{
              position: "absolute", top: "100%", left: 0, marginTop: 4, width: 200,
              backgroundColor: "var(--by-bg-2)", border: "1px solid var(--by-border)",
              borderRadius: 6, boxShadow: "0 10px 30px rgba(0,0,0,0.5)", zIndex: 100, padding: 4,
            }}>
              {projects.map((p, idx) => (
                <button
                  key={p.name}
                  onClick={() => { setActiveProject(idx); setDropdownOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    width: "100%", padding: "6px 8px", borderRadius: 4, border: "none",
                    background: activeProject === idx ? "rgba(232,94,44,0.08)" : "transparent",
                    color: "var(--by-text)", fontSize: 12,
                    fontFamily: "'JetBrains Mono', monospace",
                    textAlign: "left", cursor: "pointer", transition: "background 120ms",
                  }}
                  onMouseEnter={e => { if (activeProject !== idx) e.currentTarget.style.background = "var(--by-bg-3)"; }}
                  onMouseLeave={e => { if (activeProject !== idx) e.currentTarget.style.background = "transparent"; }}
                >
                  <Avatar name={p.name} variant="marble" colors={["#E8593C", "#2C2C2A", "#F0EDE8"]} size={16} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {!isMobile && (
        <button
          onClick={onSearchClick}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            width: 180, height: 28, borderRadius: 4,
            border: "0.5px solid var(--by-border)", background: "rgba(255, 255, 255, 0.02)",
            padding: "0 8px", color: "var(--by-text-3)", fontSize: 12,
            fontFamily: "'Inter', sans-serif", cursor: "pointer", marginLeft: 8,
            transition: "all 120ms ease",
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "var(--by-text-3)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "var(--by-border)"}
        >
          <span>Search or command...</span>
          <kbd style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
            padding: "1px 4px", border: "0.5px solid var(--by-border)",
            background: "rgba(255,255,255,0.03)", borderRadius: 2,
            color: "var(--by-text-3)"
          }}>K</kbd>
        </button>
      )}

      {isMobile && (
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500, color: "var(--by-text)", flex: 1, textAlign: "center", marginRight: 8 }}>
          {activeTab === "desk" ? "The Desk" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </span>
      )}

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
        {!isMobile && (
          <button onClick={onToggleLog} title="Pipeline run log"
            style={{ width: 30, height: 30, borderRadius: 5, background: logOpen ? "rgba(232,94,44,0.12)" : "transparent", border: "0.5px solid " + (logOpen ? "rgba(232,94,44,0.3)" : "transparent"), cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: logOpen ? "#E85E2C" : "var(--by-text-3)", transition: "all 150ms", position: "relative" }}
            onMouseEnter={e => { if (!logOpen) { const el = e.currentTarget as HTMLButtonElement; el.style.background = "rgba(255,255,255,0.05)"; el.style.color = "var(--by-text)"; } }}
            onMouseLeave={e => { if (!logOpen) { const el = e.currentTarget as HTMLButtonElement; el.style.background = "transparent"; el.style.color = "var(--by-text-3)"; } }}
          >
            <IconTerminal2 size={14} stroke={1.5} />
            {isRunning && <span style={{ position: "absolute", top: 4, right: 4, width: 5, height: 5, borderRadius: "50%", background: "#E85E2C" }} />}
          </button>
        )}

        <button onClick={onPublish}
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, height: 28, padding: "0 12px", background: "#E85E2C", color: "#F5F2EC", border: "none", borderRadius: 5, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, transition: "background 150ms", flexShrink: 0 }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#C7501E"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#E85E2C"; }}
        >
          <IconBolt size={11} stroke={2} />
          {isMobile ? "Run" : "log dispatch"}
        </button>

        <div style={{ marginLeft: 4, cursor: "pointer", borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
          <Avatar name="Sahil" variant="marble" colors={["#E8593C", "#2C2C2A", "#F0EDE8", "#C44A2E", "#1F1F22"]} size={26} />
        </div>
      </div>
    </div>
  );
}
