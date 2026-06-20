import React, { useEffect, useRef } from "react";
import { IconBook, IconChevronRight } from "@tabler/icons-react";

interface DocsTabProps {
  isMobile: boolean;
  scrollTarget: string | null;
  onScrollComplete: () => void;
}

const SECTIONS = [
  { id: "getting-started", title: "Getting Started", content: `Byline watches your GitHub, listens for voice notes, and accepts quick captures. When it detects something worth saying, a 5-agent LangGraph pipeline runs: a Strategist decides the angle and platforms, four platform Writers produce native drafts (LinkedIn, X, Reddit, Threads), and a Critic scores each one for voice match and platform fit.` },
  { id: "cli-usage", title: "CLI Usage", content: `python cli.py log "your milestone here"\n\nThe CLI sends a milestone to the Byline API, which runs the full agent pipeline and returns drafts for all selected platforms. Use it as a quick way to generate content without opening the dashboard.` },
  { id: "agents", title: "Agent Pipeline", content: `Strategist — evaluates the milestone and decides if it's post-worthy, which angle to take, and which platforms to target.\n\nWriters — one per platform (LinkedIn, X, Reddit, Threads). Each produces native-format content optimized for its platform.\n\nCritic — reviews all drafts for voice match, platform fit, and AI slop. Scores each draft and flags issues.` },
  { id: "voice-profile", title: "Voice Profile", content: `The voice profile captures your writing style: opener patterns, banned phrases, typical post length, and platform-specific notes. The agents use this to match your natural voice. Update it from Settings > Voice Profile.` },
  { id: "platforms", title: "Platforms", content: `LinkedIn — professional tone, 150-300 words, short paragraphs, ends with insight or question.\n\nX (Twitter) — casual, lowercase, opinions over info, 3-5 tweets max, each under 280 chars.\n\nReddit — educational framing, minimum 400 words, project name at end with disclosure.\n\nThreads — casual, under 300 chars, one idea, raw energy.` },
  { id: "api", title: "API Reference", content: `POST /dispatch — create a new dispatch from a milestone.\nGET /dispatch/{id} — get dispatch status and drafts.\nGET /dispatch/{id}/stream — SSE stream of agent progress.\nPATCH /dispatch/{id}/drafts/{platform} — update a draft.\n\nAll API routes return JSON. Authentication via API key in Authorization header.` },
];

export function DocsTab({ isMobile, scrollTarget, onScrollComplete }: DocsTabProps) {
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (scrollTarget && sectionRefs.current[scrollTarget]) {
      sectionRefs.current[scrollTarget]?.scrollIntoView({ behavior: "smooth", block: "start" });
      onScrollComplete();
    }
  }, [scrollTarget, onScrollComplete]);

  return (
    <div style={{
      flex: 1, overflowY: "auto", padding: isMobile ? "16px" : "24px 40px",
      display: "flex", flexDirection: "column", gap: 24,
      maxWidth: 720,
    }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--by-text-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        Documentation
      </div>

      {SECTIONS.map((sec) => (
        <div key={sec.id} ref={(el) => { sectionRefs.current[sec.id] = el; }}
          style={{
            background: "var(--by-bg-2)", border: "0.5px solid var(--by-border)",
            borderRadius: 6, padding: "16px 18px",
          }}
        >
          <div id={`docs-${sec.id}`} style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
            fontWeight: 600, color: "var(--by-accent)", marginBottom: 8,
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <IconChevronRight size={12} stroke={2} />
            {sec.title}
          </div>
          <div style={{
            fontSize: 13, color: "var(--by-text-2)", lineHeight: 1.7,
            whiteSpace: "pre-wrap",
          }}>
            {sec.content}
          </div>
        </div>
      ))}
    </div>
  );
}
