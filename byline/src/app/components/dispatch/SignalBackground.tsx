import React from "react";

export function SignalBackground({ 
  className = "", 
  style = {}, 
  opacity = 0.5,
  centerOffsetY = "50%"
}) {
  return (
    <div className={`signal-bg ${className}`} style={{ ...style, position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      <style>{`
        @keyframes pulseRing {
          0% { transform: scale(0.9); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: scale(1.1); opacity: 0; }
        }
        .sig-ring {
          animation: pulseRing 6s infinite cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center;
        }
        .sig-ring-1 { animation-delay: 0s; }
        .sig-ring-2 { animation-delay: 1.2s; }
        .sig-ring-3 { animation-delay: 2.4s; }
        .sig-ring-4 { animation-delay: 3.6s; }
        .sig-ring-5 { animation-delay: 4.8s; }
      `}</style>
      
      {/* 
        We use a massive fixed-size SVG placed absolutely so we can easily 
        align its center point across different sections regardless of their aspect ratio.
      */}
      <div style={{
        position: "absolute",
        width: 3000,
        height: 3000,
        left: "50%",
        top: centerOffsetY,
        transform: "translate(-50%, -50%)",
        opacity: opacity,
        color: "var(--border)"
      }}>
        <svg 
          viewBox="-1500 -1500 3000 3000" 
          width="100%" 
          height="100%"
        >
          {/* Rings */}
          <g stroke="currentColor" strokeWidth="2" fill="none">
            {/* Innermost ~40% empty. 400px radius = 800px diameter */}
            <circle r="400" className="sig-ring sig-ring-1" />
            <circle r="550" className="sig-ring sig-ring-2" />
            <circle r="750" className="sig-ring sig-ring-3" />
            <circle r="1000" className="sig-ring sig-ring-4" />
            <circle r="1300" className="sig-ring sig-ring-5" />
          </g>
          
          {/* Muted dots echoing the terminal traffic lights */}
          <g fill="currentColor">
            <g className="sig-ring sig-ring-3" transform="rotate(45)"><circle cx="0" cy="-750" r="8" /></g>
            <g className="sig-ring sig-ring-4" transform="rotate(-30)"><circle cx="0" cy="-1000" r="8" /></g>
            <g className="sig-ring sig-ring-5" transform="rotate(120)"><circle cx="0" cy="-1300" r="8" /></g>
          </g>
        </svg>
      </div>
    </div>
  );
}
