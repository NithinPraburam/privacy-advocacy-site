require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const trackerRoutes = require('./routes/tracker');
const breachRoutes = require('./routes/breach');
const newsRoutes = require('./routes/news');

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/tracker', trackerRoutes);
app.use('/api/breach-check', breachRoutes);
app.use('/api/news', newsRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found.' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error.' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Privacy advocacy API listening on port ${PORT}`);
});
