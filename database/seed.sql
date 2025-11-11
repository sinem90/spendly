-- Spendly Database Seed Data
-- Sample data for testing and development

-- ========================================
-- Clean existing data (in reverse order of dependencies)
-- ========================================
DELETE FROM transactions;
DELETE FROM budgets;
DELETE FROM categories;
DELETE FROM users;

-- ========================================
-- Sample Users
-- ========================================

-- User 1: Brianna (from user persona - college student managing tight budget)
-- Password for all users: "Password123!" (hashed with bcrypt, cost factor 10)
-- Use bcrypt to generate this hash in your backend
INSERT INTO users (user_id, email, password_hash, first_name, last_name, created_at)
VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'brianna.chen@email.com', '$2b$10$rKvFJvqR7xZ1Q1fZ1Q1Q1O', 'Brianna', 'Chen', NOW() - INTERVAL '60 days'),
    ('b1ffcd99-9c0b-4ef8-bb6d-6bb9bd380a22', 'frank.marino@email.com', '$2b$10$rKvFJvqR7xZ1Q1fZ1Q1Q1O', 'Frank', 'Marino', NOW() - INTERVAL '45 days');

-- ========================================
-- Sample Categories for Brianna
-- ========================================

INSERT INTO categories (category_id, user_id, name, type, color, created_at)
VALUES
    -- Expense categories
    ('c1111111-1111-1111-1111-111111111111', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Groceries', 'expense', '#22c55e', NOW() - INTERVAL '60 days'),
    ('c2222222-2222-2222-2222-222222222222', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Dining Out', 'expense', '#f97316', NOW() - INTERVAL '60 days'),
    ('c3333333-3333-3333-3333-333333333333', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Transportation', 'expense', '#3b82f6', NOW() - INTERVAL '60 days'),
    ('c4444444-4444-4444-4444-444444444444', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Entertainment', 'expense', '#a855f7', NOW() - INTERVAL '60 days'),
    ('c5555555-5555-5555-5555-555555555555', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Utilities', 'expense', '#eab308', NOW() - INTERVAL '60 days'),
    ('c6666666-6666-6666-6666-666666666666', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Shopping', 'expense', '#ec4899', NOW() - INTERVAL '60 days'),
    ('c7777777-7777-7777-7777-777777777777', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Rent', 'expense', '#ef4444', NOW() - INTERVAL '60 days'),
    -- Income categories
    ('c8888888-8888-8888-8888-888888888888', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Salary', 'income', '#10b981', NOW() - INTERVAL '60 days'),
    ('c9999999-9999-9999-9999-999999999999', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Part-time Job', 'income', '#14b8a6', NOW() - INTERVAL '60 days');

-- ========================================
-- Sample Categories for Frank
-- ========================================

INSERT INTO categories (category_id, user_id, name, type, color, created_at)
VALUES
    ('d1111111-1111-1111-1111-111111111111', 'b1ffcd99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Groceries', 'expense', '#22c55e', NOW() - INTERVAL '45 days'),
    ('d2222222-2222-2222-2222-222222222222', 'b1ffcd99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Retirement Savings', 'expense', '#8b5cf6', NOW() - INTERVAL '45 days'),
    ('d3333333-3333-3333-3333-333333333333', 'b1ffcd99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Pension', 'income', '#10b981', NOW() - INTERVAL '45 days');

-- ========================================
-- Sample Budgets for Brianna (Current Month)
-- ========================================

-- Calculate current month period
INSERT INTO budgets (budget_id, user_id, category_id, amount, period_start, period_end, created_at)
VALUES
    ('b1111111-1111-1111-1111-111111111111', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1111111-1111-1111-1111-111111111111', 400.00, DATE_TRUNC('month', CURRENT_DATE), (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day')::DATE, NOW()),
    ('b2222222-2222-2222-2222-222222222222', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c2222222-2222-2222-2222-222222222222', 200.00, DATE_TRUNC('month', CURRENT_DATE), (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day')::DATE, NOW()),
    ('b3333333-3333-3333-3333-333333333333', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c3333333-3333-3333-3333-333333333333', 150.00, DATE_TRUNC('month', CURRENT_DATE), (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day')::DATE, NOW()),
    ('b4444444-4444-4444-4444-444444444444', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c4444444-4444-4444-4444-444444444444', 100.00, DATE_TRUNC('month', CURRENT_DATE), (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day')::DATE, NOW()),
    ('b5555555-5555-5555-5555-555555555555', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c7777777-7777-7777-7777-777777777777', 1200.00, DATE_TRUNC('month', CURRENT_DATE), (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day')::DATE, NOW());

-- ========================================
-- Sample Transactions for Brianna
-- ========================================

-- Current month transactions
INSERT INTO transactions (transaction_id, user_id, category_id, amount, description, transaction_date, type, created_at)
VALUES
    -- Income transactions
    ('t0000001-0000-0000-0000-000000000001', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c9999999-9999-9999-9999-999999999999', 850.00, 'Part-time job paycheck', DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 day', 'income', NOW() - INTERVAL '29 days'),
    ('t0000002-0000-0000-0000-000000000002', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c9999999-9999-9999-9999-999999999999', 850.00, 'Part-time job paycheck', DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '15 days', 'income', NOW() - INTERVAL '15 days'),

    -- Rent payment
    ('t0000003-0000-0000-0000-000000000003', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c7777777-7777-7777-7777-777777777777', 1200.00, 'Monthly rent', DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 day', 'expense', NOW() - INTERVAL '29 days'),

    -- Grocery transactions (approaching budget limit - $350 spent of $400)
    ('t0000004-0000-0000-0000-000000000004', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1111111-1111-1111-1111-111111111111', 87.45, 'Weekly groceries at Trader Joes', DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '2 days', 'expense', NOW() - INTERVAL '28 days'),
    ('t0000005-0000-0000-0000-000000000005', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1111111-1111-1111-1111-111111111111', 92.30, 'Groceries and household items', DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '9 days', 'expense', NOW() - INTERVAL '21 days'),
    ('t0000006-0000-0000-0000-000000000006', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1111111-1111-1111-1111-111111111111', 78.90, 'Weekly groceries', DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '16 days', 'expense', NOW() - INTERVAL '14 days'),
    ('t0000007-0000-0000-0000-000000000007', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1111111-1111-1111-1111-111111111111', 91.50, 'Groceries - Whole Foods', DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '23 days', 'expense', NOW() - INTERVAL '7 days'),

    -- Dining out transactions (over budget - $215 spent of $200 budget)
    ('t0000008-0000-0000-0000-000000000008', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c2222222-2222-2222-2222-222222222222', 35.60, 'Lunch with friends', DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '3 days', 'expense', NOW() - INTERVAL '27 days'),
    ('t0000009-0000-0000-0000-000000000009', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c2222222-2222-2222-2222-222222222222', 48.75, 'Dinner date', DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '7 days', 'expense', NOW() - INTERVAL '23 days'),
    ('t0000010-0000-0000-0000-000000000010', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c2222222-2222-2222-2222-222222222222', 28.40, 'Coffee and breakfast', DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '10 days', 'expense', NOW() - INTERVAL '20 days'),
    ('t0000011-0000-0000-0000-000000000011', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c2222222-2222-2222-2222-222222222222', 52.30, 'Pizza night', DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '14 days', 'expense', NOW() - INTERVAL '16 days'),
    ('t0000012-0000-0000-0000-000000000012', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c2222222-2222-2222-2222-222222222222', 49.95, 'Thai takeout', DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '21 days', 'expense', NOW() - INTERVAL '9 days'),

    -- Transportation (under budget)
    ('t0000013-0000-0000-0000-000000000013', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c3333333-3333-3333-3333-333333333333', 45.00, 'Gas', DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '5 days', 'expense', NOW() - INTERVAL '25 days'),
    ('t0000014-0000-0000-0000-000000000014', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c3333333-3333-3333-3333-333333333333', 12.50, 'Uber to campus', DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '12 days', 'expense', NOW() - INTERVAL '18 days'),
    ('t0000015-0000-0000-0000-000000000015', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c3333333-3333-3333-3333-333333333333', 38.20, 'Gas', DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '19 days', 'expense', NOW() - INTERVAL '11 days'),

    -- Entertainment (under budget)
    ('t0000016-0000-0000-0000-000000000016', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c4444444-4444-4444-4444-444444444444', 15.99, 'Netflix subscription', DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 day', 'expense', NOW() - INTERVAL '29 days'),
    ('t0000017-0000-0000-0000-000000000017', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c4444444-4444-4444-4444-444444444444', 32.00, 'Movie tickets', DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '8 days', 'expense', NOW() - INTERVAL '22 days'),
    ('t0000018-0000-0000-0000-000000000018', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c4444444-4444-4444-4444-444444444444', 24.50, 'Concert ticket', DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '18 days', 'expense', NOW() - INTERVAL '12 days'),

    -- Shopping (no budget set - spontaneous purchases)
    ('t0000019-0000-0000-0000-000000000019', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c6666666-6666-6666-6666-666666666666', 45.99, 'New shirt', DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '11 days', 'expense', NOW() - INTERVAL '19 days'),
    ('t0000020-0000-0000-0000-000000000020', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c6666666-6666-6666-6666-666666666666', 89.99, 'Shoes on sale', DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '20 days', 'expense', NOW() - INTERVAL '10 days');

-- Previous month transactions (for trend analysis)
INSERT INTO transactions (transaction_id, user_id, category_id, amount, description, transaction_date, type, created_at)
VALUES
    ('t1000001-0000-0000-0000-000000000001', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c9999999-9999-9999-9999-999999999999', 850.00, 'Part-time job paycheck', DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month' + INTERVAL '1 day', 'income', NOW() - INTERVAL '60 days'),
    ('t1000002-0000-0000-0000-000000000002', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c9999999-9999-9999-9999-999999999999', 850.00, 'Part-time job paycheck', DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month' + INTERVAL '15 days', 'income', NOW() - INTERVAL '45 days'),
    ('t1000003-0000-0000-0000-000000000003', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c7777777-7777-7777-7777-777777777777', 1200.00, 'Monthly rent', DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month' + INTERVAL '1 day', 'expense', NOW() - INTERVAL '60 days'),
    ('t1000004-0000-0000-0000-000000000004', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1111111-1111-1111-1111-111111111111', 320.50, 'Monthly groceries total', DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month' + INTERVAL '15 days', 'expense', NOW() - INTERVAL '45 days'),
    ('t1000005-0000-0000-0000-000000000005', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c2222222-2222-2222-2222-222222222222', 180.75, 'Dining expenses', DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month' + INTERVAL '15 days', 'expense', NOW() - INTERVAL '45 days');

-- ========================================
-- Sample Transactions for Frank
-- ========================================

INSERT INTO transactions (transaction_id, user_id, category_id, amount, description, transaction_date, type, created_at)
VALUES
    ('f0000001-0000-0000-0000-000000000001', 'b1ffcd99-9c0b-4ef8-bb6d-6bb9bd380a22', 'd3333333-3333-3333-3333-333333333333', 3200.00, 'Monthly pension', DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 day', 'income', NOW() - INTERVAL '29 days'),
    ('f0000002-0000-0000-0000-000000000002', 'b1ffcd99-9c0b-4ef8-bb6d-6bb9bd380a22', 'd1111111-1111-1111-1111-111111111111', 125.40, 'Groceries', DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '5 days', 'expense', NOW() - INTERVAL '25 days'),
    ('f0000003-0000-0000-0000-000000000003', 'b1ffcd99-9c0b-4ef8-bb6d-6bb9bd380a22', 'd2222222-2222-2222-2222-222222222222', 500.00, 'IRA contribution', DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '10 days', 'expense', NOW() - INTERVAL '20 days');

-- ========================================
-- Verification Queries
-- ========================================

-- Display summary of seeded data
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Database seeded successfully!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Users created: %', (SELECT COUNT(*) FROM users);
    RAISE NOTICE 'Categories created: %', (SELECT COUNT(*) FROM categories);
    RAISE NOTICE 'Budgets created: %', (SELECT COUNT(*) FROM budgets);
    RAISE NOTICE 'Transactions created: %', (SELECT COUNT(*) FROM transactions);
    RAISE NOTICE '========================================';
END $$;

-- Show user summary
SELECT
    u.first_name || ' ' || u.last_name AS user_name,
    u.email,
    COUNT(DISTINCT c.category_id) AS num_categories,
    COUNT(DISTINCT b.budget_id) AS num_budgets,
    COUNT(DISTINCT t.transaction_id) AS num_transactions
FROM users u
LEFT JOIN categories c ON u.user_id = c.user_id
LEFT JOIN budgets b ON u.user_id = b.user_id
LEFT JOIN transactions t ON u.user_id = t.user_id
GROUP BY u.user_id, u.first_name, u.last_name, u.email;
