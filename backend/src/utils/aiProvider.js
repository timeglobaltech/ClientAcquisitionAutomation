const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// ---------------------------------------------------------------------------
// Multi-provider AI chat layer.
// Priority: Groq (fast, free, ChatGPT-quality) -> OpenAI -> Gemini fallback.
// Drop the relevant API key in backend/.env and it is picked up automatically:
//   GROQ_API_KEY=gsk_...        (recommended, get it free at console.groq.com)
//   OPENAI_API_KEY=sk-...       (optional)
//   GEMINI_API_KEY=...          (existing fallback)
// ---------------------------------------------------------------------------

const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

// Returns the active provider name based on which key is configured.
function activeProvider() {
  if (process.env.GROQ_API_KEY) return 'groq';
  if (process.env.OPENAI_API_KEY) return 'openai';
  if (process.env.GEMINI_API_KEY) return 'gemini';
  return 'none';
}

// Normalize app messages ({ role: 'user' | 'ai', text }) into OpenAI-style
// ({ role: 'user' | 'assistant', content }).
function toOpenAIMessages(systemPrompt, messages) {
  const out = [{ role: 'system', content: systemPrompt }];
  for (const m of messages) {
    out.push({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.text || '',
    });
  }
  return out;
}

// Call any OpenAI-compatible endpoint (Groq + OpenAI both use this shape).
async function callOpenAICompatible({ baseURL, apiKey, model, systemPrompt, messages }) {
  const res = await axios.post(
    `${baseURL}/chat/completions`,
    {
      model,
      messages: toOpenAIMessages(systemPrompt, messages),
      temperature: 0.7,
      max_tokens: 2048,
      top_p: 0.9,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000,
    }
  );
  const text = res.data?.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error('Empty response from AI provider');
  return text;
}

// Gemini fallback.
async function callGemini({ systemPrompt, messages }) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const history = [{ role: 'user', parts: [{ text: systemPrompt }] }];
  messages.slice(0, -1).forEach((msg) => {
    history.push({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    });
  });

  const chat = model.startChat({
    history,
    generationConfig: { maxOutputTokens: 2048, temperature: 0.7, topP: 0.9 },
  });
  const last = messages[messages.length - 1];
  const result = await chat.sendMessage(last.text);
  return (await result.response).text();
}

// Main entry: returns the assistant reply text, trying providers in order of
// preference and gracefully falling back if one fails (e.g. rate limited).
async function chat({ systemPrompt, messages }) {
  const order = [];
  if (process.env.GROQ_API_KEY) order.push('groq');
  if (process.env.OPENAI_API_KEY) order.push('openai');
  if (process.env.GEMINI_API_KEY) order.push('gemini');

  if (order.length === 0) {
    const err = new Error('No AI provider configured. Add GROQ_API_KEY (or OPENAI_API_KEY / GEMINI_API_KEY) to backend/.env');
    err.status = 503;
    throw err;
  }

  let lastErr;
  for (const provider of order) {
    try {
      if (provider === 'groq') {
        return await callOpenAICompatible({
          baseURL: 'https://api.groq.com/openai/v1',
          apiKey: process.env.GROQ_API_KEY,
          model: GROQ_MODEL,
          systemPrompt,
          messages,
        });
      }
      if (provider === 'openai') {
        return await callOpenAICompatible({
          baseURL: 'https://api.openai.com/v1',
          apiKey: process.env.OPENAI_API_KEY,
          model: OPENAI_MODEL,
          systemPrompt,
          messages,
        });
      }
      if (provider === 'gemini') {
        return await callGemini({ systemPrompt, messages });
      }
    } catch (err) {
      const status = err.response?.status || err.status;
      console.warn(`AI provider "${provider}" failed (${status || 'err'}):`, err.response?.data?.error?.message || err.message);
      lastErr = err;
      lastErr.status = status || lastErr.status;
      // Try the next provider in the chain
    }
  }
  throw lastErr || new Error('All AI providers failed');
}

module.exports = { chat, activeProvider };
