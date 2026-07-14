import React from "react";
import { IconBrandGithub } from "@tabler/icons-react";
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
          color: rgba(237, 234, 227, 0.7); /* Forced light for dark bg */
          text-decoration: none;
          padding: 16px 32px;
          border: 1px solid rgba(255, 255, 255, 0.15); /* Forced light */
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          background: transparent;
        }
        .cta-github-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #EDEAE3;
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
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
        
        .cta-btn-primary {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .cta-btn-primary:hover {
          background: #fff !important;
          color: #000 !important;
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.4), 6px 6px 0 0 #000 !important;
          transform: translateY(-2px) scale(1.02) !important;
        }
      `}</style>
      
      <div className="ta-grid" style={{ overflow: "hidden" }}>
        {/* Background Image & Overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/cta_scene_bg.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          zIndex: 0,
          opacity: 0.85, /* INCREASED OPACITY SO IMAGE IS VISIBLE */
          pointerEvents: "none",
        }} aria-hidden="true" role="presentation" />
        
        {/* Subtle dark gradient overlay so text is still readable, but decreased significantly so image pops */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 100% 100% at 50% 30%, rgba(13,17,23,0.6) 0%, rgba(13,17,23,0.85) 100%)",
          zIndex: 1,
          pointerEvents: "none"
        }} />

        <div className="ta-col" style={{ gridColumn: "span 4", padding: "160px 48px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", position: "relative", overflow: "hidden" }}>
          
          {/* Removed SVG Stamp Background */}

          {/* Removed internal radial gradient to rely on the parent wrapper's linear gradient */}

          <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h2 className="ta-hero-title" style={{ fontSize: "3rem", color: "#EDEAE3" }}>Ready to ship in public?</h2>
            <p className="ta-hero-desc" style={{ marginBottom: 40, textAlign: "center", color: "rgba(237, 234, 227, 0.7)" }}>Open source. Self-hostable. Ship code, we'll write the post.</p>
            <div className="cta-btn-container">
              <a href="https://github.com/phnxsahil/byline" target="_blank" rel="noopener noreferrer" className="ta-btn-pixel cta-btn-primary" style={{ padding: "16px 32px", display: "flex", alignItems: "center", gap: 12 }}>
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
                color: "rgba(237, 234, 227, 0.8)", /* Increased brightness */
                fontWeight: 700,
                textTransform: "uppercase",
                opacity: 0.9,
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
