const express = require('express');
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const VALID_CATEGORY_KEYS = ['socialMedia', 'browser', 'devices', 'apps'];

router.use(requireAuth);

// Save a completed Privacy Checkup result for the logged-in user
router.post('/', async (req, res) => {
  const { totalScore, categoryScores } = req.body;

  if (!Number.isInteger(totalScore) || totalScore < 0 || totalScore > 100) {
    return res.status(400).json({ error: 'totalScore must be an integer between 0 and 100.' });
  }
  if (typeof categoryScores !== 'object' || categoryScores === null) {
    return res.status(400).json({ error: 'categoryScores is required.' });
  }
  for (const key of VALID_CATEGORY_KEYS) {
    const value = categoryScores[key];
    if (!Number.isInteger(value) || value < 0 || value > 25) {
      return res.status(400).json({ error: `categoryScores.${key} must be an integer between 0 and 25.` });
    }
  }

  try {
    const result = await pool.query(
      `INSERT INTO checkup_results (user_id, total_score, category_scores)
       VALUES ($1, $2, $3) RETURNING id, total_score, category_scores, created_at`,
      [req.user.id, totalScore, categoryScores]
    );
    res.status(201).json({ result: result.rows[0] });
  } catch (err) {
    console.error('Save checkup result error:', err);
    res.status(500).json({ error: 'Could not save your checkup result.' });
  }
});

// Get the logged-in user's checkup history, most recent first
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, total_score, category_scores, created_at
       FROM checkup_results WHERE user_id = $1
       ORDER BY created_at DESC LIMIT 10`,
      [req.user.id]
    );
    res.json({ results: result.rows });
  } catch (err) {
    console.error('Fetch checkup history error:', err);
    res.status(500).json({ error: 'Could not load your checkup history.' });
  }
});

module.exports = router;
