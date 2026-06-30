
import { motion } from "motion/react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp } from "lucide-react";
import { StatCard, GlassCard } from "../../utils/helpers";
import { REVENUE_DATA, OPEN_RATE_DATA } from "../../data/constants";

export default function AnalyticsView() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>Analytics</h1>
        <p className="text-sm text-white/40 mt-0.5">Full-funnel insights, revenue tracking, and performance metrics</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: "$211K", change: "+34%", color: "purple" },
          { label: "Leads Processed", value: "1,847", change: "+22%", color: "cyan" },
          { label: "Avg Close Rate", value: "14.2%", change: "+4%", color: "green" },
          { label: "ROI on AISA", value: "847%", change: "vs. manual", color: "orange" },
        ].map((s, i) => <StatCard key={i} icon={TrendingUp} {...s} />)}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard className="p-5">
          <h2 className="font-semibold text-white mb-4">Revenue Over Time</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}K`} />
              <Tooltip contentStyle={{ background: "#0D1235", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 8, color: "white" }} />
              <Area type="monotone" dataKey="revenue" stroke="#7C3AED" strokeWidth={2} fill="url(#aGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
        <GlassCard className="p-5">
          <h2 className="font-semibold text-white mb-4">Leads Found Per Month</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={REVENUE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0D1235", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 8, color: "white" }} />
              <Bar dataKey="leads" fill="#7C3AED" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
        <GlassCard className="p-5">
          <h2 className="font-semibold text-white mb-4">Email Open Rate by Day</h2>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={OPEN_RATE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0D1235", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 8, color: "white" }} />
              <Line type="monotone" dataKey="rate" stroke="#06B6D4" strokeWidth={2} dot={{ fill: "#06B6D4", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </div>
  );
}
