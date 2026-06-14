const express = require('express');
const Parser = require('rss-parser');

const router = express.Router();
const parser = new Parser();

const FEED_URL = process.env.PRIVACY_NEWS_RSS_URL || 'https://www.eff.org/rss/updates.xml';

let cache = { items: [], fetchedAt: 0 };
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

router.get('/', async (req, res) => {
  const now = Date.now();

  if (cache.items.length > 0 && now - cache.fetchedAt < CACHE_TTL_MS) {
    return res.json({ items: cache.items, source: FEED_URL, cached: true });
  }

  try {
    const feed = await parser.parseURL(FEED_URL);
    const items = (feed.items || []).slice(0, 10).map((item) => ({
      title: item.title,
      link: item.link,
      summary: (item.contentSnippet || item.summary || '').slice(0, 280),
      publishedAt: item.isoDate || item.pubDate,
    }));

    cache = { items, fetchedAt: now };
    res.json({ items, source: FEED_URL, cached: false });
  } catch (err) {
    console.error('News feed error:', err.message);
    if (cache.items.length > 0) {
      return res.json({ items: cache.items, source: FEED_URL, cached: true, stale: true });
    }
    res.status(502).json({ error: 'Could not load the privacy news feed right now.' });
  }
});

module.exports = router;
