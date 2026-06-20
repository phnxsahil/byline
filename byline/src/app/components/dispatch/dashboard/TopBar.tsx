import React, { useEffect, useRef, useState } from "react";
import { IconBolt, IconChevronDown, IconCommand, IconMenu2 } from "@tabler/icons-react";
import Avatar from "boring-avatars";

export type DashTab = "overview" | "desk" | "signal" | "activity" | "settings" | "docs";

interface Project {
  name: string;
  stack: string;
  arc: string;
}

interface TopBarProps {
  "data-testid"?: string;
  activeTab: DashTab;
  onDispatchClick: () => void;
  onLandingClick: () => void;
  isRunning: boolean;
  isMobile: boolean;
  onMenuClick: () => void;
  projects: Project[];
  activeProject: number;
  setActiveProject: (idx: number) => void;
  onSearchClick: () => void;
}

export function TopBar({
  "data-testid": dataTestId,
  activeTab,
  onDispatchClick,
  onLandingClick,
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
  const activeLabel = activeTab === "desk" ? "The Desk" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1);

  return (
    <div
      data-testid={dataTestId}
      style={{
        height: 58,
        background: "linear-gradient(180deg, rgba(19,20,24,0.98), rgba(18,19,23,0.94))",
        borderBottom: "0.5px solid rgba(255,255,255,0.07)",
        display: "flex",
        alignItems: "center",
        padding: isMobile ? "0 12px" : "0 18px",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        zIndex: 50,
        gap: 12,
        boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
      }}
    >
      {!isMobile && (
        <div style={{ display: "flex", gap: 7, marginRight: 4, flexShrink: 0 }}>
          {[["#FF5F57", "#FF3B30"], ["#FFBD2E", "#FF9F0A"], ["#28C840", "#30D158"]].map(([bg, hover], i) => (
            <div
              key={i}
              style={{
                width: 11,
                height: 11,
                borderRadius: "50%",
                background: bg,
                cursor: i === 0 ? "pointer" : "default",
                transition: "background 150ms",
                flexShrink: 0,
              }}
              onClick={i === 0 ? onLandingClick : undefined}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = hover;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = bg;
              }}
              title={i === 0 ? "Back to site" : i === 1 ? "Minimize" : "Full screen"}
            />
          ))}
        </div>
      )}

      {isMobile && (
        <button
          onClick={onMenuClick}
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: "rgba(255,255,255,0.03)",
            border: "0.5px solid rgba(255,255,255,0.08)",
            cursor: "pointer",
            color: "var(--by-text-2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconMenu2 size={18} stroke={1.6} />
        </button>
      )}

      <button
        onClick={onLandingClick}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          fontFamily: "DM Mono, monospace",
          fontSize: 17,
          fontWeight: 500,
          color: "var(--by-text)",
          letterSpacing: "-0.04em",
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <span>byline_</span>
        {!isMobile && (
          <span
            style={{
              fontSize: 10,
              padding: "4px 8px",
              borderRadius: 999,
              background: "rgba(232,94,44,0.1)",
              color: "var(--by-accent)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            operator
          </span>
        )}
      </button>

      {!isMobile && (
        <div ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
          <button
            id="project-switcher-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "7px 10px",
              borderRadius: 10,
              border: "0.5px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
              color: "var(--by-text)",
              fontSize: 12,
              fontFamily: "DM Mono, monospace",
              cursor: "pointer",
              transition: "all 120ms ease",
            }}
          >
            {currentProject && (
              <Avatar name={currentProject.name} variant="marble" colors={["#E8593C", "#2C2C2A", "#F0EDE8"]} size={18} />
            )}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2, minWidth: 0 }}>
              <span style={{ color: "var(--by-text)", lineHeight: 1 }}>{currentProject?.name}</span>
              <span style={{ color: "var(--by-text-3)", fontSize: 10, lineHeight: 1 }}>{currentProject?.arc}</span>
            </div>
            <IconChevronDown size={12} stroke={1.5} color="var(--by-text-3)" />
          </button>

          {dropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                left: 0,
                width: 250,
                backgroundColor: "rgba(18,19,23,0.98)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                boxShadow: "0 18px 34px rgba(0,0,0,0.38)",
                zIndex: 100,
                padding: 6,
              }}
            >
              {projects.map((p, idx) => (
                <button
                  key={p.name}
                  onClick={() => {
                    setActiveProject(idx);
                    setDropdownOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    padding: "9px 10px",
                    borderRadius: 10,
                    border: "none",
                    background: activeProject === idx ? "rgba(232,94,44,0.1)" : "transparent",
                    color: "var(--by-text)",
                    fontSize: 12,
                    fontFamily: "DM Mono, monospace",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <Avatar name={p.name} variant="marble" colors={["#E8593C", "#2C2C2A", "#F0EDE8"]} size={18} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                    <div style={{ color: "var(--by-text-3)", fontSize: 10, marginTop: 2 }}>{p.stack}</div>
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
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: 244,
            height: 36,
            borderRadius: 10,
            border: "0.5px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.03)",
            padding: "0 10px 0 12px",
            color: "var(--by-text-3)",
            fontSize: 12,
            fontFamily: "'Inter', sans-serif",
            cursor: "pointer",
            marginLeft: 4,
          }}
        >
          <span>Search milestones, docs, commands...</span>
          <kbd
            style={{
              fontFamily: "DM Mono, monospace",
              fontSize: 10,
              padding: "3px 5px",
              border: "0.5px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.04)",
              borderRadius: 6,
              color: "var(--by-text-3)",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <IconCommand size={11} stroke={1.8} />
            K
          </kbd>
        </button>
      )}

      {isMobile && (
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: "var(--by-text)" }}>
            {activeLabel}
          </div>
          <div style={{ fontFamily: "DM Mono, monospace", fontSize: 10, color: "var(--by-text-3)", marginTop: 2 }}>
            {currentProject?.name}
          </div>
        </div>
      )}

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <button
          onClick={onDispatchClick}
          style={{
            fontFamily: "DM Mono, monospace",
            fontSize: 12,
            height: 38,
            padding: "0 14px",
            background: "#E85E2C",
            color: "#F5F2EC",
            border: "none",
            borderRadius: 11,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 7,
            boxShadow: "0 10px 24px rgba(232,94,44,0.18)",
            flexShrink: 0,
          }}
        >
          <IconBolt size={12} stroke={2} />
          {isMobile ? "Run" : "Dispatch"}
        </button>

        <div style={{ cursor: "pointer", borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
          <Avatar name="Sahil" variant="marble" colors={["#E8593C", "#2C2C2A", "#F0EDE8", "#C44A2E", "#1F1F22"]} size={28} />
        </div>
      </div>
    </div>
  );
}
