import React from "react";
import { IconCheck, IconBrandGithub, IconArrowRight } from "@tabler/icons-react";
import { StampBadge } from "../StampBadge";

export function PricingPage() {
  return (
    <div style={{ padding: "80px 48px", minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div className="ta-badge"><span style={{ color: "var(--accent)", marginRight: 8 }}>/</span> PRICING</div>
      <h1 className="ta-hero-title" style={{ marginTop: 24, marginBottom: 24, fontSize: "3rem", textAlign: "center" }}>Free forever if you clone it.</h1>
      <p className="ta-hero-desc" style={{ textAlign: "center", maxWidth: 600, marginBottom: 64 }}>
        Byline is open source. You can self-host the entire 5-agent pipeline for free, or let us handle the infrastructure.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32, width: "100%", maxWidth: 900 }}>
        
        {/* Tier 1: Self Hosted */}
        <div style={{ border: "1px solid var(--border)", padding: 48, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
          <div style={{ fontFamily: "var(--byline-font-mono)", fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>COMMUNITY</div>
          <div style={{ fontSize: 48, fontFamily: "Space Grotesk", fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>$0<span style={{ fontSize: 16, color: "var(--text-secondary)", fontWeight: 400 }}> / forever</span></div>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 32 }}>
            Self-host the entire Byline LangGraph engine on your own hardware using Docker.
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16, flex: 1, marginBottom: 48 }}>
            {[
              "Full 5-agent LangGraph pipeline",
              "Local Postgres + pgvector setup",
              "Unlimited milestone captures",
              "Unlimited draft generations",
              "Community support"
            ].map(feature => (
              <li key={feature} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14, color: "var(--text-primary)" }}>
                <IconCheck size={16} color="var(--text-secondary)" /> {feature}
              </li>
            ))}
          </ul>
          <a href="https://github.com/phnxsahil/byline" target="_blank" rel="noopener noreferrer" className="ta-btn-pixel" style={{ width: "100%", padding: "16px", textAlign: "center", display: "flex", justifyContent: "center", gap: 8 }}>
            <IconBrandGithub size={18} stroke={2} /> CLONE REPO
          </a>
        </div>

        {/* Tier 2: Cloud */}
        <div style={{ border: "1px solid var(--accent)", padding: 48, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", background: "color-mix(in srgb, var(--accent) 3%, transparent)" }}>
          <div style={{ position: "absolute", top: -80, right: -80 }}>
            <StampBadge size={240} opacity={0.1} rotation={15} />
          </div>
          <div style={{ fontFamily: "var(--byline-font-mono)", fontSize: 13, color: "var(--accent)", marginBottom: 16 }}>BYLINE CLOUD</div>
          <div style={{ fontSize: 48, fontFamily: "Space Grotesk", fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>$19<span style={{ fontSize: 16, color: "var(--text-secondary)", fontWeight: 400 }}> / month</span></div>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 32 }}>
            We host the agents, database, and webhooks. You just ship code and review drafts.
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16, flex: 1, marginBottom: 48 }}>
            {[
              "Zero setup & managed infrastructure",
              "1-click GitHub webhook integration",
              "Managed Composio OAuth keys",
              "Premium model access (Claude 3.5 Sonnet)",
              "Priority support"
            ].map(feature => (
              <li key={feature} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14, color: "var(--text-primary)" }}>
                <IconCheck size={16} color="var(--accent)" /> {feature}
              </li>
            ))}
          </ul>
          <a href="#" className="hero-abstract-btn" style={{ width: "100%", padding: "16px", textAlign: "center", display: "flex", justifyContent: "center", gap: 8 }}>
            JOIN WAITLIST <IconArrowRight size={16} stroke={2} />
          </a>
        </div>

      </div>
    </div>
  );
}
