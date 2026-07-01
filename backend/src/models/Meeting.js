const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please add a meeting title'],
  },
  date: {
    type: String,   // "YYYY-MM-DD"
    required: [true, 'Please add a date'],
  },
  time: {
    type: String,   // "HH:MM" 24h
    required: [true, 'Please add a time'],
  },
  duration: {
    type: Number,   // minutes
    default: 30,
  },
  status: {
    type: String,
    enum: ['confirmed', 'pending', 'cancelled'],
    default: 'confirmed',
  },
  notes: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('Meeting', MeetingSchema);
