// routes/auth.js
// POST /api/auth/register  — create new account
// POST /api/auth/login     — login, get JWT
// GET  /api/auth/me        — get current user info

const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/authenticate');

const router = express.Router();
const prisma = new PrismaClient();

// ── Helper: sign JWT ──────────────────────────────────────────
function signToken(userId, username) {
  return jwt.sign(
    { userId, username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
  );
}

// ── POST /api/auth/register ───────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // Validate
    if (!name || !username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }
    if (!/^[a-z0-9_-]+$/i.test(username)) {
      return res.status(400).json({ error: 'Username: letters, numbers, _ and - only.' });
    }

    // Check uniqueness
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }] }
    });
    if (existing) {
      const field = existing.email === email.toLowerCase() ? 'Email' : 'Username';
      return res.status(409).json({ error: `${field} is already taken.` });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user + empty progress
    const user = await prisma.user.create({
      data: {
        name,
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        passwordHash,
        progress: { create: {} }  // initialise empty progress record
      }
    });

    const token = signToken(user.id, user.username);

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: { id: user.id, name: user.name, username: user.username, email: user.email }
    });

  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// ── POST /api/auth/login ──────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body; // login = email OR username

    if (!login || !password) {
      return res.status(400).json({ error: 'Please provide your login and password.' });
    }

    // Find user by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: login.toLowerCase() },
          { username: login.toLowerCase() }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'No account found with those credentials.' });
    }

    // Verify password
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Incorrect password.' });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Record today's visit (for streak tracking)
    const today = new Date().toISOString().split('T')[0];
    await prisma.visit.upsert({
      where: { userId_date: { userId: user.id, date: today } },
      create: { userId: user.id, date: today },
      update: {}
    });

    const token = signToken(user.id, user.username);

    res.json({
      message: 'Welcome back!',
      token,
      user: { id: user.id, name: user.name, username: user.username, email: user.email }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// ── GET /api/auth/me ──────────────────────────────────────────
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, name: true, username: true, email: true, createdAt: true, lastLogin: true }
    });

    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ user });

  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ error: 'Failed to fetch user.' });
  }
});

module.exports = router;