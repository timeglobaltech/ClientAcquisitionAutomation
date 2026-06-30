
const Lead = require('../models/Lead');

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: 'success',
      results: leads.length,
      data: { leads }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// @desc    Create new lead
// @route   POST /api/leads
// @access  Private
exports.createLead = async (req, res) => {
  try {
    const newLead = await Lead.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { lead: newLead }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
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
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ status: 'fail', message: 'Lead not found' });
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};
