
import { motion } from "motion/react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, Mail, Calendar, DollarSign, RefreshCw, Send, Bot, MessageSquare, Eye } from "lucide-react";
import { cn, StatCard, GlassCard, GlowButton, ScoreBadge } from "../../utils/helpers";
import { KANBAN_STAGES, KANBAN_CARDS, REVENUE_DATA, LEADS } from "../../data/constants";

export default function DashboardMainView({ setView }) {
  const kpis = [
    { label: "Leads This Week", value: "247", icon: Users, change: "+23% vs last week", color: "purple" },
    { label: "Email Open Rate", value: "61.4%", icon: Mail, change: "+8.2% vs last week", color: "cyan" },
    { label: "Meetings Booked", value: "23", icon: Calendar, change: "+5 vs last week", color: "green" },
    { label: "Pipeline Revenue", value: "$84.2K", icon: DollarSign, change: "+$12K vs last week", color: "orange" },
  ];
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>Dashboard</h1>
          <p className="text-sm text-white/40 mt-0.5">Welcome back, James. Your AI is working 24/7.</p>
        </div>
        <div className="flex gap-2">
          <GlowButton variant="secondary" onClick={() => { console.log("✅ DashboardMain: Find New Leads clicked!"); setView("leads"); }}><RefreshCw className="w-4 h-4" /> Find New Leads</GlowButton>
          <GlowButton onClick={() => { console.log("✅ DashboardMain: New Campaign clicked!"); setView("outreach"); }}><Send className="w-4 h-4" /> New Campaign</GlowButton>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <StatCard {...kpi} />
          </motion.div>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Revenue Pipeline</h2>
              <span className="text-xs text-white/40 font-mono">Last 8 months</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ background: "#0D1235", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 8, color: "white" }} />
                <Area type="monotone" dataKey="revenue" stroke="#7C3AED" strokeWidth={2} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Pipeline Board</h2>
              <GlowButton variant="ghost" onClick={() => setView("leads")} className="text-xs py-1 px-3">View All</GlowButton>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {KANBAN_STAGES.slice(0, 4).map(stage => (
                <div key={stage.id} className="shrink-0 w-44">
                  <div className={cn("flex items-center justify-between mb-2 px-2 py-1 rounded-lg text-xs font-semibold", stage.bg, stage.border, "border")}>
                    <span className={stage.color}>{stage.label}</span>
                    <span className="text-white/40">{stage.count}</span>
                  </div>
                  <div className="space-y-2">
                    {(KANBAN_CARDS[stage.id] || []).slice(0, 2).map((card, ci) => (
                      <div key={ci} className="bg-white/[0.03] border border-white/8 rounded-xl p-2.5 hover:border-purple-500/30 transition-colors cursor-pointer">
                        <div className="text-xs font-semibold text-white">{card.name}</div>
                        <div className="text-xs text-purple-400 font-mono mt-0.5">{card.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
        <div className="space-y-4">
          <GlassCard className="p-5 h-full flex flex-col" glow>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <h2 className="font-semibold text-white text-sm">AI Copilot</h2>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">Online</span>
            </div>
            <div className="flex-1 space-y-3 text-xs">
              <div className="bg-purple-500/10 rounded-xl p-3 border border-purple-500/20 text-white/80 leading-relaxed">
                🔥 <strong className="text-purple-300">Marco's Italian Kitchen</strong> opened your email 4x. Strike now — high intent!
              </div>
              <div className="bg-purple-500/10 rounded-xl p-3 border border-purple-500/20 text-white/80 leading-relaxed">
                📊 Your open rate jumped to <strong className="text-cyan-400">61.4%</strong> — best week ever. Keep Tuesday 10am sends.
              </div>
              <div className="bg-purple-500/10 rounded-xl p-3 border border-purple-500/20 text-white/80 leading-relaxed">
                💡 3 leads haven't been contacted in 48h. Want me to send follow-ups?
              </div>
            </div>
            <GlowButton onClick={() => setView("copilot")} className="w-full justify-center mt-4 text-xs py-2">
              <MessageSquare className="w-3.5 h-3.5" /> Open Full Copilot
            </GlowButton>
          </GlassCard>
        </div>
      </div>
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">Recent Leads</h2>
          <GlowButton variant="secondary" onClick={() => setView("leads")} className="text-xs py-1.5 px-3"><Eye className="w-3.5 h-3.5" /> View All</GlowButton>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {["Business", "Type", "Score", "Location", "Actions"].map(h => (
                  <th key={h} className="pb-3 text-left text-xs text-white/40 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LEADS.slice(0, 5).map((lead, i) => (
                <tr key={lead.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 font-medium text-white">{lead.name}</td>
                  <td className="py-3 text-white/40 text-xs">{lead.type}</td>
                  <td className="py-3"><ScoreBadge score={lead.score} /></td>
                  <td className="py-3 text-white/40 text-xs">{lead.location}</td>
                  <td className="py-3">
                    <div className="flex gap-1.5">
                      <button onClick={() => setView("audit")} className="text-xs px-2 py-1 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-colors">Audit</button>
                      <button onClick={() => setView("outreach")} className="text-xs px-2 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors">Email</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
