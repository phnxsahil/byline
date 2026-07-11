import React from 'react';

export function StampBadge({ 
  size = 200, 
  opacity = 1, 
  rotation = 0, 
  className = "", 
  style = {} 
}) {
  return (
    <div 
      className={`stamp-badge ${className}`} 
      style={{
        ...style,
        width: size,
        height: size,
        opacity,
        transform: `rotate(${rotation}deg)`,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        pointerEvents: 'none',
        color: "var(--text-primary)" // Natively supports dark/light mode
      }}
    >
      <svg 
        viewBox="0 0 200 200" 
        width="100%" 
        height="100%" 
        style={{ color: "currentColor", fill: "currentColor" }}
      >
        <defs>
          <path 
            id="stampPathTop" 
            d="M 28,100 A 72,72 0 1,1 172,100" 
          />
          <path 
            id="stampPathBottom" 
            d="M 28,100 A 72,72 0 0,0 172,100" 
          />
          {/* SVG filter for the slightly worn/stamped texture */}
          <filter id="wornTexture" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 3 -1" in="noise" result="coloredNoise" />
            <feComposite operator="in" in="SourceGraphic" in2="coloredNoise" result="composite" />
            <feDisplacementMap in="composite" in2="noise" scale="0.5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        
        <g filter="url(#wornTexture)">
          {/* Outer edge rings */}
          <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="100" cy="100" r="87" fill="none" stroke="currentColor" strokeWidth="1" />
          
          {/* Inner ring bordering text */}
          <circle cx="100" cy="100" r="52" fill="none" stroke="currentColor" strokeWidth="1" />
          


          {/* Circular Text using two paths so bottom text isn't upside down */}
          <text 
            fontFamily="var(--byline-font-mono), monospace" 
            fontSize="14" 
            fontWeight="bold" 
          >
            <textPath 
              href="#stampPathTop" 
              startOffset="50%" 
              textAnchor="middle"
            >
              BYLINE MULTI-AGENT CONTENT ENGINE
            </textPath>
          </text>
          <text 
            fontFamily="var(--byline-font-mono), monospace" 
            fontSize="14" 
            fontWeight="bold" 
          >
            <textPath 
              href="#stampPathBottom" 
              startOffset="50%" 
              textAnchor="middle"
              dominantBaseline="hanging"
            >
              • FILED •
            </textPath>
          </text>
        </g>
      </svg>
    </div>
  );
}
