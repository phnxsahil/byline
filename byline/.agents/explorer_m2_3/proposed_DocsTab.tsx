import { useEffect } from "react";
import { IconBook } from "@tabler/icons-react";

interface DocsTabProps {
  isMobile?: boolean;
  scrollTarget?: string | null;
  onScrollComplete?: () => void;
}

export function DocsTab({ isMobile = false, scrollTarget, onScrollComplete }: DocsTabProps) {
  // Listen for scroll target changes and scroll to the correct element
  useEffect(() => {
    if (scrollTarget) {
      const elementId = `docs-heading-${scrollTarget}`;
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      onScrollComplete?.();
    }
  }, [scrollTarget, onScrollComplete]);

  return (
    <div
      style={{
        flex: 1,
        background: "var(--by-bg)",
        padding: isMobile ? 16 : 24,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <IconBook size={24} style={{ color: "var(--by-accent)" }} />
        {/* Milestone 2: Attached ID for scrolling */}
        <h1 id="docs-heading-documentation" style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>
          Documentation
        </h1>
      </div>
      
      <p style={{ color: "var(--by-text-2)", fontSize: 14, margin: 0, maxWidth: 600, lineHeight: 1.6 }}>
        Welcome to the Byline documentation. Here you will find guides, API references, and playbooks to help you build in public and distribute your updates seamlessly.
      </p>

      <div style={{
        marginTop: 12,
        padding: 20,
        background: "var(--by-bg-2)",
        border: "0.5px solid var(--by-border)",
        borderRadius: 8,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        maxWidth: 600,
      }}>
        {/* Milestone 2: Attached ID for scrolling */}
        <h3 id="docs-heading-getting-started" style={{ margin: 0, fontSize: 16, color: "var(--by-text)" }}>
          Getting Started
        </h3>
        <p style={{ margin: 0, fontSize: 13, color: "var(--by-text-2)", lineHeight: 1.5 }}>
          Learn how Byline connects to your codebase, transcribes your voice reflections, and uses multi-agent workflows to publish to social channels.
        </p>
      </div>
    </div>
  );
}
