
const express = require('express');
const { scrapeLeads, auditWebsite, updateLeadFromN8N } = require('../controllers/scraperController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Temporarily unprotected for testing
router.post('/scrape', scrapeLeads);
router.post('/audit', auditWebsite);
router.post('/update-lead', updateLeadFromN8N); // Webhook for n8n (doesn't need auth)

module.exports = router;
