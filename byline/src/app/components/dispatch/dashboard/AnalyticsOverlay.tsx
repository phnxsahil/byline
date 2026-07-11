import React from "react";
import { IconTrendingUp, IconEye, IconThumbUp, IconMessageCircle, IconShare } from "@tabler/icons-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface AnalyticsOverlayProps {
  onClose: () => void;
}

export function AnalyticsOverlay({ onClose }: AnalyticsOverlayProps) {
  // Mock data for analytics
  const metrics = [
    { label: "Total Views", value: "124.5K", trend: "+12.5%", icon: IconEye, color: "text-blue-500" },
    { label: "Engagements", value: "8,240", trend: "+5.2%", icon: IconThumbUp, color: "text-emerald-500" },
    { label: "Replies", value: "342", trend: "+18.1%", icon: IconMessageCircle, color: "text-amber-500" },
    { label: "Reposts", value: "89", trend: "-2.4%", icon: IconShare, color: "text-purple-500" },
  ];

  const recentPosts = [
    { platform: "LinkedIn", title: "Shipped semantic search using pgvector...", views: "45K", likes: "1.2K", date: "2 days ago" },
    { platform: "X", title: "just shipped semantic search. the chunking...", views: "78K", likes: "6.8K", date: "2 days ago" },
    { platform: "Reddit", title: "How I solved vector search scaling issues...", views: "1.5K", likes: "240", date: "5 days ago" },
  ];

  const chartData = [
    { name: "Mon", views: 4000, engagements: 2400 },
    { name: "Tue", views: 3000, engagements: 1398 },
    { name: "Wed", views: 2000, engagements: 9800 },
    { name: "Thu", views: 2780, engagements: 3908 },
    { name: "Fri", views: 1890, engagements: 4800 },
    { name: "Sat", views: 2390, engagements: 3800 },
    { name: "Sun", views: 3490, engagements: 4300 },
  ];

  return (
    <div className="absolute inset-0 bg-paper/95 backdrop-blur-xl z-[60] animate-in fade-in duration-300 flex flex-col">
      <div className="p-8 border-b border-rule/50 flex justify-between items-center bg-surface/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-ink text-paper rounded-lg">
            <IconTrendingUp size={20} stroke={2} />
          </div>
          <div>
            <h2 className="text-lg font-display font-bold text-ink tracking-tight">Performance Analytics</h2>
            <p className="text-xs font-medium text-mute uppercase tracking-widest mt-1">Last 30 Days</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="px-5 py-2 bg-surface border border-rule/50 hover:bg-rule/30 text-ink rounded-lg text-[11px] font-bold uppercase tracking-widest transition-colors"
        >
          Close Analytics
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-10 max-w-6xl mx-auto w-full flex flex-col gap-10">
        
        {/* Top level metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {metrics.map((m, i) => (
            <div key={i} className="bg-surface/30 border border-rule/30 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 bg-paper rounded-xl shadow-sm border border-rule/50 ${m.color}`}>
                  <m.icon size={20} stroke={2} />
                </div>
                <div className={`text-[11px] font-bold px-2 py-1 rounded-full ${m.trend.startsWith('+') ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'}`}>
                  {m.trend}
                </div>
              </div>
              <div className="text-3xl font-display font-bold text-ink tracking-tight">{m.value}</div>
              <div className="text-xs font-medium text-mute mt-1 uppercase tracking-widest">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Chart Area */}
        <div className="bg-surface/30 border border-rule/30 rounded-3xl p-8 shadow-sm">
          <h3 className="text-[13px] font-bold text-ink uppercase tracking-widest mb-6">Views Over Time</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3FB950" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3FB950" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.1)" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} />
                <YAxis stroke="rgba(255,255,255,0.1)" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#131312", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}
                  itemStyle={{ color: "#EDEAE3" }}
                />
                <Area type="monotone" dataKey="views" stroke="#3FB950" fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tables Area */}
        <div className="bg-surface/30 border border-rule/30 rounded-3xl p-8 shadow-sm">
          <h3 className="text-[13px] font-bold text-ink uppercase tracking-widest mb-6">Top Performing Dispatches</h3>
          
          <div className="flex flex-col gap-4">
            {recentPosts.map((post, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-paper rounded-2xl border border-rule/50 hover:border-ink/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center font-bold text-ink text-xs uppercase border border-rule/50">
                    {post.platform[0]}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-ink mb-1">{post.title}</div>
                    <div className="text-[11px] font-medium text-mute tracking-wide">{post.platform} • {post.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-ink">{post.views}</span>
                    <span className="text-[10px] uppercase tracking-widest text-mute font-medium">Views</span>
                  </div>
                  <div className="flex flex-col items-end w-16">
                    <span className="text-sm font-bold text-ink">{post.likes}</span>
                    <span className="text-[10px] uppercase tracking-widest text-mute font-medium">Likes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
