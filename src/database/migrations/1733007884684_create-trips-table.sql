-- Up Migration
CREATE TABLE IF NOT EXISTS trips (
    trip_id SERIAL PRIMARY KEY,
    owner_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    -- Code to join trip group
    code TEXT NOT NULL UNIQUE CHECK (code <> ''),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Down Migration
DROP TABLE IF EXISTS trips;
