const Meeting = require('../models/Meeting');

// @desc    Get all meetings for user
// @route   GET /api/meetings
// @access  Private
exports.getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({ user: req.user._id }).sort({ date: 1, time: 1 });
    res.status(200).json({ status: 'success', data: { meetings } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch meetings' });
  }
};

// @desc    Create a meeting (book a slot)
// @route   POST /api/meetings
// @access  Private
exports.createMeeting = async (req, res) => {
  try {
    const { title, date, time, duration, notes } = req.body;

    // Check for duplicate slot
    const existing = await Meeting.findOne({ user: req.user._id, date, time, status: { $ne: 'cancelled' } });
    if (existing) {
      return res.status(400).json({ status: 'fail', message: 'This slot is already booked' });
    }

    const meeting = await Meeting.create({
      user:  req.user._id,
      title,
      date,
      time,
      duration: duration || 30,
      notes:    notes    || '',
      status:   'confirmed',
    });

    res.status(201).json({ status: 'success', data: { meeting } });
  } catch (err) {
    console.error('Create meeting error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to create meeting' });
  }
};

// @desc    Update meeting status or details
// @route   PUT /api/meetings/:id
// @access  Private
exports.updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!meeting) return res.status(404).json({ status: 'fail', message: 'Meeting not found' });
    res.status(200).json({ status: 'success', data: { meeting } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to update meeting' });
  }
};

// @desc    Delete a meeting
// @route   DELETE /api/meetings/:id
// @access  Private
exports.deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!meeting) return res.status(404).json({ status: 'fail', message: 'Meeting not found' });
    res.status(200).json({ status: 'success', message: 'Meeting deleted' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to delete meeting' });
  }
};
