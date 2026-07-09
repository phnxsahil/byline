import React from "react";
import { IconBrain, IconMicrophoneOff, IconLayoutGrid, IconAlertCircle } from "@tabler/icons-react";

const PROBLEMS = [
  { Icon: IconBrain, title: "The memory gap", body: "AI tools forget your project context the moment you close the tab." },
  { Icon: IconMicrophoneOff, title: "Voice decay", body: "AI rewrites strip your personality. Posts sound like a press release." },
  { Icon: IconLayoutGrid, title: "Format fatigue", body: "LinkedIn, X, Reddit, Threads — the same update needs a different frame." },
  { Icon: IconAlertCircle, title: "The Reddit trap", body: "Self-promo gets you banned. Reddit needs genuine education." },
];

export function ProblemSection() {
  return (
    <section className="ta-grid-wrapper dispatch-reveal">
      <div className="ta-grid">
        <div className="ta-col">
          <div style={{ padding: "80px 48px" }}>
            <div className="ta-badge"><span style={{ color: "var(--accent)", marginRight: 8 }}>/01</span> THE PROBLEM</div>
            <h2 className="ta-hero-title" style={{ fontSize: "2rem" }}>Building in public shouldn't be a second job.</h2>
            <p className="ta-hero-desc">You ship code daily. But talking about it takes longer than the build itself.</p>
          </div>
        </div>
        
        {PROBLEMS.map((p, i) => (
          <div key={i} className="ta-col" style={{ padding: 48, justifyContent: "space-between", background: "var(--bg)" }}>
            <p.Icon size={24} color="var(--accent)" stroke={1.5} />
            <div style={{ marginTop: 40 }}>
              <div style={{ fontFamily: "Space Grotesk", fontSize: 18, fontWeight: 600, color: "var(--text-primary)", marginBottom: 12 }}>{p.title}</div>
              <div style={{ fontFamily: "Inter", fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{p.body}</div>
            </div>
            <div className="ta-cross" style={{ bottom: -5, left: -5 }}></div>
          </div>
        ))}
      </div>
    </section>
  );
}
