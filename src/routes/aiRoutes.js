const express = require('express');
const router = express.Router();
const { sendToAI } = require('../services/aiService');

router.post('/chat', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const aiResponse = await sendToAI(prompt);
    res.json({ response: aiResponse });
  } catch (error) {
    console.error('AI error:', error.message);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

module.exports = router;
