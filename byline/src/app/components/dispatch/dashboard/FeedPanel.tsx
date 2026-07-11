import React, { useRef, useEffect, useState } from "react";
import type { AgentStep } from "./AgentRail";
import { IconPhoto, IconSend, IconLoader2, IconBrandLinkedin, IconBrandX, IconBrandReddit, IconSparkles, IconMessageCircle } from "@tabler/icons-react";

interface FeedPanelProps {
  agentSteps: AgentStep[];
  isRunning: boolean;
  onRunMilestone: (txt: string, images?: string[]) => void;
  onReviewDraft?: () => void;
}

export function FeedPanel({ agentSteps, isRunning, onRunMilestone, onReviewDraft }: FeedPanelProps) {
  const [input, setInput] = useState("");
  const [platforms, setPlatforms] = useState({ linkedin: true, x: true, reddit: true, threads: false });
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [agentSteps]);

  const handleSend = () => {
    if (!input.trim()) return;
    onRunMilestone(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasSteps = agentSteps.length > 0;

  // Reconstruct chat history from agentSteps for the UI
  // Realistically we'd want a "Message" array in state, but we'll mock the flow from agentSteps.
  const userPromptContext = agentSteps[0]?.input.context.find((c) => c.startsWith("Milestone: "));
  const userPrompt = userPromptContext ? userPromptContext.replace("Milestone: ", "") : null;

  return (
    <div className="flex flex-col h-full bg-surface relative overflow-hidden">
      
      {/* Header */}
      <div className="px-8 py-5 border-b border-rule/50 flex justify-between items-center z-10 bg-surface/80 backdrop-blur-md absolute top-0 left-0 right-0">
        <div className="text-[12px] font-bold text-ink tracking-widest uppercase flex items-center gap-2">
          <IconSparkles size={16} className="text-amber-500" />
          Agent Workspace
        </div>
        {isRunning && (
          <div className="flex items-center gap-2 text-[10px] text-ink font-medium uppercase tracking-widest bg-paper px-3 py-1.5 rounded-full border border-rule/50 shadow-sm">
            <IconLoader2 size={12} className="animate-spin text-amber-500" />
            Synthesizing
          </div>
        )}
      </div>

      {/* Chat History Area */}
      <div className="flex-1 overflow-y-auto p-8 pt-24 relative">
        
        {/* Empty State */}
        {!hasSteps && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="w-20 h-20 rounded-[2rem] bg-paper border border-rule/50 flex items-center justify-center shadow-lg mb-8 shadow-black/20">
              <IconSparkles size={32} className="text-amber-500 opacity-80" />
            </div>
            <div className="text-xl font-display font-bold text-ink mb-3 tracking-tight">What did you ship today?</div>
            <div className="text-sm text-mute max-w-md text-center leading-relaxed">
              Describe your milestone, paste a PR link, or drop a commit. The agents will strategize angles and draft native content for your review.
            </div>
          </div>
        )}

        <div className="flex flex-col gap-10 max-w-3xl mx-auto pb-10">
          
          {/* User Bubble */}
          {hasSteps && userPrompt && (
            <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-ink text-paper rounded-3xl rounded-tr-sm px-6 py-4 max-w-[85%] shadow-xl shadow-black/10">
                <p className="text-sm leading-relaxed">{userPrompt}</p>
              </div>
            </div>
          )}

          {/* Agent Stream */}
          {agentSteps.filter(s => s.status !== "pending").map((step, idx) => (
            <div key={`${step.agentId}-${idx}`} className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              <div className="flex items-start gap-4 mb-2">
                <div className="w-8 h-8 rounded-full bg-paper border border-rule/50 flex items-center justify-center shadow-sm flex-shrink-0 mt-1">
                  <span className="text-[11px] font-bold text-ink uppercase tracking-wider">{step.agentId[0]}</span>
                </div>
                
                <div className="flex flex-col gap-2 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="text-[13px] font-bold text-ink capitalize">
                      {step.agentId} Agent
                    </div>
                    {step.status === "running" ? (
                      <div className="text-[10px] font-medium text-amber-500 uppercase tracking-widest flex items-center gap-1.5 bg-amber-500/10 px-2 py-0.5 rounded-full">
                        <IconLoader2 size={10} className="animate-spin" /> Thinking
                      </div>
                    ) : (
                      <div className="text-[10px] font-medium text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        Done
                      </div>
                    )}
                  </div>

                  <div className="text-[13px] flex flex-col gap-3">
                    {/* Reasoning Block */}
                    {step.decisions.length > 0 && (
                      <div className="bg-paper/50 border border-rule/50 rounded-2xl p-4 flex flex-col gap-2.5">
                        {step.decisions.map((dec, i) => (
                          <div key={i} className="flex gap-3 text-mute/90">
                            <span className="text-rule mt-0.5">↳</span>
                            <span className="leading-relaxed">{dec.detail}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Output Block */}
                    {step.output?.draft && (
                      <div className="mt-2 p-5 rounded-2xl bg-paper border border-rule shadow-sm text-ink relative group">
                        <div className="whitespace-pre-wrap leading-relaxed text-sm">{step.output.draft}</div>
                        
                        {step.status === "done" && onReviewDraft && (
                          <div className="mt-5 flex gap-3">
                            <button 
                              onClick={onReviewDraft}
                              className="flex items-center justify-center gap-2 flex-1 py-2.5 bg-ink text-paper hover:opacity-90 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all shadow-md shadow-ink/20"
                            >
                              Review & Refine Draft →
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Composer Area */}
      <div className="p-6 bg-surface/90 backdrop-blur-md border-t border-rule/50 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-paper border border-rule shadow-lg shadow-black/5 focus-within:border-ink/40 focus-within:ring-4 focus-within:ring-ink/5 rounded-3xl transition-all p-2 flex flex-col">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask the agents to refine, or log a new milestone..."
              className="w-full bg-transparent resize-none outline-none text-sm text-ink placeholder:text-mute/60 min-h-[60px] p-5 pb-3"
              rows={1}
            />
            
            <div className="flex items-center justify-between px-4 pb-3 pt-2">
              <div className="flex gap-2">
                <button 
                  onClick={() => setPlatforms(p => ({...p, linkedin: !p.linkedin}))}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] font-bold tracking-wide transition-colors ${platforms.linkedin ? 'bg-ink text-paper shadow-md' : 'bg-surface text-mute hover:text-ink'}`}
                >
                  <IconBrandLinkedin size={14} />
                  LinkedIn
                </button>
                <button 
                  onClick={() => setPlatforms(p => ({...p, x: !p.x}))}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] font-bold tracking-wide transition-colors ${platforms.x ? 'bg-ink text-paper shadow-md' : 'bg-surface text-mute hover:text-ink'}`}
                >
                  <IconBrandX size={14} />
                  X
                </button>
                <button 
                  onClick={() => setPlatforms(p => ({...p, reddit: !p.reddit}))}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] font-bold tracking-wide transition-colors ${platforms.reddit ? 'bg-ink text-paper shadow-md' : 'bg-surface text-mute hover:text-ink'}`}
                >
                  <IconBrandReddit size={14} />
                  Reddit
                </button>
                <button 
                  onClick={() => setPlatforms(p => ({...p, threads: !p.threads}))}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] font-bold tracking-wide transition-colors ${platforms.threads ? 'bg-ink text-paper shadow-md' : 'bg-surface text-mute hover:text-ink'}`}
                >
                  <IconMessageCircle size={14} />
                  Threads
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2.5 text-mute hover:text-ink hover:bg-surface rounded-full transition-colors">
                  <IconPhoto size={20} stroke={1.5} />
                </button>
                <button 
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="p-3 bg-ink text-paper hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed rounded-full transition-all ml-1 shadow-lg shadow-ink/20"
                >
                  <IconSend size={18} stroke={2} className="ml-0.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
