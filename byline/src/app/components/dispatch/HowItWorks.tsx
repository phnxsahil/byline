import React from "react";
import { IconTerminal2, IconDatabase, IconChessKnight, IconPencil, IconShieldCheck, IconArrowRight } from "@tabler/icons-react";

const STEPS = [
  { num: 1, Icon: IconTerminal2, title: "Log milestone", desc: "CLI or voice capture.", color: "var(--text-secondary)" },
  { num: 2, Icon: IconDatabase, title: "Memory pull", desc: "pgvector pulls context.", color: "var(--text-secondary)" },
  { num: 3, Icon: IconChessKnight, title: "Strategist", desc: "Decides angle & platforms.", color: "var(--accent)" },
  { num: 4, Icon: IconPencil, title: "4 Writers", desc: "Native drafts in parallel.", color: "var(--accent)" },
  { num: 5, Icon: IconShieldCheck, title: "Critic", desc: "AI slop check & approval.", color: "#3FB950" },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="ta-grid-wrapper dispatch-reveal">
      <div className="ta-grid">
        <div className="ta-col">
          <div style={{ padding: "80px 48px" }}>
            <div className="ta-badge"><span style={{ color: "var(--accent)", marginRight: 8 }}>/02</span> HOW IT WORKS</div>
            <h2 className="ta-hero-title" style={{ fontSize: "2rem" }}>One signal in. Four platforms out.</h2>
            <p className="ta-hero-desc">A LangGraph pipeline runs five specialized agents.</p>
          </div>
        </div>
        
        <div className="ta-col" style={{ gridColumn: "span 3" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", height: "100%" }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{ borderRight: i < 4 ? "1px dashed var(--border)" : "none", padding: "48px 24px", position: "relative" }}>
                <div style={{ fontFamily: "var(--byline-font-mono)", fontSize: 32, fontWeight: 700, color: "var(--border)", opacity: 0.4, marginBottom: 16 }}>0{step.num}</div>
                <step.Icon size={24} color={step.color} stroke={1.5} style={{ marginBottom: 16 }} />
                <div style={{ fontFamily: "Space Grotesk", fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>{step.title}</div>
                <div style={{ fontFamily: "Inter", fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>{step.desc}</div>
                {i < 4 && <div style={{ position: "absolute", right: -8, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, background: "var(--bg)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}><IconArrowRight size={10} color="var(--text-secondary)" /></div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
