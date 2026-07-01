const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const testSite = 'example.com';

console.log('🔍 Testing Groq API directly...\n');

const prompt = `Conduct a detailed, realistic website audit for: ${testSite}

Please provide a comprehensive audit with:
- speed score (0-100, realistic estimate based on typical business websites)
- seo score (0-100, realistic estimate)
- mobile responsiveness score (0-100, realistic estimate)
- security score (0-100, realistic estimate)
- 3-5 specific, actionable issues found (be realistic, not generic)
- 3-5 specific, actionable recommendations to fix those issues

Make it specific to the type of business this website likely represents. Return the response ONLY as a valid JSON object, no other text or explanation:
{
  "site": "${testSite}",
  "speed": 75,
  "seo": 68,
  "mobile": 82,
  "security": 70,
  "issues": [
    "Images are not optimized for web, leading to slower load times",
    "Missing meta descriptions on key pages",
    "Mobile menu has usability issues on smaller screens"
  ],
  "recommendations": [
    "Compress and lazy-load all images to improve page speed",
    "Add unique meta descriptions to each page",
    "Optimize mobile navigation for touch devices"
  ]
}`;

async function testGroq() {
  try {
    console.log('📡 Sending request to Groq...\n');
    const res = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: GROQ_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a professional website audit expert. Your job is to provide realistic, specific website audits. Respond ONLY with valid JSON, no extra explanations, no markdown, just the JSON object.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 0.9
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Got response from Groq!');
    console.log('🤖 Raw response:', res.data);
    const aiText = res.data.choices[0].message.content;
    console.log('\n📝 AI Text:', aiText);
    const parsed = JSON.parse(aiText.replace(/```json|```/g, '').trim());
    console.log('\n✅ Parsed JSON:', JSON.stringify(parsed, null, 2));
  } catch (err) {
    console.error('❌ Error with Groq API:', err.response?.data || err.message);
  }
}

testGroq();
