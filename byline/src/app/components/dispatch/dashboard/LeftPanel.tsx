import { useState } from "react";
import {
  IconBrain,
  IconBrandLinkedin,
  IconBrandX,
  IconBrandReddit,
  IconShieldCheck,
  IconChevronDown,
  IconChevronRight,
  IconPlayerPlay,
  IconCopy,
  IconCheck,
  IconPlus,
} from "@tabler/icons-react";
import Avatar from "boring-avatars";
const AGENTS = [
  {
    num: "01",
    name: "Strategist",
    sub: "Angle + platform selection",
    icon: IconBrain,
  },
  {
    num: "02",
    name: "LinkedIn Writer",
    sub: "Narrative, long-form",
    icon: IconBrandLinkedin,
  },
  { num: "03", name: "X Writer", sub: "Thread + hot takes", icon: IconBrandX },
  {
    num: "04",
    name: "Reddit Writer",
    sub: "Stealth, community-native",
    icon: IconBrandReddit,
  },
  {
    num: "05",
    name: "Critic",
    sub: "Voice + AI-slop check",
    icon: IconShieldCheck,
  },
];
const DEFAULT_PROJECTS = [
  {
    name: "fltrd.tech",
    stack: "FastAPI · pgvector · React",
    arc: "zero to 1k users",
  },
  {
    name: "byline",
    stack: "LangGraph · FastAPI · Postgres",
    arc: "build in public",
  },
];
function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: 32,
        height: 18,
        borderRadius: 9,
        background: on ? "#E85E2C" : "rgba(255,255,255,0.08)",
        border: "none",
        cursor: "pointer",
        position: "relative",
        flexShrink: 0,
        transition: "background 150ms",
      }}
    >
      {" "}
      <div
        style={{
          position: "absolute",
          top: 2,
          left: on ? 14 : 2,
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: "#fff",
          transition: "left 150ms cubic-bezier(0.4,0,0.2,1)",
        }}
      />{" "}
    </button>
  );
}
function SectionHead({
  label,
  action,
}: {
  label: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 16px 8px",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
        letterSpacing: "0.10em",
        textTransform: "uppercase",
        color: "var(--by-text-3)",
      }}
    >
      {" "}
      <span>{label}</span> {action}{" "}
    </div>
  );
}
interface LeftPanelProps {
  isRunning: boolean;
  runningAgent: number;
  onRun: () => void;
}
export function LeftPanel({ isRunning, runningAgent, onRun }: LeftPanelProps) {
  const [projects] = useState(DEFAULT_PROJECTS);
  const [activeProject, setActiveProject] = useState(0);
  const [configOpen, setConfigOpen] = useState(true);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [platforms, setPlatforms] = useState([
    { name: "LinkedIn", on: true },
    { name: "X", on: true },
    { name: "Reddit", on: true },
    { name: "Threads", on: false },
  ]);
  const [skills] = useState([
    {
      name: "Storyteller Mode",
      desc: "Long narrative LinkedIn posts",
      on: true,
    },
    { name: "Thread Architect", desc: "Auto-split into X threads", on: false },
    { name: "Reddit Stealth", desc: "Ultra-careful anti-promo", on: true },
    { name: "Ghost Mode", desc: "Drafts only, never auto-posts", on: false },
    { name: "Velocity Mode", desc: "Batch multiple milestones", on: false },
  ]);
  const [voice, setVoice] = useState(7);
  const [critic, setCritic] = useState(7);
  const [freq, setFreq] = useState<"low" | "medium" | "high">("low");
  const [copied, setCopied] = useState(false);
  const [expandedAgent, setExpandedAgent] = useState<number | null>(null);
  const getState = (i: number) => {
    if (!isRunning && runningAgent < 0) return "idle";
    if (i < runningAgent) return "done";
    if (i === runningAgent) return "running";
    return "pending";
  };
  const PLATFORM_COLORS: Record<string, string> = {
    LinkedIn: "#0A66C2",
    X: "var(--by-text)",
    Reddit: "#FF4500",
    Threads: "#1C1C1E",
  };
  return (
    <div
      style={{
        width: 248,
        flexShrink: 0,
        height: "100%",
        background: "var(--by-bg-2)",
        borderRight: "0.5px solid var(--by-border)",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {" "}
      {}{" "}
      <SectionHead
        label="PROJECTS"
        action={
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 5,
              background: "rgba(255,255,255,0.05)",
              border: "0.5px solid var(--by-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--by-text-3)",
              cursor: "pointer",
            }}
          >
            {" "}
            <IconPlus size={11} stroke={2.5} />{" "}
          </div>
        }
      />{" "}
      <div style={{ padding: "0 10px 6px" }}>
        {" "}
        {projects.map((p, i) => (
          <button
            key={p.name}
            onClick={() => setActiveProject(i)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              width: "100%",
              padding: "7px 8px",
              borderRadius: 7,
              border: `0.5px solid ${activeProject === i ? "rgba(232,94,44,0.3)" : "transparent"}`,
              background:
                activeProject === i ? "rgba(232,94,44,0.08)" : "transparent",
              cursor: "pointer",
              transition: "all 150ms",
              marginBottom: 2,
            }}
            onMouseEnter={(e) => {
              if (activeProject !== i)
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255,255,255,0.03)";
            }}
            onMouseLeave={(e) => {
              if (activeProject !== i)
                (e.currentTarget as HTMLButtonElement).style.background =
                  "transparent";
            }}
          >
            {" "}
            <Avatar
              name={p.name}
              variant="marble"
              colors={["#E8593C", "#2C2C2A", "#F0EDE8"]}
              size={22}
            />{" "}
            <div style={{ textAlign: "left", minWidth: 0 }}>
              {" "}
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  color: "var(--by-text)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {p.name}
              </div>{" "}
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 10,
                  color: "var(--by-text-3)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {p.arc}
              </div>{" "}
            </div>{" "}
          </button>
        ))}{" "}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            borderRadius: 6,
            padding: "7px 10px",
            marginTop: 4,
            border: "0.5px solid var(--by-border)",
          }}
        >
          {" "}
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--by-text-3)",
              marginBottom: 3,
            }}
          >
            STACK
          </div>{" "}
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 11,
              color: "var(--by-text-2)",
              lineHeight: 1.55,
            }}
          >
            {projects[activeProject]?.stack}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {}{" "}
      <div style={{ borderTop: "0.5px solid var(--by-border)", marginTop: 6 }}>
        {" "}
        <SectionHead
          label="AGENT PIPELINE"
          action={
            <button
              onClick={onRun}
              disabled={isRunning}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                background: isRunning ? "rgba(255,255,255,0.05)" : "#E85E2C",
                color: isRunning ? "var(--by-text-3)" : "#F5F2EC",
                padding: "3px 8px",
                borderRadius: 3,
                border: "none",
                cursor: isRunning ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {" "}
              <IconPlayerPlay size={9} fill="currentColor" stroke={0} />{" "}
              {isRunning ? "running" : "run"}{" "}
            </button>
          }
        />{" "}
      </div>{" "}
      {}{" "}
      <div style={{ padding: "4px 14px 8px", position: "relative" }}>
        {" "}
        <div
          style={{
            position: "absolute",
            left: 28,
            top: 20,
            bottom: 20,
            width: 1,
            background: "var(--by-border)",
          }}
        />{" "}
        {AGENTS.map((agent, i) => {
          const state = getState(i);
          const Icon = agent.icon;
          const isDone = state === "done";
          const isActive = state === "running";
          const isPending = state === "pending" || state === "idle";
          return (
            <div
              key={agent.name}
              style={{ position: "relative", marginBottom: 4 }}
            >
              {" "}
              {i > 0 && isDone && (
                <div
                  style={{
                    position: "absolute",
                    left: 14,
                    top: -8,
                    width: 1,
                    height: 8,
                    background: "#E85E2C",
                    zIndex: 1,
                  }}
                />
              )}{" "}
              <div
                onClick={() => setExpandedAgent(expandedAgent === i ? null : i)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "7px 8px 7px 0",
                  borderRadius: 7,
                  cursor: "pointer",
                  background: isActive ? "rgba(232,94,44,0.08)" : "transparent",
                  border: `0.5px solid ${isActive ? "rgba(232,94,44,0.25)" : "transparent"}`,
                  transition: "all 150ms",
                  position: "relative",
                  zIndex: 2,
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLDivElement).style.background =
                      "rgba(255,255,255,0.03)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLDivElement).style.background =
                      "transparent";
                }}
              >
                {" "}
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isDone
                      ? "#3FB950"
                      : isActive
                        ? "#E85E2C"
                        : "rgba(255,255,255,0.05)",
                    border: `0.5px solid ${isDone ? "transparent" : isActive ? "#E85E2C" : "var(--by-border)"}`,
                    transition: "all 200ms",
                    position: "relative",
                  }}
                >
                  {" "}
                  {isDone ? (
                    <IconCheck size={13} stroke={2.5} color="#fff" />
                  ) : isActive ? (
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        border: "1.5px solid #F5F2EC",
                        borderTopColor: "transparent",
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 10,
                        color: "var(--by-text-3)",
                        fontWeight: 500,
                      }}
                    >
                      {agent.num}
                    </span>
                  )}{" "}
                  {isActive && (
                    <div
                      style={{
                        position: "absolute",
                        inset: -3,
                        borderRadius: 10,
                        border: "1px solid #E85E2C",
                        opacity: 0.4,
                      }}
                    />
                  )}{" "}
                </div>{" "}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {" "}
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 12,
                      color: isActive
                        ? "#E85E2C"
                        : isDone
                          ? "var(--by-text)"
                          : "var(--by-text-2)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      transition: "color 200ms",
                    }}
                  >
                    {agent.name}
                  </div>{" "}
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 10,
                      color: "var(--by-text-3)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {agent.sub}
                  </div>{" "}
                </div>{" "}
                <Icon
                  size={13}
                  style={{
                    color: isDone
                      ? "#3FB950"
                      : isActive
                        ? "#E85E2C"
                        : "var(--by-text-3)",
                    flexShrink: 0,
                  }}
                  stroke={1.5}
                />{" "}
              </div>{" "}
              {expandedAgent === i && (
                <div
                  style={{
                    marginLeft: 8,
                    marginBottom: 4,
                    background: "rgba(0,0,0,0.15)",
                    border: "0.5px solid var(--by-border)",
                    borderRadius: 5,
                    padding: "6px 10px",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    color: "var(--by-text-3)",
                    lineHeight: 1.7,
                  }}
                >
                  {" "}
                  {isDone && (
                    <>
                      <div>
                        <span style={{ color: "#4ADE80" }}>✓</span> Completed ·{" "}
                        {["0.71s", "0.86s", "0.54s", "0.49s", "0.54s"][i]}
                      </div>
                      <div>
                        Tokens:{" "}
                        {
                          [
                            "1,247 in · 89 out",
                            "2,011 in · 391 out",
                            "1,843 in · 218 out",
                            "1,621 in · 184 out",
                            "3,247 in · 42 out",
                          ][i]
                        }
                      </div>
                    </>
                  )}{" "}
                  {isActive && (
                    <div style={{ color: "#E85E2C" }}>generating...</div>
                  )}{" "}
                  {isPending && <div>Waiting for upstream agent</div>}{" "}
                </div>
              )}{" "}
            </div>
          );
        })}{" "}
      </div>{" "}
      {}{" "}
      <div style={{ borderTop: "0.5px solid var(--by-border)" }}>
        {" "}
        <button
          onClick={() => setConfigOpen((o) => !o)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px 8px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: "var(--by-text-3)",
            background: "none",
            border: "none",
            width: "100%",
            cursor: "pointer",
          }}
        >
          {" "}
          AGENT CONFIG{" "}
          {configOpen ? (
            <IconChevronDown size={11} stroke={2} />
          ) : (
            <IconChevronRight size={11} stroke={2} />
          )}{" "}
        </button>{" "}
      </div>{" "}
      {configOpen && (
        <>
          {" "}
          <div
            style={{
              padding: "0 16px 4px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--by-text-3)",
            }}
          >
            PLATFORMS
          </div>{" "}
          {platforms.map((p, i) => (
            <div
              key={p.name}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "6px 16px",
                gap: 10,
              }}
            >
              {" "}
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 5,
                  background: p.on
                    ? PLATFORM_COLORS[p.name]
                    : "rgba(255,255,255,0.05)",
                  flexShrink: 0,
                  transition: "background 150ms",
                }}
              />{" "}
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  color: "var(--by-text)",
                  flex: 1,
                }}
              >
                {p.name}
              </span>{" "}
              <Toggle
                on={p.on}
                onToggle={() =>
                  setPlatforms((prev) =>
                    prev.map((pp, ii) =>
                      ii === i ? { ...pp, on: !pp.on } : pp,
                    ),
                  )
                }
              />{" "}
            </div>
          ))}{" "}
          {[
            { label: "Voice Strength", val: voice, set: setVoice },
            { label: "Critic Floor", val: critic, set: setCritic },
          ].map((s) => (
            <div key={s.label} style={{ padding: "10px 16px 4px" }}>
              {" "}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                {" "}
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12,
                    color: "var(--by-text-2)",
                  }}
                >
                  {s.label}
                </span>{" "}
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    color: "var(--by-text-3)",
                  }}
                >
                  {s.val}/10
                </span>{" "}
              </div>{" "}
              <input
                type="range"
                min={1}
                max={10}
                value={s.val}
                onChange={(e) => s.set(Number(e.target.value))}
                style={{ width: "100%", cursor: "pointer" }}
              />{" "}
            </div>
          ))}{" "}
          <div style={{ padding: "8px 16px 12px" }}>
            {" "}
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 12,
                color: "var(--by-text-2)",
                display: "block",
                marginBottom: 8,
              }}
            >
              Post Frequency
            </span>{" "}
            <div
              style={{
                display: "flex",
                background: "rgba(255,255,255,0.05)",
                borderRadius: 6,
                padding: 2,
                gap: 2,
              }}
            >
              {" "}
              {(["low", "medium", "high"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFreq(f)}
                  style={{
                    flex: 1,
                    height: 24,
                    borderRadius: 4,
                    border: "none",
                    background: freq === f ? "#E85E2C" : "transparent",
                    color: freq === f ? "#F5F2EC" : "var(--by-text-2)",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    cursor: "pointer",
                    transition: "all 150ms",
                  }}
                >
                  {f}
                </button>
              ))}{" "}
            </div>{" "}
          </div>{" "}
        </>
      )}{" "}
      {}{" "}
      <div style={{ borderTop: "0.5px solid var(--by-border)" }}>
        {" "}
        <button
          onClick={() => setSkillsOpen((o) => !o)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px 8px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: "var(--by-text-3)",
            background: "none",
            border: "none",
            width: "100%",
            cursor: "pointer",
          }}
        >
          {" "}
          AGENT SKILLS{" "}
          {skillsOpen ? (
            <IconChevronDown size={11} stroke={2} />
          ) : (
            <IconChevronRight size={11} stroke={2} />
          )}{" "}
        </button>{" "}
      </div>{" "}
      {skillsOpen &&
        skills.map((skill, i) => (
          <div
            key={skill.name}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 16px",
              gap: 10,
              borderBottom:
                i < skills.length - 1 ? "0.5px solid var(--by-border)" : "none",
            }}
          >
            {" "}
            <div style={{ flex: 1, minWidth: 0 }}>
              {" "}
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--by-text)",
                }}
              >
                {skill.name}
              </div>{" "}
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 11,
                  color: "var(--by-text-3)",
                  marginTop: 1,
                }}
              >
                {skill.desc}
              </div>{" "}
            </div>{" "}
            <Toggle on={skill.on} onToggle={() => {}} />{" "}
          </div>
        ))}{" "}
      {}{" "}
      <div
        style={{ borderTop: "0.5px solid var(--by-border)", marginTop: "auto" }}
      >
        {" "}
        <SectionHead label="QUICK START" />{" "}
      </div>{" "}
      <div
        style={{
          padding: "0 16px 8px",
          fontFamily: "'Inter', sans-serif",
          fontSize: 11,
          color: "var(--by-text-3)",
        }}
      >
        Self-host in 5 minutes
      </div>{" "}
      <div
        style={{
          margin: "0 12px 16px",
          background: "rgba(0,0,0,0.2)",
          border: "0.5px solid var(--by-border)",
          borderRadius: 6,
          padding: "10px 12px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          lineHeight: 1.8,
          position: "relative",
        }}
      >
        {" "}
        <button
          onClick={() => {
            navigator.clipboard.writeText(
              "git clone github.com/sahil/byline && docker compose up -d",
            );
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            width: 20,
            height: 20,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: copied ? "#3FB950" : "var(--by-text-3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {" "}
          {copied ? (
            <IconCheck size={11} stroke={2} />
          ) : (
            <IconCopy size={11} stroke={1.5} />
          )}{" "}
        </button>{" "}
        {[
          "git clone .../byline",
          "cp .env.example .env",
          "docker compose up -d",
        ].map((line, i) => (
          <div key={i} style={{ display: "flex", gap: 10 }}>
            {" "}
            <span style={{ color: "var(--by-text-3)" }}>{i + 1}</span>{" "}
            <span style={{ color: "rgba(255,255,255,0.5)" }}>{line}</span>{" "}
          </div>
        ))}{" "}
      </div>{" "}
    </div>
  );
}
