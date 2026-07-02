import React, { useState, useEffect } from "react";
import { IconCopy, IconCheck, IconArrowLeft, IconChevronRight, IconInfoCircle } from "@tabler/icons-react";

interface DocPage {
  id: string;
  title: string;
  category: string;
}

const DOC_PAGES: DocPage[] = [
  { id: "overview", title: "Understanding Byline", category: "Getting Started" },
  { id: "self-host", title: "Self-hosting with Docker", category: "Getting Started" },
  { id: "cli", title: "Milestone capturing via CLI", category: "Getting Started" },
  { id: "agents", title: "Designing the agent pipeline", category: "Core Concepts" },
  { id: "voice", title: "Profiling and matching your voice", category: "Core Concepts" },
  { id: "webhooks", title: "Listening to GitHub webhooks", category: "Integrations & Publishing" },
  { id: "composio", title: "Publishing drafts with Composio", category: "Integrations & Publishing" },
  { id: "changelog", title: "Changelog", category: "Integrations & Publishing" },
];

function CodeBlock({ filename, code }: { filename?: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      margin: "16px 0",
      borderRadius: 6,
      border: "0.5px solid var(--by-border)",
      overflow: "hidden",
      backgroundColor: "var(--bg-terminal)",
    }}>
      {/* VSCode Tab Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 16px",
        background: "rgba(255, 255, 255, 0.02)",
        borderBottom: "0.5px solid var(--by-border)",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          color: "var(--text-secondary)",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} />
          {filename || "bash"}
        </div>
        <button
          onClick={handleCopy}
          style={{
            background: "transparent",
            border: "none",
            color: copied ? "var(--by-green, #3FB950)" : "var(--text-secondary)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            cursor: "pointer",
            transition: "color 0.15s ease",
          }}
        >
          {copied ? "copied" : "copy"}
        </button>
      </div>

      {/* Code Container */}
      <div style={{
        padding: "14px 18px",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 12,
        color: "rgba(255, 255, 255, 0.85)",
        lineHeight: 1.6,
        overflowX: "auto",
      }}>
        <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{code}</pre>
      </div>
    </div>
  );
}

function InfoAlert({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: "rgba(255, 102, 0, 0.04)",
      borderLeft: "3px solid var(--accent)",
      borderRadius: "0 6px 6px 0",
      padding: "12px 16px",
      margin: "18px 0",
      display: "flex",
      gap: 12,
      alignItems: "flex-start",
    }}>
      <IconInfoCircle size={18} color="var(--accent)" style={{ flexShrink: 0, marginTop: 1 }} />
      <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65 }}>
        {children}
      </div>
    </div>
  );
}

