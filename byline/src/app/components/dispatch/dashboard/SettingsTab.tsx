import React from "react";
import { IconSettings, IconMicrophone, IconBrandGithub, IconUser, IconPalette } from "@tabler/icons-react";

interface SettingsTabProps {
  isMobile: boolean;
}

const SECTIONS = [
  { icon: IconMicrophone, title: "Voice Profile", desc: "Configure how your content sounds across platforms" },
  { icon: IconBrandGithub, title: "GitHub Integration", desc: "Connect repos and configure webhooks" },
  { icon: IconUser, title: "Account", desc: "Manage your account and API keys" },
  { icon: IconPalette, title: "Appearance", desc: "Theme and display preferences" },
];

export function SettingsTab({ isMobile }: SettingsTabProps) {
  return (
    <div style={{
      flex: 1, overflowY: "auto", padding: isMobile ? "16px" : "24px",
      display: "flex", flexDirection: "column", gap: 16,
    }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--by-text-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        Settings
      </div>

      <div style={{
        background: "var(--by-bg-2)", border: "0.5px solid var(--by-border)",
        borderRadius: 6, overflow: "hidden",
      }}>
        {SECTIONS.map((s, i) => (
          <div key={i}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "14px 16px", cursor: "pointer",
              borderBottom: i < SECTIONS.length - 1 ? "0.5px solid var(--by-border)" : "none",
              transition: "background 120ms",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <s.icon size={18} stroke={1.5} color="var(--by-accent)" />
            <div>
              <div style={{ fontSize: 13, color: "var(--by-text)", fontWeight: 500 }}>{s.title}</div>
              <div style={{ fontSize: 11, color: "var(--by-text-3)", marginTop: 1 }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
