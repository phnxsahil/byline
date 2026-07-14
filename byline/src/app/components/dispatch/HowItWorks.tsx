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
      <style>{`
        .hiw-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          height: 100%;
        }
        .hiw-card {
          padding: 48px 24px;
          position: relative;
          border-right: 1px dashed var(--border);
          border-bottom: none;
        }
        .hiw-card:last-child {
          border-right: none;
        }
        .step-arrow {
          position: absolute;
          right: -8px;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          background: var(--bg);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }
        @media (max-width: 1024px) {
          .hiw-grid {
            grid-template-columns: 1fr;
          }
          .hiw-card {
            border-right: none !important;
            border-bottom: 1px dashed var(--border);
            padding: 32px 24px;
          }
          .hiw-card:last-child {
            border-bottom: none;
          }
          .step-arrow {
            right: auto;
            left: 50%;
            top: auto;
            bottom: -8px;
            transform: translateX(-50%) rotate(90deg);
          }
        }
      `}</style>
      <div id="how-it-works-grid" className="ta-grid">
        
        {/* Content on the Left */}
        <div className="ta-col" style={{ gridColumn: "span 3" }}>
          <div className="hiw-grid">
            {STEPS.map((step, i) => (
              <div key={i} className="hiw-card">
                <div style={{ fontFamily: "var(--byline-font-mono)", fontSize: 32, fontWeight: 700, color: "var(--text-secondary)", opacity: 0.6, marginBottom: 16 }}>0{step.num}</div>
                <step.Icon size={24} color={step.color} stroke={1.5} style={{ marginBottom: 16 }} />
                <h3 style={{ fontFamily: "Space Grotesk", fontSize: 14, fontWeight: 600, color: "var(--text-primary)", margin: 0, marginBottom: 8 }}>{step.title}</h3>
                <div style={{ fontFamily: "Inter", fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>{step.desc}</div>
                {i < 4 && <div className="step-arrow"><IconArrowRight size={10} color="var(--text-secondary)" /></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Title on the Right */}
        <div className="ta-col" style={{ gridColumn: 'span 1' }}>
          <div style={{ padding: "48px", display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
            <div className="ta-badge"><span style={{ color: "var(--accent)", marginRight: 8 }}>/03</span> HOW IT WORKS</div>
            <h2 className="ta-hero-title" style={{ fontSize: "2rem" }}>
              One signal in.<br/>Four platforms out.
            </h2>
            <p className="ta-hero-desc">
              A LangGraph pipeline runs five specialized agents.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