export function DocsSection() {
  const [activePage, setActivePage] = useState(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash.startsWith("#docs/")) {
        return hash.substring(6);
      }
    }
    return "overview";
  });

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#docs/")) {
        setActivePage(hash.substring(6));
      } else if (hash === "#docs") {
        setActivePage("overview");
      }
    };
    window.addEventListener("hashchange", handleHash);
    handleHash();
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const activeDoc = DOC_PAGES.find(p => p.id === activePage) || DOC_PAGES[0];

  const renderContent = () => {
    switch (activePage) {
      case "overview":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0, transition: "color 0.3s ease" }}>
              Byline is an open-source wire service and publishing engine designed for developer-founders who build in public. The application monitors your development signals (such as GitHub commits, terminal logs, or voice notes), identifies key milestones, and drafts tailored updates for LinkedIn, X (Twitter), Reddit, and Threads.
            </p>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0, transition: "color 0.3s ease" }}>
              Unlike standard automated posting utilities that cross-post identical text, Byline uses a five-agent LangGraph pipeline to reframe each message specifically for individual platform audiences. The Strategist determines the post angle, specialized writers draft content according to platform-native conventions, and the Critic reviews the outputs to eliminate AI slop and ensure voice compliance.
            </p>

            <InfoAlert>
              To fully automate Byline, connect your repository webhooks. Once configured, pushing a commit with keywords like <code>shipped</code>, <code>feat</code>, or <code>fix</code> will trigger draft generations in the background.
            </InfoAlert>

            <h2 style={{ fontFamily: "Space Grotesk, system-ui, sans-serif", fontSize: 20, fontWeight: 500, color: "var(--text-primary)", letterSpacing: "-0.02em", margin: "24px 0 8px 0", transition: "color 0.3s ease" }}>
              Core Workflow
            </h2>
            <ul style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0, paddingLeft: 20, transition: "color 0.3s ease" }}>
              <li><strong>Ingesting Milestones:</strong> Capture a milestone manually, upload a voice note, or push a commit to a tracked GitHub repository.</li>
              <li><strong>Refining Content:</strong> The multi-agent pipeline triggers in the background. The agents retrieve similar past posts using vector embeddings to maintain context.</li>
              <li><strong>Reviewing on The Desk:</strong> Review and edit the generated platform-native drafts inside the Desk panel. Approve each post individually.</li>
              <li><strong>Publishing:</strong> Approved posts are published to your social feeds via Composio OAuth connections.</li>
            </ul>
          </div>
        );

      case "self-host":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0, transition: "color 0.3s ease" }}>
              You can deploy Byline on your own infrastructure using Docker Compose. The environment includes the FastAPI backend, the Next.js web dashboard, and a PostgreSQL database preconfigured with the pgvector extension.
            </p>

            <h2 style={{ fontFamily: "Space Grotesk, system-ui, sans-serif", fontSize: 20, fontWeight: 500, color: "var(--text-primary)", letterSpacing: "-0.02em", margin: "24px 0 8px 0", transition: "color 0.3s ease" }}>
              Initializing the container
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0, transition: "color 0.3s ease" }}>
              Clone the repository and run Docker Compose to spin up all services:
            </p>
            <CodeBlock filename="docker-compose.yml" code={`git clone https://github.com/sahil/byline.git\ncd byline\ndocker compose up -d`} />

            <h2 style={{ fontFamily: "Space Grotesk, system-ui, sans-serif", fontSize: 20, fontWeight: 500, color: "var(--text-primary)", letterSpacing: "-0.02em", margin: "24px 0 8px 0", transition: "color 0.3s ease" }}>
              Configuring environment variables
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0, transition: "color 0.3s ease" }}>
              Copy <code>.env.example</code> to <code>.env</code> and fill in the required LLM provider credentials:
            </p>
            <CodeBlock filename=".env" code={`# Database Configuration\nDATABASE_URL=postgresql+asyncpg://byline:byline@localhost:5432/byline\n\n# LLM API Keys\nANTHROPIC_API_KEY=your-anthropic-key-for-agents\nOPENAI_API_KEY=your-openai-key-for-embeddings\n\n# Optional: Composio Key for posting\nCOMPOSIO_API_KEY=your-composio-key`} />
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0, transition: "color 0.3s ease" }}>
              The database schema is initialized using <code>infra/postgres/init.sql</code> on the first run. Subsequent changes should be applied via migration scripts.
            </p>
          </div>
        );

      case "cli":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0, transition: "color 0.3s ease" }}>
              For developers who build in public from the terminal, the <code>byline</code> CLI allows capturing milestones directly after shipping code or debugging.
            </p>

            <h2 style={{ fontFamily: "Space Grotesk, system-ui, sans-serif", fontSize: 20, fontWeight: 500, color: "var(--text-primary)", letterSpacing: "-0.02em", margin: "24px 0 8px 0", transition: "color 0.3s ease" }}>
              Posting milestones
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0, transition: "color 0.3s ease" }}>
              Call the CLI utility and pass the milestone message:
            </p>
            <CodeBlock filename="cli.py" code={`python cli.py log "shipped semantic search on fltrd.tech using pgvector"`} />
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0, transition: "color 0.3s ease" }}>
              The tool submits the input text to the <code>/dispatch</code> endpoint, tracks the background LangGraph pipeline, and prints the generated drafts for each configured platform to your terminal.
            </p>
          </div>
        );

      case "agents":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0, transition: "color 0.3s ease" }}>
              Byline orchestrates the post generation using a multi-agent state graph built on LangGraph. This architecture ensures specialized nodes handle distinct stages of the publishing workflow:
            </p>

            <div
              style={{
                backgroundColor: "var(--by-bg-2)",
                borderRadius: 8,
                border: "0.5px solid var(--by-border)",
                padding: "16px 20px",
                margin: "12px 0",
                transition: "all 0.3s ease",
              }}
            >
              <h3 style={{ fontFamily: "Space Grotesk, system-ui, sans-serif", fontSize: 16, fontWeight: 500, color: "var(--by-text)", margin: "0 0 8px 0", transition: "color 0.3s ease" }}>
                Pipeline Node Flow
              </h3>
              <ol style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0, paddingLeft: 20, transition: "color 0.3s ease" }}>
                <li><strong>Ingestion:</strong> Milestones enter from the dashboard, Cmd+K, or GitHub webhook.</li>
                <li><strong>Memory Retrieval:</strong> <code>pgvector</code> retrieves the 5 most similar past bylines to ground context.</li>
                <li><strong>Strategist:</strong> Analyzes milestone relevance, selects the story angle, and flags appropriate target platforms.</li>
                <li><strong>Writers:</strong> Four concurrent platform specialists (LinkedIn, X, Reddit, Threads) draft platform-specific posts.</li>
                <li><strong>Critic:</strong> Evaluates every draft 1-10 on voice alignment, length constraints, and anti-promo checks (especially Reddit).</li>
              </ol>
            </div>
          </div>
        );

      case "voice":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0, transition: "color 0.3s ease" }}>
              To write posts that sound natural and authentic, Byline extracts writing heuristics from your past publications to build a voice profile.
            </p>

            <h2 style={{ fontFamily: "Space Grotesk, system-ui, sans-serif", fontSize: 20, fontWeight: 500, color: "var(--text-primary)", letterSpacing: "-0.02em", margin: "24px 0 8px 0", transition: "color 0.3s ease" }}>
              Avoiding corporate filler
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0, transition: "color 0.3s ease" }}>
              The voice model scans drafts to delete forbidden terms, such as 'excited to announce', 'game-changer', and 'synergy'.
            </p>

            <h2 style={{ fontFamily: "Space Grotesk, system-ui, sans-serif", fontSize: 20, fontWeight: 500, color: "var(--text-primary)", letterSpacing: "-0.02em", margin: "24px 0 8px 0", transition: "color 0.3s ease" }}>
              Formatting parameters
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0, transition: "color 0.3s ease" }}>
              The engine controls post lengths (e.g., 180–280 words for LinkedIn, under 280 characters for X) and opener patterns (e.g., 'I spent X days on Y and Z was the hard part') to match casual, low-overhead writing habits.
            </p>
          </div>
        );

      case "webhooks":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0, transition: "color 0.3s ease" }}>
              Byline automates milestone detection by listening to GitHub commit push webhooks.
            </p>

            <h2 style={{ fontFamily: "Space Grotesk, system-ui, sans-serif", fontSize: 20, fontWeight: 500, color: "var(--text-primary)", letterSpacing: "-0.02em", margin: "24px 0 8px 0", transition: "color 0.3s ease" }}>
              Configuring repository webhooks
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0, transition: "color 0.3s ease" }}>
              Add the <code>/api/webhooks/github</code> payload URL in your GitHub repository settings. Set the content type to <code>application/json</code> and enter your webhook secret.
            </p>

            <h2 style={{ fontFamily: "Space Grotesk, system-ui, sans-serif", fontSize: 20, fontWeight: 500, color: "var(--text-primary)", letterSpacing: "-0.02em", margin: "24px 0 8px 0", transition: "color 0.3s ease" }}>
              Processing commit messages
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0, transition: "color 0.3s ease" }}>
              When you push commits to the repository, Byline parses the commit messages. Commit summaries starting with keywords like 'feat', 'fix', or 'shipped' automatically trigger the LangGraph pipeline to generate drafts.
            </p>
          </div>
        );

      case "composio":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0, transition: "color 0.3s ease" }}>
              Byline integrates with Composio to handle OAuth connections and post publishing to LinkedIn, X (Twitter), and Reddit without storing user credentials.
            </p>

            <h2 style={{ fontFamily: "Space Grotesk, system-ui, sans-serif", fontSize: 20, fontWeight: 500, color: "var(--text-primary)", letterSpacing: "-0.02em", margin: "24px 0 8px 0", transition: "color 0.3s ease" }}>
              Authorizing channels
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0, transition: "color 0.3s ease" }}>
              Connect your channels using the Composio command line:
            </p>
            <CodeBlock filename="terminal" code={`# Connect your accounts via Composio OAuth\ncomposio add linkedin\ncomposio add twitter\ncomposio add reddit`} />
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0, transition: "color 0.3s ease" }}>
              The backend API routes posting actions to the Composio toolset. Posts are only published after you review, edit, and click the 'Approve' button on the dashboard.
            </p>
          </div>
        );

      case "changelog":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0, transition: "color 0.3s ease" }}>
              Recent updates and improvements to the Byline platform:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 12 }}>
              <div>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "var(--by-accent)", fontWeight: 500 }}>v0.8.2 · June 2026</span>
                <h3 style={{ fontFamily: "Space Grotesk, system-ui, sans-serif", fontSize: 15, fontWeight: 500, color: "var(--text-primary)", margin: "4px 0", transition: "color 0.3s ease" }}>UI/UX Polishes & responsive improvements</h3>
                <ul style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: "6px 0 0 0", paddingLeft: 18, transition: "color 0.3s ease" }}>
                  <li>Fixed Navbar links hover unreadability in dark mode by introducing theme-sensitive color evaluations.</li>
                  <li>Replaced inline aspect-ratio overrides on terminal viewports to prevent layout squishing on mobile screens.</li>
                  <li>Added fully interactive side-navigation routing for documentation pages.</li>
                  <li>Integrated moon/sun icon with localStorage persistence for global dark mode.</li>
                </ul>
              </div>
              <div style={{ borderTop: "0.5px solid var(--border)", paddingTop: 16 }}>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "var(--text-secondary)", opacity: 0.8 }}>v0.8.0 · May 2026</span>
                <h3 style={{ fontFamily: "Space Grotesk, system-ui, sans-serif", fontSize: 15, fontWeight: 500, color: "var(--text-primary)", margin: "4px 0", transition: "color 0.3s ease" }}>Multi-Agent LangGraph Pipeline</h3>
                <ul style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: "6px 0 0 0", paddingLeft: 18, transition: "color 0.3s ease" }}>
                  <li>Introduced concurrent writer agents specializing in LinkedIn, X, Reddit, and Threads.</li>
                  <li>Integrated the critic agent node evaluating anti-promotional and slop guidelines.</li>
                  <li>Set up pgvector DB support for semantic workspace search caching.</li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section style={{ backgroundColor: "var(--bg)", minHeight: "calc(100vh - 56px)", paddingTop: 130, paddingBottom: 64, transition: "background-color 0.3s ease" }}>
      <style>{`
        .dispatch-docs-grid {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 40px;
          max-width: 1080px;
          margin: 0 auto;
          padding: 0 40px;
        }
        .dispatch-docs-sidebar {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .dispatch-docs-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .dispatch-docs-group:not(:last-of-type) {
          border-bottom: 0.5px solid var(--border);
          padding-bottom: 16px;
        }
        .dispatch-docs-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          font-weight: 500;
          color: var(--text-secondary);
          opacity: 0.7;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 4px;
          transition: color 0.3s ease;
        }
        .dispatch-docs-btn {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 13px;
          color: var(--text-secondary);
          background: none;
          border: none;
          text-align: left;
          padding: 5px 0;
          cursor: pointer;
          transition: color 0.12s ease;
        }
        .dispatch-docs-btn:hover {
          color: var(--text-primary);
        }
        .dispatch-docs-btn.active {
          color: var(--by-accent);
          font-weight: 500;
        }
        .dispatch-docs-body {
          max-width: 680px;
          min-width: 0;
        }
        .dispatch-docs-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          color: var(--text-secondary);
          text-decoration: none;
          margin-bottom: 8px;
          transition: color 0.12s ease, transform 0.12s ease;
        }
        .dispatch-docs-back:hover {
          color: var(--text-primary);
          transform: translateX(-3px);
        }
        @media (max-width: 767px) {
          .dispatch-docs-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
            padding: 0 20px !important;
          }
          .dispatch-docs-sidebar {
            border-bottom: 0.5px solid var(--border);
            padding-bottom: 16px;
          }
          .dispatch-docs-group:not(:last-of-type) {
            border-bottom: none;
            padding-bottom: 0;
          }
        }
      `}</style>
      <div className="dispatch-docs-grid">
        {/* Sidebar */}
        <aside className="dispatch-docs-sidebar">
          {/* Back button */}
          <a href="#" className="dispatch-docs-back">
            <IconArrowLeft size={12} stroke={2} />
            Back to Home
          </a>

          <div className="dispatch-docs-group">
            <span className="dispatch-docs-label">Getting Started</span>
            {DOC_PAGES.filter((p) => p.category === "Getting Started").map((p) => (
              <button
                key={p.id}
                onClick={() => { window.location.hash = `#docs/${p.id}`; }}
                className={`dispatch-docs-btn ${activePage === p.id ? "active" : ""}`}
              >
                {p.title}
              </button>
            ))}
          </div>

          <div className="dispatch-docs-group">
            <span className="dispatch-docs-label">Core Concepts</span>
            {DOC_PAGES.filter((p) => p.category === "Core Concepts").map((p) => (
              <button
                key={p.id}
                onClick={() => { window.location.hash = `#docs/${p.id}`; }}
                className={`dispatch-docs-btn ${activePage === p.id ? "active" : ""}`}
              >
                {p.title}
              </button>
            ))}
          </div>

          <div className="dispatch-docs-group">
            <span className="dispatch-docs-label">Integrations & Publishing</span>
            {DOC_PAGES.filter((p) => p.category === "Integrations & Publishing").map((p) => (
              <button
                key={p.id}
                onClick={() => { window.location.hash = `#docs/${p.id}`; }}
                className={`dispatch-docs-btn ${activePage === p.id ? "active" : ""}`}
              >
                {p.title}
              </button>
            ))}
          </div>
        </aside>

        {/* Content body */}
        <article className="dispatch-docs-body">
          {/* Stripe-style Breadcrumbs */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            color: "var(--text-secondary)",
            opacity: 0.7,
            marginBottom: 16
          }}>
            <span>Docs</span>
            <IconChevronRight size={10} stroke={2} />
            <span>{activeDoc.category}</span>
            <IconChevronRight size={10} stroke={2} />
            <span style={{ color: "var(--accent)" }}>{activeDoc.title}</span>
          </div>

          <div style={{ borderBottom: "0.5px solid var(--border)", paddingBottom: 12, marginBottom: 24 }}>
            <h1 style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontSize: 32,
              fontWeight: 500,
              color: "var(--text-primary)",
              margin: 0,
              letterSpacing: "-0.03em"
            }}>
              {activeDoc.title}
            </h1>
          </div>

          {renderContent()}
        </article>
      </div>
    </section>
  );
}
