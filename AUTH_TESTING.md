# Authentication Testing Guide

## Fixed Issues ✅

1. **Infinite Reload Loop** - Fixed the API interceptor to not redirect when already on auth pages
2. **JWT Authentication** - Properly configured with secret from .env file
3. **User Registration** - Simplified registration form with proper error handling
4. **Password Hashing** - Using bcrypt with proper salt rounds (10)
5. **Token Management** - Proper JWT token generation and validation

## Testing Steps

### 1. Start Backend

```bash
cd backend/server
npm run start:dev
```

Backend should start on http://localhost:5000

### 2. Start Frontend

```bash
cd resu-match
npm run dev
```

Frontend should start on http://localhost:5173

### 3. Test Registration

1. Navigate to http://localhost:5173/register
2. Fill in the form:
   - Full Name: Test User
   - Email: test@example.com
   - Phone: +1234567890 (optional)
   - Location: Test City (optional)
   - Password: test123456
   - Confirm Password: test123456
3. Click "Create Account"
4. Should redirect to dashboard on success

### 4. Test Login

1. Navigate to http://localhost:5173/login
2. Use the credentials:
   - Email: test@example.com
   - Password: test123456
3. Click "Sign In"
4. Should redirect to dashboard on success

### 5. Verify Token

Open browser DevTools > Application > Local Storage > http://localhost:5173
You should see a 'token' entry with a JWT token

## API Endpoints

- POST /api/users/register - Create new account
- POST /api/users/login - Login to account
- GET /api/users/me - Get current user (requires auth)
- PUT /api/users/profile - Update profile (requires auth)

## Configuration

### Backend (.env)

- DATABASE_URL: PostgreSQL connection
- JWT_SECRET: Secure secret key for JWT signing
- PORT: 5000

### Frontend (.env)

- VITE_API_URL: http://localhost:5000/api
- VITE_RAPIDAPI_KEY: API key for job search

## Troubleshooting

### If login keeps reloading:

1. Clear browser localStorage
2. Clear browser cache
3. Restart both servers
4. Check browser console for errors

### If registration fails:

1. Check backend console for errors
2. Verify database connection
3. Check if email already exists

### If token invalid:

1. Verify JWT_SECRET is set in backend/.env
2. Check token in localStorage is valid JWT
3. Verify token expiration (set to 7 days)

## Security Notes

- Passwords are hashed with bcrypt (10 rounds)
- JWT tokens expire after 7 days
- Tokens stored in localStorage (consider httpOnly cookies for production)
- CORS enabled for localhost:5173 and localhost:3000
