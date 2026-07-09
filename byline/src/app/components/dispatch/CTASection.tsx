import React from "react";
import { IconBrandGithub } from "@tabler/icons-react";

export function CTASection() {
  return (
    <section className="ta-grid-wrapper dispatch-reveal">
      <div className="ta-grid">
        <div className="ta-col" style={{ gridColumn: "span 4", padding: "120px 48px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h2 className="ta-hero-title" style={{ fontSize: "3rem" }}>Ready to ship in public?</h2>
          <p className="ta-hero-desc" style={{ marginBottom: 40, textAlign: "center" }}>Open source. Self-hostable. Ship code, we'll write the post.</p>
          <div style={{ display: "flex", gap: 16 }}>
            <a href="#docs" className="ta-btn-pixel" style={{ padding: "16px 32px" }}>READ THE DOCS</a>
            <a href="https://github.com/sahil/byline" style={{ fontFamily: "var(--byline-font-mono)", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", textDecoration: "none", padding: "16px 32px", border: "1px dashed var(--border)", display: "flex", alignItems: "center", gap: 8 }}><IconBrandGithub size={16} /> STAR ON GITHUB</a>
          </div>
        </div>
      </div>
    </section>
  );
}
