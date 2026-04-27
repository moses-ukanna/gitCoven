// routes/profile.js
// GET /api/profile       — full profile with stats, streak, rank

const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// ── Streak calculation ────────────────────────────────────────
function calculateStreak(visitDates) {
  if (!visitDates.length) return 0;
  const sorted  = [...visitDates].sort().reverse();
  const today   = new Date().toISOString().split('T')[0];
  let streak    = 0;
  let check     = today;

  for (const date of sorted) {
    if (date === check) {
      streak++;
      const d = new Date(check);
      d.setDate(d.getDate() - 1);
      check = d.toISOString().split('T')[0];
    } else if (date < check) {
      break;
    }
  }
  return streak;
}

// ── Rank system ───────────────────────────────────────────────
const RANKS = [
  { min: 0,  icon: '🌱', name: 'Apprentice',     desc: 'Just getting started' },
  { min: 4,  icon: '⚡', name: 'Initiate',        desc: 'Learning the basics' },
  { min: 8,  icon: '🔥', name: 'Practitioner',   desc: 'Building real skills' },
  { min: 13, icon: '🧪', name: 'Wizard',         desc: 'Advanced territory' },
  { min: 19, icon: '🧙', name: 'Sorcerer',       desc: 'Enterprise level' },
  { min: 25, icon: '👑', name: 'Enterprise Pro', desc: 'Full coven graduate' }
];

function getRank(phasesCompleted) {
  let rank = RANKS[0];
  for (const r of RANKS) { if (phasesCompleted >= r.min) rank = r; }
  return rank;
}

// ── GET /api/profile ──────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const [user, progress, visits] = await Promise.all([
      prisma.user.findUnique({
        where: { id: req.userId },
        select: { id: true, name: true, username: true, email: true, createdAt: true }
      }),
      prisma.progress.findUnique({ where: { userId: req.userId } }),
      prisma.visit.findMany({
        where: { userId: req.userId },
        select: { date: true },
        orderBy: { date: 'desc' }
      })
    ]);

    if (!user) return res.status(404).json({ error: 'User not found.' });

    const visitDates      = visits.map(v => v.date);
    const streak          = calculateStreak(visitDates);
    const phasesCompleted = progress ? progress.completedPhases.length : 0;
    const challengeData   = progress ? (progress.challengeData || []) : [];
    const challengesSolved = challengeData.reduce((total, cs) => {
      return total + (cs.solved ? cs.solved.filter(Boolean).length : 0);
    }, 0);

    const daysSinceStart  = progress
      ? Math.max(1, Math.round((new Date() - new Date(progress.startDate)) / 86400000))
      : 1;

    const rank     = getRank(phasesCompleted);
    const rankIdx  = RANKS.indexOf(rank);
    const nextRank = RANKS[rankIdx + 1] || null;
    const rankPct  = nextRank
      ? Math.round((phasesCompleted - rank.min) / (nextRank.min - rank.min) * 100)
      : 100;

    res.json({
      user: {
        id:       user.id,
        name:     user.name,
        username: user.username,
        email:    user.email,
        joinedAt: user.createdAt
      },
      progress: {
        currentPhase:    progress ? progress.currentPhase : 0,
        completedPhases: progress ? progress.completedPhases : [],
        challengeData:   challengeData
      },
      stats: {
        phasesCompleted,
        challengesSolved,
        streak,
        daysSinceStart,
        totalVisitDays: visitDates.length,
        visitDates
      },
      rank: {
        ...rank,
        pct:      rankPct,
        nextRank: nextRank ? nextRank.name : null,
        nextMin:  nextRank ? nextRank.min  : null
      }
    });

  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ error: 'Failed to load profile.' });
  }
});

module.exports = router;