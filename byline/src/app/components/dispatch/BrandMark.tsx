import React from 'react';

export function BrandMark({ 
  size = 24, 
  color = "var(--text-primary)", 
  bracketColor = "var(--accent)",
  opacity = 1,
  className = "",
  style = {}
}: {
  size?: number | string;
  color?: string;
  bracketColor?: string;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div 
      className={`byline-brand-mark ${className}`}
      style={{
        fontFamily: "var(--byline-font-mono), monospace",
        fontSize: size,
        fontWeight: 700,
        color: color,
        opacity: opacity,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        letterSpacing: "-0.05em",
        userSelect: "none",
        pointerEvents: "none",
        ...style
      }}
    >
      <span style={{ color: bracketColor }}>[</span>
      b
      <span style={{ color: bracketColor }}>]</span>
    </div>
  );
}
