# Spendly Backend API

Complete Node.js/Express REST API for the Spendly personal finance application.

## Features

- ✅ JWT-based authentication
- ✅ PostgreSQL database with connection pooling
- ✅ Complete CRUD operations for users, categories, budgets, and transactions
- ✅ Advanced analytics queries (spending trends, budget vs actual)
- ✅ Request validation and sanitization
- ✅ Security middleware (Helmet, CORS, rate limiting)
- ✅ Comprehensive error handling
- ✅ Database views and triggers for complex queries

## Tech Stack

- **Runtime**: Node.js 16+
- **Framework**: Express.js 4.x
- **Database**: PostgreSQL 12+ with node-postgres (pg)
- **Authentication**: JWT (jsonwebtoken) + bcrypt
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env`:
```env
NODE_ENV=development
PORT=5001
DB_HOST=localhost
DB_NAME=spendly
DB_USER=spendly_app
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key_min_32_chars
```

### 3. Set Up Database

Ensure PostgreSQL is running and the database is created:

```bash
# From the root directory
psql -d spendly -f database/schema.sql
psql -d spendly -f database/seed.sql
```

See `../database/README.md` for detailed database setup.

### 4. Start Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will start on http://localhost:5001

### 5. Test API

**Health check:**
```bash
curl http://localhost:5001/health
```

**API info:**
```bash
curl http://localhost:5001/api
```

## Project Structure

```
backend/
├── config/
│   └── database.js          # PostgreSQL connection pool
├── controllers/
│   ├── auth.controller.js   # Authentication logic
│   ├── user.controller.js   # User management
│   ├── category.controller.js
│   ├── budget.controller.js
│   └── transaction.controller.js
├── middleware/
│   ├── auth.js              # JWT authentication
│   └── validation.js        # Request validation
├── models/
│   ├── user.model.js        # User database operations
│   ├── category.model.js
│   ├── budget.model.js
│   └── transaction.model.js
├── routes/
│   ├── index.js             # Main router
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── category.routes.js
│   ├── budget.routes.js
│   └── transaction.routes.js
├── utils/
│   └── errors.js            # Custom error classes
├── .env.example
├── package.json
└── server.js                # Express app entry point
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (auth required)

### Users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user account

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Budgets
- `GET /api/budgets` - Get all budgets
- `GET /api/budgets/active` - Get active budgets
- `GET /api/budgets/status` - Get budget vs actual
- `GET /api/budgets/:id` - Get budget by ID
- `POST /api/budgets` - Create budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

### Transactions
- `GET /api/transactions` - Get all transactions (with filters)
- `GET /api/transactions/stats` - Get spending statistics
- `GET /api/transactions/trends` - Get spending trends
- `GET /api/transactions/:id` - Get transaction by ID
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

**For complete API documentation with request/response examples, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**

## Database Models

All models use parameterized queries for SQL injection protection.

**User Model** - Authentication and profile management
```javascript
User.findById(userId)
User.findByEmail(email)
User.create({ email, passwordHash, firstName, lastName })
User.update(userId, { firstName, lastName, email })
User.delete(userId)
```

**Category Model** - Income/expense categorization
```javascript
Category.findById(categoryId, userId)
Category.findByUser(userId, type)
Category.create({ userId, name, type, color })
Category.update(categoryId, userId, updates)
Category.delete(categoryId, userId)
```

**Budget Model** - Budget management and tracking
```javascript
Budget.findById(budgetId, userId)
Budget.findByUser(userId, filters)
Budget.findActiveBudgets(userId)
Budget.getBudgetStatus(userId)
Budget.create({ userId, categoryId, amount, periodStart, periodEnd })
Budget.update(budgetId, userId, updates)
Budget.delete(budgetId, userId)
```

**Transaction Model** - Financial transaction tracking
```javascript
Transaction.findById(transactionId, userId)
Transaction.findByUser(userId, filters)
Transaction.create({ userId, categoryId, amount, description, transactionDate, type })
Transaction.update(transactionId, userId, updates)
Transaction.delete(transactionId, userId)
Transaction.getSpendingByCategory(userId, startDate, endDate)
Transaction.getMonthlyTrend(userId, months)
```

