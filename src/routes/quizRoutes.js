// server/routes/quizRoutes.js
const express = require('express');
const router = express.Router();
const { sendToAI } = require('../services/aiService');

router.post('/generate', async (req, res) => {
  const { content } = req.body;

  if (!content) return res.status(400).json({ error: 'No content provided' });

  const prompt = `
From the following content, generate 10 multiple choice questions with 4 options each. Also, include the correct answer after each question.

Content:
${content}
`;

  try {
    const aiResponse = await sendToAI(prompt);
    res.json({ quiz: aiResponse });
  } catch (err) {
    console.error('Quiz generation error:', err.message);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
});

module.exports = router;
