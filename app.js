// server/app.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const app = express();
const summaryRoutes = require('./routes/summaryRoutes');
const quizRoutes = require('./routes/quizRoutes');
const imageRoutes = require('./routes/imageRoutes'); 

// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/image', imageRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('🧠 Mentora AI Backend is working!');
});



module.exports = app;
