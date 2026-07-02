import React, { useState, useEffect } from "react";
import {
  IconBook,
  IconChevronRight,
  IconBulb,
  IconSettings,
  IconCpu,
  IconBrandGithub,
  IconTerminal,
  IconCheck,
  IconAlertCircle,
  IconInfoCircle,
} from "@tabler/icons-react";

interface DocsTabProps {
  isMobile: boolean;
  scrollTarget: string | null;
  onScrollComplete: () => void;
}

const CATEGORIES = [
  {
    id: "getting-started",
    label: "Getting Started",
    pages: [
      { id: "overview", title: "Understanding Byline", icon: IconBook },
      { id: "self-host", title: "Self-hosting with Docker", icon: IconSettings },
      { id: "cli", title: "Milestone capturing via CLI", icon: IconTerminal },
    ]
  },
  {
    id: "core-concepts",
    label: "Core Concepts",
    pages: [
      { id: "agents", title: "Designing the agent pipeline", icon: IconCpu },
      { id: "voice", title: "Profiling and matching your voice", icon: IconBulb },
    ]
  },
  {
    id: "integrations",
    label: "Integrations & Publishing",
    pages: [
      { id: "webhooks", title: "Listening to GitHub webhooks", icon: IconBrandGithub },
      { id: "composio", title: "Publishing drafts with Composio", icon: IconCheck },
    ]
  }
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
      border: "0.5px solid var(--border)",
      overflow: "hidden",
      backgroundColor: "#0A0A0A",
    }}>
      {/* VSCode Tab Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 16px",
        background: "rgba(255, 255, 255, 0.02)",
        borderBottom: "0.5px solid var(--border)",
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

const DOC_CONTENT: Record<string, { title: string; category: string; content: React.ReactNode }> = {
  overview: {
    category: "Getting Started",
    title: "Understanding Byline",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "var(--text-secondary)" }}>
          Byline is an open-source wire service and publishing engine designed for developer-founders who build in public. The application monitors your development signals (such as GitHub commits, terminal logs, or voice notes), identifies key milestones, and drafts tailored updates for LinkedIn, X (Twitter), Reddit, and Threads.
        </p>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "var(--text-secondary)" }}>
          Unlike standard automated posting utilities that cross-post identical text, Byline uses a five-agent LangGraph pipeline to reframe each message specifically for individual platform audiences. The Strategist determines the post angle, specialized writers draft content according to platform-native conventions, and the Critic reviews the outputs to eliminate AI slop and ensure voice compliance.
        </p>

        <InfoAlert>
          To fully automate Byline, connect your repository webhooks. Once configured, pushing a commit with keywords like <code>shipped</code>, <code>feat</code>, or <code>fix</code> will trigger draft generations in the background.
        </InfoAlert>

        <h3 style={{ margin: "16px 0 6px 0", fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>Core Workflow</h3>
        <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13, lineHeight: 1.7, color: "var(--text-secondary)" }}>
          <li style={{ marginBottom: 8 }}><strong>Ingesting Milestones:</strong> Capture a milestone manually, upload a voice note, or push a commit to a tracked GitHub repository.</li>
          <li style={{ marginBottom: 8 }}><strong>Refining Content:</strong> The multi-agent pipeline triggers in the background. The agents retrieve similar past posts using vector embeddings to maintain context.</li>
          <li style={{ marginBottom: 8 }}><strong>Reviewing on The Desk:</strong> Review and edit the generated platform-native drafts inside the Desk panel. Approve each post individually.</li>
          <li><strong>Publishing:</strong> Approved posts are published to your social feeds via Composio OAuth connections.</li>
        </ol>
      </div>
    )
  },
  "self-host": {
    category: "Getting Started",
    title: "Self-hosting with Docker",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "var(--text-secondary)" }}>
          You can deploy Byline on your own infrastructure using Docker Compose. The environment includes the FastAPI backend, the Next.js web dashboard, and a PostgreSQL database preconfigured with the pgvector extension.
        </p>

        <h3 style={{ margin: "14px 0 4px 0", fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Initializing the container</h3>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "var(--text-secondary)" }}>
          Clone the repository and run Docker Compose to spin up all services:
        </p>
        <CodeBlock filename="docker-compose.yml" code={`git clone https://github.com/sahil/byline.git\ncd byline\ndocker compose up -d`} />

        <h3 style={{ margin: "14px 0 4px 0", fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Configuring environment variables</h3>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "var(--text-secondary)" }}>
          Copy <code>.env.example</code> to <code>.env</code> and fill in the required LLM provider credentials:
        </p>
        <CodeBlock filename=".env" code={`# Database Configuration\nDATABASE_URL=postgresql+asyncpg://byline:byline@localhost:5432/byline\n\n# LLM API Keys\nANTHROPIC_API_KEY=your-anthropic-key-for-agents\nOPENAI_API_KEY=your-openai-key-for-embeddings\n\n# Optional: Composio Key for posting\nCOMPOSIO_API_KEY=your-composio-key`} />
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "var(--text-secondary)" }}>
          The database schema is initialized using <code>infra/postgres/init.sql</code> on the first run. Subsequent changes should be applied via migration scripts.
        </p>
      </div>
    )
  },
  cli: {
    category: "Getting Started",
    title: "Milestone capturing via CLI",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "var(--text-secondary)" }}>
          For developers who build in public from the terminal, the <code>byline</code> CLI allows capturing milestones directly after shipping code or debugging.
        </p>

        <h3 style={{ margin: "14px 0 4px 0", fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Posting milestones</h3>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "var(--text-secondary)" }}>
          Call the CLI utility and pass the milestone message:
        </p>
        <CodeBlock filename="cli.py" code={`python cli.py log "shipped semantic search on fltrd.tech using pgvector"`} />
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "var(--text-secondary)" }}>
          The tool submits the input text to the <code>/dispatch</code> endpoint, tracks the background LangGraph pipeline, and prints the generated drafts for each configured platform to your terminal.
        </p>
      </div>
    )
  },
  agents: {
    category: "Core Concepts",
    title: "Designing the agent pipeline",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "var(--text-secondary)" }}>
          Byline orchestrates the post generation using a multi-agent state graph built on LangGraph. This architecture ensures specialized nodes handle distinct stages of the publishing workflow:
        </p>

        <div style={{
          backgroundColor: "rgba(255, 255, 255, 0.02)",
          borderRadius: 6,
          border: "0.5px solid var(--border)",
          padding: 14,
          display: "flex",
          flexDirection: "column",
          gap: 12
        }}>
          <div>
            <strong style={{ color: "var(--accent)" }}>1. Strategist</strong>
            <p style={{ margin: "4px 0 0 0", fontSize: 12, lineHeight: 1.6, color: "var(--text-secondary)" }}>
              Analyzes the milestone payload, assigns an engagement score, selects the best angle (technical deep dive, lesson learned, or milestone), and chooses target platforms.
            </p>
          </div>
          <div style={{ borderTop: "0.5px solid var(--border)", paddingTop: 10 }}>
            <strong style={{ color: "var(--accent)" }}>2. Writers</strong>
            <p style={{ margin: "4px 0 0 0", fontSize: 12, lineHeight: 1.6, color: "var(--text-secondary)" }}>
              Platform-specific nodes (LinkedIn, X, Reddit, Threads) run concurrently to draft content matching each platform's constraints and length requirements.
            </p>
          </div>
          <div style={{ borderTop: "0.5px solid var(--border)", paddingTop: 10 }}>
            <strong style={{ color: "var(--accent)" }}>3. Critic</strong>
            <p style={{ margin: "4px 0 0 0", fontSize: 12, lineHeight: 1.6, color: "var(--text-secondary)" }}>
              Evaluates every draft 1-10 on voice alignment, length constraints, and anti-promo checks (especially Reddit).
            </p>
          </div>
        </div>
      </div>
    )
  },
  voice: {
    category: "Core Concepts",
    title: "Profiling and matching your voice",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "var(--text-secondary)" }}>
          To write posts that sound natural and authentic, Byline extracts writing heuristics from your past publications to build a voice profile.
        </p>

        <h3 style={{ margin: "14px 0 4px 0", fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Avoiding corporate filler</h3>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "var(--text-secondary)" }}>
          The voice model scans drafts to delete forbidden terms, such as 'excited to announce', 'game-changer', and 'synergy'.
        </p>

        <h3 style={{ margin: "14px 0 4px 0", fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Formatting parameters</h3>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "var(--text-secondary)" }}>
          The engine controls post lengths (e.g., 180–280 words for LinkedIn, under 280 characters for X) and opener patterns (e.g., 'I spent X days on Y and Z was the hard part') to match casual, low-overhead writing habits.
        </p>
      </div>
    )
  },
  webhooks: {
    category: "Integrations & Publishing",
    title: "Listening to GitHub webhooks",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "var(--text-secondary)" }}>
          Byline automates milestone detection by listening to GitHub commit push webhooks.
        </p>

        <h3 style={{ margin: "14px 0 4px 0", fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Configuring repository webhooks</h3>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "var(--text-secondary)" }}>
          Add the <code>/api/webhooks/github</code> payload URL in your GitHub repository settings. Set the content type to <code>application/json</code> and enter your webhook secret.
        </p>

        <h3 style={{ margin: "14px 0 4px 0", fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Processing commit messages</h3>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "var(--text-secondary)" }}>
          When you push commits to the repository, Byline parses the commit messages. Commit summaries starting with keywords like 'feat', 'fix', or 'shipped' automatically trigger the LangGraph pipeline to generate drafts.
        </p>
      </div>
    )
  },
  composio: {
    category: "Integrations & Publishing",
    title: "Publishing drafts with Composio",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "var(--text-secondary)" }}>
          Byline integrates with Composio to handle OAuth connections and post publishing to LinkedIn, X (Twitter), and Reddit without storing user credentials.
        </p>

        <h3 style={{ margin: "14px 0 4px 0", fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Authorizing channels</h3>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "var(--text-secondary)" }}>
          Connect your channels using the Composio command line:
        </p>
        <CodeBlock filename="terminal" code={`# Connect your accounts via Composio OAuth\ncomposio add linkedin\ncomposio add twitter\ncomposio add reddit`} />
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "var(--text-secondary)" }}>
          The backend API routes posting actions to the Composio toolset. Posts are only published after you review, edit, and click the 'Approve' button on the dashboard.
        </p>
      </div>
    )
  }
};

interface PipelineNode {
  id: string;
  label: string;
  x: number;
  y: number;
  details: {
    model: string;
    input: string;
    output: string;
  };
}

const PIPELINE_NODES: PipelineNode[] = [
  {
    id: "ingress",
    label: "Ingress",
    x: 40,
    y: 80,
    details: {
      model: "Webhook / Whisper API",
      input: "commit_msg | voice_note",
      output: "milestone_payload"
    }
  },
  {
    id: "memory",
    label: "Memory",
    x: 130,
    y: 35,
    details: {
      model: "pgvector embeddings",
      input: "milestone_payload",
      output: "historical_context"
    }
  },
  {
    id: "strategist",
    label: "Strategist",
    x: 130,
    y: 125,
    details: {
      model: "Claude 3.5 Sonnet",
      input: "milestone + context",
      output: "routing_decision"
    }
  },
  {
    id: "writers",
    label: "Writers",
    x: 220,
    y: 80,
    details: {
      model: "Claude 3.5 Sonnet (Parallel)",
      input: "milestone + strategist_prompt",
      output: "platform_drafts"
    }
  },
  {
    id: "critic",
    label: "Critic",
    x: 310,
    y: 80,
    details: {
      model: "Claude 3.5 Sonnet",
      input: "drafts + voice_profile",
      output: "scores_and_verdict"
    }
  },
  {
    id: "composio",
    label: "Publish",
    x: 400,
    y: 80,
    details: {
      model: "Composio OAuth API",
      input: "approved_draft",
      output: "live_post_id"
    }
  }
];

function PipelineVisualizer() {
  const [selectedNode, setSelectedNode] = useState<string>("ingress");

  const currentNode = PIPELINE_NODES.find(n => n.id === selectedNode) || PIPELINE_NODES[0];

  return (
    <div style={{
      background: "var(--by-bg-2)",
      border: "0.5px solid var(--border)",
      borderRadius: 8,
      padding: 16,
      display: "flex",
      flexDirection: "column",
      gap: 16,
      alignSelf: "stretch",
    }}>
      <style>{`
        @keyframes flowDash {
          to { stroke-dashoffset: -20; }
        }
        .visualizer-flow-line {
          stroke: var(--border);
          stroke-dasharray: 4, 4;
          animation: flowDash 1.2s linear infinite;
        }
        .visualizer-flow-line-active {
          stroke: var(--accent);
          stroke-dasharray: 4, 4;
          animation: flowDash 0.8s linear infinite;
        }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "var(--text-secondary)", opacity: 0.6, textTransform: "uppercase" }}>
          Interactive Map
        </span>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>Agent Pipeline Flow</div>
      </div>

      {/* SVG Pipeline Map */}
      <div style={{
        background: "rgba(0,0,0,0.3)",
        border: "0.5px solid var(--border)",
        borderRadius: 6,
        padding: "8px 4px",
        position: "relative",
      }}>
        <svg viewBox="0 0 440 160" width="100%" height="100%" style={{ overflow: "visible" }}>
          {/* SVG Connectors */}
          <path d="M 65 80 L 105 80 L 105 35 L 125 35" fill="none" className="visualizer-flow-line" />
          <path d="M 65 80 L 105 80 L 105 125 L 125 125" fill="none" className="visualizer-flow-line" />
          <path d="M 155 35 L 175 35 L 175 80 L 195 80" fill="none" className="visualizer-flow-line-active" />
          <path d="M 155 125 L 175 125 L 175 80 L 195 80" fill="none" className="visualizer-flow-line-active" />
          <path d="M 245 80 L 285 80" fill="none" className="visualizer-flow-line-active" />
          <path d="M 335 80 L 375 80" fill="none" className="visualizer-flow-line" />

          {/* SVG Nodes */}
          {PIPELINE_NODES.map((node) => {
            const isSelected = selectedNode === node.id;
            return (
              <g key={node.id} onClick={() => setSelectedNode(node.id)} style={{ cursor: "pointer" }}>
                {/* Outer Glow */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isSelected ? 18 : 14}
                  fill="transparent"
                  stroke={isSelected ? "var(--accent)" : "transparent"}
                  strokeWidth="2"
                  style={{ opacity: 0.4 }}
                />
                {/* Node Body */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={12}
                  fill={isSelected ? "var(--accent)" : "var(--surface-secondary)"}
                  stroke={isSelected ? "var(--accent)" : "var(--border)"}
                  strokeWidth="1"
                />
                {/* Node Initials */}
                <text
                  x={node.x}
                  y={node.y + 3.5}
                  textAnchor="middle"
                  fill={isSelected ? "#FFF" : "var(--text-secondary)"}
                  style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold" }}
                >
                  {node.label.substring(0, 2).toUpperCase()}
                </text>
                {/* Node label */}
                <text
                  x={node.x}
                  y={node.y + 24}
                  textAnchor="middle"
                  fill={isSelected ? "var(--text-primary)" : "var(--text-secondary)"}
                  style={{ fontSize: 8, fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Node Details Card */}
      <div style={{
        background: "rgba(255, 255, 255, 0.01)",
        border: "0.5px solid var(--border)",
        borderRadius: 6,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, fontWeight: "bold", color: "var(--text-primary)" }}>
            {currentNode.label} Node
          </span>
          <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: "var(--accent)" }}>
            {currentNode.details.model}
          </span>
        </div>
        <div style={{ borderTop: "0.5px solid var(--border)", paddingTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
          <div>
            <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-secondary)", opacity: 0.6 }}>INPUT</div>
            <code style={{ fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", color: "var(--text-primary)" }}>{currentNode.details.input}</code>
          </div>
          <div>
            <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-secondary)", opacity: 0.6 }}>OUTPUT</div>
            <code style={{ fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", color: "var(--text-primary)" }}>{currentNode.details.output}</code>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DocsTab({ isMobile, scrollTarget, onScrollComplete }: DocsTabProps) {
  const [activePage, setActivePage] = useState("overview");

  useEffect(() => {
    if (scrollTarget) {
      setActivePage(scrollTarget);
      onScrollComplete();
    }
  }, [scrollTarget, onScrollComplete]);

  const activeContent = DOC_CONTENT[activePage] || DOC_CONTENT.overview;

  return (
    <div style={{
      flex: 1,
      overflowY: "auto",
      padding: isMobile ? "16px" : "24px",
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "220px minmax(0, 1fr) 280px",
      gap: 20,
      alignItems: "start",
    }}>
      {/* Sidebar Navigation */}
      <aside style={{
        display: "flex",
        flexDirection: isMobile ? "row" : "column",
        gap: 16,
        overflowX: isMobile ? "auto" : "visible",
        background: "var(--by-bg-2)",
        border: "0.5px solid var(--border)",
        borderRadius: 8,
        padding: 12,
      }}>
        {CATEGORIES.map((cat) => (
          <div key={cat.id} style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: isMobile ? 160 : undefined }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              color: "var(--text-secondary)",
              opacity: 0.6,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 4,
              paddingLeft: 6,
            }}>
              {cat.label}
            </span>
            {cat.pages.map((p) => {
              const Icon = p.icon;
              const active = activePage === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePage(p.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    width: "100%",
                    padding: "6px 8px",
                    borderRadius: 4,
                    border: "none",
                    background: active ? "rgba(255, 102, 0, 0.08)" : "transparent",
                    color: active ? "var(--accent)" : "var(--text-secondary)",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: 12,
                    transition: "all 0.15s ease",
                  }}
                >
                  <Icon size={14} />
                  <span style={{ fontWeight: active ? 600 : 400 }}>{p.title}</span>
                </button>
              );
            })}
          </div>
        ))}
      </aside>

      {/* Main Active Page Content */}
      <article style={{
        background: "var(--by-bg-2)",
        border: "0.5px solid var(--border)",
        borderRadius: 8,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        minHeight: 340,
      }}>
        {/* Stripe-style Breadcrumbs */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          color: "var(--text-secondary)",
          opacity: 0.7,
        }}>
          <span>Docs</span>
          <IconChevronRight size={10} stroke={2} />
          <span>{activeContent.category}</span>
          <IconChevronRight size={10} stroke={2} />
          <span style={{ color: "var(--accent)" }}>{activeContent.title}</span>
        </div>

        <div style={{ borderBottom: "0.5px solid var(--border)", paddingBottom: 12 }}>
          <h1 style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontSize: 24,
            fontWeight: 500,
            color: "var(--text-primary)",
            margin: 0,
            letterSpacing: "-0.03em"
          }}>
            {activeContent.title}
          </h1>
        </div>

        <div>
          {activeContent.content}
        </div>
      </article>

      {/* Visual Sidebar Widget */}
      {!isMobile && <PipelineVisualizer />}
    </div>
  );
}
