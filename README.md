# Users Microservice

Authentication and user management service for Stock Management System.

## 📍 Service Information

- **Port:** 5001
- **Database:** `users_db`
- **Base URL:** `http://localhost:5001/api/users`

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running on port 27017
- Required environment variables (see `.env.example`)

### Installation
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Run Production Server
```bash
npm start
```

## 🔐 User Roles

- **Admin:** Full access (manage users, all CRUD operations)
- **Manager:** Operational access (no user management)

## 📡 API Endpoints

### Public Endpoints

#### Health Check
```http
GET /api/users/health
```
Returns service health status.

#### Register User
```http
POST /api/users/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "role": "manager"  // optional: "admin" or "manager", defaults to "manager"
}
```

#### Login
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```
Returns JWT tokens in HTTP-only cookies.

#### Verify Email
```http
GET /api/users/verify-email/:token
```

#### Forgot Password
```http
POST /api/users/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Reset Password
```http
POST /api/users/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "password": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

#### Refresh Token
```http
POST /api/users/refresh-token
```
Uses refresh token from cookies to get new access token.

---

### Protected Endpoints (Require Authentication)

#### Get Current User Profile
```http
GET /api/users/profile
```

#### Logout
```http
POST /api/users/logout
```

#### Verify Token (For Other Microservices)
```http
GET /api/users/verify-token
```
Returns user info if token is valid. Used by other microservices to validate authentication.

---

### Admin Only Endpoints

#### Get All Users
```http
GET /api/users/
```

#### Get User by ID
```http
GET /api/users/:id
```

#### Update User
```http
PUT /api/users/:id
Content-Type: application/json

{
  "username": "newusername",
  "email": "newemail@example.com",
  "role": "admin",
  "status": "active",
  "emailVerified": true
}
```

#### Delete User (Soft Delete)
```http
DELETE /api/users/:id
```
Sets user status to "inactive" and revokes all sessions.

---

## 🔑 Authentication

This service uses JWT (JSON Web Tokens) for authentication:

- **Access Token:** Expires in 15 minutes (stored in HTTP-only cookie)
- **Refresh Token:** Expires in 7 days (stored in HTTP-only cookie)

### How to Authenticate Requests

1. Login via `/api/users/login`
2. Cookies are automatically set
3. Include cookies in subsequent requests
4. Use `/api/users/refresh-token` when access token expires

---

## 🔒 Security Features

- ✅ Password hashing with bcrypt (12 rounds)
- ✅ HTTP-only cookies for token storage
- ✅ Rate limiting on login/register (5 attempts per 15 minutes)
- ✅ Account lockout after 5 failed login attempts (30 minutes)
- ✅ Email verification required for account activation
- ✅ Password reset with time-limited tokens
- ✅ Session management with database storage
- ✅ Role-based access control (RBAC)

---

## 🗄️ Database Schema

### User Model
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  role: Enum ['admin', 'manager'],
  status: Enum ['active', 'inactive', 'pending'],
  emailVerified: Boolean,
  passwordResetToken: String,
  passwordResetExpires: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Session Model
```javascript
{
  userId: ObjectId (ref: User),
  accessToken: String,
  refreshToken: String,
  userAgent: String,
  ipAddress: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🌐 Inter-Service Communication

Other microservices can verify user authentication by calling:
```http
GET http://localhost:5001/api/users/verify-token
Authorization: Bearer {token}
```

Response:
```json
{
  "success": true,
  "valid": true,
  "user": {
    "id": "...",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "manager",
    "status": "active",
    "emailVerified": true
  }
}
```

---

## 📧 Email Configuration

Uses SMTP for sending emails (verification, password reset).

Required environment variables:
```env
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=your_user
SMTP_PASS=your_pass
EMAIL_FROM="Stock Management <noreply@stockmanagement.local>"
FRONTEND_URL=http://localhost:5173
```

---

## 🧪 Testing

### Manual Testing with curl
```bash
# Health check
curl http://localhost:5001/api/users/health

# Register
curl -X POST http://localhost:5001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "test123",
    "confirmPassword": "test123",
    "role": "manager"
  }'

# Login
curl -X POST http://localhost:5001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }' \
  -c cookies.txt

# Get profile (using saved cookies)
curl http://localhost:5001/api/users/profile \
  -b cookies.txt
```

---

## 📊 API Documentation

Interactive API documentation available at:
```
http://localhost:5001/api-docs
```

---

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check MongoDB is running
mongosh

# Check database exists
use users_db
show collections
```

### Token Verification Fails
- Ensure cookies are included in request
- Check token hasn't expired
- Verify JWT secrets in `.env` match

### Email Not Sending
- Check SMTP credentials
- Verify `FRONTEND_URL` is set correctly
- Check Mailtrap inbox for test emails

---

## 📝 Environment Variables

Create a `.env` file with:
```env
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

MONGO_URI=mongodb://localhost:27017/users_db

JWT_ACCESS_SECRET=your_secret_here
JWT_REFRESH_SECRET=your_secret_here
JWT_EMAIL_SECRET=your_secret_here
JWT_PASSWORD_RESET_SECRET=your_secret_here

SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=your_user
SMTP_PASS=your_pass
EMAIL_FROM="Stock Management <noreply@stockmanagement.local>"

BCRYPT_ROUNDS=12
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION=30
```

---

## 🏗️ Project Structure
```
services/users/
├── src/
│   ├── config/
│   │   ├── db.js
│   │   ├── jwt.js
│   │   └── index.js
│   ├── controllers/
│   │   └── userController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── rateLimit.js
│   ├── models/
│   │   ├── userModel.js
│   │   └── sessionModel.js
│   ├── routes/
│   │   └── userRoutes.js
│   ├── services/
│   │   └── userService.js
│   ├── utils/
│   │   ├── mail.js
│   │   └── logger.js
│   ├── validations/
│   │   └── userValidation.js
│   └── server.js
├── .env
├── package.json
└── README.md
```

---

## 👥 Author

Part of Stock Management Microservices System
