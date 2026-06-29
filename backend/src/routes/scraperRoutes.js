
const express = require('express');
const { scrapeLeads, auditWebsite, updateLeadFromN8N, getUserAudits, getAuditById, getGroupedAudits } = require('../controllers/scraperController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes
router.post('/scrape', protect, scrapeLeads);
router.post('/audit', protect, auditWebsite);
router.get('/audits', protect, getUserAudits);
router.get('/audits/grouped', protect, getGroupedAudits);
router.get('/audits/:id', protect, getAuditById);
router.post('/update-lead', updateLeadFromN8N); // Webhook for n8n (doesn't need auth)

module.exports = router;
