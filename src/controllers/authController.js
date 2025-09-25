const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    console.log('📩 Register attempt:', { name, email });

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('❌ Email already registered');
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    console.log('✅ User registered:', user.email);

    res.status(201).json({ user: { id: user._id, name, email }, token });
  } catch (err) {
    console.error('❌ Registration Error:', err.message);
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log('🔐 Login attempt:', email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log('❌ Password mismatch');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    console.log('✅ Login successful');

    res.json({ user: { id: user._id, name: user.name, email }, token });
  } catch (err) {
    console.error('❌ Login Error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

