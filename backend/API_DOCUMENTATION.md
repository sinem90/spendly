# Spendly API Documentation

Complete REST API documentation for the Spendly personal finance application.

## Base URL

```
http://localhost:5001/api
```

## Authentication

Most endpoints require authentication using JWT (JSON Web Token). Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

All responses follow this general structure:

**Success Response:**
```json
{
  "message": "Success message",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "error": "Error type",
  "message": "Error description",
  "details": { ... }
}
```

---

## Authentication Endpoints

### Register New User

Create a new user account.

- **URL:** `/auth/register`
- **Method:** `POST`
- **Auth Required:** No

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "userId": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "token": "jwt_token_here"
}
```

---

### Login

Authenticate and receive JWT token.

- **URL:** `/auth/login`
- **Method:** `POST`
- **Auth Required:** No

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "userId": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "jwt_token_here"
}
```

---

### Get Current User

Get authenticated user's information.

- **URL:** `/auth/me`
- **Method:** `GET`
- **Auth Required:** Yes

**Success Response (200):**
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

### Logout

Logout (client-side operation for JWT).

- **URL:** `/auth/logout`
- **Method:** `POST`
- **Auth Required:** No

**Success Response (200):**
```json
{
  "message": "Logout successful",
  "note": "Please remove the token from client storage"
}
```

---

## User Endpoints

### Get User by ID

Get user profile information.

- **URL:** `/users/:id`
- **Method:** `GET`
- **Auth Required:** Yes
- **Permissions:** User can only access their own data

**Success Response (200):**
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

### Update User Profile

Update user information or password.

