# Spendly Database Setup

This folder contains the PostgreSQL database schema and seed data for the Spendly personal finance application.

## Prerequisites

- PostgreSQL 12 or higher installed
- `psql` command-line tool (comes with PostgreSQL)
- Basic knowledge of SQL and command-line operations

## Database Architecture

The Spendly database consists of 4 main tables:

1. **users** - User authentication and profile information
2. **categories** - User-defined income and expense categories
3. **budgets** - Monthly spending limits for each category
4. **transactions** - Core table storing all financial transactions

### Key Features

- UUID primary keys for all tables
- Foreign key relationships with CASCADE and RESTRICT rules
- CHECK constraints for data validation
- Indexes optimized for dashboard queries
- Helpful views for common analytical queries
- Automatic timestamp updates via triggers

## Installation Steps

### 1. Install PostgreSQL

**macOS (using Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Windows:**
Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)

### 2. Create Database and User

Connect to PostgreSQL as the default user:
```bash
# macOS/Linux
psql postgres

# If you need to specify the user
psql -U postgres
```

Create the database and user:
```sql
-- Create the database
CREATE DATABASE spendly;

-- Create a dedicated user for the application
CREATE USER spendly_app WITH PASSWORD 'your_secure_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE spendly TO spendly_app;

-- Connect to the spendly database
\c spendly

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO spendly_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO spendly_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO spendly_app;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO spendly_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO spendly_app;

-- Exit psql
\q
```

### 3. Run Schema Script

Apply the database schema:
```bash
psql -U spendly_app -d spendly -f schema.sql
```

Or if you're using the default user:
```bash
psql -d spendly -f schema.sql
```

### 4. Load Sample Data (Optional)

Load test data for development:
```bash
psql -U spendly_app -d spendly -f seed.sql
```

## Verification

After running the scripts, verify the setup:

```bash
psql -U spendly_app -d spendly
```

Run these queries to verify:
```sql
-- Check all tables exist
\dt

-- Check table structure
\d users
\d categories
\d budgets
\d transactions

-- Check indexes
\di

-- Check views
\dv

-- View sample data count
SELECT
    (SELECT COUNT(*) FROM users) AS users,
    (SELECT COUNT(*) FROM categories) AS categories,
    (SELECT COUNT(*) FROM budgets) AS budgets,
    (SELECT COUNT(*) FROM transactions) AS transactions;

-- View budget vs actual spending (from the helpful view)
SELECT * FROM budget_vs_actual;

-- View current month spending by category
SELECT * FROM current_month_spending;
```

## Sample Queries

### Get all transactions for a user:
```sql
SELECT t.*, c.name AS category_name
FROM transactions t
JOIN categories c ON t.category_id = c.category_id
WHERE t.user_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
ORDER BY t.transaction_date DESC
LIMIT 10;
```

### Check budget status:
```sql
SELECT * FROM budget_vs_actual
WHERE user_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
```

### Monthly spending trend:
```sql
SELECT
    DATE_TRUNC('month', transaction_date) AS month,
    SUM(amount) AS total_spent
FROM transactions
WHERE user_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
    AND type = 'expense'
GROUP BY DATE_TRUNC('month', transaction_date)
ORDER BY month DESC;
```

## Sample Test Users

After running `seed.sql`, you'll have these test users:

| Name | Email | Password (unhashed) | Description |
|------|-------|---------------------|-------------|
| Brianna Chen | brianna.chen@email.com | Password123! | College student with tight budget |
| Frank Marino | frank.marino@email.com | Password123! | Retiree tracking pension income |

**Note:** The passwords in seed.sql are placeholder hashes. In your backend, you'll need to implement proper bcrypt hashing.

## Environment Variables for Backend

Add these to your backend `.env` file:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=spendly
DB_USER=spendly_app
DB_PASSWORD=your_secure_password_here
DB_SSL=false
```

For production, set `DB_SSL=true` and use secure connection strings.

## Backup and Restore

### Backup
```bash
pg_dump -U spendly_app spendly > spendly_backup.sql
```

### Restore
```bash
psql -U spendly_app spendly < spendly_backup.sql
```

## Reset Database

To completely reset the database:
```bash
# Drop and recreate
psql -U postgres -c "DROP DATABASE IF EXISTS spendly;"
psql -U postgres -c "CREATE DATABASE spendly;"

# Re-run schema and seed
psql -U spendly_app -d spendly -f schema.sql
psql -U spendly_app -d spendly -f seed.sql
```

## Troubleshooting

### Permission denied errors
```sql
-- Connect as postgres user and grant permissions
psql -U postgres spendly
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO spendly_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO spendly_app;
```

### UUID extension not available
```sql
-- Connect to database and install extension
psql -U postgres spendly
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Connection refused
- Check if PostgreSQL is running: `pg_isready`
- Start PostgreSQL service:
  - macOS: `brew services start postgresql@15`
  - Linux: `sudo systemctl start postgresql`

## Cloud Deployment Options

### Heroku Postgres
```bash
heroku addons:create heroku-postgresql:mini
heroku pg:psql < schema.sql
```

### AWS RDS
1. Create PostgreSQL RDS instance
2. Update security group for your IP
3. Connect: `psql -h your-instance.region.rds.amazonaws.com -U spendly_app -d spendly`

### DigitalOcean Managed Database
1. Create PostgreSQL cluster
2. Download CA certificate
3. Connect with SSL: `psql "sslmode=require host=your-host port=25060 user=doadmin dbname=spendly"`

## Performance Optimization

The schema includes these optimizations:
- Composite indexes on frequently queried columns
- Views for common dashboard queries
- Proper foreign key indexes
- CHECK constraints to prevent invalid data

For production at scale, consider:
- Partitioning `transactions` table by date
- Materialized views for heavy aggregations
- Read replicas for dashboard queries
- Connection pooling (e.g., PgBouncer)

## Schema Migrations

For future schema changes, use a migration tool:
- [node-pg-migrate](https://github.com/salsita/node-pg-migrate)
- [db-migrate](https://github.com/db-migrate/node-db-migrate)
- [Knex.js migrations](http://knexjs.org/)

## Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [node-postgres (pg) Documentation](https://node-postgres.com/)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- Design Document: `docs/Spendly_Database_Design.docx`
