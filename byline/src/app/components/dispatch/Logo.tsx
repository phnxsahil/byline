import React, { useState } from "react";

interface LogoProps {
  size?: number; // font size
}

export function Logo({ size = 14 }: LogoProps) {
  const [hovered, setHovered] = useState(false);

  const colors = {
    linkedin: "#0A66C2",
    x: "var(--text-primary)",
    reddit: "#FF4500",
    threads: "#F59E0B",
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <div
        style={{
          width: size * 1.8,
          height: size * 1.8,
          background: "linear-gradient(135deg, var(--amber, #F0A500) 0%, #D4820C 100%)",
          borderRadius: Math.max(6, size * 0.4),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 1.0,
          boxShadow: "0 0 20px rgba(245,166,35,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
          flexShrink: 0,
          transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease",
          transform: hovered ? "scale(1.08)" : "scale(1)",
        }}
      >
        🦉
      </div>
      <span
        style={{
          fontFamily: "Space Grotesk, system-ui, sans-serif",
          fontSize: size,
          fontWeight: size > 16 ? 600 : 500,
          color: "var(--text-primary)",
          letterSpacing: "-0.03em",
          lineHeight: 1,
          transition: "color 0.3s ease",
          paddingBottom: size * 0.1, // optical center adjustment for Space Grotesk
        }}
      >
        byline
      </span>
    </div>
  );
}
