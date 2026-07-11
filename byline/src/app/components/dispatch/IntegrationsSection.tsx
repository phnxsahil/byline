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
  { Icon: IconBrandLinkedin, name: "LinkedIn", desc: "Hook-first posts. 150–300 words.", color: "var(--text-primary)" },
  { Icon: IconBrandX, name: "X / Twitter", desc: "Punchy threads. Lowercase opinions.", color: "var(--text-primary)" },
  { Icon: IconBrandReddit, name: "Reddit", desc: "Educational framing. Zero promo risk.", color: "var(--text-primary)" },
  { Icon: IconBrandThreads, name: "Threads", desc: "Casual. Raw. Under 300 chars.", color: "var(--text-primary)" },
  { Icon: IconBrandGithub, name: "GitHub", desc: "PR and deploy watcher.", color: "var(--text-primary)" },
  { Icon: IconMicrophone, name: "Voice Notes", desc: "Whisper transcription pipeline.", color: "var(--text-primary)" },
  { Icon: IconApi, name: "Composio MCP", desc: "Auto-posting via MCP.", color: "var(--accent)" },
];

export function IntegrationsSection() {
  return (
    <section className="ta-grid-wrapper dispatch-reveal" style={{ position: 'relative' }}>
      <style>{`
        .int-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
        }
        .int-card {
          padding: 32px 48px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          border-right: 1px dashed var(--border);
          border-bottom: 1px dashed var(--border);
        }
        .int-card:nth-child(3n) {
          border-right: none;
        }
        .int-card:nth-last-child(-n+3) {
          border-bottom: none;
        }
        .int-api-callout {
          border-top: 1px dashed var(--border);
          border-left: 2px solid var(--accent);
          padding: 32px 46px; /* 48px minus 2px border */
          display: flex;
          align-items: center;
          gap: 24px;
          background: transparent;
        }
        @media (max-width: 1024px) {
          .int-grid {
            grid-template-columns: 1fr;
          }
          .int-card {
            border-right: none !important;
            border-bottom: 1px dashed var(--border) !important;
            padding: 32px 24px;
          }
          .int-card:last-child {
            border-bottom: none !important;
          }
          .int-api-callout {
            flex-direction: column;
            align-items: flex-start;
            padding: 32px 24px;
          }
        }
      `}</style>
      <div className="ta-grid">
        <div className="ta-col">
          <div style={{ padding: "80px 48px" }}>
            <div className="ta-badge"><span style={{ color: "var(--accent)", marginRight: 8 }}>/06</span> INTEGRATIONS</div>
            <h2 className="ta-hero-title" style={{ fontSize: "2rem" }}>Plugs into your world.</h2>
            <p className="ta-hero-desc">Four platforms. Three inputs. One pipeline. Zero OAuth headaches.</p>
          </div>
        </div>
        
        <div className="ta-col" style={{ gridColumn: "span 3", display: "flex", flexDirection: "column" }}>
          
          {/* Top 6 Integrations in a 3x2 Grid */}
          <div className="int-grid">
            {INTEGRATIONS.slice(0, 6).map((integ, i) => (
              <div 
                key={integ.name} 
                className="int-card"
              >
                <integ.Icon size={24} color={integ.color} stroke={1.5} />
                <div>
                  <div style={{ fontFamily: "Space Grotesk", fontSize: 16, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 4px 0" }}>{integ.name}</div>
                  <div style={{ fontFamily: "Inter", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{integ.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Full-width callout for Composio MCP */}
          <div className="int-api-callout">
            <div style={{ width: 48, height: 48, borderRadius: "8px", background: "color-mix(in srgb, var(--accent) 15%, transparent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <IconApi size={24} color="var(--accent)" stroke={1.5} />
            </div>
            <div>
              <div style={{ fontFamily: "var(--byline-font-mono)", fontSize: 11, color: "var(--accent)", letterSpacing: "0.05em", fontWeight: 600, marginBottom: 4 }}>POWERED BY</div>
              <div style={{ fontFamily: "Space Grotesk", fontSize: 18, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 4px 0" }}>{INTEGRATIONS[6].name}</div>
              <div style={{ fontFamily: "Inter", fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5 }}>{INTEGRATIONS[6].desc} Integrates directly into your existing agent architectures.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}