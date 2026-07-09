import React, { useState, useEffect } from "react";
import { IconArrowRight } from "@tabler/icons-react";

export function Hero() {
  const [typed, setTyped] = useState("");
  const tagline = "Your byline. Everywhere you ship.";
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTyped(tagline.slice(0, ++i));
      if (i >= tagline.length) clearInterval(interval);
    }, 45);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="ta-grid-wrapper" style={{ overflow: 'hidden' }}>
      <style>{`
        .hero-watermark {
          position: absolute;
          right: -80px;
          bottom: -120px;
          font-size: 500px;
          line-height: 1;
          opacity: 0.04;
          filter: grayscale(100%);
          transform: rotate(-15deg);
          pointer-events: none;
          user-select: none;
          z-index: 0;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease;
        }
        .ta-grid-wrapper:hover .hero-watermark {
          transform: rotate(-10deg) scale(1.02);
          opacity: 0.08;
          filter: grayscale(0%);
        }
        
        .hero-abstract-btn {
          position: relative;
          background: var(--accent);
          color: #000;
          padding: 16px 32px;
          font-family: var(--byline-font-mono), monospace;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          /* Abstract pixel-cut shape */
          clip-path: polygon(
            0 0, 
            calc(100% - 16px) 0, 
            100% 16px, 
            100% 100%, 
            16px 100%, 
            0 calc(100% - 16px)
          );
        }
        .hero-abstract-btn:hover {
          background: var(--text-primary);
          color: var(--bg);
          transform: translateY(-2px);
        }
      `}</style>

      <div className="ta-grid">
        
        {/* Left column: Content spanning 3 columns for asymmetrical feel */}
        <div className="ta-col" style={{ gridColumn: "span 3", position: "relative", zIndex: 1 }}>
          <div className="ta-hero-content dispatch-hero-content">
            <div className="ta-badge">
              <span style={{ color: "var(--accent)", marginRight: 8 }}>/00</span>
              MULTI-AGENT CONTENT ENGINE
            </div>
            
            <h1 className="ta-hero-title">
              Ship code.<br />
              We'll write<br />
              the post.
            </h1>
            
            <div style={{ fontFamily: "var(--byline-font-mono)", fontSize: 16, color: "var(--accent)", marginBottom: 24, minHeight: 24 }}>
              {typed}<span style={{ display: "inline-block", width: 2, height: 18, background: "var(--accent)", marginLeft: 2, animation: "blink 1s step-end infinite", verticalAlign: "text-bottom" }} />
            </div>

            <p className="ta-hero-desc">
              Byline watches your GitHub, runs a 5-agent LangGraph pipeline, and drafts
              platform-native content for LinkedIn, X, Reddit, and Threads — in your voice.
            </p>

            <div style={{ marginTop: 48, display: "flex", gap: 24, alignItems: "center" }}>
              <a href="#dashboard" className="hero-abstract-btn">
                GET THE DESK <IconArrowRight size={16} stroke={2} />
              </a>
              <a href="#how-it-works" style={{ 
                fontFamily: "var(--byline-font-mono)", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.05em", transition: "color 0.2s ease"
              }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}>
                SEE HOW IT WORKS
              </a>
            </div>
          </div>
        </div>

        {/* Right column: 1 column, empty for asymmetry and hosting the watermark */}
        <div className="ta-col" style={{ position: "relative" }}>
          <div className="ta-cross" style={{ bottom: -5, left: -5 }}></div>
          <div className="ta-cross" style={{ top: -5, right: -5 }}></div>
          
          {/* Faded Watermark Mascot */}
          <div className="hero-watermark">🦉</div>
        </div>

      </div>
    </section>
  );
}
