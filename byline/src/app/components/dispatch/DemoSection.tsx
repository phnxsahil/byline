import React, { useState, useEffect } from "react";

const DEMO_LINES = [
  { prefix: "$", text: 'byline log "shipped semantic search on fltrd using pgvector"', delay: 0 },
  { prefix: "→", text: "Strategist agent running...", delay: 800 },
  { prefix: "✓", text: "post_worthy_score: 8/10  |  angle: lesson_learned", delay: 1600 },
  { prefix: "→", text: "Writing for: linkedin, x, reddit", delay: 2200 },
  { prefix: "✓", text: "linkedin_draft: 247 chars", delay: 3000 },
  { prefix: "✓", text: "x_draft: 3 tweets", delay: 3600 },
  { prefix: "→", text: "Critic agent scoring...", delay: 4800 },
  { prefix: "✓", text: "overall: 8.4/10  |  ai_slop: none", delay: 5600 },
];

export function DemoSection() {
  const [visibleLines, setVisibleLines] = useState(DEMO_LINES.length);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    const timers = DEMO_LINES.map((line, i) => setTimeout(() => setVisibleLines(i + 1), line.delay));
    return () => timers.forEach(clearTimeout);
  }, [started]);

  return (
    <section id="demo" className="ta-grid-wrapper dispatch-reveal" style={{ position: "relative" }}>
      <div className="dither-pattern" />
      {/* Dark overlay gradient to ensure text legibility */}
      <div style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        background: "radial-gradient(ellipse at left center, transparent 0%, var(--bg) 70%)",
        pointerEvents: "none"
      }}></div>
      <style>{`
        .demo-run-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #8B949E;
          padding: 12px 24px;
          font-family: var(--byline-font-mono), monospace;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          border-radius: 4px;
        }
        .demo-run-btn:hover {
          background: var(--surface);
          color: var(--text-primary);
          border-color: rgba(255, 255, 255, 0.4);
        }
      `}</style>
      <div className="ta-grid" style={{ position: "relative", zIndex: 1 }}>
        <div className="ta-col" style={{ justifyContent: "center" }}>
          <div style={{ padding: "48px" }}>
            <div className="ta-badge"><span style={{ color: "var(--accent)", marginRight: 8 }}>/05</span> LIVE DEMO</div>
            <h2 className="ta-hero-title" style={{ fontSize: "2rem", marginTop: 12 }}>Watch it run.</h2>
          </div>
        </div>
        
        <div className="ta-col" style={{ gridColumn: "span 3", borderLeft: "1px solid var(--border)", position: "relative", padding: "48px" }}>
          <div style={{ 
            background: "var(--bg2)", 
            border: "1px solid var(--border)", 
            borderRadius: "8px", 
            overflow: "hidden",
            boxShadow: "0 20px 40px rgba(0,0,0,0.8)"
          }}>
            <div style={{ padding: "12px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 8, background: "rgba(0,0,0,0.2)" }}>
               <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#F85149" }} />
               <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#F0A500" }} />
               <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#3FB950" }} />
            </div>
            <div style={{ padding: 40, fontFamily: "var(--byline-font-mono)", fontSize: 13, color: "#E6EDF3" }}>
              {DEMO_LINES.slice(0, visibleLines).map((line, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <span style={{ color: line.prefix === '$' ? '#58A6FF' : line.prefix === '→' ? '#F0A500' : '#3FB950', marginRight: 12 }}>{line.prefix}</span>
                  {line.text}
                </div>
              ))}
              
              {!started && (
                 <button 
                   onClick={() => { 
                     setVisibleLines(0); 
                     setStarted(true); 
                   }} 
                   className="demo-run-btn"
                   style={{ marginTop: 24 }}
                 >
                   ▶ LIVE REPLAY
                 </button>
              )}

              {started && visibleLines === DEMO_LINES.length && (
                 <button 
                   onClick={() => { 
                     setVisibleLines(0); 
                     setStarted(false); 
                     setTimeout(() => setStarted(true), 50); 
                   }} 
                   className="demo-run-btn"
                   style={{ marginTop: 24 }}
                 >
                   ↺ REPLAY
                 </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
