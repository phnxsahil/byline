import React from "react";
import { IconBrandGithub } from "@tabler/icons-react";
import { BrandMark } from "./BrandMark";
export function CTASection() {
  return (
    <section 
      className="ta-grid-wrapper dispatch-reveal" 
      style={{ 
        marginBottom: 0, 
        borderBottom: "1px solid var(--border)",
        position: "relative",
        background: "var(--bg)",
        overflow: "hidden"
      } as React.CSSProperties}
    >

      <style>{`
        .cta-github-btn {
          font-family: var(--byline-font-mono);
          font-size: 13px;
          font-weight: 700;
          color: var(--text-secondary);
          text-decoration: none;
          padding: 16px 32px;
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.2s ease;
          background: transparent;
        }
        .cta-github-btn:hover {
          background: var(--surface);
          color: var(--text-primary);
          border-color: var(--text-primary);
        }
        .cta-btn-container {
          display: flex;
          gap: 16px;
          align-items: center;
          margin-top: 24px;
          flex-wrap: wrap;
          justify-content: center;
        }
        @media (max-width: 640px) {
          .cta-github-btn {
            padding: 14px 24px;
            font-size: 12px;
            white-space: nowrap;
          }
          .cta-btn-primary {
            padding: 14px 24px !important;
            font-size: 12px !important;
            white-space: nowrap;
          }
        }
      `}</style>
      
      <div className="ta-grid" style={{ overflow: "hidden" }}>
        {/* Background Image & Overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/cta-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          zIndex: 0,
          opacity: 1,
          pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 80% 80% at 50% 30%, rgba(13,17,23,0.95) 0%, rgba(13,17,23,0.7) 40%, transparent 80%)",
          zIndex: 0,
          pointerEvents: "none"
        }} />

        {/* Reusable Brand Mark acting as a painted detail on the equipment */}
        <BrandMark 
          size={84} 
          opacity={0.15} 
          color="#ffffff"
          bracketColor="#ffffff"
          style={{
            position: "absolute",
            right: "15%",
            bottom: "15%",
            transform: "rotate(-12deg)",
            zIndex: 1,
            mixBlendMode: "overlay"
          }} 
        />
        <div className="ta-col" style={{ gridColumn: "span 4", padding: "160px 48px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", position: "relative", overflow: "hidden" }}>
          
          {/* Removed SVG Stamp Background */}

          {/* Removed internal radial gradient to rely on the parent wrapper's linear gradient */}

          <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h2 className="ta-hero-title" style={{ fontSize: "3rem" }}>Ready to ship in public?</h2>
            <p className="ta-hero-desc" style={{ marginBottom: 40, textAlign: "center" }}>Open source. Self-hostable. Ship code, we'll write the post.</p>
            <div className="cta-btn-container">
              <a href="https://github.com/sahil/byline" target="_blank" className="ta-btn-pixel cta-btn-primary" style={{ padding: "16px 32px", display: "flex", alignItems: "center", gap: 12 }}>
                <IconBrandGithub size={18} stroke={2} /> STAR ON GITHUB
              </a>
              <a href="#docs" className="cta-github-btn">
                READ THE DOCS
              </a>
            </div>
            
            <div style={{ marginTop: 32, display: "flex", justifyContent: "center" }}>
              <div style={{ 
                fontFamily: "var(--byline-font-mono)", 
                fontSize: 12, 
                letterSpacing: "0.08em", 
                color: "var(--text-primary)", 
                fontWeight: 700,
                textTransform: "uppercase",
                opacity: 0.9,
                background: "linear-gradient(90deg, var(--text-primary), var(--text-secondary))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                Backed by Y (Combinator rejected us).
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
