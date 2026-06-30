
const express = require('express');
const { scrapeLeads, auditWebsite, updateLeadFromN8N, getUserAudits, getAuditById, getGroupedAudits, getAuditByLead, clearSavedLeads } = require('../controllers/scraperController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes
router.post('/scrape', protect, scrapeLeads);
router.post('/audit', protect, auditWebsite);
router.get('/audits', protect, getUserAudits);
router.get('/audits/grouped', protect, getGroupedAudits);
router.get('/audits/lead/:leadId', protect, getAuditByLead);
router.get('/audits/:id', protect, getAuditById);
router.delete('/clear', protect, clearSavedLeads); // Clear saved leads
router.post('/update-lead', updateLeadFromN8N); // Webhook for n8n (doesn't need auth)

module.exports = router;
