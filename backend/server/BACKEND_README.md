# ResuMatch Backend API

Complete NestJS backend for the ResuMatch job matching platform with PostgreSQL database.

## 🎯 Overview

This is a fully functional NestJS backend API that provides authentication, user management, job management, application tracking, and dashboard analytics for the ResuMatch platform.

## 🚀 Features Implemented

### Authentication & Authorization

- JWT-based authentication
- User registration and login
- Password change functionality
- Protected routes with JWT guards

### User Management

- Complete user profile management (CRUD)
- Profile picture upload
- Resume upload with AI parsing
- Skill extraction from PDF resumes
- Professional information management
- Job preferences management

### Job Management

- Save/unsave jobs
- Track saved jobs
- Job recommendation system based on user skills

### Application Tracking

- Create job applications
- Update application status (applied, interviewing, accepted, rejected)
- Delete applications
- Filter applications by status
- Application statistics

### Dashboard

- Dashboard statistics (applied jobs, saved jobs, recommendations)
- Job recommendations based on user profile

## 🛠 Tech Stack

- **Framework**: NestJS 11.x
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma 7.x with PostgreSQL adapter
- **Authentication**: JWT (Passport)
- **Validation**: class-validator, class-transformer
- **File Upload**: Multer
- **PDF Parsing**: pdf-parse
- **Password Hashing**: bcrypt

## 📦 Installation

```bash
cd backend/server
npm install
```

## ⚙️ Configuration

The `.env` file is already configured with:

- `DATABASE_URL`: Neon PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 5000)

## 🗄️ Database Schema

### Users Table

- Authentication (email, password)
- Personal information (name, phone, location, profile picture)
- Professional info (job title, experience, company, industry, summary)
- Skills (stored as JSON: primary, technical, secondary, soft)
- Education (JSON array)
- Job preferences (JSON)
- Resume (URL and filename)

### Saved Jobs Table

- User relationship
- External job ID from The Muse API
- Complete job data (JSON)

### Applications Table

- User relationship
- Job information (title, company, location, type)
- Application status workflow
- Cover letter, notes, applied via
- Timestamps

### Password Resets Table

- Email and token for password reset
- Expiration and usage tracking

## 🚦 Running the Application

### Development Mode

```bash
npm run start:dev
```

### Production Mode

```bash
npm run build
npm run start:prod
```

## 📡 API Endpoints

### Authentication & Users (`/api/users`)

- `POST /register` - Register new user
- `POST /login` - User login
- `GET /me` - Get current user profile (protected)
- `PUT /profile` - Update user profile with optional profile picture (protected)
- `POST /resume` - Upload and parse resume PDF (protected)
- `PUT /password` - Change password (protected)
- `DELETE /profile` - Delete account (protected)

### Jobs (`/api/jobs`)

- `GET /saved` - Get all saved jobs (protected)
- `POST /:jobId/save` - Save a job (protected)
- `DELETE /:jobId/save` - Unsave a job (protected)
- `GET /:jobId/saved` - Check if job is saved (protected)

### Applications (`/api/applications`)

- `GET /` - Get all applications with optional filters (protected)
  - Query params: `status`, `limit`
- `GET /stats` - Get application statistics (protected)
- `GET /:id` - Get single application (protected)
- `POST /` - Create new application (protected)
- `PUT /:id` - Update application (protected)
- `DELETE /:id` - Delete application (protected)

### Dashboard (`/api/dashboard`)

- `GET /stats` - Get dashboard statistics (protected)
- `GET /recommendations` - Get job recommendations (protected)

## 📁 Project Structure

```
src/
├── auth/                  # JWT authentication module
│   ├── jwt.strategy.ts    # JWT Passport strategy
│   ├── jwt-auth.guard.ts  # JWT guard for protected routes
│   └── auth.module.ts     # Auth module
├── users/                 # User management module
│   ├── dto/               # Data transfer objects
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── jobs/                  # Job management module
│   ├── dto/
│   ├── jobs.controller.ts
│   ├── jobs.service.ts
│   └── jobs.module.ts
├── applications/          # Application tracking module
│   ├── dto/
│   ├── applications.controller.ts
│   ├── applications.service.ts
│   └── applications.module.ts
├── dashboard/             # Dashboard analytics module
│   ├── dashboard.controller.ts
│   ├── dashboard.service.ts
│   └── dashboard.module.ts
├── prisma/                # Database module
│   ├── prisma.service.ts  # Prisma client service
│   └── prisma.module.ts   # Global Prisma module
├── utils/                 # Utility functions
│   └── resume-parser.ts   # PDF resume parsing
├── app.module.ts          # Root application module
└── main.ts                # Application entry point
```

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Protected routes using guards
- CORS enabled for frontend origins
- File upload validation (size, type)
- Input validation using class-validator

## 📤 File Upload

### Profile Pictures

- **Location**: `uploads/profiles/`
- **Allowed formats**: jpg, jpeg, png, gif
- **Max size**: 5MB

### Resumes

- **Location**: `uploads/resumes/`
- **Allowed formats**: PDF only
- **Max size**: 10MB
- **AI Parsing**: Automatically extracts skills from resume

## 🤖 Resume Parsing

The resume parser extracts skills from PDF resumes using keyword matching for:

- Programming languages (JavaScript, Python, Java, etc.)
- Web technologies (React, Angular, Vue, Node.js, etc.)
- Databases (SQL, MongoDB, PostgreSQL, etc.)
- Cloud & DevOps (AWS, Docker, Kubernetes, etc.)
- Mobile development
- Data & AI technologies
- Testing frameworks
- Soft skills

## 🔄 Database Migrations

Migrations are managed by Prisma:

```bash
# Generate Prisma Client
npx prisma generate

# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations in production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

## 🌐 CORS Configuration

CORS is enabled for:

- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternative frontend port)

Modify in `src/main.ts` to add more origins.

## 📊 Application Status Flow

Applications can have the following statuses:

- `applied` - Initial application submitted
- `interviewing` - In interview process
- `accepted` - Offer accepted
- `rejected` - Application rejected

## 🎯 Recommendations Engine

The recommendation system:

- Analyzes user skills from profile and resume
- Calculates match scores based on skill overlap
- Returns personalized job recommendations
- Updates as user profile changes

## 🔍 API Response Format

### Success Response

```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  ...
}
```

### Error Response

```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🚀 Deployment

1. Set environment variables in production
2. Build the application: `npm run build`
3. Run migrations: `npx prisma migrate deploy`
4. Start server: `npm run start:prod`

## 📝 Notes

- Database is hosted on Neon PostgreSQL (cloud)
- All endpoints except register/login require JWT authentication
- File uploads are stored locally in the `uploads/` directory
- Static files are served at `/uploads/` path

## 🔗 Integration with Frontend

The backend is configured to work with the ResuMatch frontend:

- API base URL: `http://localhost:5000/api`
- Authentication: Bearer token in Authorization header
- File access: `http://localhost:5000/uploads/...`

## ✅ Backend Status

**Status**: ✅ Fully operational and running on http://localhost:5000

All API endpoints are functional and connected to the Neon PostgreSQL database.
