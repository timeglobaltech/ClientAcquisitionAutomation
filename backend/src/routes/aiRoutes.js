
const express = require('express');
const router = express.Router();
const { chatWithAI, getChats, createChat, updateChat, deleteChat } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// Apply auth middleware to all AI routes
router.use(protect);

// Chat with AI Copilot
router.post('/chat', chatWithAI);

// Chat history endpoints
router.get('/chats', getChats);
router.post('/chats', createChat);
router.put('/chats/:id', updateChat);
router.delete('/chats/:id', deleteChat);

module.exports = router;
