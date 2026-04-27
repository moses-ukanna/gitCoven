// routes/progress.js
// GET   /api/progress      — load user's progress
// PUT   /api/progress      — save/sync user's progress
// DELETE /api/progress     — reset all progress

const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// ── GET /api/progress ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const progress = await prisma.progress.findUnique({
      where: { userId: req.userId }
    });

    if (!progress) {
      return res.json({
        currentPhase: 0,
        completedPhases: [],
        challengeData: [],
        startDate: new Date().toISOString()
      });
    }

    // Also fetch visit dates for streak calculation
    const visits = await prisma.visit.findMany({
      where: { userId: req.userId },
      select: { date: true },
      orderBy: { date: 'desc' }
    });

    res.json({
      currentPhase:    progress.currentPhase,
      completedPhases: progress.completedPhases,
      challengeData:   progress.challengeData,
      startDate:       progress.startDate.toISOString(),
      visitDates:      visits.map(v => v.date)
    });

  } catch (err) {
    console.error('Get progress error:', err);
    res.status(500).json({ error: 'Failed to load progress.' });
  }
});

// ── PUT /api/progress ─────────────────────────────────────────
router.put('/', async (req, res) => {
  try {
    const { currentPhase, completedPhases, challengeData } = req.body;

    // Validate
    if (typeof currentPhase !== 'number') {
      return res.status(400).json({ error: 'Invalid progress data.' });
    }

    const progress = await prisma.progress.upsert({
      where: { userId: req.userId },
      update: {
        currentPhase:    Math.max(0, currentPhase),
        completedPhases: completedPhases || [],
        challengeData:   challengeData   || []
      },
      create: {
        userId:          req.userId,
        currentPhase:    Math.max(0, currentPhase),
        completedPhases: completedPhases || [],
        challengeData:   challengeData   || []
      }
    });

    // Record today's visit
    const today = new Date().toISOString().split('T')[0];
    await prisma.visit.upsert({
      where: { userId_date: { userId: req.userId, date: today } },
      create: { userId: req.userId, date: today },
      update: {}
    });

    res.json({ message: 'Progress saved.', updatedAt: progress.updatedAt });

  } catch (err) {
    console.error('Save progress error:', err);
    res.status(500).json({ error: 'Failed to save progress.' });
  }
});

// ── DELETE /api/progress ──────────────────────────────────────
router.delete('/', async (req, res) => {
  try {
    await prisma.progress.update({
      where: { userId: req.userId },
      data: {
        currentPhase:    0,
        completedPhases: [],
        challengeData:   []
      }
    });

    res.json({ message: 'Progress reset successfully.' });

  } catch (err) {
    console.error('Reset progress error:', err);
    res.status(500).json({ error: 'Failed to reset progress.' });
  }
});

module.exports = router;