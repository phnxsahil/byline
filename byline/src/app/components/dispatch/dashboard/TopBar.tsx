import React from "react";
import type { Project as ApiProject } from "../../../api";
import { IconCommand, IconBolt, IconAlertCircle } from "@tabler/icons-react";
import Avatar from "boring-avatars";

interface TopBarProps {
  currentProject: ApiProject | null;
  onSearchClick: () => void;
  onLogNew: () => void;
  onLandingClick: () => void;
  backendError?: string | null;
  apiConnected?: boolean | null;
  onOpenSettings?: () => void;
  onOpenAnalytics?: () => void;
}

export function TopBar({
  currentProject,
  onSearchClick,
  onLogNew,
  onLandingClick,
  backendError,
  apiConnected,
  onOpenSettings,
  onOpenAnalytics
}: TopBarProps) {
  return (
    <div className="flex flex-col flex-shrink-0 z-50">
      {/* Main TopBar */}
      <div className="h-[60px] bg-paper border-b border-surface flex items-center px-6 justify-between relative">
        
        {/* Left: Logo & Navigation */}
        <div className="flex items-center gap-8">
          <button 
            onClick={onLandingClick}
            className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-ink hover:opacity-80 transition-opacity"
          >
            <span className="font-mono text-stamp font-medium">[ b ]</span> byline
          </button>

          <div className="hidden md:flex items-center gap-6 text-[11px] font-medium text-mute tracking-widest uppercase">
            <button className="hover:text-ink transition-colors">Dashboard</button>
            <button onClick={onOpenAnalytics} className="hover:text-ink transition-colors">Analytics</button>
            <button onClick={onOpenSettings} className="hover:text-ink transition-colors">Settings</button>
          </div>
        </div>

        {/* Center: Search (Absolute centered on large screens) */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2">
          <button
            onClick={onSearchClick}
            className="flex items-center justify-between w-[340px] h-[36px] bg-surface/50 border border-rule/50 rounded-lg px-3 text-xs text-mute hover:bg-surface transition-colors focus:outline-none focus:ring-1 focus:ring-mute"
          >
            <span className="opacity-70">Search milestones, docs, commands...</span>
            <kbd className="flex items-center gap-1 bg-paper border border-rule rounded px-1.5 py-0.5 text-[10px] font-mono text-mute">
              <IconCommand size={10} /> K
            </kbd>
          </button>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-5">
          <div className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-widest text-mute font-medium group relative">
            {backendError ? (
              <IconAlertCircle size={14} className="text-amber-500" />
            ) : (
              <span className={`w-2 h-2 rounded-full ${apiConnected ? 'bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500/80'}`}></span>
            )}
            {apiConnected ? 'Live' : 'Demo'}
            
            {/* Tooltip for backend error */}
            {backendError && (
              <div className="absolute top-full right-0 mt-2 w-64 p-2 bg-surface border border-rule rounded-md text-[10px] text-amber-500 normal-case hidden group-hover:block z-50">
                {backendError}
              </div>
            )}
          </div>

          <button
            onClick={onLogNew}
            className="flex items-center gap-2 h-[34px] px-4 bg-ink text-paper rounded-md text-[11px] font-semibold tracking-wider uppercase hover:opacity-90 transition-opacity"
          >
            <IconBolt size={14} />
            Log New
          </button>

          <div className="w-[34px] h-[34px] rounded-full overflow-hidden flex-shrink-0 cursor-pointer border border-rule/50 hover:border-rule transition-colors">
            <Avatar name="Sahil" variant="marble" colors={["#E8593C", "#2C2C2A", "#F0EDE8", "#C44A2E", "#1F1F22"]} size={34} />
          </div>
        </div>

      </div>
    </div>
  );
}
