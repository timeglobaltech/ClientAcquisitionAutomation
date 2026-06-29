const mongoose = require('mongoose');

const AuditSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: true
  },
  site: {
    type: String,
    required: true
  },
  speed: {
    type: Number,
    required: true
  },
  seo: {
    type: Number,
    required: true
  },
  mobile: {
    type: Number,
    required: true
  },
  security: {
    type: Number,
    required: true
  },
  issues: [{
    type: String
  }],
  recommendations: [{
    type: String
  }]
}, {
  timestamps: true
});

// Prevent duplicate audits for same website and user
AuditSchema.index({ user: 1, site: 1, lead: 1 }, { unique: true });

module.exports = mongoose.model('Audit', AuditSchema);
