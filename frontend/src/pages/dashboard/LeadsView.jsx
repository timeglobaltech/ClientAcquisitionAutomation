
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Filter, CheckCircle, Globe, Calendar, Clock, Mail, MessageCircle } from "lucide-react";
import { cn, GlowButton, GlassCard, ScoreBadge } from "../../utils/helpers";

import { scraperAPI, leadsAPI } from "../../services/api";

export default function LeadsView({ setView }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [finding, setFinding] = useState(false);
  const [found, setFound] = useState(false);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await leadsAPI.getLeads();
        setLeads(response.data.leads);
      } catch (err) {
        console.error("Failed to fetch leads:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const handleFind = async () => {
    console.log("handleFind called!");
    setFinding(true);
    setFound(false);
    try {
      // Get scraped leads (isInLeads: false)
      const scrapedResponse = await leadsAPI.getScrapedLeads();
      const scrapedLeads = scrapedResponse.data.leads;
      
      if (scrapedLeads.length === 0) {
        alert("No scraped leads available! Please scrape some leads first from the Scraper page.");
        setFinding(false);
        return;
      }

      // Take up to 10 leads
      const leadsToMove = scrapedLeads.slice(0, 10).map(lead => lead._id);
      
      // Move them to active leads
      await leadsAPI.moveToLeads(leadsToMove);
      
      // Refresh the leads list
      const response = await leadsAPI.getLeads();
      setLeads(response.data.leads);
      
      setFinding(false);
      setFound(true);
      setTimeout(() => setFound(false), 3000);
    } catch (error) {
      console.error("Error finding leads:", error);
      setFinding(false);
    }
  };
  
  const filtered = filter === "All" ? leads : leads.filter(l => l.status === filter);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>Leads</h1>
          <p className="text-sm text-white/40 mt-0.5">Your qualified leads ready for outreach</p>
        </div>
        <GlowButton onClick={() => { console.log("✅ LeadsView: Find New Leads button clicked!"); handleFind(); }} disabled={finding}>
          {finding ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2" style={{ animation: "spin 0.8s linear infinite" }} /> : <Search className="w-4 h-4 mr-2" />}
          {finding ? "Scraping..." : "Find New Leads"}
        </GlowButton>
      </div>
      <AnimatePresence>
        {found && <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400"><CheckCircle className="w-5 h-5" />New leads found and added to list!</motion.div>}
      </AnimatePresence>
      <div className="flex gap-2 flex-wrap">
        {["All", "Hot", "Warm", "Cold"].map((f) => (<button key={f} onClick={() => setFilter(f)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all", filter === f ? "bg-purple-500/20 text-purple-400 border border-purple-500/40" : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70")}>{f}</button>))}
      </div>
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/5">
              <tr>
                {["Business", "Type", "Location", "Score", "Response", "Meeting", "Follow-Up", "Actions"].map((h) => <th key={h} className="px-4 py-3 text-left text-xs text-white/40 font-medium">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead, i) => (
                <motion.tr key={lead.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-purple-400" />
                      <div className="font-medium text-white">{lead.name}</div>
                    </div>
                    <div className="text-xs text-white/40 mt-0.5">{lead.email}</div>
                  </td>
                  <td className="px-4 py-3 text-white/60">{lead.type}</td>
                  <td className="px-4 py-3 text-white/40 text-xs">{lead.location}</td>
                  <td className="px-4 py-3"><ScoreBadge score={lead.score} /></td>
                  <td className="px-4 py-3">
                    {lead.response ? <span className="text-xs text-green-400 flex items-center gap-1"><MessageCircle className="w-3 h-3" />Responded</span> : <span className="text-xs text-white/30">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    {lead.meetingBooked ? <span className="text-xs text-cyan-400 flex items-center gap-1"><Calendar className="w-3 h-3" />Booked</span> : <span className="text-xs text-white/30">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    {lead.followUpSent ? <span className="text-xs text-orange-400 flex items-center gap-1"><Clock className="w-3 h-3" />Sent</span> : <span className="text-xs text-white/30">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button onClick={() => setView("audit")} className="text-xs px-2 py-1 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-colors">Audit</button>
                      <button onClick={() => setView("outreach")} className="text-xs px-2 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors">Email</button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
