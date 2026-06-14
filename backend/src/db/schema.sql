-- Data Privacy Advocacy site schema

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Catalog of suggested privacy actions users can add to their tracker
CREATE TABLE IF NOT EXISTS tracker_catalog (
  id SERIAL PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  description TEXT,
  category VARCHAR(60) NOT NULL
);

-- A user's personal privacy tracker items
CREATE TABLE IF NOT EXISTS tracker_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(160) NOT NULL,
  description TEXT,
  category VARCHAR(60) NOT NULL DEFAULT 'general',
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tracker_items_user_id ON tracker_items(user_id);

-- Demo breach data used as a fallback when no HIBP API key is configured
CREATE TABLE IF NOT EXISTS demo_breaches (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(160) NOT NULL,
  domain VARCHAR(160),
  breach_date DATE,
  pwn_count BIGINT,
  data_classes TEXT[],
  description TEXT
);

CREATE INDEX IF NOT EXISTS idx_demo_breaches_email ON demo_breaches(email);
