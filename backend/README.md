# Spendly Backend API

Node.js/Express backend API for the Spendly personal finance application.

## Current Status

**Phase 1 Complete** - Core infrastructure is set up:
- ✅ Express server with middleware
- ✅ PostgreSQL database connection with pooling
- ✅ User, Category, and Transaction models
- ✅ Authentication middleware (JWT)
- ✅ Validation middleware
- ✅ Environment configuration

**TODO** - Still needed for complete backend:
- Controllers for all routes
- Complete route implementations
- Budget model
- Error handling utilities
- Testing setup

## Tech Stack

- **Runtime**: Node.js 16+
- **Framework**: Express.js
- **Database**: PostgreSQL with node-postgres (pg)
- **Authentication**: JWT (jsonwebtoken) + bcrypt
- **Validation**: express-validator
- **Security**: helmet, cors, rate-limiting

## Project Structure

```
backend/
├── config/
│   └── database.js          # PostgreSQL connection pool
├── middleware/
│   ├── auth.js              # JWT authentication
│   └── validation.js        # Request validation rules
├── models/
│   ├── user.model.js        # User database operations
│   ├── category.model.js    # Category database operations
│   └── transaction.model.js # Transaction database operations
├── routes/                  # TODO: Route definitions
├── controllers/             # TODO: Request handlers
├── utils/                   # TODO: Helper functions
├── .env.example             # Environment variables template
├── package.json             # Dependencies
├── server.js                # Express app entry point
└── README.md                # This file
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` with your settings:
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=spendly
DB_USER=spendly_app
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key_min_32_chars
```

### 3. Set Up Database

Make sure PostgreSQL is running and the database is created. See `../database/README.md` for instructions.

```bash
# From the database folder
psql -U spendly_app -d spendly -f schema.sql
psql -U spendly_app -d spendly -f seed.sql
```

### 4. Run the Server

**Development mode with auto-reload:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## Available Endpoints

### Health Check
- `GET /health` - Check server and database status

### API Routes (TODO)
Currently stubbed out. Full implementation coming soon:
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/categories` - Get user's categories
- `GET /api/transactions` - Get user's transactions
- `GET /api/budgets` - Get user's budgets

## Database Models

### User Model
```javascript
User.findById(userId)
User.findByEmail(email)
User.create({ email, passwordHash, firstName, lastName })
User.update(userId, { firstName, lastName, email })
User.delete(userId)
```

### Category Model
```javascript
Category.findById(categoryId, userId)
Category.findByUser(userId, type)
Category.create({ userId, name, type, color })
Category.update(categoryId, userId, { name, type, color })
Category.delete(categoryId, userId)
```

### Transaction Model
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
```javascript
const { authenticate } = require('./middleware/auth');

// Protect routes
router.get('/protected', authenticate, controller.method);
```

### Validation
```javascript
const { validateTransaction } = require('./middleware/validation');

// Validate request body
router.post('/transactions', validateTransaction, controller.create);
```

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing configured
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **JWT**: Stateless authentication with 7-day expiration
- **bcrypt**: Password hashing with salt rounds
- **Input Validation**: express-validator on all endpoints
- **SQL Injection Protection**: Parameterized queries

## Database Connection

The application uses connection pooling for efficient database access:
- Max connections: 20
- Idle timeout: 30 seconds
- Connection timeout: 2 seconds

## Error Handling

The server includes:
- Global error handler middleware
- Graceful shutdown on SIGTERM/SIGINT
- Unhandled rejection handler
- Database error logging

## Development

### Run with auto-reload
```bash
npm run dev
```

### Linting
```bash
npm run lint
npm run lint:fix
```

### Testing (TODO)
```bash
npm test
npm run test:watch
```

## Next Steps

To complete the backend:

1. **Create Controllers** - Implement business logic for each route
2. **Create Routes** - Wire up controllers to Express routes
3. **Budget Model** - Add budget-related database operations
4. **Error Utilities** - Custom error classes and handlers
5. **Testing** - Add unit and integration tests
6. **Documentation** - Add JSDoc comments and API documentation

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment (development/production) | development |
| PORT | Server port | 5000 |
| DB_HOST | PostgreSQL host | localhost |
| DB_PORT | PostgreSQL port | 5432 |
| DB_NAME | Database name | spendly |
| DB_USER | Database user | spendly_app |
| DB_PASSWORD | Database password | (required) |
| DB_SSL | Enable SSL for database | false |
| JWT_SECRET | Secret key for JWT signing | (required) |
| JWT_EXPIRES_IN | JWT expiration time | 7d |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:3000 |

## License

MIT
