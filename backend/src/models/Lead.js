
const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a business name']
  },
  type: {
    type: String,
    required: [true, 'Please add a business type']
  },
  site: {
    type: String,
    required: [true, 'Please add a website']
  },
  score: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Hot', 'Warm', 'Cold'],
    default: 'Warm'
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  phone: {
    type: String
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  revenue: {
    type: String
  },
  employees: {
    type: String
  },
  response: {
    type: String
  },
  meetingBooked: {
    type: Boolean,
    default: false
  },
  followUpSent: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number
  },
  reviews: {
    type: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Lead', LeadSchema);
