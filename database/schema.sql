-- Spendly Database Schema
-- PostgreSQL Database Design

-- Enable UUID extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop tables in reverse order of dependencies to avoid foreign key conflicts
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS budgets CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ========================================
-- Table 1: users
-- ========================================
-- Purpose: Stores authentication credentials and basic profile information
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for fast authentication lookups
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- ========================================
-- Table 2: categories
-- ========================================
-- Purpose: Stores user-defined spending and income categories
CREATE TABLE categories (
    category_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    color VARCHAR(7) DEFAULT '#2563eb',
    created_at TIMESTAMP DEFAULT NOW(),

    -- Foreign key constraint with CASCADE delete
    CONSTRAINT fk_categories_user FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- Index for retrieving all categories for a user
CREATE INDEX idx_categories_user_id ON categories(user_id);

-- ========================================
-- Table 3: budgets
-- ========================================
-- Purpose: Defines monthly spending limits for each category
CREATE TABLE budgets (
    budget_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    category_id UUID NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),

    -- Foreign key constraints with CASCADE delete
    CONSTRAINT fk_budgets_user FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_budgets_category FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE CASCADE
);

-- Composite index for finding active budgets
CREATE INDEX idx_budgets_user_period ON budgets(user_id, period_start, period_end);

-- ========================================
-- Table 4: transactions
-- ========================================
-- Purpose: Core data repository storing every income and expense entry
CREATE TABLE transactions (
    transaction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    category_id UUID NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    description VARCHAR(255),
    transaction_date DATE NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    -- Foreign key constraint with CASCADE delete for user
    CONSTRAINT fk_transactions_user FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    -- Foreign key constraint with RESTRICT delete for category
    -- This prevents category deletion if transactions reference it
    CONSTRAINT fk_transactions_category FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE RESTRICT
);

-- Composite index for date-range queries by user (critical for dashboard)
CREATE INDEX idx_transactions_user_date ON transactions(user_id, transaction_date);

-- Index for category-specific aggregations
CREATE INDEX idx_transactions_category_id ON transactions(category_id);

-- ========================================
-- Helpful Views for Common Queries
-- ========================================

-- View: Current month spending by category
CREATE OR REPLACE VIEW current_month_spending AS
SELECT
    c.user_id,
    c.category_id,
    c.name AS category_name,
    c.color,
    COALESCE(SUM(t.amount), 0) AS total_spent,
    COUNT(t.transaction_id) AS transaction_count
FROM categories c
LEFT JOIN transactions t ON t.category_id = c.category_id
    AND t.type = 'expense'
    AND t.transaction_date >= DATE_TRUNC('month', CURRENT_DATE)
    AND t.transaction_date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
WHERE c.type = 'expense'
GROUP BY c.user_id, c.category_id, c.name, c.color;

-- View: Budget vs Actual comparison
CREATE OR REPLACE VIEW budget_vs_actual AS
SELECT
    b.user_id,
    b.budget_id,
    c.name AS category_name,
    c.color,
    b.amount AS budget_amount,
    b.period_start,
    b.period_end,
    COALESCE(SUM(t.amount), 0) AS spent_amount,
    CASE
        WHEN b.amount = 0 THEN 0
        ELSE ROUND((COALESCE(SUM(t.amount), 0) / b.amount * 100), 2)
    END AS percentage_used,
    b.amount - COALESCE(SUM(t.amount), 0) AS remaining_amount
FROM budgets b
JOIN categories c ON b.category_id = c.category_id
LEFT JOIN transactions t ON t.category_id = b.category_id
    AND t.type = 'expense'
    AND t.transaction_date BETWEEN b.period_start AND b.period_end
WHERE CURRENT_DATE BETWEEN b.period_start AND b.period_end
GROUP BY b.budget_id, b.user_id, c.name, c.color, b.amount, b.period_start, b.period_end;

-- ========================================
-- Trigger: Update updated_at timestamp
-- ========================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for transactions table
CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- Comments for documentation
-- ========================================

COMMENT ON TABLE users IS 'Stores user authentication credentials and profile information';
COMMENT ON TABLE categories IS 'Stores user-defined spending and income categories';
COMMENT ON TABLE budgets IS 'Defines monthly spending limits for each category';
COMMENT ON TABLE transactions IS 'Core table storing all income and expense transactions';

COMMENT ON COLUMN users.user_id IS 'Unique identifier for each user (UUID)';
COMMENT ON COLUMN users.email IS 'User email address for authentication (unique)';
COMMENT ON COLUMN users.password_hash IS 'Hashed password using bcrypt';

COMMENT ON COLUMN categories.type IS 'Category type: income or expense';
COMMENT ON COLUMN categories.color IS 'Hex color code for UI visualization';

COMMENT ON COLUMN budgets.amount IS 'Monthly budget amount in dollars (must be >= 0)';
COMMENT ON COLUMN budgets.period_start IS 'Start date of budget period';
COMMENT ON COLUMN budgets.period_end IS 'End date of budget period';

COMMENT ON COLUMN transactions.amount IS 'Transaction amount in dollars (must be > 0)';
COMMENT ON COLUMN transactions.type IS 'Transaction type: income or expense';
COMMENT ON COLUMN transactions.transaction_date IS 'Date the transaction occurred';

-- ========================================
-- Grant permissions (adjust as needed for your environment)
-- ========================================

-- Example: GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO spendly_app;
-- Example: GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO spendly_app;
