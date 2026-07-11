import React from "react";
import type { DispatchRead, Project as ApiProject } from "../../../api";
import { IconGitCommit, IconHistory, IconChevronDown, IconBrandGithub, IconActivity } from "@tabler/icons-react";

interface SignalHubProps {
  currentProject: ApiProject | null;
  projects: ApiProject[];
  dispatches: DispatchRead[];
  onSelectProject: (idx: number) => void;
  onSelectDispatch: (d: DispatchRead) => void;
  activeDispatchId?: string;
  onLogNew: (milestone?: string) => void;
}

export function SignalHub({
  currentProject,
  projects,
  dispatches,
  onSelectProject,
  onSelectDispatch,
  activeDispatchId,
  onLogNew
}: SignalHubProps) {
  const recentCommits = [
    { id: "c1", message: "feat: implemented semantic search using pgvector", score: 8, time: "2h ago", hash: "a3f9b2" },
    { id: "c2", message: "fix: query response times optimized", score: 6, time: "5h ago", hash: "c7d1e4" },
    { id: "c3", message: "chore: update dependencies", score: 2, time: "1d ago", hash: "9f4a81" },
  ];

  return (
    <div className="flex flex-col h-full border-r border-surface bg-paper">
      
      {/* Header / Project Selector */}
      <div className="p-8 border-b border-surface bg-surface/10">
        <div className="text-[10px] font-bold text-mute uppercase tracking-widest mb-3 flex items-center gap-2">
          <IconActivity size={14} className="text-emerald-500" />
          Active Workspace
        </div>
        <div className="relative group">
          <select 
            className="w-full appearance-none bg-surface border border-rule/50 hover:border-ink/30 rounded-xl text-ink font-bold text-sm px-4 py-3 outline-none cursor-pointer transition-all shadow-sm"
            value={currentProject?.id || ""}
            onChange={(e) => {
              const idx = projects.findIndex(p => p.id === e.target.value);
              if (idx !== -1) onSelectProject(idx);
            }}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-mute">
            <IconChevronDown size={16} />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        
        {/* Recent Commits */}
        <div className="p-8 border-b border-surface relative overflow-hidden">
          {/* Subtle gradient background for the "AI is watching" feel */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex items-center justify-between mb-5 relative z-10">
            <h3 className="text-[11px] font-bold text-ink tracking-widest uppercase flex items-center gap-2">
              <IconBrandGithub size={16} />
              GitHub Signals
            </h3>
            <div className="text-[10px] text-mute font-medium px-2 py-0.5 bg-surface rounded-full border border-rule/50">Live</div>
          </div>

          <div className="flex flex-col gap-3 relative z-10">
            {recentCommits.map(commit => (
              <div key={commit.id} className="p-4 rounded-2xl bg-surface/30 border border-rule/30 hover:bg-surface/80 hover:border-rule/80 transition-all group cursor-pointer">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-mute bg-paper px-1.5 py-0.5 rounded border border-rule/50">{commit.hash}</span>
                    <span className="text-[10px] font-medium text-mute/80">{commit.time}</span>
                  </div>
                  {commit.score >= 6 && (
                    <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest">
                      Score: {commit.score}
                    </span>
                  )}
                </div>
                <p className="text-[13px] font-medium text-ink/90 leading-relaxed">{commit.message}</p>
                
                {commit.score >= 6 && (
                  <div className="mt-4 hidden group-hover:block animate-in fade-in slide-in-from-top-1">
                    <button 
                      onClick={() => onLogNew(commit.message)} 
                      className="w-full text-[10px] font-bold text-paper bg-ink hover:opacity-90 px-3 py-2 rounded-xl uppercase tracking-widest transition-all shadow-md shadow-ink/10"
                    >
                      Draft a post about this →
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* History section */}
        <div className="p-8">
          <h3 className="text-[11px] font-bold text-ink tracking-widest uppercase flex items-center gap-2 mb-5">
            <IconHistory size={16} />
            Dispatch Archive
          </h3>
          <div className="flex flex-col gap-2">
            {dispatches.length === 0 ? (
              <div className="text-center p-6 bg-surface/30 border border-dashed border-rule/50 rounded-2xl">
                <p className="text-xs font-medium text-mute">No dispatches yet.</p>
              </div>
            ) : (
              dispatches.map(d => (
                <button
                  key={d.id}
                  onClick={() => onSelectDispatch(d)}
                  className={`text-left p-4 rounded-2xl text-xs transition-all ${activeDispatchId === d.id ? 'bg-ink text-paper shadow-lg' : 'bg-surface/30 border border-transparent text-ink hover:bg-surface hover:border-rule/50'}`}
                >
                  <div className="line-clamp-2 mb-2 font-medium leading-relaxed">{d.body}</div>
                  <div className={`text-[10px] font-mono tracking-wide ${activeDispatchId === d.id ? 'text-paper/70' : 'text-mute'}`}>
                    {new Date(d.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
