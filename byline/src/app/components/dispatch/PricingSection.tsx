import React from "react";
import { IconCheck, IconBrandGithub } from "@tabler/icons-react";

export function PricingSection() {
  return (
    <section id="pricing" className="ta-grid-wrapper dispatch-reveal">
      <div className="ta-grid">
        <div className="ta-col">
          <div style={{ padding: "80px 48px" }}>
            <div className="ta-badge"><span style={{ color: "var(--accent)", marginRight: 8 }}>/05</span> PRICING</div>
            <h2 className="ta-hero-title" style={{ fontSize: "2rem" }}>Start free. Always.</h2>
            <p className="ta-hero-desc">Byline is MIT licensed.</p>
          </div>
        </div>
        
        <div className="ta-col" style={{ gridColumn: "span 2", padding: 48, background: "var(--surface)", borderRight: "1px dashed var(--border)" }}>
          <div style={{ fontFamily: "var(--byline-font-mono)", fontSize: 10, color: "var(--bg)", background: "var(--accent)", padding: "4px 8px", display: "inline-block", marginBottom: 24 }}>MOST POPULAR</div>
          <div style={{ fontFamily: "Space Grotesk", fontSize: 24, fontWeight: 600, color: "var(--text-primary)" }}>Self-hosted</div>
          <div style={{ fontFamily: "var(--byline-font-mono)", fontSize: 48, fontWeight: 700, color: "var(--accent)", marginTop: 16 }}>$0</div>
          <div style={{ borderTop: "1px dashed var(--border)", margin: "32px 0", paddingTop: 32, display: "flex", flexDirection: "column", gap: 16 }}>
             {["Full LangGraph pipeline", "pgvector project memory", "Unlimited bylines"].map(f => (
               <div key={f} style={{ display: "flex", gap: 12, alignItems: "center", fontFamily: "Inter", fontSize: 14, color: "var(--text-secondary)" }}><IconCheck size={16} color="var(--accent)" /> {f}</div>
             ))}
          </div>
          <a href="https://github.com/sahil/byline" className="ta-btn-pixel" style={{ padding: "12px 24px", width: "100%" }}>CLONE ON GITHUB</a>
        </div>
        
        <div className="ta-col" style={{ padding: 48 }}>
           <div style={{ fontFamily: "var(--byline-font-mono)", fontSize: 10, color: "var(--text-secondary)", border: "1px solid var(--border)", padding: "4px 8px", display: "inline-block", marginBottom: 24 }}>COMING SOON</div>
           <div style={{ fontFamily: "Space Grotesk", fontSize: 24, fontWeight: 600, color: "var(--text-secondary)" }}>Cloud</div>
           <div style={{ fontFamily: "var(--byline-font-mono)", fontSize: 32, fontWeight: 700, color: "var(--text-secondary)", marginTop: 16 }}>TBD</div>
        </div>
      </div>
    </section>
  );
}
