const express = require('express');
const axios = require('axios');
const pool = require('../db');

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// GET /api/breach-check?email=someone@example.com
router.get('/', async (req, res) => {
  const email = (req.query.email || '').trim().toLowerCase();

  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  const apiKey = process.env.HIBP_API_KEY;

  // No API key configured: fall back to seeded demo data so the tool is still usable.
  if (!apiKey || apiKey === 'your_haveibeenpwned_api_key_here') {
    try {
      const result = await pool.query('SELECT * FROM demo_breaches WHERE email = $1 ORDER BY breach_date DESC', [email]);
      return res.json({
        email,
        source: 'demo',
        breaches: result.rows.map(formatDemoBreach),
      });
    } catch (err) {
      console.error('Demo breach lookup error:', err);
      return res.status(500).json({ error: 'Could not look up breach data.' });
    }
  }

  try {
    const response = await axios.get(
      `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}`,
      {
        params: { truncateResponse: false },
        headers: {
          'hibp-api-key': apiKey,
          'user-agent': 'privacy-advocacy-site',
        },
      }
    );
    return res.json({ email, source: 'hibp', breaches: response.data });
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return res.json({ email, source: 'hibp', breaches: [] });
    }
    if (err.response && err.response.status === 429) {
      return res.status(429).json({ error: 'Rate limited by HaveIBeenPwned. Please try again shortly.' });
    }
    console.error('HIBP lookup error:', err.message);
    return res.status(502).json({ error: 'Could not reach the breach database. Please try again later.' });
  }
});

function formatDemoBreach(row) {
  return {
    Name: row.name,
    Domain: row.domain,
    BreachDate: row.breach_date,
    PwnCount: Number(row.pwn_count),
    DataClasses: row.data_classes,
    Description: row.description,
  };
}

module.exports = router;
