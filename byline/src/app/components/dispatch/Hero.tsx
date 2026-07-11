import React, { useState, useEffect } from "react";
import { IconArrowRight, IconBrandGithub } from "@tabler/icons-react";



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
    <section className="ta-grid-wrapper" style={{ overflow: 'hidden', position: 'relative' }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: "url('/hero_bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.12,
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div className="dither-pattern" />
      <style>{`
        .hero-abstract-btn {
          font-size: 13px;
          padding: 16px 32px;
          border: 2px solid #000;
        }

        .hero-abstract-btn-secondary {
          font-size: 13px;
          padding: 16px 32px;
        }
        .hero-btn-container {
          margin-top: 48px;
          display: flex;
          gap: 24px;
          align-items: center;
          flex-wrap: wrap;
        }
        @media (max-width: 640px) {
          .hero-btn-container {
            gap: 16px;
          }
          .hero-abstract-btn {
            padding: 14px 24px;
            font-size: 12px;
            white-space: nowrap;
          }
          .hero-abstract-btn-secondary {
            padding: 12px 24px;
            font-size: 12px;
            white-space: nowrap;
          }
        }
      `}</style>

      <div className="ta-grid">
        
        {/* Left column: Content spanning 3 columns for asymmetrical feel */}
        <div className="ta-col" style={{ gridColumn: "span 3", position: "relative", zIndex: 1 }}>
          <div className="ta-hero-content dispatch-hero-content">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
              <div className="ta-badge" style={{ margin: 0 }}>
                <span style={{ color: "var(--accent)", marginRight: 8 }}>/00</span>
                MULTI-AGENT CONTENT ENGINE
              </div>
              <div style={{ width: 3, height: 3, background: "var(--border)" }} />
              <div style={{ fontFamily: "var(--byline-font-mono)", fontSize: 11, letterSpacing: "0.05em", color: "var(--accent)", textTransform: "uppercase" }}>
                Backed by Y (Combinator rejected us).
              </div>
            </div>
            
            <h1 className="ta-hero-title">
              Ship code.<br />
              We'll write<br />
              the post.
            </h1>
            
            <div style={{ fontFamily: "var(--byline-font-mono)", fontSize: 16, color: "var(--accent)", marginBottom: 24, minHeight: 24 }}>
              {typed}
              <span style={{ 
                display: "inline-block", 
                width: 2, 
                height: 18, 
                background: "var(--accent)", 
                marginLeft: 2, 
                animation: typed.length === tagline.length ? "none" : "blink 1s step-end infinite", 
                verticalAlign: "text-bottom",
                opacity: typed.length === tagline.length ? 0 : 1,
                transition: "opacity 1.5s ease 0.8s"
              }} />
            </div>

            <p className="ta-hero-desc">
              Byline watches your GitHub, runs a 5-agent LangGraph pipeline, and drafts
              platform-native content for LinkedIn, X, Reddit, and Threads — in your voice.
            </p>

            <div className="hero-btn-container">
              <a 
                href="https://github.com/sahil/byline" 
                className="ta-btn-pixel hero-abstract-btn dispatch-cta-pulse"
                target="_blank"
              >
                <IconBrandGithub size={18} stroke={2} style={{ marginRight: 8 }} /> STAR ON GITHUB
              </a>
              <a href="#docs" className="ta-btn-pixel-secondary hero-abstract-btn-secondary">
                READ THE DOCS
              </a>
            </div>


          </div>
        </div>

        {/* Right column: 1 column, empty for asymmetry and minimalism */}
        <div className="ta-col" style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          <div className="ta-cross" style={{ bottom: -5, left: -5 }}></div>
          <div className="ta-cross" style={{ top: -5, right: -5 }}></div>
        </div>

      </div>
    </section>
  );
}

