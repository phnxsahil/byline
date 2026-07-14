import React from "react";
import type { DraftRead, DispatchRead } from "../../../api";
import { IconX, IconBrandLinkedin, IconBrandX, IconBrandReddit, IconCheck, IconPencil } from "@tabler/icons-react";

interface DeskDrawerProps {
  drafts: DraftRead[];
  activeDispatch: DispatchRead | null;
  onUpdateDraft: (draftId: string, updatedBody: string, newStatus: string) => void;
  onClose: () => void;
}

export function DeskDrawer({ drafts, activeDispatch, onUpdateDraft, onClose }: DeskDrawerProps) {
  if (!activeDispatch) return null;

  return (
    <div className="flex flex-col h-full bg-paper border-l border-surface shadow-2xl shadow-black/50">
      {/* Header */}
      <div className="px-8 py-5 border-b border-surface flex justify-between items-center bg-surface/30 backdrop-blur-md">
        <div className="text-[12px] font-bold text-ink tracking-widest uppercase flex items-center gap-2">
          <IconPencil size={16} className="text-emerald-500" />
          The Desk
        </div>
        <button onClick={onClose} className="p-2 rounded-full text-mute hover:text-ink hover:bg-surface transition-colors">
          <IconX size={18} stroke={2} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-10">
        
        {/* Context / Dispatch Info */}
        <div className="flex flex-col gap-4 relative">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-bold text-mute uppercase tracking-widest">Active Dispatch Context</div>
            <span className="text-[9px] bg-surface border border-rule/50 text-ink px-3 py-1 rounded-full font-bold tracking-widest uppercase">
              {activeDispatch.angle.replace('_', ' ')}
            </span>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-surface to-transparent rounded-2xl opacity-50"></div>
            <p className="relative text-[13px] text-ink/90 leading-relaxed p-5 rounded-2xl border border-rule/30 font-medium">
              {activeDispatch.body}
            </p>
          </div>
        </div>

        {/* Drafts */}
        <div className="flex flex-col gap-6">
          <div className="text-[11px] font-bold text-ink tracking-widest uppercase flex items-center justify-between border-b border-surface pb-4">
            <span>Platform Drafts</span>
            <span className="text-[10px] bg-ink text-paper px-2.5 py-1 rounded-full">{drafts.length}</span>
          </div>

          {drafts.length === 0 ? (
            <div className="text-center p-12 text-mute text-sm bg-surface/20 rounded-3xl border border-dashed border-rule/50">
              No drafts generated yet. Run the agents to see results.
            </div>
          ) : (
            drafts.map(draft => {
              const Icon = draft.platform === "linkedin" ? IconBrandLinkedin :
                           draft.platform === "x" ? IconBrandX :
                           draft.platform === "reddit" ? IconBrandReddit : null;
              
              const isApproved = draft.status === "approved" || draft.status === "posted";

              return (
                <div key={draft.id} className={`rounded-3xl transition-all duration-300 relative overflow-hidden ${isApproved ? 'bg-surface border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/5' : 'bg-surface border border-rule/30 hover:border-rule shadow-md shadow-black/10'}`}>
                  
                  {/* Card Header */}
                  <div className="flex items-center justify-between px-5 py-4 bg-paper/50 border-b border-rule/10">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${isApproved ? 'bg-emerald-500 text-paper shadow-sm shadow-emerald-500/20' : 'bg-paper text-ink border border-rule/50'}`}>
                        {Icon && <Icon size={16} stroke={2} />}
                      </div>
                      <span className="text-[12px] font-bold tracking-widest text-ink uppercase">
                        {draft.platform}
                      </span>
                    </div>
                    {draft.critic_score && (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-mute font-bold uppercase tracking-widest">Score</span>
                        <div className={`text-[12px] font-mono font-bold px-2 py-0.5 rounded border ${
                          draft.critic_score >= 8 ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' : 
                          draft.critic_score >= 6 ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' : 
                          'text-red-500 bg-red-500/10 border-red-500/20'
                        }`}>
                          {draft.critic_score}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Critic Details */}
                  {(draft.voice_match_score || draft.critic_grade || draft.critic_note) && (
                    <div className="px-5 py-3 bg-surface/50 border-b border-rule/10 flex flex-col gap-2">
                      <div className="flex items-center gap-4">
                        {draft.voice_match_score && (
                           <div className="flex items-center gap-1.5">
                             <span className="text-[9px] text-mute font-bold uppercase tracking-widest">Voice Match</span>
                             <span className="text-[11px] font-mono font-bold text-ink">{draft.voice_match_score}/10</span>
                           </div>
                        )}
                        {draft.critic_grade && (
                           <div className="flex items-center gap-1.5">
                             <span className="text-[9px] text-mute font-bold uppercase tracking-widest">Grade</span>
                             <div className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                               draft.critic_grade === 'A' ? 'bg-emerald-500/10 text-emerald-500' :
                               draft.critic_grade === 'B' ? 'bg-amber-500/10 text-amber-500' :
                               draft.critic_grade === 'C' ? 'bg-orange-500/10 text-orange-500' :
                               'bg-red-500/10 text-red-500'
                             }`}>
                               {draft.critic_grade}
                             </div>
                           </div>
                        )}
                      </div>
                      {draft.critic_note && (
                        <p className="text-[11px] italic text-mute/80 font-medium">
                          &quot;{draft.critic_note}&quot;
                        </p>
                      )}
                    </div>
                  )}

                  {/* Card Body */}
                  <div className="p-2 relative">
                    <textarea 
                      className="w-full bg-transparent text-[13px] font-medium text-ink leading-relaxed resize-none outline-none min-h-[140px] p-5 placeholder:text-mute/50 focus:bg-paper/30 transition-colors rounded-xl"
                      value={draft.body}
                      onChange={(e) => onUpdateDraft(draft.id, e.target.value, draft.status)}
                      placeholder="Start typing..."
                    />
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 py-4 border-t border-rule/10 flex justify-between items-center bg-paper/50">
                    <div className="text-[11px] font-mono text-mute font-medium">
                      {draft.body.length} <span className="opacity-50">chars</span>
                    </div>
                    
                    <button 
                      onClick={() => onUpdateDraft(draft.id, draft.body, isApproved ? "draft" : "approved")}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all shadow-sm ${
                        isApproved 
                          ? "bg-emerald-500 text-paper hover:opacity-90 shadow-emerald-500/20" 
                          : "bg-ink text-paper hover:opacity-90 shadow-ink/20"
                      }`}
                    >
                      {isApproved ? (
                        <>
                          <IconCheck size={14} stroke={3} /> Approved
                        </>
                      ) : "Approve & Queue"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
