import React, { useState } from "react";
import { IconSettings, IconX, IconDatabase, IconKey, IconTerminal2 } from "@tabler/icons-react";

interface SettingsOverlayProps {
  onClose: () => void;
  apiConnected: boolean | null;
}

export function SettingsOverlay({ onClose, apiConnected }: SettingsOverlayProps) {
  const [activeTab, setActiveTab] = useState<"api" | "logs">("api");
  const [openAiKey, setOpenAiKey] = useState("");
  const [anthropicKey, setAnthropicKey] = useState("");

  return (
    <div className="absolute inset-0 bg-paper/95 backdrop-blur-xl z-[60] animate-in fade-in duration-300 flex items-center justify-center p-6">
      
      <div className="bg-surface border border-rule/50 rounded-3xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden shadow-2xl shadow-black/50">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-rule/20 flex justify-between items-center bg-paper/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-ink text-paper rounded-xl shadow-md shadow-ink/20">
              <IconSettings size={22} stroke={2} />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-ink tracking-tight">Workspace Settings</h2>
              <p className="text-[11px] font-medium text-mute uppercase tracking-widest mt-1">Configuration & Logs</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 bg-surface border border-rule/50 hover:bg-rule/30 text-ink rounded-full transition-colors"
          >
            <IconX size={20} stroke={2} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Sidebar */}
          <div className="w-64 border-r border-rule/20 bg-paper/30 p-6 flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab("api")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'api' ? 'bg-ink text-paper shadow-md' : 'text-mute hover:bg-surface hover:text-ink'}`}
            >
              <IconKey size={18} /> API & Connections
            </button>
            <button 
              onClick={() => setActiveTab("logs")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'logs' ? 'bg-ink text-paper shadow-md' : 'text-mute hover:bg-surface hover:text-ink'}`}
            >
              <IconTerminal2 size={18} /> Developer Logs
            </button>
          </div>

          {/* Main Panel */}
          <div className="flex-1 overflow-y-auto p-8 bg-surface/10">
            
            {activeTab === "api" && (
              <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-paper border border-rule/50 p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <IconDatabase className={apiConnected ? 'text-emerald-500' : 'text-amber-500'} size={24} />
                    <div>
                      <h3 className="text-sm font-bold text-ink">Backend Connection</h3>
                      <p className="text-[11px] text-mute uppercase tracking-widest mt-1">Status: {apiConnected ? 'Live' : 'Demo Mode'}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <label className="flex flex-col gap-2">
                      <span className="text-[11px] font-bold text-ink uppercase tracking-widest">FastAPI Endpoint</span>
                      <input 
                        type="text" 
                        value="http://localhost:8000" 
                        readOnly 
                        className="bg-surface border border-rule/50 rounded-lg px-4 py-3 text-sm text-mute font-mono outline-none"
                      />
                    </label>
                  </div>
                </div>

                <div className="bg-paper border border-rule/50 p-6 rounded-2xl">
                  <h3 className="text-sm font-bold text-ink mb-2">AI Providers & Models</h3>
                  <p className="text-xs text-mute mb-6 leading-relaxed">Provide your own API keys to power the Byline agents. Keys are stored locally.</p>
                  
                  <div className="flex flex-col gap-5">
                    <label className="flex flex-col gap-2">
                      <span className="text-[11px] font-bold text-ink uppercase tracking-widest">OpenAI API Key</span>
                      <input 
                        type="password" 
                        value={openAiKey}
                        onChange={(e) => setOpenAiKey(e.target.value)}
                        placeholder="sk-..."
                        className="bg-surface border border-rule/50 hover:border-rule focus:border-ink/50 focus:ring-1 focus:ring-ink/20 rounded-lg px-4 py-3 text-sm text-ink outline-none transition-all"
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-[11px] font-bold text-ink uppercase tracking-widest">Anthropic API Key</span>
                      <input 
                        type="password" 
                        value={anthropicKey}
                        onChange={(e) => setAnthropicKey(e.target.value)}
                        placeholder="sk-ant-..."
                        className="bg-surface border border-rule/50 hover:border-rule focus:border-ink/50 focus:ring-1 focus:ring-ink/20 rounded-lg px-4 py-3 text-sm text-ink outline-none transition-all"
                      />
                    </label>
                  </div>
                </div>

                <div className="bg-paper border border-rule/50 p-6 rounded-2xl">
                  <h3 className="text-sm font-bold text-ink mb-2">Platform Integrations</h3>
                  <p className="text-xs text-mute mb-6 leading-relaxed">Connect your accounts to enable automated posting directly from the dashboard.</p>
                  
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between p-4 border border-rule/30 rounded-xl bg-surface/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">in</div>
                        <div>
                          <div className="text-sm font-bold text-ink">LinkedIn</div>
                          <div className="text-[10px] text-mute uppercase tracking-widest">Not Connected</div>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-paper border border-rule hover:border-ink/20 rounded-lg text-[11px] font-bold uppercase tracking-widest text-ink transition-colors">
                        Connect
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-rule/30 rounded-xl bg-surface/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center font-bold text-lg">𝕏</div>
                        <div>
                          <div className="text-sm font-bold text-ink">X (Twitter)</div>
                          <div className="text-[10px] text-mute uppercase tracking-widest">Not Connected</div>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-paper border border-rule hover:border-ink/20 rounded-lg text-[11px] font-bold uppercase tracking-widest text-ink transition-colors">
                        Connect
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "logs" && (
              <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-[#0A0A0A] border border-rule/50 rounded-2xl flex-1 flex flex-col overflow-hidden">
                  <div className="px-4 py-3 bg-[#111] border-b border-rule/20 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                    <span className="ml-4 text-[11px] font-mono text-mute">agent_pipeline.log</span>
                  </div>
                  <div className="p-4 font-mono text-[11px] leading-loose text-emerald-400/80 overflow-y-auto">
                    <p>[2026-07-11 16:42:01] INFO: Initializing LangGraph state...</p>
                    <p>[2026-07-11 16:42:01] INFO: Strategist node active.</p>
                    <p>[2026-07-11 16:42:02] DEBUG: Anthropic API call for angle generation.</p>
                    <p>[2026-07-11 16:42:04] INFO: Selected platforms: ['linkedin', 'x']</p>
                    <p className="text-amber-400/80">[2026-07-11 16:42:05] WARN: Reddit skipped due to low technical depth in prompt.</p>
                    <p>[2026-07-11 16:42:08] INFO: LinkedIn draft complete. Sending to Critic...</p>
                    <p>[2026-07-11 16:42:10] INFO: Critic score: 8.5/10. Status: Approved.</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
