CREATE TABLE IF NOT EXISTS prize_entries (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  consent BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_prize_entries_email ON prize_entries (email);
CREATE INDEX IF NOT EXISTS idx_prize_entries_created_at ON prize_entries (created_at DESC);
