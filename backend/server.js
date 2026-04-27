// GitCoven API Server
// Stack: Express + Prisma + PostgreSQL (Supabase) + JWT

require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const authRoutes     = require('./routes/auth');
const progressRoutes = require('./routes/progress');
const profileRoutes  = require('./routes/profile');
const { authenticate } = require('./middleware/authenticate');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── MIDDLEWARE ────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5500',
  credentials: true
}));
app.use(express.json());

// ── HEALTH CHECK ──────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'GitCoven API', version: '1.0.0' });
});

// ── ROUTES ────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/progress', authenticate, progressRoutes);
app.use('/api/profile',  authenticate, profileRoutes);

// ── 404 ───────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── ERROR HANDLER ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ── START ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🧙 GitCoven API running on http://localhost:${PORT}`);
});