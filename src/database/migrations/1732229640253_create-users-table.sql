-- Up Migration
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE CHECK (email <> ''),
    clerk_id TEXT NOT NULL UNIQUE CHECK (clerk_id <> ''),
    is_admin BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Down Migration
DROP TABLE IF EXISTS users;
