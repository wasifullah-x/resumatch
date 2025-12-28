# ResuMatch - Full Stack Setup Guide

Complete guide to run the ResuMatch application with frontend and backend.

## 🎯 Overview

ResuMatch is an AI-powered job matching platform that helps users find relevant jobs based on their skills and experience. The application consists of:

- **Frontend**: React + Vite (resu-match folder)
- **Backend**: NestJS + PostgreSQL (backend/server folder)
- **Database**: Neon PostgreSQL (cloud)

## ✅ Prerequisites

- Node.js 18+ installed
- npm or yarn
- Internet connection (for Neon database)

## 🚀 Quick Start

### 1. Start Backend Server

```bash
cd backend/server
npm install
npm run start:dev
```

Backend will run on: **http://localhost:5000**

### 2. Start Frontend Application

```bash
cd resu-match
npm install
npm run dev
```

Frontend will run on: **http://localhost:5173**

## 🌐 Access the Application

1. Open your browser and go to: **http://localhost:5173**
2. Register a new account or login
3. Upload your resume for AI skill extraction
4. Browse jobs and track applications

## 📡 API Configuration

The frontend is already configured to connect to the backend at `http://localhost:5000/api`

If you need to change this, update `resu-match/src/services/api.js`:

```javascript
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  // ...
});
```

## 🗄️ Database

- **Type**: PostgreSQL
- **Provider**: Neon (cloud)
- **Connection**: Already configured in `backend/server/.env`
- **Migrations**: Already applied

## 📁 Project Structure

```
FS Project/
├── backend/
│   └── server/              # NestJS Backend
│       ├── src/             # Source code
│       ├── prisma/          # Database schema & migrations
│       ├── uploads/         # File uploads (resumes, profiles)
│       └── .env             # Environment variables
└── resu-match/              # React Frontend
    ├── src/                 # Source code
    ├── server/              # Old Express server (not used)
    └── public/              # Static assets
```

## 🎯 Key Features

### For Users

1. **Authentication**: Register/Login with JWT tokens
2. **Profile Management**: Complete profile with skills, experience, preferences
3. **Resume Upload**: AI-powered skill extraction from PDF resumes
4. **Job Search**: Browse jobs from The Muse API with advanced filters
5. **Save Jobs**: Bookmark interesting opportunities
6. **Apply to Jobs**: Track application status and history
7. **Dashboard**: View statistics and personalized recommendations

### For Developers

1. **Modern Stack**: NestJS + React + Prisma + PostgreSQL
2. **Type Safety**: TypeScript throughout
3. **API Documentation**: RESTful API with clear endpoints
4. **Database Migrations**: Version-controlled schema changes
5. **File Uploads**: Profile pictures and resume handling
6. **Authentication**: JWT-based security
7. **Validation**: Input validation on both frontend and backend

## 🔑 Environment Variables

### Backend (.env)

```env
DATABASE_URL="postgresql://..."  # Neon PostgreSQL URL
JWT_SECRET="your-secret-key"     # JWT signing key
PORT=5000                        # Server port
```

### Frontend (.env.local) - Optional

```env
VITE_API_URL=http://localhost:5000/api
```

## 🛠️ Development Commands

### Backend

```bash
# Development mode with hot reload
npm run start:dev

# Production build
npm run build
npm run start:prod

# Database operations
npx prisma generate          # Generate Prisma Client
npx prisma migrate dev       # Create & apply migrations
npx prisma studio            # Open database GUI
```

### Frontend

```bash
# Development server
npm run dev

# Production build
npm run build
npm run preview
```

## 📚 API Endpoints

### Authentication

- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login

### User Profile

- `GET /api/users/me` - Get current user
- `PUT /api/users/profile` - Update profile
- `POST /api/users/resume` - Upload resume

### Jobs

- `GET /api/jobs/saved` - Get saved jobs
- `POST /api/jobs/:id/save` - Save job
- `DELETE /api/jobs/:id/save` - Unsave job

### Applications

- `GET /api/applications` - Get applications
- `POST /api/applications` - Create application
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/:id` - Delete application

### Dashboard

- `GET /api/dashboard/stats` - Get statistics
- `GET /api/dashboard/recommendations` - Get recommendations

## 🔒 Authentication

All API requests (except register/login) require JWT token:

```javascript
Authorization: Bearer <token>
```

The frontend automatically includes the token from localStorage.

## 📤 File Uploads

### Resume Upload

- Format: PDF only
- Max size: 10MB
- AI parsing: Extracts skills automatically
- Storage: `backend/server/uploads/resumes/`

### Profile Picture

- Formats: JPG, PNG, GIF
- Max size: 5MB
- Storage: `backend/server/uploads/profiles/`

## 🐛 Troubleshooting

### Backend won't start

1. Check if PostgreSQL connection is working
2. Run `npx prisma generate` to regenerate client
3. Check if port 5000 is available

### Frontend can't connect to backend

1. Verify backend is running on port 5000
2. Check CORS settings in `backend/server/src/main.ts`
3. Clear browser cache and localStorage

### Database errors

1. Check DATABASE_URL in .env
2. Run migrations: `npx prisma migrate deploy`
3. Check Neon dashboard for database status

### File upload errors

1. Ensure `uploads/` directories exist
2. Check file size and format restrictions
3. Verify multer configuration

## 📊 Testing the Application

### Test User Registration

1. Go to http://localhost:5173/register
2. Fill in: name, email, password
3. Submit and verify JWT token is stored

### Test Resume Upload

1. Login and go to Dashboard
2. Click "Resume" tab
3. Upload a PDF resume
4. Check if skills are extracted

### Test Job Application

1. Go to "Jobs" section
2. Search for jobs
3. Click "Apply" on any job
4. Track application in "Applications" tab

## 🎉 Success Indicators

✅ Backend running on http://localhost:5000
✅ Frontend running on http://localhost:5173
✅ Database connected (Neon PostgreSQL)
✅ User registration working
✅ JWT authentication working
✅ Resume upload and parsing working
✅ Job save/unsave working
✅ Application tracking working
✅ Dashboard statistics displaying

## 📞 Support

For issues or questions:

1. Check the logs in both terminal windows
2. Review BACKEND_README.md for detailed API documentation
3. Check browser console for frontend errors
4. Verify database connection in Neon dashboard

## 🚀 Next Steps

1. **Customize branding**: Update colors, logos, and styling
2. **Add more features**: Email notifications, advanced search, etc.
3. **Deploy to production**: Use Vercel (frontend) + Railway/Render (backend)
4. **Set up CI/CD**: Automate testing and deployment
5. **Add analytics**: Track user behavior and application metrics

---

**Status**: ✅ Everything is set up and ready to use!

Both frontend and backend are connected and fully functional.
