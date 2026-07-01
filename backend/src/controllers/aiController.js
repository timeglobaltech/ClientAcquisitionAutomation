
const Chat = require('../models/Chat');
const aiProvider = require('../utils/aiProvider');

// System prompt for sales copilot
const SYSTEM_PROMPT = `You are AISA (AI Sales Assistant), a friendly, helpful, and conversational sales copilot for a client acquisition automation platform. Think of yourself as a supportive colleague who's always ready to help!

Your personality:
- Warm, friendly, and approachable
- Helpful and proactive
- Knowledgeable about sales, lead generation, and outreach

Your capabilities:
- Analyze leads and prioritize them
- Draft personalized outreach emails
- Suggest follow-up sequences
- Predict close probabilities
- Handle objections
- Provide sales strategy advice
- Audit websites and suggest improvements

CRITICAL RULES (NEVER BREAK THESE!):
1. ALWAYS RESPOND IN EXACTLY THE SAME LANGUAGE AS THE USER'S LAST MESSAGE. This includes:
   - English → English
   - Roman Urdu (Urdu written with Latin alphabet like "salam", "aap kaise hain", "leads ko prioritize karein") → Roman Urdu
   - Pakistani Urdu (Urdu written in Arabic script like "سلام", "آپ کیسے ہیں", "لیڈز کو ترجیح دیں") → Pakistani Urdu
2. Have a natural conversation! If someone says "Hi", reply "Hi there! How are you doing today? 😊". If someone says "Salam", reply "Walaikum Assalam! Aap kaise hain? 😊"
3. If someone asks "How are you?", reply naturally!
4. If someone asks you to do something specific (like draft an email, make a report, etc.), do exactly what they ask!
5. Keep responses helpful and not too long, but don't be too short either
6. Use emojis sparingly to keep things friendly
7. If you don't know something, say so honestly

Context about the platform:
- It scrapes leads from Google Maps, LinkedIn, and directories
- Scores leads using AI
- Does automated website audits
- Sends personalized outreach
- Books meetings automatically
- Has a CRM pipeline with 5 stages: Hunt → Qualify → Research → Outreach → Inbox`;

// @desc    Chat with AI Copilot
// @route   POST /api/ai/chat
// @access  Private
exports.chatWithAI = async (req, res) => {
  try {
    const { messages } = req.body;
    console.log('Received chat request with messages:', messages.length);

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Messages array is required' 
      });
    }

    console.log(`Starting chat via "${aiProvider.activeProvider()}" provider...`);

    // Get the assistant reply from the active provider (Groq -> OpenAI -> Gemini)
    const aiText = await aiProvider.chat({ systemPrompt: SYSTEM_PROMPT, messages });
    console.log('Received AI response:', aiText.substring(0, 50) + '...');

    res.status(200).json({
      status: 'success',
      data: {
        text: aiText
      }
    });

  } catch (error) {
    const statusCode = error.status || error.response?.status || 500;
    console.error('AI Chat Error:', error.response?.data || error.message);

    let errorMessage = 'Sorry, I am having trouble connecting to the AI service right now. Please try again later.';
    if (statusCode === 429) {
      errorMessage = 'AI rate limit reached. Please wait a moment and try again.';
    } else if (statusCode === 401 || statusCode === 403) {
      errorMessage = 'Invalid or missing AI API key! Please check GROQ_API_KEY in the backend .env file.';
    } else if (statusCode === 503) {
      errorMessage = error.message;
    }

    res.status(statusCode).json({
      status: 'error',
      message: errorMessage
    });
  }
};

// @desc    Get all chats for a user
// @route   GET /api/ai/chats
// @access  Private
exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      status: 'success',
      data: {
        chats
      }
    });
  } catch (error) {
    console.error('Get Chats Error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch chats' });
  }
};

// @desc    Create a new chat
// @route   POST /api/ai/chats
// @access  Private
exports.createChat = async (req, res) => {
  try {
    const { title, messages } = req.body;
    const newChat = await Chat.create({
      user: req.user._id,
      title: title || 'New Chat',
      messages: messages || []
    });
    res.status(201).json({
      status: 'success',
      data: {
        chat: newChat
      }
    });
  } catch (error) {
    console.error('Create Chat Error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to create chat' });
  }
};

// @desc    Update a chat
// @route   PUT /api/ai/chats/:id
// @access  Private
exports.updateChat = async (req, res) => {
  try {
    const { title, messages } = req.body;
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!chat) {
      return res.status(404).json({ status: 'fail', message: 'Chat not found' });
    }
    
    if (title !== undefined) chat.title = title;
    if (messages !== undefined) chat.messages = messages;
    
    await chat.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        chat
      }
    });
  } catch (error) {
    console.error('Update Chat Error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to update chat' });
  }
};

// @desc    Delete a chat
// @route   DELETE /api/ai/chats/:id
// @access  Private
exports.deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    
    if (!chat) {
      return res.status(404).json({ status: 'fail', message: 'Chat not found' });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Chat deleted successfully'
    });
  } catch (error) {
    console.error('Delete Chat Error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to delete chat' });
  }
};