## Middleware

### Authentication
Protects routes requiring user authentication:
```javascript
const { authenticate } = require('./middleware/auth');
router.get('/protected', authenticate, controller.method);
```

### Validation
Validates and sanitizes request data:
```javascript
const { validateTransaction } = require('./middleware/validation');
router.post('/transactions', validateTransaction, controller.create);
```

Available validators:
- `validateRegistration` - User registration
- `validateLogin` - User login
- `validateCategory` - Category creation/update
- `validateBudget` - Budget creation/update
- `validateTransaction` - Transaction creation/update
- `validateUuidParam` - UUID parameter validation
- `validateDateRange` - Date range query validation
- `validatePagination` - Pagination query validation

## Error Handling

Custom error classes for consistent error responses:

```javascript
const { NotFoundError, BadRequestError } = require('./utils/errors');

// Throw errors in controllers
if (!user) {
  throw new NotFoundError('User not found');
}

// Errors are automatically caught and formatted by errorHandler middleware
```

Available error classes:
- `BadRequestError` (400)
- `UnauthorizedError` (401)
- `ForbiddenError` (403)
- `NotFoundError` (404)
- `ConflictError` (409)
- `ValidationError` (422)
- `InternalServerError` (500)

## Security Features

- **Helmet**: Security headers
- **CORS**: Configured cross-origin resource sharing
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **JWT**: Stateless authentication with 7-day expiration
- **bcrypt**: Password hashing (10 salt rounds)
- **Input Validation**: express-validator on all endpoints
- **SQL Injection Protection**: Parameterized queries
- **Error Sanitization**: Production errors hide stack traces

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment | development |
| PORT | Server port | 5001 |
| DB_HOST | PostgreSQL host | localhost |
| DB_PORT | PostgreSQL port | 5432 |
| DB_NAME | Database name | spendly |
| DB_USER | Database user | spendly_app |
| DB_PASSWORD | Database password | (required) |
| DB_SSL | Enable SSL | false |
| JWT_SECRET | JWT signing key | (required) |
| JWT_EXPIRES_IN | Token expiration | 7d |
| CORS_ORIGIN | Allowed origin | http://localhost:3000 |
| RATE_LIMIT_WINDOW_MS | Rate limit window | 900000 (15min) |
| RATE_LIMIT_MAX_REQUESTS | Max requests | 100 |

## Testing

Run the server and test endpoints:

```bash
# Start server
npm run dev

# Test health check
curl http://localhost:5001/health

# Register user
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","firstName":"Test","lastName":"User"}'

# Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Get categories (use token from login)
curl http://localhost:5001/api/categories \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Database Connection

Connection pooling configuration:
- **Max connections**: 20
- **Idle timeout**: 30 seconds
- **Connection timeout**: 2 seconds

The pool automatically:
- Reconnects on connection loss
- Logs connection events
- Handles errors gracefully

## Graceful Shutdown

The server handles shutdown signals:
- Closes database connections
- Finishes pending requests
- Exits cleanly

```bash
# Stop server gracefully
Ctrl+C  # or
kill -SIGTERM <pid>
```

## Scripts

```bash
npm start          # Start server
npm run dev        # Start with auto-reload (nodemon)
npm test           # Run tests (not yet implemented)
npm run lint       # Run ESLint
npm run lint:fix   # Fix linting issues
```

## Performance Considerations

- Database queries use indexes for optimal performance
- Connection pooling reduces overhead
- Compression middleware reduces response size
- Database views pre-compute complex aggregations
- Rate limiting prevents abuse

## Troubleshooting

### Database connection errors
```bash
# Check PostgreSQL is running
pg_isready

# Test connection
psql -d spendly -U spendly_app
```

### Port already in use
```bash
# Find process using port
lsof -ti:5001

# Kill process
kill -9 $(lsof -ti:5001)
```

### JWT errors
- Ensure JWT_SECRET is set in .env
- JWT_SECRET must be at least 32 characters

## Contributing

1. Follow existing code style
2. Add validation for new endpoints
3. Document new API endpoints
4. Test before committing

## License

MIT
