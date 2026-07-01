
const Lead = require('../models/Lead');
const Audit = require('../models/Audit');

// @desc    Get all active leads (isInLeads: true)
// @route   GET /api/leads
// @access  Private
exports.getLeads = async (req, res) => {
  try {
    console.log("Fetching leads for user:", req.user._id);
    const leads = await Lead.find({ user: req.user._id, isInLeads: true }).sort({ createdAt: -1 });
    console.log("Found leads:", leads.length);
    
    // For each lead, check if audit exists and update lead score if needed
    const leadsWithAuditStatus = await Promise.all(
      leads.map(async (lead, index) => {
        const leadObj = lead.toObject();
        console.log(`Lead ${index + 1}:`, { name: lead.name, score: lead.score, status: lead.status });
        const audit = await Audit.findOne({ user: req.user._id, lead: lead._id });
        console.log(`  Audit exists for lead ${index + 1}:`, !!audit);
        leadObj.hasAudit = !!audit;
        
        // If audit exists, update lead score regardless
        if (audit) {
          const overallScore = Math.round(
            (audit.speed + audit.seo + audit.mobile + audit.security) / 4
          );
          const status = overallScore >= 80 ? 'Hot' : overallScore >= 60 ? 'Warm' : 'Cold';
          console.log(`  Updating lead ${index + 1}:`, { score: overallScore, status });
          await Lead.findByIdAndUpdate(lead._id, { score: overallScore, status });
          leadObj.score = overallScore;
          leadObj.status = status;
        }
        
        return leadObj;
      })
    );
    
    console.log("Returning leads with audit status:", leadsWithAuditStatus);
    res.status(200).json({
      status: 'success',
      results: leadsWithAuditStatus.length,
      data: { leads: leadsWithAuditStatus }
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// @desc    Get all scraped leads (isInLeads: false)
// @route   GET /api/leads/scraped
// @access  Private
exports.getScrapedLeads = async (req, res) => {
  try {
    console.log("Fetching scraped leads for user:", req.user._id);
    const leads = await Lead.find({ user: req.user._id, isInLeads: false }).sort({ createdAt: -1 });
    console.log("Found scraped leads:", leads.length);
    
    // For each lead, check if audit exists and update lead score if needed
    const leadsWithAuditStatus = await Promise.all(
      leads.map(async (lead, index) => {
        const leadObj = lead.toObject();
        console.log(`Scraped lead ${index + 1}:`, { name: lead.name, score: lead.score, status: lead.status });
        const audit = await Audit.findOne({ user: req.user._id, lead: lead._id });
        console.log(`  Audit exists for scraped lead ${index + 1}:`, !!audit);
        leadObj.hasAudit = !!audit;
        
        // If audit exists, update lead score regardless
        if (audit) {
          const overallScore = Math.round(
            (audit.speed + audit.seo + audit.mobile + audit.security) / 4
          );
          const status = overallScore >= 80 ? 'Hot' : overallScore >= 60 ? 'Warm' : 'Cold';
          console.log(`  Updating scraped lead ${index + 1}:`, { score: overallScore, status });
          await Lead.findByIdAndUpdate(lead._id, { score: overallScore, status });
          leadObj.score = overallScore;
          leadObj.status = status;
        }
        
        return leadObj;
      })
    );
    
    console.log("Returning scraped leads with audit status:", leadsWithAuditStatus);
    res.status(200).json({
      status: 'success',
      results: leadsWithAuditStatus.length,
      data: { leads: leadsWithAuditStatus }
    });
  } catch (error) {
    console.error('Get scraped leads error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// @desc    Move lead(s) to active leads (set isInLeads: true)
// @route   POST /api/leads/move
// @access  Private
exports.moveToLeads = async (req, res) => {
  try {
    const { leadIds } = req.body; // Array of lead IDs
    if (!leadIds || leadIds.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Please provide lead IDs' });
    }

    const updatedLeads = await Lead.updateMany(
      { _id: { $in: leadIds }, user: req.user._id },
      { isInLeads: true },
      { new: true }
    );

    res.status(200).json({
      status: 'success',
      message: `Moved ${updatedLeads.modifiedCount} lead(s) to Leads`,
      data: { modifiedCount: updatedLeads.modifiedCount }
    });
  } catch (error) {
    console.error('Move leads error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// @desc    Create new lead
// @route   POST /api/leads
// @access  Private
exports.createLead = async (req, res) => {
  try {
    const newLead = await Lead.create({
      ...req.body,
      user: req.user._id
    });
    res.status(201).json({
      status: 'success',
      data: { lead: newLead }
    });
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    if (!lead) {
      return res.status(404).json({ status: 'fail', message: 'Lead not found' });
    }
    res.status(200).json({
      status: 'success',
      data: { lead }
    });
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!lead) {
      return res.status(404).json({ status: 'fail', message: 'Lead not found' });
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};
