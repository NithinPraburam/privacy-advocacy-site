require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('../db');

async function setup() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(schema);
  console.log('Database schema created successfully.');
  await pool.end();
}

setup().catch((err) => {
  console.error('Failed to set up database:', err);
  process.exit(1);
});
