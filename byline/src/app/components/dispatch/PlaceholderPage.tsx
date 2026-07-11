import React from "react";

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div style={{ padding: "160px 48px", minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <div className="ta-badge"><span style={{ color: "var(--accent)", marginRight: 8 }}>/</span> COMING SOON</div>
      <h1 className="ta-hero-title" style={{ marginTop: 24, marginBottom: 24, fontSize: "3rem" }}>{title}</h1>
      <p className="ta-hero-desc">We're still writing the {title}. Check back soon or view our GitHub repository.</p>
    </div>
  );
}
