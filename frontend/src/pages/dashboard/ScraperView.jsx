import { useState, useEffect } from "react";
import { Search, Filter, Download, CheckCircle, Globe, MapPin, Phone, Mail, Check, Link2, RefreshCw, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GlowButton, GlassCard } from "../../utils/helpers";
import { scraperAPI, leadsAPI } from "../../services/api";

export default function ScraperView() {
  const [searchQuery, setSearchQuery] = useState("gym");
  const [location, setLocation] = useState("New York");
  const [isScraping, setIsScraping] = useState(false);
  const [isSendingToN8n, setIsSendingToN8n] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [allResults, setAllResults] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLoadSuccess, setShowLoadSuccess] = useState(false);
  const [showClearSuccess, setShowClearSuccess] = useState(false);
  const [dataSource, setDataSource] = useState('');
  const [addedLeadIds, setAddedLeadIds] = useState(new Set());
  const [webhookUrl, setWebhookUrl] = useState(() => {
    return localStorage.getItem('n8n_webhook_url') || '';
  });

  // Visible results: first 20 or all
  const results = showAll ? allResults : allResults.slice(0, 20);

  // Load saved leads from database
  const loadSavedLeads = async () => {
    setIsRefreshing(true);
    try {
      console.log("🔄 Loading saved leads from database...");
      const response = await leadsAPI.getScrapedLeads();
      console.log("✅ API response received:", response);

      const loadedLeads = response.data.leads || [];
      console.log("📋 Loaded leads:", loadedLeads);

      setAllResults(loadedLeads);

      // Update added lead IDs
      const newAddedIds = new Set();
      loadedLeads.forEach(lead => {
        if (lead.isInLeads) {
          newAddedIds.add(lead._id);
        }
      });
      setAddedLeadIds(newAddedIds);

      setShowLoadSuccess(true);
      setTimeout(() => setShowLoadSuccess(false), 3000);
    } catch (error) {
      console.error("❌ Error loading saved scraped leads:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Clear all saved leads
  const clearSavedLeads = async () => {
    if (!window.confirm("Are you sure you want to clear all saved scraped leads? This cannot be undone.")) {
      return;
    }
    setIsClearing(true);
    try {
      const response = await scraperAPI.clearSavedLeads();
      console.log("✅ Cleared leads:", response);
      setAllResults([]);
      setAddedLeadIds(new Set());
      setShowClearSuccess(true);
      setTimeout(() => setShowClearSuccess(false), 3000);
    } catch (error) {
      console.error("❌ Error clearing leads:", error);
      alert("Failed to clear leads: " + (error.message || "Unknown error"));
    } finally {
      setIsClearing(false);
    }
  };

  // Load saved leads on mount
  useEffect(() => {
    loadSavedLeads();
  }, []);

  // Save webhook URL to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('n8n_webhook_url', webhookUrl);
  }, [webhookUrl]);

  const addToLeads = async (lead) => {
    try {
      await leadsAPI.moveToLeads([lead._id || lead.id]);
      setAddedLeadIds(prev => new Set([...prev, lead._id || lead.id]));
    } catch (error) {
      console.error("Error adding lead:", error);
    }
  };

  const handleScrape = async () => {
    setIsScraping(true);
    setShowSuccess(false);
    setShowLoadSuccess(false);
    setShowAll(false);
    try {
      console.log("🚀 Starting scrape...");
      const response = await scraperAPI.scrapeLeads(searchQuery, location, webhookUrl);
      console.log("✅ Scrape successful:", response);
      setAllResults(response.data.leads);
      setDataSource(response.data.source);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error("❌ Error scraping:", error);
      alert("Scraping failed: " + (error.message || "Unknown error"));
    } finally {
      setIsScraping(false);
    }
  };

  const sendToN8n = async () => {
    if (!webhookUrl) {
      alert('Please enter an n8n webhook URL first!');
      return;
    }

    if (allResults.length === 0) {
      alert('No leads to send! Please scrape some leads first.');
      return;
    }

    setIsSendingToN8n(true);
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          location: location,
          leads: allResults,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        alert('Leads sent to n8n successfully!');
      } else {
        alert('Failed to send leads to n8n!');
      }
    } catch (error) {
      console.error("Error sending to n8n:", error);
      alert('Error sending leads to n8n: ' + error.message);
    } finally {
      setIsSendingToN8n(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
            Scraper Dashboard
          </h1>
          <p className="text-sm text-white/40 mt-0.5">
            Scrape leads from Google Maps, LinkedIn, and directories
          </p>
        </div>
      </div>

      {/* Info Box for Real Data Setup */}
      <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
        <h3 className="text-sm font-semibold mb-1">📊 How to get REAL Data:</h3>
        <ol className="text-xs space-y-1 text-amber-300/90">
          <li>1. Get a free API key from <a href="https://serpapi.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-200">serpapi.com</a></li>
          <li>2. Open the <code className="bg-black/30 px-1.5 py-0.5 rounded text-xs">backend/.env</code> file and add your SERP_API_KEY</li>
        </ol>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-semibold">{allResults.length} new leads scraped successfully from {dataSource}!</span>
          </motion.div>
        )}
        {showLoadSuccess && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-semibold">{allResults.length} saved leads loaded from database!</span>
          </motion.div>
        )}
        {showClearSuccess && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-semibold">All saved leads cleared successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <GlassCard className="p-6">
        <div className="grid md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-2">
            <label className="text-xs text-white/50 mb-2 block">Search Query (e.g., restaurant, gym, agency)</label>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-purple-500/50">
              <Search className="w-4 h-4 text-white/40" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., restaurants in New York"
                className="bg-transparent w-full text-white text-sm outline-none" />
            </div>
          </div>
          <div className="md:col-span-1">
            <label className="text-xs text-white/50 mb-2 block">Location</label>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-purple-500/50">
              <MapPin className="w-4 h-4 text-white/40" />
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                placeholder="City, State"
                className="bg-transparent w-full text-white text-sm outline-none" />
            </div>
          </div>
          <div className="flex items-end">
            <GlowButton onClick={handleScrape} disabled={isScraping} className="w-full justify-center">
              {isScraping ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Scraping...</>
              ) : (
                <><Search className="w-4 h-4" /> Start Scraping</>
              )}
            </GlowButton>
          </div>
        </div>

        <div className="mb-6 bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/30 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 3v4m-4-4v4M6 21v-4m4 4v-4M6 7h12a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>n8n INTEGRATION</h3>
              <p className="text-xs text-pink-300/80">Automate your lead outreach workflows</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-white/60 mb-2 block flex items-center gap-2">
                <Globe className="w-3.5 h-3.5" /> Webhook URL
              </label>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-pink-500/50">
                <Link2 className="w-4 h-4 text-pink-400/70" />
                <input type="url" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://your-n8n-domain.com/webhook-test/"
                  className="bg-transparent w-full text-white text-sm outline-none placeholder:text-white/20" />
              </div>
            </div>

            <button
              onClick={sendToN8n}
              disabled={isSendingToN8n || !webhookUrl || allResults.length === 0}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500/90 to-purple-500/90 hover:from-pink-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 border border-pink-500/50"
            >
              {isSendingToN8n ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending to n8n...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                  Send All to n8n
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          <GlowButton variant="ghost" className="text-xs py-1.5 px-3">
            <Filter className="w-3.5 h-3.5 mr-1.5" /> Filter Results
          </GlowButton>
          <GlowButton variant="ghost" className="text-xs py-1.5 px-3">
            <Download className="w-3.5 h-3.5 mr-1.5" /> Export to CSV
          </GlowButton>
          <GlowButton
            variant="ghost"
            className="text-xs py-1.5 px-3"
            onClick={loadSavedLeads}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Saved Leads'}
          </GlowButton>
          <GlowButton
            variant="ghost"
            className="text-xs py-1.5 px-3 text-red-400 border-red-500/20"
            onClick={clearSavedLeads}
            disabled={isClearing}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            {isClearing ? 'Clearing...' : 'Clear All Saved Leads'}
          </GlowButton>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[1100px]">
            <thead>
              <tr className="border-b border-white/8">
                {["Business Name", "Type", "Location", "Phone", "Email", "Rating", "Actions"].map((header, i) => (
                  <th
                    key={i}
                    className={`pb-4 text-left text-xs text-white/40 font-medium whitespace-nowrap
                      ${i === 0 ? "w-[28%]" : ""}
                      ${i === 1 ? "w-[10%]" : ""}
                      ${i === 2 ? "w-[12%]" : ""}
                      ${i === 3 ? "w-[14%]" : ""}
                      ${i === 4 ? "w-[18%]" : ""}
                      ${i === 5 ? "w-[8%]" : ""}
                      ${i === 6 ? "w-[10%] text-right" : ""}`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.length > 0 ? (
                results.map((lead, i) => (
                  <motion.tr
                    key={lead._id || lead.id || `lead-${i}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/5 hover:bg-purple-500/5 transition-colors group"
                  >
                    <td className="py-4 font-semibold text-white flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-purple-400" /> {lead.name}
                    </td>
                    <td className="py-4 text-white/60">{lead.type}</td>
                    <td className="py-4 text-white/60 text-sm">{lead.location}</td>
                    <td className="py-4 text-white/70 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                        {lead.phone}
                      </div>
                    </td>
                    <td className="py-4 text-white/70 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                        {lead.email}
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-yellow-400 font-semibold">★ {lead.rating} ({lead.reviews})</span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button className="text-xs px-4 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-colors">
                          View
                        </button>
                        <button
                          onClick={() => addToLeads(lead)}
                          disabled={addedLeadIds.has(lead._id || lead.id)}
                          className={`text-xs px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1.5
                            ${addedLeadIds.has(lead._id || lead.id)
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                              : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20'}`}
                        >
                          {addedLeadIds.has(lead._id || lead.id) ? (
                            <><Check className="w-3.5 h-3.5" /> Added</>
                          ) : (
                            <>Add to Leads</>
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-white/40 text-sm">
                    No scraped leads yet. Start scraping or click "Refresh Saved Leads"!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* View All Button */}
        {!showAll && allResults.length > 20 && (
          <div className="text-center mt-6">
            <GlowButton onClick={() => setShowAll(true)} className="justify-center">
              View All {allResults.length} Leads
            </GlowButton>
          </div>
        )}

        {/* Show Less Button */}
        {showAll && allResults.length > 20 && (
          <div className="text-center mt-6">
            <GlowButton variant="ghost" onClick={() => setShowAll(false)} className="justify-center">
              Show Less
            </GlowButton>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
