import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { Loader2, RefreshCw, Send } from "lucide-react";
import { GlassCard, GlowButton } from "../../utils/helpers";
import { leadsAPI, scraperAPI } from "../../services/api";
import { useDashboard } from "../../contexts/DashboardContext";

const TT = {
  contentStyle: {
    background: "#0D1235",
    border: "1px solid rgba(124,58,237,0.3)",
    borderRadius: 8,
    color: "white",
    fontSize: 13,
    fontWeight: 600,
  },
  labelStyle: { color: "white" },
  itemStyle: { color: "white" },
};

// Build last 8 month labels for chart
function buildMonthlyBuckets() {
  const buckets = [];
  const now = new Date();
  for (let i = 7; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      year:   d.getFullYear(),
      month:  d.getMonth(),
      label:  d.toLocaleString("default", { month: "short" }),
      leads:  0,
      audits: 0,
    });
  }
  return buckets;
}

export default function DashboardMainView({ setView }) {
  const [leads, setLeads]     = useState([]);
  const [audits, setAudits]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // Listen to global refreshKey — re-fetch whenever any audit completes
  const { refreshKey } = useDashboard();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Same APIs that LeadsView and AuditView use
      const [leadsRes, auditsRes] = await Promise.all([
        leadsAPI.getLeads(),
        scraperAPI.getUserAudits(),
      ]);

      setLeads(leadsRes.data.leads || []);
      setAudits(auditsRes.data.audits || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [refreshKey]); // re-run when audit completes

  // ── Derived stats from same data as other pages ────────────────────
  // Unique audited websites (same dedupe as AuditView shows)
  const uniqueSites = [...new Set(audits.map(a => (a.site || "").trim().toLowerCase()).filter(Boolean))];
  const totalUniqueAudits = uniqueSites.length;

  const hotLeads      = leads.filter(l => l.hasAudit && l.status === "Hot").length;
  const warmLeads     = leads.filter(l => l.hasAudit && l.status === "Warm").length;
  const coldLeads     = leads.filter(l => l.hasAudit && l.status === "Cold").length;
  const followUpsSent = leads.filter(l => l.followUpSent).length;

  // Avg audit scores from actual audits (unique sites — latest per site)
  const uniqueAuditMap = new Map();
  audits.forEach(a => {
    const key = (a.site || "").trim().toLowerCase();
    if (!key) return;
    const ex = uniqueAuditMap.get(key);
    if (!ex || new Date(a.createdAt) > new Date(ex.createdAt)) uniqueAuditMap.set(key, a);
  });
  const uniqueAudits = Array.from(uniqueAuditMap.values());

  let avgSpeed = 0, avgSeo = 0, avgMobile = 0, avgSecurity = 0, avgScore = 0;
  if (uniqueAudits.length > 0) {
    avgSpeed    = Math.round(uniqueAudits.reduce((s, a) => s + a.speed,    0) / uniqueAudits.length);
    avgSeo      = Math.round(uniqueAudits.reduce((s, a) => s + a.seo,      0) / uniqueAudits.length);
    avgMobile   = Math.round(uniqueAudits.reduce((s, a) => s + a.mobile,   0) / uniqueAudits.length);
    avgSecurity = Math.round(uniqueAudits.reduce((s, a) => s + a.security, 0) / uniqueAudits.length);
    avgScore    = Math.round((avgSpeed + avgSeo + avgMobile + avgSecurity) / 4);
  }

  // Monthly chart — count leads & unique audits per month
  const buckets = buildMonthlyBuckets();
  leads.forEach(l => {
    const d = new Date(l.createdAt);
    const b = buckets.find(b => b.year === d.getFullYear() && b.month === d.getMonth());
    if (b) b.leads++;
  });
  uniqueAudits.forEach(a => {
    const d = new Date(a.createdAt);
    const b = buckets.find(b => b.year === d.getFullYear() && b.month === d.getMonth());
    if (b) b.audits++;
  });

  // Status pie — colors EXACTLY match ScoreBadge in LeadsView/helpers.jsx
  // Hot ≥80 = green-400 (#4ade80), Warm 60-79 = yellow-400 (#facc15), Cold <60 = red-400 (#f87171)
  const statusDistribution = [
    { name: "Hot",  value: hotLeads,  color: "#4ade80" },  // green-400
    { name: "Warm", value: warmLeads, color: "#facc15" },  // yellow-400
    { name: "Cold", value: coldLeads, color: "#f87171" },  // red-400
  ];

  // Audit score breakdown
  const auditScoreBreakdown = [
    { label: "Speed",    score: avgSpeed,    color: "#7C3AED" },
    { label: "SEO",      score: avgSeo,      color: "#06B6D4" },
    { label: "Mobile",   score: avgMobile,   color: "#10B981" },
    { label: "Security", score: avgSecurity, color: "#F59E0B" },
  ];

  // Top 5 scored leads that have audits (same filter as LeadsView)
  const topLeads = [...leads]
    .filter(l => l.hasAudit && l.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const hasData = leads.length > 0 || audits.length > 0;

  // ── Loading ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-white/40">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          <span className="text-sm">Loading…</span>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
            Dashboard
          </h1>
          <p className="text-sm text-white/40 mt-0.5">
            {leads.length} total leads · {totalUniqueAudits} unique audits
          </p>
        </div>
        <div className="flex gap-2">
          <GlowButton variant="secondary" onClick={fetchData}>
            <RefreshCw className="w-4 h-4" /> Refresh
          </GlowButton>
          <GlowButton variant="secondary" onClick={() => setView("scraper")}>
            <RefreshCw className="w-4 h-4" /> Find New Leads
          </GlowButton>
          <GlowButton onClick={() => setView("outreach")}>
            <Send className="w-4 h-4" /> New Campaign
          </GlowButton>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      {!hasData ? (
        <GlassCard className="p-12 text-center">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-white/60 font-medium">No data yet</p>
          <p className="text-white/30 text-sm mt-1">Scrape leads and run audits to see your dashboard here.</p>
        </GlassCard>
      ) : (
        <>
          {/* ── KPI Cards ─────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Leads",      value: leads.length,     color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
              { label: "Audits Completed", value: totalUniqueAudits, color: "text-cyan-400",   bg: "bg-cyan-500/10 border-cyan-500/20" },
              // Hot = green (same as ScoreBadge in LeadsView)
              { label: "Hot Leads",        value: hotLeads,          color: "text-green-400",  bg: "bg-green-500/10 border-green-500/20" },
              { label: "Follow-ups Sent",  value: followUpsSent,     color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-2xl border p-5 ${item.bg}`}
              >
                <div className={`text-3xl font-bold font-mono ${item.color}`}>{item.value}</div>
                <div className="text-sm text-white/50 mt-1">{item.label}</div>
              </motion.div>
            ))}
          </div>

          {/* ── Charts Row 1 ──────────────────────────────────────── */}
          <div className="grid lg:grid-cols-2 gap-6">
            <GlassCard className="p-5">
              <h2 className="font-semibold text-white mb-4">Leads Found Per Month</h2>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={buckets}>
                  <defs>
                    <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#7C3AED" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="label" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip {...TT} formatter={(v) => [v, "Leads"]} />
                  <Area type="monotone" dataKey="leads" stroke="#7C3AED" strokeWidth={2} fill="url(#aGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </GlassCard>

            <GlassCard className="p-5">
              <h2 className="font-semibold text-white mb-4">Unique Sites Audited Per Month</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={buckets}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="label" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip {...TT} formatter={(v) => [v, "Audits"]} />
                  <Bar dataKey="audits" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>

          {/* ── Charts Row 2 ──────────────────────────────────────── */}
          <div className="grid lg:grid-cols-3 gap-6">

            {/* Lead Status Pie */}
            <GlassCard className="p-5">
              <h2 className="font-semibold text-white mb-4">Lead Status Distribution</h2>
              {statusDistribution.every(s => s.value === 0) ? (
                <div className="flex items-center justify-center h-40 text-white/20 text-sm">No audited leads yet</div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={statusDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                        {statusDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "#0D1235",
                          border: "1px solid rgba(124,58,237,0.3)",
                          borderRadius: 8,
                          color: "white",
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                        labelStyle={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}
                        itemStyle={{ color: "white" }}
                        formatter={(value, name) => [
                          <span style={{ color: "white", fontWeight: 700 }}>{value} leads</span>,
                          <span style={{
                            color: name === "Hot" ? "#4ade80" : name === "Warm" ? "#facc15" : "#f87171",
                            fontWeight: 600,
                          }}>{name}</span>
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-2">
                    {statusDistribution.map(s => (
                      <div key={s.name} className="flex items-center gap-1.5 text-xs text-white/60">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                        {s.name} ({s.value})
                      </div>
                    ))}
                  </div>
                </>
              )}
            </GlassCard>

            {/* Avg Audit Scores */}
            <GlassCard className="p-5">
              <h2 className="font-semibold text-white mb-4">Avg Audit Scores</h2>
              {uniqueAudits.length === 0 ? (
                <div className="flex items-center justify-center h-40 text-white/20 text-sm">No audits yet</div>
              ) : (
                <div className="space-y-4 mt-2">
                  {auditScoreBreakdown.map(item => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-white/60">{item.label}</span>
                        <span className="font-mono font-bold" style={{ color: item.color }}>{item.score}/100</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-2">
                        <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${item.score}%`, background: item.color }} />
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-white/40">Overall Average</span>
                    <span className="font-mono font-bold text-white">{avgScore}/100</span>
                  </div>
                </div>
              )}
            </GlassCard>

            {/* Top Scored Leads */}
            <GlassCard className="p-5">
              <h2 className="font-semibold text-white mb-4">Top Scored Leads</h2>
              {topLeads.length === 0 ? (
                <div className="flex items-center justify-center h-40 text-white/20 text-sm">No scored leads yet</div>
              ) : (
                <div className="space-y-2.5">
                  {topLeads.map((lead, i) => (
                    <div key={lead._id} className="flex items-center gap-3">
                      <span className="text-xs text-white/20 w-4 font-mono">#{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-white truncate">{lead.name}</div>
                        <div className="text-xs text-white/30 truncate">{lead.type}</div>
                      </div>
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full border ${
                        lead.score >= 80 ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : lead.score >= 60 ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        : "bg-red-500/20 text-red-400 border-red-500/30"
                      }`}>{lead.score}</span>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>


        </>
      )}
    </div>
  );
}
