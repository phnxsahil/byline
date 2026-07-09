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
      <div className="ta-grid">
        <div className="ta-col">
          <div style={{ padding: "80px 48px" }}>
            <div className="ta-badge"><span style={{ color: "var(--accent)", marginRight: 8 }}>/03</span> FEATURES</div>
            <h2 className="ta-hero-title" style={{ fontSize: "2rem" }}>Tools for builders.</h2>
          </div>
        </div>
        
        <div className="ta-col" style={{ gridColumn: "span 3" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", height: "100%" }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ padding: 48, borderRight: (i+1)%3!==0 ? "1px dashed var(--border)" : "none", borderBottom: i<3 ? "1px dashed var(--border)" : "none" }}>
                <f.Icon size={24} color="var(--text-secondary)" stroke={1.5} style={{ marginBottom: 24 }} />
                <div style={{ fontFamily: "Space Grotesk", fontSize: 16, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontFamily: "Inter", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
