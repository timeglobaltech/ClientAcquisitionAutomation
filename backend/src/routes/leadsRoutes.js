
const express = require('express');
const { getLeads, createLead, updateLead, deleteLead } = require('../controllers/leadsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getLeads)
  .post(protect, createLead);

router.route('/:id')
  .put(protect, updateLead)
  .delete(protect, deleteLead);

module.exports = router;
