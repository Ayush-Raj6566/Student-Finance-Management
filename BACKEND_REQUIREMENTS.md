# Backend API Requirements for Student Finance Management System

## Base URL
```
http://localhost:3001/api
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## 1. Authentication Endpoints

### POST /auth/login
**Purpose**: User login
**Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```
**Response**:
```json
{
  "success": true,
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "memberSince": "string (ISO date)",
    "studentId": "string"
  },
  "token": "string (JWT token)"
}
```

### POST /auth/signup
**Purpose**: User registration
**Request Body**:
```json
{
  "name": "string",
  "email": "string",
  "studentId": "string",
  "password": "string"
}
```
**Response**:
```json
{
  "success": true,
  "message": "Account created successfully"
}
```

---

## 2. User Profile Endpoints

### GET /users/:userId
**Purpose**: Get user profile
**Headers**: Authorization required
**Response**:
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "memberSince": "string (ISO date)",
  "studentId": "string"
}
```

### PUT /users/:userId
**Purpose**: Update user profile
**Headers**: Authorization required
**Request Body**:
```json
{
  "name": "string (optional)",
  "email": "string (optional)",
  "studentId": "string (optional)"
}
```
**Response**:
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

---

## 3. Transaction Endpoints

### GET /transactions
**Purpose**: Get transactions with filters
**Headers**: Authorization required
**Query Parameters**:
- `year`: number (optional)
- `month`: number (optional, 1-12)
- `date`: string (optional, YYYY-MM-DD format)
- `type`: string (optional, 'income' | 'expense' | 'all')
- `category`: string (optional)
- `search`: string (optional, search in description/category/id)
- `limit`: number (optional, default 50)
- `offset`: number (optional, default 0)

**Response**:
```json
{
  "transactions": [
    {
      "id": "string",
      "amount": "number",
      "category": "string",
      "type": "income | expense",
      "date": "string (YYYY-MM-DD)",
      "description": "string"
    }
  ],
  "total": "number",
  "hasMore": "boolean"
}
```

### POST /transactions
**Purpose**: Add new transaction
**Headers**: Authorization required
**Request Body**:
```json
{
  "amount": "number",
  "category": "string",
  "type": "income | expense",
  "description": "string",
  "date": "string (YYYY-MM-DD)"
}
```
**Response**:
```json
{
  "success": true,
  "transaction": {
    "id": "string",
    "amount": "number",
    "category": "string",
    "type": "income | expense",
    "date": "string",
    "description": "string"
  }
}
```

### PUT /transactions/:transactionId
**Purpose**: Update transaction
**Headers**: Authorization required
**Request Body**:
```json
{
  "amount": "number (optional)",
  "category": "string (optional)",
  "type": "income | expense (optional)",
  "description": "string (optional)",
  "date": "string (optional)"
}
```
**Response**:
```json
{
  "success": true,
  "message": "Transaction updated successfully"
}
```

### DELETE /transactions/:transactionId
**Purpose**: Delete transaction
**Headers**: Authorization required
**Response**:
```json
{
  "success": true,
  "message": "Transaction deleted successfully"
}
```

---

## 4. Reports and Analytics Endpoints

### GET /reports/monthly
**Purpose**: Get monthly report
**Headers**: Authorization required
**Query Parameters**:
- `month`: number (1-12)
- `year`: number

**Response**:
```json
{
  "totalSpent": "number",
  "totalIncome": "number",
  "netBalance": "number",
  "categoryBreakdown": {
    "Food": "number",
    "Transportation": "number",
    "Entertainment": "number",
    "Shopping": "number",
    "Health": "number"
  }
}
```

### GET /analytics
**Purpose**: Get analytics data
**Headers**: Authorization required
**Query Parameters**:
- `period`: string ('week' | 'month' | 'quarter' | 'year')

**Response**:
```json
{
  "totalIncome": "number",
  "totalExpenses": "number",
  "netBalance": "number",
  "categoryBreakdown": {
    "category_name": "number"
  }
}
```

### GET /analytics/categories
**Purpose**: Get category breakdown
**Headers**: Authorization required
**Query Parameters**:
- `period`: string ('week' | 'month' | 'quarter' | 'year')

**Response**:
```json
{
  "categories": {
    "category_name": {
      "amount": "number",
      "percentage": "number",
      "transactionCount": "number"
    }
  }
}
```

---

## 5. Budget Endpoints

### GET /budgets
**Purpose**: Get all budgets
**Headers**: Authorization required
**Response**:
```json
{
  "budgets": [
    {
      "id": "string",
      "category": "string",
      "amount": "number",
      "spent": "number",
      "period": "monthly | weekly | yearly"
    }
  ]
}
```

### POST /budgets
**Purpose**: Create new budget
**Headers**: Authorization required
**Request Body**:
```json
{
  "category": "string",
  "amount": "number",
  "period": "monthly | weekly | yearly"
}
```
**Response**:
```json
{
  "success": true,
  "budget": {
    "id": "string",
    "category": "string",
    "amount": "number",
    "spent": "number",
    "period": "string"
  }
}
```

### PUT /budgets/:budgetId
**Purpose**: Update budget
**Headers**: Authorization required
**Request Body**:
```json
{
  "category": "string (optional)",
  "amount": "number (optional)",
  "period": "string (optional)"
}
```
**Response**:
```json
{
  "success": true,
  "message": "Budget updated successfully"
}
```

### DELETE /budgets/:budgetId
**Purpose**: Delete budget
**Headers**: Authorization required
**Response**:
```json
{
  "success": true,
  "message": "Budget deleted successfully"
}
```

---

## 6. AI Chat Bot Endpoint

### POST /bot/query
**Purpose**: Get AI response for user query
**Headers**: Authorization required
**Request Body**:
```json
{
  "query": "string"
}
```
**Response**:
```json
{
  "answer": "string",
  "suggestions": ["string"] // optional
}
```

---

## 7. Categories Endpoint

### GET /categories
**Purpose**: Get available transaction categories
**Headers**: Authorization required
**Response**:
```json
{
  "categories": [
    "Food",
    "Transportation",
    "Entertainment",
    "Shopping",
    "Health",
    "Education",
    "Utilities"
  ]
}
```

---

## 8. Settings Endpoints

### GET /settings
**Purpose**: Get user settings
**Headers**: Authorization required
**Response**:
```json
{
  "notifications": "boolean",
  "darkMode": "boolean",
  "currency": "string"
}
```

### PUT /settings
**Purpose**: Update user settings
**Headers**: Authorization required
**Request Body**:
```json
{
  "notifications": "boolean (optional)",
  "darkMode": "boolean (optional)",
  "currency": "string (optional)"
}
```
**Response**:
```json
{
  "success": true,
  "message": "Settings updated successfully"
}
```

---

## 9. Export Data Endpoint

### GET /export
**Purpose**: Export user data
**Headers**: Authorization required
**Query Parameters**:
- `format`: string ('csv' | 'json' | 'pdf')

**Response**: File download (blob)

---

## Database Schema Requirements

### Users Table
```sql
- id (Primary Key)
- name (String)
- email (String, Unique)
- studentId (String, Unique)
- password (String, Hashed)
- memberSince (DateTime)
- createdAt (DateTime)
- updatedAt (DateTime)
```

### Transactions Table
```sql
- id (Primary Key)
- userId (Foreign Key to Users)
- amount (Decimal)
- category (String)
- type (Enum: 'income', 'expense')
- description (Text)
- date (Date)
- createdAt (DateTime)
- updatedAt (DateTime)
```

### Budgets Table
```sql
- id (Primary Key)
- userId (Foreign Key to Users)
- category (String)
- amount (Decimal)
- period (Enum: 'monthly', 'weekly', 'yearly')
- createdAt (DateTime)
- updatedAt (DateTime)
```

### Settings Table
```sql
- id (Primary Key)
- userId (Foreign Key to Users)
- notifications (Boolean, Default: true)
- darkMode (Boolean, Default: true)
- currency (String, Default: 'USD')
- createdAt (DateTime)
- updatedAt (DateTime)
```

---

## Error Response Format
All endpoints should return errors in this format:
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE (optional)"
}
```

## Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

---

## Environment Variables Required
```
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

## Additional Notes
1. All monetary values should be stored as decimals with 2 decimal places
2. Dates should be in YYYY-MM-DD format
3. JWT tokens should expire after 24 hours
4. Implement proper password hashing (bcrypt recommended)
5. Add input validation for all endpoints
6. Implement rate limiting for API endpoints
7. Add proper logging for debugging
8. The AI bot endpoint can be a simple rule-based system initially

---

## Summary of All API Endpoints Your Friend Needs to Create:

### Authentication (2 endpoints)
- POST /auth/login
- POST /auth/signup

### User Profile (2 endpoints)
- GET /users/:userId
- PUT /users/:userId

### Transactions (4 endpoints)
- GET /transactions
- POST /transactions
- PUT /transactions/:transactionId
- DELETE /transactions/:transactionId

### Reports & Analytics (3 endpoints)
- GET /reports/monthly
- GET /analytics
- GET /analytics/categories

### Budgets (4 endpoints)
- GET /budgets
- POST /budgets
- PUT /budgets/:budgetId
- DELETE /budgets/:budgetId

### AI Chat Bot (1 endpoint)
- POST /bot/query

### Categories (1 endpoint)
- GET /categories

### Settings (2 endpoints)
- GET /settings
- PUT /settings

### Export (1 endpoint)
- GET /export

**Total: 20 API endpoints**