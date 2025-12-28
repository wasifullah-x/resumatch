# 🚀 ResuMatch - Quick Reference

## ✅ Status

- **Backend**: ✅ Running on http://localhost:5000
- **Database**: ✅ Connected to Neon PostgreSQL
- **Frontend**: Ready to connect

## 🎯 Start Commands

### Backend

```bash
cd backend/server
npm run start:dev
```

### Frontend

```bash
cd resu-match
npm run dev
```

## 📡 API Base URL

```
http://localhost:5000/api
```

## 🔑 Key Endpoints

### Auth (No token required)

- `POST /api/users/register` - Register
- `POST /api/users/login` - Login

### Profile (Token required)

- `GET /api/users/me` - Get profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/resume` - Upload resume

### Jobs (Token required)

- `GET /api/jobs/saved` - Saved jobs
- `POST /api/jobs/:id/save` - Save job
- `DELETE /api/jobs/:id/save` - Unsave job

### Applications (Token required)

- `GET /api/applications` - List applications
- `POST /api/applications` - Apply to job
- `PUT /api/applications/:id` - Update status
- `DELETE /api/applications/:id` - Delete

### Dashboard (Token required)

- `GET /api/dashboard/stats` - Statistics
- `GET /api/dashboard/recommendations` - Recommendations

## 🔐 Authentication

```javascript
// Header format
Authorization: Bearer <jwt-token>
```

## 📤 File Uploads

### Profile Picture

- **Endpoint**: `PUT /api/users/profile`
- **Field name**: `profilePicture`
- **Formats**: JPG, PNG, GIF
- **Max size**: 5MB

### Resume

- **Endpoint**: `POST /api/users/resume`
- **Field name**: `resume`
- **Format**: PDF only
- **Max size**: 10MB
- **Feature**: AI skill extraction

## 🗄️ Database Schema

### users

- Authentication & profile data
- Skills (JSON)
- Education (JSON)
- Job preferences (JSON)
- Resume & profile picture URLs

### saved_jobs

- User → Job relationship
- Complete job data (JSON)

### applications

- User → Job application
- Status: applied/interviewing/accepted/rejected
- Cover letter, notes

## 📁 Files Created

```
backend/server/
├── src/
│   ├── auth/          (JWT authentication)
│   ├── users/         (User management)
│   ├── jobs/          (Job saving)
│   ├── applications/  (Application tracking)
│   ├── dashboard/     (Analytics)
│   ├── prisma/        (Database)
│   └── utils/         (Resume parser)
├── prisma/
│   ├── schema.prisma  (Database schema)
│   └── migrations/    (Applied)
├── uploads/
│   ├── profiles/      (Created)
│   └── resumes/       (Created)
└── .env               (Configured)
```

## 📚 Documentation

1. [BACKEND_README.md](backend/server/BACKEND_README.md) - Complete API docs
2. [SETUP_GUIDE.md](SETUP_GUIDE.md) - Setup instructions
3. [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - What was built

## 🎯 Test Flow

1. **Register**: `POST /api/users/register`

   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123"
   }
   ```

2. **Login**: `POST /api/users/login`

   ```json
   {
     "email": "john@example.com",
     "password": "password123"
   }
   ```

   → Receive JWT token

3. **Get Profile**: `GET /api/users/me`

   - Header: `Authorization: Bearer <token>`

4. **Upload Resume**: `POST /api/users/resume`

   - Form data with PDF file
     → Skills automatically extracted

5. **View Dashboard**: `GET /api/dashboard/stats`
   → See statistics

## 🛠️ Useful Commands

```bash
# Generate Prisma Client
npx prisma generate

# View database in GUI
npx prisma studio

# Create migration
npx prisma migrate dev --name <name>

# Reset database
npx prisma migrate reset

# Build for production
npm run build

# Start production
npm run start:prod
```

## 🔧 Environment Variables

```env
DATABASE_URL="postgresql://..."  # Neon PostgreSQL
JWT_SECRET="your-secret-key"     # JWT signing
PORT=5000                        # Server port
```

## 🌐 CORS Origins

Currently allowed:

- `http://localhost:5173` (Vite)
- `http://localhost:3000` (Alternative)

Modify in `src/main.ts` to add more.

## 📊 Application Status Flow

```
applied → interviewing → accepted
                      ↘ rejected
```

## 💡 Tips

✅ Keep backend running in one terminal
✅ Start frontend in another terminal
✅ Check browser console for errors
✅ Use Prisma Studio to view database
✅ Check backend logs for API errors

## 🎉 Everything is Ready!

Your complete full-stack ResuMatch application is now operational with:

- ✅ NestJS backend with 29 API endpoints
- ✅ PostgreSQL database with migrations
- ✅ JWT authentication
- ✅ File upload (resumes, profiles)
- ✅ AI resume parsing
- ✅ Complete CRUD operations
- ✅ Ready for frontend integration

**Start both servers and begin testing! 🚀**
