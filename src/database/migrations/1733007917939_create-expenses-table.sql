-- Up Migration
CREATE TABLE IF NOT EXISTS expenses (
    expense_id SERIAL PRIMARY KEY,
    trip_id INT NOT NULL REFERENCES trips(trip_id) ON DELETE CASCADE,
    created_by INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    amount INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Down Migration
DROP TABLE IF EXISTS expenses;
