-- Up Migration
CREATE TABLE IF NOT EXISTS expense_splits (
    expense_split_id SERIAL PRIMARY KEY,
    expense_id INT NOT NULL REFERENCES expenses(expense_id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    amount INT NOT NULL,
    is_paid BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Down Migration
DROP TABLE IF EXISTS subexpenses;
