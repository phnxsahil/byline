import React, { useState, useEffect } from "react";
import { IconCopy, IconCheck, IconArrowLeft, IconChevronRight, IconInfoCircle, IconSearch, IconCommand } from "@tabler/icons-react";

interface DocPage {
  id: string;
  title: string;
  category: string;
}

const DOC_PAGES: DocPage[] = [
  // Getting Started
  { id: "introduction", title: "Introduction", category: "Getting Started" },
  { id: "quickstart", title: "Quickstart", category: "Getting Started" },
  { id: "configuration", title: "Configuration", category: "Getting Started" },
  
  // Core Concepts
  { id: "projects", title: "Projects", category: "Core Concepts" },
  { id: "dispatches", title: "Dispatches", category: "Core Concepts" },
  { id: "pipeline", title: "Pipeline", category: "Core Concepts" },
  { id: "voice-profile", title: "Voice Profile", category: "Core Concepts" },
  { id: "outlets", title: "Outlets", category: "Core Concepts" },
  
  // Guides
  { id: "log-milestone", title: "Log Milestone", category: "Guides" },
  { id: "review-drafts", title: "Review Drafts", category: "Guides" },
  { id: "github-integration", title: "GitHub Integration", category: "Guides" },
  { id: "voice-notes", title: "Voice Notes", category: "Guides" },
  { id: "platform-playbooks", title: "Platform Playbooks", category: "Guides" },
  
  // Reference
  { id: "api-reference", title: "API Reference", category: "Reference" },
  { id: "cli", title: "CLI", category: "Reference" },
  { id: "settings", title: "Settings", category: "Reference" },
  { id: "faq", title: "FAQ", category: "Reference" },
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
    return "introduction";
  });

  const [activeSection, setActiveSection] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Intersection Observer for Scroll Spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -70% 0px" }
    );
    
    setTimeout(() => {
      const headers = document.querySelectorAll("h2[id]");
      headers.forEach((h) => observer.observe(h));
    }, 100);
    
    return () => observer.disconnect();
  }, [activePage]);

  // Hash Navigation
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#docs/")) {
        setActivePage(hash.substring(6));
      } else if (hash === "#docs") {
        setActivePage("introduction");
      }
    };
    window.addEventListener("hashchange", handleHash);
    handleHash();
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  // CmdK Search Hotkey
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeDoc = DOC_PAGES.find(p => p.id === activePage) || DOC_PAGES[0];
  const filteredPages = DOC_PAGES.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const renderContent = () => {
    switch (activePage) {
      case "introduction":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p className="doc-p">
              Byline is an open-source wire service and publishing engine designed for developer-founders who build in public. The application monitors your development signals (such as GitHub commits, terminal logs, or voice notes), identifies key milestones, and drafts tailored updates for LinkedIn, X (Twitter), Reddit, and Threads.
            </p>
            <p className="doc-p">
              Unlike standard automated posting utilities that cross-post identical text, Byline uses a five-agent LangGraph pipeline to reframe each message specifically for individual platform audiences. The Strategist determines the post angle, specialized writers draft content according to platform-native conventions, and the Critic reviews the outputs to eliminate AI slop and ensure voice compliance.
            </p>
            <InfoAlert>
              To fully automate Byline, connect your repository webhooks. Once configured, pushing a commit with keywords like <code>shipped</code>, <code>feat</code>, or <code>fix</code> will trigger draft generations in the background.
            </InfoAlert>
            <h2 id="core-workflow" className="doc-h2">Core Workflow</h2>
            <ul className="doc-ul">
              <li><strong>Ingesting Milestones:</strong> Capture a milestone manually, upload a voice note, or push a commit to a tracked GitHub repository.</li>
              <li><strong>Refining Content:</strong> The multi-agent pipeline triggers in the background. The agents retrieve similar past posts using vector embeddings to maintain context.</li>
              <li><strong>Reviewing on The Desk:</strong> Review and edit the generated platform-native drafts inside the Desk panel. Approve each post individually.</li>
              <li><strong>Publishing:</strong> Approved posts are published to your social feeds via Composio OAuth connections.</li>
            </ul>
          </div>
        );

      case "quickstart":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p className="doc-p">
              You can deploy Byline on your own infrastructure using Docker Compose. The environment includes the FastAPI backend, the Next.js web dashboard, and a PostgreSQL database preconfigured with the pgvector extension.
            </p>
            <h2 id="initializing" className="doc-h2">Initializing the container</h2>
            <p className="doc-p">Clone the repository and run Docker Compose to spin up all services:</p>
            <CodeBlock filename="docker-compose.yml" code={`git clone https://github.com/phnxsahil/byline.git\ncd byline\ndocker compose up -d`} />
          </div>
        );

      case "configuration":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <h2 id="configuring" className="doc-h2">Configuring environment variables</h2>
            <p className="doc-p">
              Copy <code>.env.example</code> to <code>.env</code> and fill in the required LLM provider credentials:
            </p>
            <CodeBlock filename=".env" code={`# Database Configuration\nDATABASE_URL=postgresql+asyncpg://byline:byline@localhost:5432/byline\n\n# LLM API Keys\nANTHROPIC_API_KEY=your-anthropic-key-for-agents\nOPENAI_API_KEY=your-openai-key-for-embeddings\n\n# Optional: Composio Key for posting\nCOMPOSIO_API_KEY=your-composio-key`} />
            <p className="doc-p">
              The database schema is initialized using <code>infra/postgres/init.sql</code> on the first run. Subsequent changes should be applied via migration scripts.
            </p>
          </div>
        );

      case "pipeline":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p className="doc-p">
              Byline orchestrates the post generation using a multi-agent state graph built on LangGraph. This architecture ensures specialized nodes handle distinct stages of the publishing workflow:
            </p>
            <div style={{ backgroundColor: "var(--by-bg-2)", borderRadius: 8, border: "0.5px solid var(--by-border)", padding: "16px 20px", margin: "12px 0", transition: "all 0.3s ease" }}>
              <h3 style={{ fontFamily: "Space Grotesk, system-ui, sans-serif", fontSize: 16, fontWeight: 500, color: "var(--by-text)", margin: "0 0 8px 0" }}>Pipeline Node Flow</h3>
              <ol className="doc-ul">
                <li><strong>Ingestion:</strong> Milestones enter from the dashboard, Cmd+K, or GitHub webhook.</li>
                <li><strong>Memory Retrieval:</strong> <code>pgvector</code> retrieves the 5 most similar past bylines to ground context.</li>
                <li><strong>Strategist:</strong> Analyzes milestone relevance, selects the story angle, and flags appropriate target platforms.</li>
                <li><strong>Writers:</strong> Four concurrent platform specialists (LinkedIn, X, Reddit, Threads) draft platform-specific posts.</li>
                <li><strong>Critic:</strong> Evaluates every draft 1-10 on voice alignment, length constraints, and anti-promo checks (especially Reddit).</li>
              </ol>
            </div>
          </div>
        );

      case "voice-profile":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p className="doc-p">
              To write posts that sound natural and authentic, Byline extracts writing heuristics from your past publications to build a voice profile.
            </p>
            <h2 id="avoiding" className="doc-h2">Avoiding corporate filler</h2>
            <p className="doc-p">
              The voice model scans drafts to delete forbidden terms, such as 'excited to announce', 'game-changer', and 'synergy'.
            </p>
            <h2 id="formatting" className="doc-h2">Formatting parameters</h2>
            <p className="doc-p">
              The engine controls post lengths (e.g., 180–280 words for LinkedIn, under 280 characters for X) and opener patterns (e.g., 'I spent X days on Y and Z was the hard part') to match casual, low-overhead writing habits.
            </p>
          </div>
        );

      case "outlets":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p className="doc-p">
              Byline integrates with Composio to handle OAuth connections and post publishing to LinkedIn, X (Twitter), and Reddit without storing user credentials.
            </p>
            <h2 id="authorizing" className="doc-h2">Authorizing channels</h2>
            <p className="doc-p">Connect your channels using the Composio command line:</p>
            <CodeBlock filename="terminal" code={`# Connect your accounts via Composio OAuth\ncomposio add linkedin\ncomposio add twitter\ncomposio add reddit`} />
            <p className="doc-p">
              The backend API routes posting actions to the Composio toolset. Posts are only published after you review, edit, and click the 'Approve' button on the dashboard.
            </p>
          </div>
        );

      case "log-milestone":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p className="doc-p">
              For developers who build in public from the terminal, the <code>byline</code> CLI allows capturing milestones directly after shipping code or debugging.
            </p>
            <h2 id="posting" className="doc-h2">Posting milestones</h2>
            <p className="doc-p">Call the CLI utility and pass the milestone message:</p>
            <CodeBlock filename="cli.py" code={`python cli.py log "shipped semantic search on fltrd.tech using pgvector"`} />
            <p className="doc-p">
              The tool submits the input text to the <code>/dispatch</code> endpoint, tracks the background LangGraph pipeline, and prints the generated drafts for each configured platform to your terminal.
            </p>
          </div>
        );

      case "github-integration":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p className="doc-p">
              Byline automates milestone detection by listening to GitHub commit push webhooks.
            </p>
            <h2 id="configuring-webhooks" className="doc-h2">Configuring repository webhooks</h2>
            <p className="doc-p">
              Add the <code>/api/webhooks/github</code> payload URL in your GitHub repository settings. Set the content type to <code>application/json</code> and enter your webhook secret.
            </p>
            <h2 id="processing" className="doc-h2">Processing commit messages</h2>
            <p className="doc-p">
              When you push commits to the repository, Byline parses the commit messages. Commit summaries starting with keywords like 'feat', 'fix', or 'shipped' automatically trigger the LangGraph pipeline to generate drafts.
            </p>
          </div>
        );

      case "api-reference":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p className="doc-p">
              Byline exposes a set of REST and Server-Sent Events (SSE) endpoints that allow you to programmatically trigger agent pipelines, check status, and post content.
            </p>
            <InfoAlert>By default, the Byline API runs locally on port 8000: <code>http://localhost:8000</code></InfoAlert>
            
            <h2 id="post-dispatch" className="doc-h2">POST /api/dispatches</h2>
            <p className="doc-p">Creates a new dispatch (milestone) and starts the agent pipeline in the background.</p>
            <CodeBlock filename="request.json" code={`{\n  "project_id": "uuid",\n  "milestone": "string",\n  "source": "manual | github | voice | paste"\n}`} />
            
            <h2 id="get-dispatch" className="doc-h2">GET /api/dispatches/&#123;id&#125;</h2>
            <p className="doc-p">Fetches the complete state of a dispatch, including its metadata, strategist reasoning, and the latest platform drafts.</p>
            
            <h2 id="stream-dispatch" className="doc-h2">GET /api/dispatches/&#123;id&#125;/stream (SSE)</h2>
            <p className="doc-p">Connects to a Server-Sent Events (SSE) stream that broadcasts the live, step-by-step progress of the agent pipeline.</p>
            
            <h2 id="post-draft" className="doc-h2">POST /api/drafts/&#123;id&#125;/post</h2>
            <p className="doc-p">Takes an approved draft and posts it natively to the target platform (via Composio).</p>
            
            <h2 id="post-voice" className="doc-h2">POST /api/voice-profile</h2>
            <p className="doc-p">Generates or updates a voice profile using provided samples.</p>
          </div>
        );

      case "projects":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p className="doc-p">
              A <strong>Project</strong> in Byline is a discrete entity or application you are building in public (e.g., <code>fltrd.tech</code>). Byline tracks its stack, tagline, and incoming milestones.
            </p>
            <h2 id="project-tracking" className="doc-h2">Project Tracking</h2>
            <p className="doc-p">
              Each milestone captured is associated with a specific project. This helps the Strategist agent recall the correct context, such as the technologies used and the specific voice profile, before writing drafts.
            </p>
          </div>
        );

      case "dispatches":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p className="doc-p">
              A <strong>Dispatch</strong> is the core unit of work in Byline. It represents a single execution of the LangGraph pipeline&mdash;from the raw milestone to the finalized platform drafts.
            </p>
            <h2 id="dispatch-lifecycle" className="doc-h2">Dispatch Lifecycle</h2>
            <ul className="doc-ul">
              <li><strong>Pending:</strong> A milestone is logged but processing hasn't started.</li>
              <li><strong>Running:</strong> The multi-agent pipeline is actively analyzing the milestone, choosing platforms, and drafting content.</li>
              <li><strong>Ready:</strong> Drafts have been scored by the Critic and are waiting for your review on The Desk.</li>
              <li><strong>Posted:</strong> The drafts have been approved and published to their respective outlets.</li>
            </ul>
          </div>
        );

      case "review-drafts":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p className="doc-p">
              Once drafts are generated, they land on <strong>The Desk</strong>. This is your primary workspace for reviewing the Strategist's reasoning and the Critic's scores.
            </p>
            <h2 id="the-desk" className="doc-h2">Using The Desk</h2>
            <p className="doc-p">
              The Desk displays all pending Dispatches. For each draft, you can see the Critic's scores (1-10 on clarity, voice match, hook strength, and platform fit). You can edit the drafts inline to tweak phrasing before clicking "Approve" to publish.
            </p>
          </div>
        );

      case "voice-notes":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p className="doc-p">
              Tired of typing updates? Byline will soon support <strong>Voice Notes</strong> to capture your milestones.
            </p>
            <InfoAlert>
              Voice Note ingestion is scheduled for Phase 2. Once available, you can send an audio file or speak directly into the dashboard.
            </InfoAlert>
            <h2 id="transcription" className="doc-h2">Transcription and Chunking</h2>
            <p className="doc-p">
              Byline will transcribe your daily brain-dumps and automatically chunk them into discrete, post-worthy milestones before passing them to the Strategist.
            </p>
          </div>
        );

      case "platform-playbooks":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p className="doc-p">
              Byline's Writer agents follow specific <strong>Playbooks</strong> to ensure content is native to each platform, avoiding the "cross-posted slop" aesthetic.
            </p>
            <h2 id="linkedin" className="doc-h2">LinkedIn</h2>
            <p className="doc-p">Optimized for 150-300 words. Strong standalone hooks with short paragraphs for readability. The Critic actively flags and removes generic corporate jargon.</p>
            <h2 id="x-twitter" className="doc-h2">X (Twitter)</h2>
            <p className="doc-p">Punchy, lowercase, and opinion-driven. The agent prioritizes authenticity over formal information delivery.</p>
            <h2 id="reddit" className="doc-h2">Reddit</h2>
            <p className="doc-p">Highly educational and deeply detailed (400+ words). The Critic enforces strict anti-promo checks to prevent shadowbans, ensuring product links only appear as disclaimers.</p>
            <h2 id="threads" className="doc-h2">Threads</h2>
            <p className="doc-p">Casual, raw, and unpolished energy. Treated as texting a friend about what you just shipped.</p>
          </div>
        );

      case "cli":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p className="doc-p">
              Command line reference for the <code>byline</code> CLI utility.
            </p>
            <h2 id="cli-log" className="doc-h2">byline log</h2>
            <p className="doc-p">Submits a raw milestone to the local Byline instance.</p>
            <CodeBlock filename="bash" code={`python cli.py log "just finished migrating to pgvector"`} />
          </div>
        );

      case "settings":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p className="doc-p">
              Manage your Byline configuration through the <strong>Settings</strong> panel.
            </p>
            <h2 id="providers" className="doc-h2">LLM Providers</h2>
            <p className="doc-p">
              Update your API keys for Anthropic (used for the Strategist, Writers, and Critic) and OpenAI (used for pgvector embeddings).
            </p>
            <h2 id="connections" className="doc-h2">Outlet Connections</h2>
            <p className="doc-p">
              View your active Composio OAuth sessions for LinkedIn, Twitter, and Reddit. You can revoke access or re-authenticate directly from here.
            </p>
          </div>
        );

      case "faq":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <h2 id="automatic-posting" className="doc-h2">Does Byline post automatically?</h2>
            <p className="doc-p">
              No. Byline operates on a "human-in-the-loop" philosophy. While it generates the drafts automatically in the background, nothing is ever published until you explicitly approve it via The Desk.
            </p>
            <h2 id="multiple-projects" className="doc-h2">Can I track multiple projects?</h2>
            <p className="doc-p">
              Yes. You can configure multiple tracked repositories in Byline. The Strategist uses the correct project context depending on where the milestone originated.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const getTOCLinks = () => {
    switch(activePage) {
      case "introduction":
        return <a href="#core-workflow" className={`dispatch-docs-toc-link ${activeSection === "core-workflow" ? "active" : ""}`}>Core Workflow</a>;
      case "quickstart":
        return <a href="#initializing" className={`dispatch-docs-toc-link ${activeSection === "initializing" ? "active" : ""}`}>Initializing the container</a>;
      case "configuration":
        return <a href="#configuring" className={`dispatch-docs-toc-link ${activeSection === "configuring" ? "active" : ""}`}>Configuring environment variables</a>;
      case "voice-profile":
        return (
          <>
            <a href="#avoiding" className={`dispatch-docs-toc-link ${activeSection === "avoiding" ? "active" : ""}`}>Avoiding corporate filler</a>
            <a href="#formatting" className={`dispatch-docs-toc-link ${activeSection === "formatting" ? "active" : ""}`}>Formatting parameters</a>
          </>
        );
      case "github-integration":
        return (
          <>
            <a href="#configuring-webhooks" className={`dispatch-docs-toc-link ${activeSection === "configuring-webhooks" ? "active" : ""}`}>Configuring repository webhooks</a>
            <a href="#processing" className={`dispatch-docs-toc-link ${activeSection === "processing" ? "active" : ""}`}>Processing commit messages</a>
          </>
        );
      case "outlets":
        return <a href="#authorizing" className={`dispatch-docs-toc-link ${activeSection === "authorizing" ? "active" : ""}`}>Authorizing channels</a>;
      case "log-milestone":
        return <a href="#posting" className={`dispatch-docs-toc-link ${activeSection === "posting" ? "active" : ""}`}>Posting milestones</a>;
      case "api-reference":
        return (
          <>
            <a href="#post-dispatch" className={`dispatch-docs-toc-link ${activeSection === "post-dispatch" ? "active" : ""}`}>POST /api/dispatches</a>
            <a href="#get-dispatch" className={`dispatch-docs-toc-link ${activeSection === "get-dispatch" ? "active" : ""}`}>GET /api/dispatches/&#123;id&#125;</a>
            <a href="#stream-dispatch" className={`dispatch-docs-toc-link ${activeSection === "stream-dispatch" ? "active" : ""}`}>GET /api/dispatches/&#123;id&#125;/stream</a>
            <a href="#post-draft" className={`dispatch-docs-toc-link ${activeSection === "post-draft" ? "active" : ""}`}>POST /api/drafts/&#123;id&#125;/post</a>
            <a href="#post-voice" className={`dispatch-docs-toc-link ${activeSection === "post-voice" ? "active" : ""}`}>POST /api/voice-profile</a>
          </>
        );
      case "projects":
        return <a href="#project-tracking" className={`dispatch-docs-toc-link ${activeSection === "project-tracking" ? "active" : ""}`}>Project Tracking</a>;
      case "dispatches":
        return <a href="#dispatch-lifecycle" className={`dispatch-docs-toc-link ${activeSection === "dispatch-lifecycle" ? "active" : ""}`}>Dispatch Lifecycle</a>;
      case "review-drafts":
        return <a href="#the-desk" className={`dispatch-docs-toc-link ${activeSection === "the-desk" ? "active" : ""}`}>Using The Desk</a>;
      case "voice-notes":
        return <a href="#transcription" className={`dispatch-docs-toc-link ${activeSection === "transcription" ? "active" : ""}`}>Transcription and Chunking</a>;
      case "platform-playbooks":
        return (
          <>
            <a href="#linkedin" className={`dispatch-docs-toc-link ${activeSection === "linkedin" ? "active" : ""}`}>LinkedIn</a>
            <a href="#x-twitter" className={`dispatch-docs-toc-link ${activeSection === "x-twitter" ? "active" : ""}`}>X (Twitter)</a>
            <a href="#reddit" className={`dispatch-docs-toc-link ${activeSection === "reddit" ? "active" : ""}`}>Reddit</a>
            <a href="#threads" className={`dispatch-docs-toc-link ${activeSection === "threads" ? "active" : ""}`}>Threads</a>
          </>
        );
      case "cli":
        return <a href="#cli-log" className={`dispatch-docs-toc-link ${activeSection === "cli-log" ? "active" : ""}`}>byline log</a>;
      case "settings":
        return (
          <>
            <a href="#providers" className={`dispatch-docs-toc-link ${activeSection === "providers" ? "active" : ""}`}>LLM Providers</a>
            <a href="#connections" className={`dispatch-docs-toc-link ${activeSection === "connections" ? "active" : ""}`}>Outlet Connections</a>
          </>
        );
      case "faq":
        return (
          <>
            <a href="#automatic-posting" className={`dispatch-docs-toc-link ${activeSection === "automatic-posting" ? "active" : ""}`}>Does Byline post automatically?</a>
            <a href="#multiple-projects" className={`dispatch-docs-toc-link ${activeSection === "multiple-projects" ? "active" : ""}`}>Can I track multiple projects?</a>
          </>
        );
      default:
        return null;
    }
  };

  const tocLinks = getTOCLinks();

  return (
    <section id="docs" style={{ backgroundColor: "var(--bg)", minHeight: "calc(100vh - 56px)", transition: "background-color 0.3s ease", scrollMarginTop: "65px" }}>
      <style>{`
        .doc-p {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.65;
          margin: 0;
          transition: color 0.3s ease;
        }
        .doc-h2 {
          font-family: 'Space Grotesk', system-ui, sans-serif;
          font-size: 20px;
          font-weight: 500;
          color: var(--text-primary);
          letter-spacing: -0.02em;
          margin: 24px 0 8px 0;
          transition: color 0.3s ease;
        }
        .doc-ul {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.7;
          margin: 0;
          padding-left: 20px;
          transition: color 0.3s ease;
        }
        .dispatch-docs-grid {
          display: flex;
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 48px;
          position: relative;
          min-height: calc(100vh - 65px);
        }
        .dispatch-docs-sidebar {
          width: 260px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 20px;
          position: sticky;
          top: 65px;
          height: calc(100vh - 65px);
          padding: 40px 24px 40px 0;
          background: var(--bg);
          border-right: 1px dashed var(--border);
          overflow-y: auto;
          scrollbar-width: none;
        }
        .dispatch-docs-sidebar::-webkit-scrollbar {
          display: none;
        }
        .dispatch-docs-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .dispatch-docs-group:not(:last-of-type) {
          border-bottom: 0.5px dashed var(--border);
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
          padding: 6px 10px;
          margin-left: -10px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .dispatch-docs-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.03);
        }
        .dispatch-docs-btn.active {
          color: var(--by-accent);
          background: rgba(240, 165, 0, 0.08);
          font-weight: 500;
        }
        .dispatch-docs-body {
          flex: 1;
          padding: 60px 40px 60px 60px;
          max-width: 900px;
        }
        .dispatch-docs-toc {
          width: 240px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: sticky;
          top: 105px;
          height: fit-content;
          max-height: calc(100vh - 120px);
          overflow-y: auto;
          scrollbar-width: none;
          padding-right: 40px;
          padding-left: 20px;
        }
        .dispatch-docs-toc::-webkit-scrollbar {
          display: none;
        }
        .dispatch-docs-toc-title {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 8px;
        }
        .dispatch-docs-toc-link {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 13px;
          color: var(--text-secondary);
          text-decoration: none;
          transition: all 0.15s ease;
          line-height: 1.5;
          padding-left: 12px;
          border-left: 1px solid var(--border);
        }
        .dispatch-docs-toc-link:hover {
          color: var(--text-primary);
          border-left-color: var(--text-secondary);
        }
        .dispatch-docs-toc-link.active {
          color: var(--by-accent);
          border-left-color: var(--by-accent);
          font-weight: 500;
        }
        .dispatch-docs-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          color: var(--text-secondary);
          text-decoration: none;
          margin-bottom: 16px;
          transition: color 0.12s ease, transform 0.12s ease;
        }
        .dispatch-docs-back:hover {
          color: var(--text-primary);
          transform: translateX(-3px);
        }

        /* Search Modal Styles */
        .dispatch-docs-search-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 120px;
          animation: fadeIn 0.2s ease;
        }
        .dispatch-docs-search-modal {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 12px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.3);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .dispatch-docs-search-input-wrap {
          display: flex;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border);
          gap: 12px;
        }
        .dispatch-docs-search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 16px;
          color: var(--text-primary);
        }
        .dispatch-docs-search-input::placeholder {
          color: var(--text-secondary);
          opacity: 0.5;
        }
        .dispatch-docs-search-results {
          max-height: 300px;
          overflow-y: auto;
          padding: 8px;
        }
        .dispatch-docs-search-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 8px;
          text-decoration: none;
          color: var(--text-primary);
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 14px;
        }
        .dispatch-docs-search-item:hover {
          background: rgba(128,128,128,0.1);
        }
        .dispatch-docs-search-cat {
          font-size: 11px;
          color: var(--text-secondary);
          font-family: 'IBM Plex Mono', monospace;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 1024px) {
          .dispatch-docs-toc {
            display: none;
          }
        }
        @media (max-width: 767px) {
          .dispatch-docs-grid {
            flex-direction: column;
            padding: 0;
          }
          .dispatch-docs-sidebar {
            position: relative;
            top: 0;
            width: 100%;
            height: auto;
            border-right: none;
            border-bottom: 1px solid var(--border);
            padding: 24px;
          }
          .dispatch-docs-body {
            margin-left: 0;
            padding: 32px 24px;
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

          {/* New Search Trigger Button */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(128, 128, 128, 0.06)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              padding: "8px 12px",
              color: "var(--text-secondary)",
              fontFamily: "var(--byline-font-body)",
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.2s ease",
              marginBottom: 16
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <IconSearch size={14} />
              <span>Search...</span>
            </div>
            <span style={{
              background: "rgba(128, 128, 128, 0.15)",
              padding: "2px 6px",
              borderRadius: 4,
              fontSize: 10,
              fontFamily: "var(--byline-font-mono)",
              fontWeight: 600
            }}>Ctrl K</span>
          </button>

          {["Getting Started", "Core Concepts", "Guides", "Reference"].map((category) => (
            <div key={category} className="dispatch-docs-group">
              <span className="dispatch-docs-label">{category}</span>
              {DOC_PAGES.filter((p) => p.category === category).map((p) => (
                <button
                  key={p.id}
                  onClick={() => { window.location.hash = `#docs/${p.id}`; }}
                  className={`dispatch-docs-btn ${activePage === p.id ? "active" : ""}`}
                >
                  {p.title}
                </button>
              ))}
            </div>
          ))}
        </aside>

        {/* Content body */}
        <article className="dispatch-docs-body">
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

        {/* Right Sidebar TOC */}
        <aside className="dispatch-docs-toc">
          {tocLinks && <div className="dispatch-docs-toc-title">On this page</div>}
          {tocLinks}
        </aside>
      </div>

      {/* CmdK Search Modal */}
      {isSearchOpen && (
        <div className="dispatch-docs-search-overlay" onClick={() => setIsSearchOpen(false)}>
          <div className="dispatch-docs-search-modal" onClick={e => e.stopPropagation()}>
            <div className="dispatch-docs-search-input-wrap">
              <IconSearch size={18} color="var(--text-secondary)" />
              <input 
                autoFocus
                type="text" 
                className="dispatch-docs-search-input"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <div style={{ 
                fontFamily: "var(--byline-font-mono)", 
                fontSize: 10, 
                color: "var(--text-secondary)",
                background: "rgba(128,128,128,0.15)",
                padding: "2px 6px",
                borderRadius: 4
              }}>ESC</div>
            </div>
            
            <div className="dispatch-docs-search-results">
              {filteredPages.length > 0 ? (
                filteredPages.map(p => (
                  <a 
                    key={p.id}
                    href={`#docs/${p.id}`}
                    className="dispatch-docs-search-item"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                    }}
                  >
                    <IconCommand size={16} color="var(--text-secondary)" />
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span>{p.title}</span>
                      <span className="dispatch-docs-search-cat">{p.category}</span>
                    </div>
                  </a>
                ))
              ) : (
                <div style={{ padding: "24px", textAlign: "center", color: "var(--text-secondary)", fontSize: 13, fontFamily: "var(--byline-font-body)" }}>
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
