// server/routes/summaryRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { sendToAI } = require('../services/aiService');

const upload = multer({ dest: 'uploads/' });

router.post('/summarize', upload.single('file'), async (req, res) => {
  const file = req.file;

  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    let text = '';

    if (file.mimetype === 'application/pdf') {
      const data = fs.readFileSync(file.path);
      const pdf = await pdfParse(data);
      text = pdf.text;
    } else if (
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const data = fs.readFileSync(file.path);
      const result = await mammoth.extractRawText({ buffer: data });
      text = result.value;
    } else {
      return res.status(400).json({ error: 'Only PDF and DOCX supported' });
    }

    // Optional: Limit long documents
    if (text.length > 6000) text = text.slice(0, 6000);

    const prompt = `Summarize the following academic content in clear points:\n\n${text}`;
    const summary = await sendToAI(prompt);

    // Delete the uploaded file
    fs.unlinkSync(file.path);

    res.json({ summary });
  } catch (err) {
    console.error('❌ Summarization error:', err.message);
    res.status(500).json({ error: 'Failed to summarize file' });
  }
});

module.exports = router;
