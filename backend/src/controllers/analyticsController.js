const Lead = require('../models/Lead');
const Audit = require('../models/Audit');

// Build last N month buckets for charts
function buildMonthlyBuckets(months = 8) {
  const buckets = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      year:  d.getFullYear(),
      month: d.getMonth(),
      label: d.toLocaleString('default', { month: 'short' }),
      leads:  0,
      audits: 0,
    });
  }
  return buckets;
}

// @desc    Get analytics stats
// @route   GET /api/analytics/stats
// @access  Private
exports.getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [allLeads, activeLeads, allAudits] = await Promise.all([
      Lead.find({ user: userId }),
      Lead.find({ user: userId, isInLeads: true }),
      Audit.find({ user: userId }),
    ]);

    // Deduplicate audits — one entry per unique website (latest wins)
    const uniqueSiteMap = new Map();
    allAudits.forEach(audit => {
      const key = (audit.site || '').trim().toLowerCase();
      if (!key) return;
      const existing = uniqueSiteMap.get(key);
      if (!existing || new Date(audit.createdAt) > new Date(existing.createdAt)) {
        uniqueSiteMap.set(key, audit);
      }
    });
    const uniqueAudits = Array.from(uniqueSiteMap.values());

    // KPIs
    const totalLeads    = allLeads.length;
    const hotLeads      = activeLeads.filter(l => l.status === 'Hot').length;
    const warmLeads     = activeLeads.filter(l => l.status === 'Warm').length;
    const coldLeads     = activeLeads.filter(l => l.status === 'Cold').length;
    const followUpsSent = allLeads.filter(l => l.followUpSent).length;

    // Avg audit scores (unique sites only)
    let avgSpeed = 0, avgSeo = 0, avgMobile = 0, avgSecurity = 0, avgScore = 0;
    if (uniqueAudits.length > 0) {
      avgSpeed    = Math.round(uniqueAudits.reduce((s, a) => s + a.speed,    0) / uniqueAudits.length);
      avgSeo      = Math.round(uniqueAudits.reduce((s, a) => s + a.seo,      0) / uniqueAudits.length);
      avgMobile   = Math.round(uniqueAudits.reduce((s, a) => s + a.mobile,   0) / uniqueAudits.length);
      avgSecurity = Math.round(uniqueAudits.reduce((s, a) => s + a.security, 0) / uniqueAudits.length);
      avgScore    = Math.round((avgSpeed + avgSeo + avgMobile + avgSecurity) / 4);
    }

    // Monthly chart data
    const buckets = buildMonthlyBuckets(8);
    allLeads.forEach(lead => {
      const d = new Date(lead.createdAt);
      const b = buckets.find(b => b.year === d.getFullYear() && b.month === d.getMonth());
      if (b) b.leads++;
    });
    uniqueAudits.forEach(audit => {
      const d = new Date(audit.createdAt);
      const b = buckets.find(b => b.year === d.getFullYear() && b.month === d.getMonth());
      if (b) b.audits++;
    });

    // Status distribution for pie chart
    const statusDistribution = [
      { name: 'Hot',  value: hotLeads,  color: '#ef4444' },
      { name: 'Warm', value: warmLeads, color: '#f59e0b' },
      { name: 'Cold', value: coldLeads, color: '#3b82f6' },
    ];

    // Audit score breakdown for progress bars
    const auditScoreBreakdown = [
      { label: 'Speed',    score: avgSpeed,    color: '#7C3AED' },
      { label: 'SEO',      score: avgSeo,      color: '#06B6D4' },
      { label: 'Mobile',   score: avgMobile,   color: '#10B981' },
      { label: 'Security', score: avgSecurity, color: '#F59E0B' },
    ];

    // Recent 5 active leads — only those with an audit
    const auditedLeadIds = new Set(uniqueAudits.map(a => String(a.lead)));
    const recentLeads = activeLeads
      .filter(l => auditedLeadIds.has(String(l._id)))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(l => ({
        _id:      l._id,
        name:     l.name,
        type:     l.type,
        score:    l.score,
        status:   l.status,
        location: l.location,
        site:     l.site,
        hasAudit: true,
      }));

    // Top 5 scored leads
    const topLeads = activeLeads
      .filter(l => l.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(l => ({ _id: l._id, name: l.name, type: l.type, score: l.score, status: l.status, site: l.site }));

    res.status(200).json({
      status: 'success',
      data: {
        kpis: {
          totalLeads,
          totalAudits: uniqueAudits.length,
          hotLeads,
          followUpsSent,
          avgScore,
        },
        monthlyData:        buckets,
        statusDistribution,
        auditScoreBreakdown,
        recentLeads,
        topLeads,
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to load analytics' });
  }
};
