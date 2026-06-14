const express = require('express');
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Public: list suggested catalog items that users can add to their tracker
router.get('/catalog', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tracker_catalog ORDER BY category, title');
    res.json({ items: result.rows });
  } catch (err) {
    console.error('Fetch catalog error:', err);
    res.status(500).json({ error: 'Could not load the privacy action catalog.' });
  }
});

// All routes below require a logged-in user
router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tracker_items WHERE user_id = $1 ORDER BY completed ASC, created_at DESC',
      [req.user.id]
    );
    res.json({ items: result.rows });
  } catch (err) {
    console.error('Fetch tracker items error:', err);
    res.status(500).json({ error: 'Could not load your privacy tracker.' });
  }
});

router.post('/', async (req, res) => {
  const { title, description, category } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'A title is required.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO tracker_items (user_id, title, description, category)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.user.id, title, description || null, category || 'general']
    );
    res.status(201).json({ item: result.rows[0] });
  } catch (err) {
    console.error('Create tracker item error:', err);
    res.status(500).json({ error: 'Could not add this item to your tracker.' });
  }
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { completed, title, description, category } = req.body;

  try {
    const existing = await pool.query('SELECT * FROM tracker_items WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Tracker item not found.' });
    }

    const current = existing.rows[0];
    const next = {
      title: title !== undefined ? title : current.title,
      description: description !== undefined ? description : current.description,
      category: category !== undefined ? category : current.category,
      completed: completed !== undefined ? completed : current.completed,
    };
    const completedAt = next.completed
      ? (current.completed ? current.completed_at : new Date())
      : null;

    const result = await pool.query(
      `UPDATE tracker_items
       SET title = $1, description = $2, category = $3, completed = $4, completed_at = $5
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [next.title, next.description, next.category, next.completed, completedAt, id, req.user.id]
    );
    res.json({ item: result.rows[0] });
  } catch (err) {
    console.error('Update tracker item error:', err);
    res.status(500).json({ error: 'Could not update this tracker item.' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM tracker_items WHERE id = $1 AND user_id = $2 RETURNING id', [id, req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tracker item not found.' });
    }
    res.status(204).end();
  } catch (err) {
    console.error('Delete tracker item error:', err);
    res.status(500).json({ error: 'Could not delete this tracker item.' });
  }
});

module.exports = router;
