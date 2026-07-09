import { useState } from "react";
import { IconCircleCheck, IconCircle, IconX } from "@tabler/icons-react";
const STEPS = [
  {
    id: "sample",
    label: "Run a sample pipeline",
    desc: "See the agents in action",
  },
  {
    id: "project",
    label: "Add your first project",
    desc: "Name + stack + description",
  },
  {
    id: "voice",
    label: "Train your voice profile",
    desc: "Paste 5+ past posts",
  },
  {
    id: "connect",
    label: "Connect a platform",
    desc: "LinkedIn, X, Reddit, or Threads",
  },
  {
    id: "log",
    label: "Log your first milestone",
    desc: "Type what you shipped",
  },
  { id: "ship", label: "Approve & ship", desc: "Review drafts and post" },
];
export function SetupChecklist() {
  const [completed, setCompleted] = useState<string[]>(["sample"]);
  const [dismissed, setDismissed] = useState(false);
  const allDone = completed.length === STEPS.length;
  if (dismissed && allDone) return null;
  const toggle = (id: string) =>
    setCompleted((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  const progress = (completed.length / STEPS.length) * 100;
  return (
    <div
      style={{
        background: "var(--by-bg-2)",
        border: "0.5px solid var(--by-border)",
        borderRadius: 8,
        padding: "16px 20px",
        position: "relative",
      }}
    >
      {" "}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        {" "}
        <div>
          {" "}
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              fontWeight: 500,
              color: "var(--by-text)",
              marginBottom: 2,
            }}
          >
            Getting started
          </div>{" "}
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: "var(--by-text-3)",
            }}
          >
            {completed.length} / {STEPS.length} complete
          </div>{" "}
        </div>{" "}
        <button
          aria-label="Dismiss setup checklist"
          onClick={() => {
            if (allDone) setDismissed(true);
          }}
          style={{
            width: 28,
            height: 28,
            borderRadius: 5,
            background: "transparent",
            border: "none",
            color: allDone ? "var(--by-text-3)" : "var(--by-text-3)",
            cursor: allDone ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {" "}
          <IconX size={14} stroke={1.5} aria-hidden="true" />{" "}
        </button>{" "}
      </div>{" "}
      <div
        style={{
          height: 4,
          background: "rgba(255,255,255,0.05)",
          borderRadius: 2,
          marginBottom: 14,
          overflow: "hidden",
        }}
      >
        {" "}
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: allDone ? "#3FB950" : "#FF6600",
            borderRadius: 2,
            transition: "width 400ms ease",
          }}
        />{" "}
      </div>{" "}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {" "}
        {STEPS.map((step) => {
          const done = completed.includes(step.id);
          return (
            <button
              key={step.id}
              onClick={() => toggle(step.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 12px",
                borderRadius: 6,
                border: `0.5px solid ${done ? "rgba(255,102,0,0.3)" : "var(--by-border)"}`,
                background: done ? "rgba(255,102,0,0.08)" : "transparent",
                cursor: "pointer",
                transition: "all 150ms",
              }}
            >
              {" "}
              {done ? (
                <IconCircleCheck
                  size={14}
                  style={{ color: "#FF6600", flexShrink: 0 }}
                  stroke={2}
                />
              ) : (
                <IconCircle
                  size={14}
                  style={{ color: "var(--by-text-3)", flexShrink: 0 }}
                  stroke={1.5}
                />
              )}{" "}
              <div style={{ textAlign: "left" }}>
                {" "}
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12,
                    fontWeight: 500,
                    color: done ? "var(--by-text)" : "var(--by-text-2)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {step.label}
                </div>{" "}
              </div>{" "}
            </button>
          );
        })}{" "}
      </div>{" "}
    </div>
  );
}
