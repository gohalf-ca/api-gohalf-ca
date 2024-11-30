-- Up Migration
CREATE TABLE IF NOT EXISTS user_trips (
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    trip_id INT NOT NULL REFERENCES trips(trip_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, trip_id)
);

-- Down Migration
DROP TABLE IF EXISTS user_trips;
