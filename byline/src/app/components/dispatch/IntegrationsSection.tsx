import React from "react";
import {
  IconBrandLinkedin,
  IconBrandX,
  IconBrandReddit,
  IconBrandThreads,
  IconBrandGithub,
  IconMicrophone,
  IconApi,
} from "@tabler/icons-react";

const INTEGRATIONS = [
  { Icon: IconBrandLinkedin, name: "LinkedIn", desc: "Hook-first posts. 150–300 words.", color: "#0A66C2" },
  { Icon: IconBrandX, name: "X / Twitter", desc: "Punchy threads. Lowercase opinions.", color: "var(--text-primary)" },
  { Icon: IconBrandReddit, name: "Reddit", desc: "Educational framing. Zero promo risk.", color: "#FF4500" },
  { Icon: IconBrandThreads, name: "Threads", desc: "Casual. Raw. Under 300 chars.", color: "var(--text-primary)" },
  { Icon: IconBrandGithub, name: "GitHub", desc: "PR and deploy watcher.", color: "var(--text-primary)" },
  { Icon: IconMicrophone, name: "Voice Notes", desc: "Whisper transcription pipeline.", color: "var(--text-primary)" },
  { Icon: IconApi, name: "Composio MCP", desc: "Auto-posting via MCP.", color: "var(--accent)" },
];

export function IntegrationsSection() {
  return (
    <section className="ta-grid-wrapper dispatch-reveal">
      <div className="ta-grid">
        <div className="ta-col">
          <div style={{ padding: "80px 48px" }}>
            <div className="ta-badge"><span style={{ color: "var(--accent)", marginRight: 8 }}>/05</span> INTEGRATIONS</div>
            <h2 className="ta-hero-title" style={{ fontSize: "2rem" }}>Plugs into your world.</h2>
            <p className="ta-hero-desc">Four platforms. Three inputs. One pipeline. Zero OAuth headaches.</p>
          </div>
        </div>
        
        <div className="ta-col" style={{ gridColumn: "span 3", display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
          {INTEGRATIONS.map((integ, i) => (
            <div 
              key={integ.name} 
              style={{ 
                padding: "32px 48px", 
                borderRight: (i+1) % 3 !== 0 ? "1px dashed var(--border)" : "none",
                borderBottom: i < 6 ? "1px dashed var(--border)" : "none",
                display: "flex",
                flexDirection: "column",
                gap: 16
              }}
            >
              <integ.Icon size={24} color={integ.color} stroke={1.5} />
              <div>
                <div style={{ fontFamily: "Space Grotesk", fontSize: 16, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 4px 0" }}>{integ.name}</div>
                <div style={{ fontFamily: "Inter", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{integ.desc}</div>
              </div>
            </div>
          ))}
          {/* Empty cells to fill the grid if needed */}
          <div style={{ borderBottom: "1px dashed var(--border)", borderRight: "1px dashed var(--border)" }} />
          <div style={{ borderBottom: "1px dashed var(--border)" }} />
        </div>
      </div>
    </section>
  );
}