const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-super-secret-key-for-local-dev';

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(403).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    req.userId = decoded.id;
    next();
  });
};

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, displayName, avatarId, slogan } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Generate UUID-like ID for the user
    const userId = require('crypto').randomUUID();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    db.prepare('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)').run(userId, email, hashedPassword);

    // Insert profile with default points and tier
    const name = displayName || email.split('@')[0];
    const defaultSlogan = slogan || 'Decoding academic milestones & professional trajectories';
    const defaultAvatarId = avatarId || 'avatar_blobby';

    db.prepare(`
      INSERT INTO profiles (user_id, name, avatarId, slogan, points, subscriptionTier, isLoggedIn, hasTakenTest)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(userId, name, defaultAvatarId, defaultSlogan, 50, 'free', 1, 0);

    // Fetch the inserted profile to return
    const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(userId);

    // Generate JWT
    const token = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user: { uid: userId, email }, profile });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    let profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(user.id);

    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ token, user: { uid: user.id, email: user.email }, profile });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/me
router.get('/me', verifyToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id as uid, email FROM users WHERE id = ?').get(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(req.userId);

    res.status(200).json({ user, profile });
  } catch (error) {
    console.error('Auth me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = { router, verifyToken };
