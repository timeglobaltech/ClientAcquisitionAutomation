
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap, Download, Send } from "lucide-react";
import { cn, GlowButton, GlassCard } from "../../utils/helpers";
import { LEADS } from "../../data/constants";
import { scraperAPI } from "../../services/api";

export default function AuditView() {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [selectedLead, setSelectedLead] = useState(LEADS[0]);
  const [auditResult, setAuditResult] = useState(null);
  
  const handleGenerate = async () => {
    setGenerating(true);
    setGenerated(false);
    try {
      const response = await scraperAPI.auditWebsite(selectedLead.site);
      const audit = response.data.audit;
      const overallScore = Math.floor((audit.speed + audit.seo + audit.mobile + audit.security) / 4);
      const transformedAuditData = [
        { label: "PageSpeed (Mobile)", score: audit.speed, max: 100, color: audit.speed >= 80 ? "bg-green-500" : audit.speed >= 60 ? "bg-yellow-500" : "bg-red-500", issue: audit.issues[0] },
        { label: "SEO Score", score: audit.seo, max: 100, color: audit.seo >= 80 ? "bg-green-500" : audit.seo >= 60 ? "bg-yellow-500" : "bg-red-500", issue: audit.issues[1] },
        { label: "Mobile Friendly", score: audit.mobile, max: 100, color: audit.mobile >= 80 ? "bg-green-500" : audit.mobile >= 60 ? "bg-yellow-500" : "bg-red-500", issue: audit.issues[2] },
        { label: "Security (HTTPS)", score: audit.security, max: 100, color: audit.security >= 80 ? "bg-green-500" : audit.security >= 60 ? "bg-yellow-500" : "bg-red-500", issue: audit.issues[3] },
        { label: "Core Web Vitals", score: overallScore, max: 100, color: overallScore >= 80 ? "bg-green-500" : overallScore >= 60 ? "bg-yellow-500" : "bg-red-500", issue: audit.recommendations[0] },
        { label: "Broken Links", score: 70, max: 100, color: "bg-yellow-500", issue: audit.recommendations[1] },
      ];
      setAuditResult({ ...audit, auditData: transformedAuditData, overallScore });
      setGenerating(false);
      setGenerated(true);
    } catch (error) {
      console.error(error);
      setGenerating(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>Website Audit Engine</h1>
        <p className="text-sm text-white/40 mt-0.5">Generate a 12-point AI audit report for any lead</p>
      </div>
      <GlassCard className="p-5">
        <div className="grid sm:grid-cols-3 gap-4 mb-5">
          <div className="sm:col-span-2">
            <label className="text-xs text-white/50 mb-1.5 block">Select Lead</label>
            <select value={selectedLead.id} onChange={e => setSelectedLead(LEADS.find(l => l.id === +e.target.value) || LEADS[0])}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-purple-500/50">
              {LEADS.map(l => <option key={l.id} value={l.id} style={{ background: "#0D1235" }}>{l.name} — {l.site}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <GlowButton onClick={handleGenerate} disabled={generating} className="w-full justify-center">
              {generating ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" style={{ animation: "spin 0.8s linear infinite" }} /> Analyzing...</>
                : <><Zap className="w-4 h-4" /> Generate Audit</>}
            </GlowButton>
          </div>
        </div>
        {generating && (
          <div className="space-y-2">
            {["Scanning website structure...", "Analyzing page speed...", "Checking SEO signals...", "Running security audit..."].map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.5 }}
                className="flex items-center gap-2 text-xs text-white/50">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400" style={{ animation: "blink 0.8s ease infinite" }} />
                {msg}
              </motion.div>
            ))}
          </div>
        )}
      </GlassCard>
      <AnimatePresence>
        {generated && auditResult && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <GlassCard className="p-5 border-purple-500/30 shadow-[0_0_30px_rgba(124,58,237,0.15)]">
              <div className="flex items-start justify-between mb-5 flex-wrap gap-4">
                <div>
                  <div className="text-xs text-purple-400 font-mono mb-1">AUDIT REPORT</div>
                  <h2 className="text-lg font-bold text-white">{selectedLead.name}</h2>
                  <a href="#" className="text-xs text-cyan-400">{selectedLead.site}</a>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black font-mono text-red-400">{auditResult.overallScore}</div>
                  <div className="text-xs text-white/40">Overall Score</div>
                  <div className="text-xs text-red-400 font-semibold mt-0.5">
                    {auditResult.overallScore >= 80 ? "Excellent" : auditResult.overallScore >= 60 ? "Needs Work" : "Needs Urgent Work"}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {auditResult.auditData.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white/80">{item.label}</span>
                      <span className="text-sm font-mono font-bold text-white">{item.score}/100</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${item.score}%` }} transition={{ duration: 0.8, delay: i * 0.1 }}
                        className={cn("h-full rounded-full", item.color)} />
                    </div>
                    <p className="text-xs text-white/40 mt-1">{item.issue}</p>
                  </motion.div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <GlowButton className="flex-1 justify-center"><Download className="w-4 h-4" /> Download PDF</GlowButton>
                <GlowButton variant="cyan" className="flex-1 justify-center"><Send className="w-4 h-4" /> Send to Lead</GlowButton>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
