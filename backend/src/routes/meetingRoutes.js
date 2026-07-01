const express = require('express');
const { getMeetings, createMeeeting, updateMeeting, deleteMeeting, createMeeting } = require('../controllers/meetingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getMeetings)
  .post(protect, createMeeting);

router.route('/:id')
  .put(protect, updateMeeting)
  .delete(protect, deleteMeeting);

module.exports = router;