- **URL:** `/users/:id`
- **Method:** `PUT`
- **Auth Required:** Yes
- **Permissions:** User can only update their own data

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "newemail@example.com",
  "currentPassword": "OldPass123",
  "newPassword": "NewPass123"
}
```

**Success Response (200):**
```json
{
  "message": "User updated successfully",
  "user": {
    "userId": "uuid",
    "email": "newemail@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

---

### Delete User Account

Permanently delete user account and all associated data.

- **URL:** `/users/:id`
- **Method:** `DELETE`
- **Auth Required:** Yes
- **Permissions:** User can only delete their own account

**Success Response (200):**
```json
{
  "message": "User account deleted successfully",
  "userId": "uuid"
}
```

---

## Category Endpoints

### Get All Categories

Get all categories for the authenticated user.

- **URL:** `/categories`
- **Method:** `GET`
- **Auth Required:** Yes
- **Query Parameters:**
  - `type` (optional): Filter by type (`income` or `expense`)

**Success Response (200):**
```json
{
  "count": 5,
  "categories": [
    {
      "category_id": "uuid",
      "user_id": "uuid",
      "name": "Groceries",
      "type": "expense",
      "color": "#22c55e",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Get Category by ID

Get a specific category.

- **URL:** `/categories/:id`
- **Method:** `GET`
- **Auth Required:** Yes

**Success Response (200):**
```json
{
  "category_id": "uuid",
  "user_id": "uuid",
  "name": "Groceries",
  "type": "expense",
  "color": "#22c55e",
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

---

### Create Category

Create a new category.

- **URL:** `/categories`
- **Method:** `POST`
- **Auth Required:** Yes

**Request Body:**
```json
{
  "name": "Groceries",
  "type": "expense",
  "color": "#22c55e"
}
```

**Success Response (201):**
```json
{
  "message": "Category created successfully",
  "category": {
    "category_id": "uuid",
    "user_id": "uuid",
    "name": "Groceries",
    "type": "expense",
    "color": "#22c55e",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Update Category

Update an existing category.

- **URL:** `/categories/:id`
- **Method:** `PUT`
- **Auth Required:** Yes

**Request Body:**
```json
{
  "name": "Food & Groceries",
  "color": "#34d399"
}
```

**Success Response (200):**
```json
{
  "message": "Category updated successfully",
  "category": {
    "category_id": "uuid",
    "name": "Food & Groceries",
    "type": "expense",
    "color": "#34d399"
  }
}
```

---

### Delete Category

Delete a category. Fails if transactions reference this category.

- **URL:** `/categories/:id`
- **Method:** `DELETE`
- **Auth Required:** Yes

**Success Response (200):**
```json
{
  "message": "Category deleted successfully",
  "categoryId": "uuid"
}
```

**Error Response (400):**
```json
{
  "error": "Cannot delete category",
  "message": "This category has associated transactions and cannot be deleted"
}
```

---

## Budget Endpoints

### Get All Budgets

Get all budgets for the authenticated user.

- **URL:** `/budgets`
- **Method:** `GET`
- **Auth Required:** Yes
- **Query Parameters:**
  - `categoryId` (optional): Filter by category
  - `active` (optional): Filter active budgets (`true`/`false`)

**Success Response (200):**
```json
{
  "count": 3,
  "budgets": [
    {
      "budget_id": "uuid",
      "user_id": "uuid",
      "category_id": "uuid",
      "category_name": "Groceries",
      "category_type": "expense",
      "color": "#22c55e",
      "amount": "400.00",
      "period_start": "2024-01-01",
      "period_end": "2024-01-31",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Get Active Budgets

Get budgets active for the current period.

- **URL:** `/budgets/active`
- **Method:** `GET`
- **Auth Required:** Yes

**Success Response (200):**
```json
{
  "count": 3,
  "budgets": [ ... ]
}
```

---

### Get Budget Status

Get budget vs actual spending comparison (uses database view).

- **URL:** `/budgets/status`
- **Method:** `GET`
- **Auth Required:** Yes

**Success Response (200):**
```json
{
  "count": 3,
  "budgets": [
    {
      "user_id": "uuid",
      "budget_id": "uuid",
      "category_name": "Groceries",
      "color": "#22c55e",
      "budget_amount": "400.00",
      "period_start": "2024-01-01",
      "period_end": "2024-01-31",
      "spent_amount": "350.15",
      "percentage_used": "87.54",
      "remaining_amount": "49.85"
    }
  ]
}
```

---

### Get Budget by ID

Get a specific budget with spending details.

- **URL:** `/budgets/:id`
- **Method:** `GET`
- **Auth Required:** Yes

**Success Response (200):**
```json
{
  "budget_id": "uuid",
  "category_name": "Groceries",
  "amount": "400.00",
  "period_start": "2024-01-01",
  "period_end": "2024-01-31",
  "spending": {
    "budget_amount": "400.00",
    "spent_amount": "350.15",
    "percentage_used": "87.54"
  }
}
```

---

### Create Budget

Create a new budget.

- **URL:** `/budgets`
- **Method:** `POST`
- **Auth Required:** Yes

**Request Body:**
```json
{
  "categoryId": "uuid",
  "amount": 400.00,
  "periodStart": "2024-01-01",
  "periodEnd": "2024-01-31"
}
```

**Success Response (201):**
```json
{
  "message": "Budget created successfully",
  "budget": {
    "budget_id": "uuid",
    "user_id": "uuid",
    "category_id": "uuid",
    "amount": "400.00",
    "period_start": "2024-01-01",
    "period_end": "2024-01-31",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Update Budget

Update an existing budget.

- **URL:** `/budgets/:id`
- **Method:** `PUT`
- **Auth Required:** Yes

**Request Body:**
```json
{
  "amount": 450.00,
  "periodEnd": "2024-01-31"
}
```

**Success Response (200):**
```json
{
  "message": "Budget updated successfully",
  "budget": { ... }
}
```

---

### Delete Budget

Delete a budget.

- **URL:** `/budgets/:id`
- **Method:** `DELETE`
- **Auth Required:** Yes

**Success Response (200):**
```json
{
  "message": "Budget deleted successfully",
  "budgetId": "uuid"
}
```

---

## Transaction Endpoints

### Get All Transactions

Get transactions with filtering and pagination.

- **URL:** `/transactions`
- **Method:** `GET`
- **Auth Required:** Yes
- **Query Parameters:**
  - `categoryId` (optional): Filter by category
  - `type` (optional): Filter by type (`income` or `expense`)
  - `startDate` (optional): Start date for date range (ISO 8601)
  - `endDate` (optional): End date for date range (ISO 8601)
  - `limit` (optional): Number of results (default: 50, max: 100)
  - `offset` (optional): Pagination offset (default: 0)

**Success Response (200):**
```json
{
  "count": 20,
  "total": 150,
  "transactions": [
    {
      "transaction_id": "uuid",
      "user_id": "uuid",
      "category_id": "uuid",
      "category_name": "Groceries",
      "category_color": "#22c55e",
      "amount": "52.34",
      "description": "Weekly groceries",
      "transaction_date": "2024-01-15",
      "type": "expense",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Get Transaction Statistics

Get spending statistics by category for a date range.

- **URL:** `/transactions/stats`
- **Method:** `GET`
- **Auth Required:** Yes
- **Query Parameters:**
  - `startDate` (optional): Start date (ISO 8601)
  - `endDate` (optional): End date (ISO 8601)

**Success Response (200):**
```json
{
  "totalExpenses": 1250.75,
  "categoriesCount": 5,
  "byCategory": [
    {
      "category_id": "uuid",
      "category_name": "Groceries",
      "color": "#22c55e",
      "total_amount": "350.15",
      "transaction_count": "12"
    }
  ]
}
```

---

### Get Spending Trends

Get monthly spending trends.

- **URL:** `/transactions/trends`
- **Method:** `GET`
- **Auth Required:** Yes
- **Query Parameters:**
  - `months` (optional): Number of months to include (default: 6)

**Success Response (200):**
```json
{
  "count": 6,
  "trends": [
    {
      "month": "2024-01-01T00:00:00.000Z",
      "total_expenses": "1250.75",
      "total_income": "2500.00",
      "transaction_count": "45"
    }
  ]
}
```

---

### Get Transaction by ID

Get a specific transaction.

- **URL:** `/transactions/:id`
- **Method:** `GET`
- **Auth Required:** Yes

**Success Response (200):**
```json
{
  "transaction_id": "uuid",
  "user_id": "uuid",
  "category_id": "uuid",
  "category_name": "Groceries",
  "category_color": "#22c55e",
  "amount": "52.34",
  "description": "Weekly groceries",
  "transaction_date": "2024-01-15",
  "type": "expense",
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

---

### Create Transaction

Create a new transaction.

- **URL:** `/transactions`
- **Method:** `POST`
- **Auth Required:** Yes

**Request Body:**
```json
{
  "categoryId": "uuid",
  "amount": 52.34,
  "description": "Weekly groceries",
  "transactionDate": "2024-01-15",
  "type": "expense"
}
```

**Success Response (201):**
```json
{
  "message": "Transaction created successfully",
  "transaction": {
    "transaction_id": "uuid",
    "user_id": "uuid",
    "category_id": "uuid",
    "amount": "52.34",
    "description": "Weekly groceries",
    "transaction_date": "2024-01-15",
    "type": "expense",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Update Transaction

Update an existing transaction.

- **URL:** `/transactions/:id`
- **Method:** `PUT`
- **Auth Required:** Yes

**Request Body:**
```json
{
  "amount": 55.00,
  "description": "Weekly groceries at Trader Joes"
}
```

**Success Response (200):**
```json
{
  "message": "Transaction updated successfully",
  "transaction": { ... }
}
```

---

### Delete Transaction

Delete a transaction.

- **URL:** `/transactions/:id`
- **Method:** `DELETE`
- **Auth Required:** Yes

**Success Response (200):**
```json
{
  "message": "Transaction deleted successfully",
  "transactionId": "uuid"
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation failed |
| 500 | Internal Server Error |

---

## Rate Limiting

API requests are rate-limited to 100 requests per 15 minutes per IP address.

**Rate Limit Headers:**
```
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1234567890
```

---

## Example Usage

### Using cURL

**Login:**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePass123"}'
```

**Get Transactions (Authenticated):**
```bash
curl -X GET http://localhost:5001/api/transactions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using JavaScript (Fetch)

```javascript
// Login
const loginResponse = await fetch('http://localhost:5001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123'
  })
});
const { token } = await loginResponse.json();

// Get transactions
const transactionsResponse = await fetch('http://localhost:5001/api/transactions', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const transactions = await transactionsResponse.json();
```

---

## Notes

- All dates use ISO 8601 format (YYYY-MM-DD)
- All timestamps use ISO 8601 format with timezone
- UUIDs are used for all entity IDs
- Monetary amounts are returned as strings to preserve precision
- Password requirements: Minimum 8 characters, must contain uppercase, lowercase, and number
