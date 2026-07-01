import { useState, useEffect } from "react";
import { Folder, FileText, Download, CheckCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { scraperAPI } from "../../services/api";
import { GlowButton, GlassCard } from "../../utils/helpers";
import { useDashboard } from "../../contexts/DashboardContext";

export default function AuditView() {
  const [loading, setLoading] = useState(true);
  const [groupedLeads, setGroupedLeads] = useState({});
  const [selectedType, setSelectedType] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [auditLoading, setAuditLoading] = useState(false);

  const { refreshDashboard } = useDashboard();

  // Load grouped leads on mount
  useEffect(() => {
    loadGroupedLeads();
  }, []);

  const loadGroupedLeads = async () => {
    try {
      const res = await scraperAPI.getGroupedAudits();
      setGroupedLeads(res.data.groupedLeads);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load grouped leads", err);
      setLoading(false);
    }
  };

  const checkAndSetAudit = async (lead) => {
    if (!lead.site || lead.site === "N/A") {
      setSelectedLead(lead);
      setSelectedAudit(null);
      return;
    }
    setAuditLoading(true);
    try {
      const res = await scraperAPI.getAuditByLead(lead._id);
      if (res.data.exists) {
        // Audit already exists, show it immediately
        setSelectedAudit(res.data.audit);
      } else {
        // No audit exists yet, just show the lead without audit
        setSelectedAudit(null);
      }
      setSelectedLead(lead);
    } catch (err) {
      console.error("Failed to check audit", err);
      setSelectedLead(lead);
      setSelectedAudit(null);
    } finally {
      setAuditLoading(false);
    }
  };

  const handleRunAudit = async (lead, forceRegenerate = false) => {
    if (!lead.site || lead.site === "N/A") {
      alert("This lead has no website to audit!");
      return;
    }
    setAuditLoading(true);
    try {
      const res = await scraperAPI.auditWebsite(lead.site, lead._id, forceRegenerate);
      const audit = res.data.audit;
      setSelectedAudit(audit);

      // Update lead score locally so Leads page reflects immediately
      const overallScore = Math.round((audit.speed + audit.seo + audit.mobile + audit.security) / 4);
      const newStatus    = overallScore >= 80 ? "Hot" : overallScore >= 60 ? "Warm" : "Cold";
      setSelectedLead(prev => ({ ...prev, score: overallScore, status: newStatus, hasAudit: true }));

      // Update the lead card in the folder view too
      setGroupedLeads(prev => {
        const updated = { ...prev };
        if (updated[selectedType]) {
          updated[selectedType] = updated[selectedType].map(l =>
            l._id === lead._id ? { ...l, score: overallScore, status: newStatus, hasAudit: true } : l
          );
        }
        return updated;
      });

      // Trigger dashboard re-fetch automatically — no manual refresh needed
      refreshDashboard();
    } catch (err) {
      console.error("Failed to run audit", err);
      alert("Failed to run audit!");
    } finally {
      setAuditLoading(false);
    }
  };

  // PDF download using jsPDF-like approach (simple one!)
  const downloadPDF = (audit, lead) => {
    const content = `
WEBSITE AUDIT REPORT
=====================
Business: ${lead.name}
Website: ${audit.site}
Date: ${new Date(audit.createdAt).toLocaleDateString()}

SCORES
======
Speed: ${audit.speed}/100
SEO: ${audit.seo}/100
Mobile: ${audit.mobile}/100
Security: ${audit.security}/100

ISSUES FOUND
============
${audit.issues.map((issue, i) => `${i+1}. ${issue}`).join('\n')}

RECOMMENDATIONS
===============
${audit.recommendations.map((rec, i) => `${i+1}. ${rec}`).join('\n')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lead.name.replace(/\s+/g, '_')}_Audit_Report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Folder view (default)
  if (!selectedType && !selectedLead && !selectedAudit) {
    const types = Object.keys(groupedLeads);
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-white">Audit Dashboard</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {types.length === 0 ? (
            <p className="text-white/50 col-span-full text-center py-12">No leads found! Scrape some first!</p>
          ) : (
            types.map((type) => (
              <GlassCard key={type} className="p-6 cursor-pointer hover:border-purple-500/50 transition-all" onClick={() => setSelectedType(type)}>
                <Folder className="w-12 h-12 text-purple-400 mb-3" />
                <h3 className="text-lg font-semibold text-white">{type}</h3>
                <p className="text-sm text-white/50">{groupedLeads[type].length} businesses</p>
              </GlassCard>
            ))
          )}
        </div>
      </div>
    );
  }

  // Leads in folder view
  if (selectedType && !selectedLead && !selectedAudit) {
    const leads = groupedLeads[selectedType] || [];
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <GlowButton variant="ghost" onClick={() => setSelectedType(null)} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </GlowButton>
          <h1 className="text-2xl font-bold text-white">{selectedType}</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {leads.map((lead) => (
            <GlassCard key={lead._id} className="p-6 cursor-pointer hover:border-purple-500/50 transition-all" onClick={() => checkAndSetAudit(lead)}>
              <FileText className="w-10 h-10 text-purple-400 mb-2" />
              <h3 className="text-lg font-semibold text-white truncate">{lead.name}</h3>
              <p className="text-sm text-white/50 truncate">{lead.location}</p>
              <p className="text-xs text-white/30 truncate mt-1">{lead.site || "No website"}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    );
  }

  // Single lead + audit view
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <GlowButton variant="ghost" onClick={() => {
          if (selectedAudit) {
            setSelectedAudit(null);
          } else {
            setSelectedLead(null);
          }
        }} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </GlowButton>
        <div>
          <h1 className="text-2xl font-bold text-white">{selectedLead.name}</h1>
          <p className="text-sm text-white/50">{selectedLead.location}</p>
        </div>
      </div>

      {auditLoading ? (
        <GlassCard className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-white">Loading...</h3>
        </GlassCard>
      ) : !selectedAudit ? (
        <GlassCard className="p-8 text-center">
          <FileText className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Ready to Audit</h3>
          <p className="text-white/50 mb-6">Website: {selectedLead.site || "N/A"}</p>
          <GlowButton onClick={() => handleRunAudit(selectedLead)} disabled={auditLoading || !selectedLead.site || selectedLead.site === "N/A"}>
            {auditLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Running Audit...
              </>
            ) : (
              "Run Website Audit"
            )}
          </GlowButton>
        </GlassCard>
      ) : (
        <div className="space-y-6">
          <GlassCard className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">Audit Results</h3>
                <p className="text-sm text-white/50">Generated {new Date(selectedAudit.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <GlowButton variant="ghost" onClick={() => handleRunAudit(selectedLead, true)} disabled={auditLoading} className="flex items-center gap-2">
                  <RefreshCw className={`w-4 h-4 ${auditLoading ? 'animate-spin' : ''}`} />
                  Regenerate
                </GlowButton>
                <GlowButton onClick={() => downloadPDF(selectedAudit, selectedLead)} className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Report
                </GlowButton>
              </div>
            </div>

            {/* Scores */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Speed", value: selectedAudit.speed, color: "from-blue-500 to-cyan-500" },
                { label: "SEO", value: selectedAudit.seo, color: "from-green-500 to-emerald-500" },
                { label: "Mobile", value: selectedAudit.mobile, color: "from-purple-500 to-violet-500" },
                { label: "Security", value: selectedAudit.security, color: "from-orange-500 to-red-500" },
              ].map((score) => (
                <div key={score.label} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-white/50 text-sm mb-2">{score.label}</p>
                  <div className="text-3xl font-bold text-white">{score.value}<span className="text-lg text-white/50">/100</span></div>
                  <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${score.color}`} style={{ width: `${score.value}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Issues */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-amber-400" />
                Issues Found
              </h4>
              <div className="space-y-2">
                {selectedAudit.issues.map((issue, i) => (
                  <div key={i} className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm">
                    {issue}
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-400" />
                Recommendations
              </h4>
              <div className="space-y-2">
                {selectedAudit.recommendations.map((rec, i) => (
                  <div key={i} className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 text-sm">
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
