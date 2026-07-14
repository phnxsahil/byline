import React from "react";
import { IconBrandGithub, IconMicrophone, IconDatabase, IconPencil, IconShieldCheck, IconChartBar } from "@tabler/icons-react";

const FEATURES = [
  { Icon: IconBrandGithub, title: "GitHub Watcher", desc: "Automatically detects PRs and deploys worth talking about." },
  { Icon: IconMicrophone, title: "Voice Notes", desc: "Whisper transcription routing directly into the graph." },
  { Icon: IconDatabase, title: "pgvector Memory", desc: "Every project and past post is embedded. Context never lost." },
  { Icon: IconPencil, title: "Native Drafts", desc: "LinkedIn hook vs X thread vs Reddit lesson. All different." },
  { Icon: IconShieldCheck, title: "AI Slop Detector", desc: "Flags 'delve' and LLM tells. Your voice stays yours." },
  { Icon: IconChartBar, title: "Post Analytics", desc: "Feedback loop trains better drafts over time." },
];

export function FeatureSection() {
  return (
    <section id="features" className="ta-grid-wrapper dispatch-reveal">
      <style>{`
        .feat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          height: 100%;
        }
        .feat-card {
          padding: 48px;
          border-right: 1px dashed var(--border);
          border-bottom: 1px dashed var(--border);
        }
        .feat-card:nth-child(3n) {
          border-right: none;
        }
        .feat-card:nth-last-child(-n+3) {
          border-bottom: none;
        }
        @media (max-width: 1024px) {
          .feat-grid {
            grid-template-columns: 1fr;
          }
          .feat-card {
            border-right: none !important;
            border-bottom: 1px dashed var(--border) !important;
            padding: 32px 24px;
          }
          .feat-card:last-child {
            border-bottom: none !important;
          }
        }
      `}</style>
      <div className="ta-grid">
        <div className="ta-col">
          <div style={{ padding: "48px 48px 24px 48px" }}>
            <div className="ta-badge"><span style={{ color: "var(--accent)", marginRight: 8 }}>/04</span> FEATURES</div>
            <h2 className="ta-hero-title" style={{ fontSize: "2rem", marginBottom: 0 }}>Tools for builders.</h2>
          </div>
        </div>
        
        <div className="ta-col" style={{ gridColumn: "span 3" }}>
          <div className="feat-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="feat-card dispatch-bento-card" data-index={i}>
                <f.Icon size={24} color="var(--text-secondary)" stroke={1.5} style={{ marginBottom: 24 }} />
                <h3 style={{ fontFamily: "Space Grotesk", fontSize: 16, fontWeight: 600, color: "var(--text-primary)", margin: 0, marginBottom: 8 }}>{f.title}</h3>
                <div style={{ fontFamily: "Inter", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
