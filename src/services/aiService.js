// server/services/aiService.js
const axios = require('axios');

const sendToAI = async (prompt, role = 'user') => {
  try {
    const useOpenRouter = process.env.USE_OPENROUTER === 'true';
    const apiKey = useOpenRouter
      ? process.env.OPENROUTER_API_KEY
      : process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('API key not found. Set it in .env');
    }

    const url = useOpenRouter
      ? 'https://openrouter.ai/api/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions';

    // Pick the best model for Mentora AI
    const model = useOpenRouter ? 'gpt-4o-mini' : 'gpt-4';

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    };

    // OpenRouter-specific headers
    if (useOpenRouter) {
      headers['HTTP-Referer'] = 'http://localhost:5000';
      headers['X-Title'] = 'Mentora AI';
    }

    const data = {
      model,
      messages: [
        {
          role: 'system',
          content: 'You are Mentora, a helpful educational assistant. Always reply in clear and professional English.',
        },
        {
          role,
          content: prompt,
        },
      ],
    };

    const response = await axios.post(url, data, { headers });
    return response.data.choices[0].message.content.trim();

  } catch (err) {
    const isRateLimited = err.response?.status === 429;

    if (isRateLimited) {
      console.error('❌ AI rate-limited by provider. Try again later.');
      throw new Error('AI service rate-limited. Please try again later.');
    }

    console.error('❌ AI API Error:', err.response?.data || err.message);
    throw new Error('Failed to get AI response');
  }
};

module.exports = { sendToAI };
