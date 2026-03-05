# MOM (Minutes of Meeting) System - Development Guide

## ✨ Project Status: FULLY RUNNABLE ✨

This project is fully configured, seeded with test data, and ready to use.

---

## 🚀 Quick Start

### 1. **Start the Development Server**
```bash
npm run dev
```
The application will be available at `http://localhost:3000`

### 2. **Seed the Database (Already Done!)**
The database has been automatically seeded with:
- ✅ 9 staff members (2 admin/conveners + 7 regular staff)
- ✅ 7 meeting types
- ✅ 5 sample meetings with various statuses
- ✅ Test data ready for immediate use

---

## 🔐 Test User Credentials

### Admin User
```
Email: admin@demo.com
Password: admin123
Role: System Administrator
```

### Convener User
```
Email: convener@demo.com
Password: convener123
Role: Meeting Convener
```

### Staff Users (All passwords: `staff123`)
```
1. alice@demo.com
2. bob@demo.com
3. carol@demo.com
4. david@demo.com
5. emma@demo.com
6. frank@demo.com
7. grace@demo.com
```

---

## 📋 Available Scripts

```bash
# Development Commands
npm run dev              # Start development server (port 3000/3001)
npm run build            # Build for production
npm start                # Start production server

# Database Commands
npm run seed             # Seed database with test data
npm run prisma:generate  # Generate Prisma Client
npm run db:setup         # Setup database from scratch (generate + seed)

# Linting
npm lint                 # Run ESLint
```

---

## 📁 Project Structure

```
MOM/
├── src/
│   ├── app/
│   │   ├── (dashboard)/          # Protected dashboard routes
│   │   │   ├── dashboard/
│   │   │   ├── meetings/
│   │   │   ├── meeting-types/
│   │   │   ├── staff/
│   │   │   └── profile/
│   │   ├── api/                  # API routes
│   │   │   ├── auth/            # Authentication (login/logout)
│   │   │   ├── meetings/        # Meeting management
│   │   │   ├── staff/           # Staff management
│   │   │   ├── meeting-types/   # Meeting type management
│   │   │   ├── documents/       # Document management
│   │   │   └── reports/         # Reporting
│   │   ├── login/               # Login page
│   │   └── page.tsx             # Home redirect
│   ├── components/
│   │   └── ui/                  # Reusable UI components
│   └── lib/
│       ├── prisma.ts            # Prisma Client setup
│       └── utils.ts             # Utility functions
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Database seeding script
└── public/
    └── uploads/                 # Upload directory for files
```

---

## 🗄️ Database Configuration

**Database Type:** SQLite (file-based)  
**Location:** `./prisma/dev.db`  
**Configuration File:** `.env`

### Environment Variables in `.env`:
```env
# Database Configuration (SQLite)
DATABASE_URL="file:./prisma/dev.db"

# JWT Secret for Authentication
JWT_SECRET="your-super-secret-jwt-key-for-mom-change-in-production"

# Node Environment
NODE_ENV="development"
```

**To change database:**
- Edit `DATABASE_URL` in `.env`
- Alternatively, use `prisma.config.ts` for advanced configuration
- Run `npm run db:setup` to reinitialize

---

## 🏗️ Database Schema

### Core Tables:

1. **MOM_Staff**
   - User management with authentication
   - Roles: ADMIN, CONVENER, STAFF
   - Password hashed with bcrypt

2. **MOM_MeetingType**
   - Different types of meetings (Weekly Sync, Project Review, etc.)
   - Can be used to categorize meetings

3. **MOM_Meetings**
   - Main meeting records
   - Includes cancellation tracking
   - Linked to meeting types

4. **MOM_MeetingMember**
   - Tracks attendance of staff members in meetings
   - Can mark presence/absence
   - Stores remarks for each member

5. **MOM_MeetingDocument**
   - Stores documents attached to meetings
   - File path and sequence tracking
   - Optional remarks

---

## 🔑 Key Features

### ✅ Implemented
- User authentication with JWT
- Role-based access control (Admin, Convener, Staff)
- Dashboard with meeting management
- Staff directory management
- Meeting type management
- Document upload and management
- Meeting member attendance tracking
- Meeting cancellation support
- Responsive UI with shadcn/ui components
- Dark theme support

### 🔄 Data Flow
1. User logs in with email/password
2. System generates JWT token
3. Token stored in HTTP-only cookie
4. All API requests include token verification
5. Dashboard loads with role-appropriate data

---

## 🧪 Testing the Application

### 1. **Login Test**
- Navigate to `http://localhost:3000`
- Use credentials from "Test User Credentials" section
- Should see dashboard with meetings and staff data

### 2. **Create a Meeting**
- Go to "Meetings" → "Create Meeting"
- Select meeting type, date, time
- Add staff members
- Save meeting

### 3. **View Meetings**
- Dashboard shows all meetings
- Click on a meeting to view details
- Upload documents
- Track member attendance

### 4. **Manage Staff**
- Go to "Staff Management"
- View all staff members
- Create new staff members
- Edit/delete staff

---

## 🛠️ Troubleshooting

### Issue: Port 3000 already in use
**Solution:** Next.js will automatically use port 3001. Restart the dev server.

### Issue: Database errors
**Solution:** 
```bash
npm run db:setup
```
This will regenerate Prisma and reseed the database.

### Issue: Build errors
**Solution:**
```bash
# Clear cache and rebuild
rm -r .next
npm run build
```

### Issue: TypeScript errors
**Solution:**
```bash
# Regenerate Prisma types
npm run prisma:generate
```

---

## 📚 Technology Stack

- **Framework:** Next.js 16+ (App Router)
- **Database:** Prisma ORM with SQLite
- **UI:** React 19 + shadcn/ui + Tailwind CSS
- **Authentication:** JWT (Jose)
- **Password Hashing:** bcryptjs
- **Form Handling:** React Hook Form + Zod
- **Styling:** Tailwind CSS with CVA
- **Notifications:** Sonner Toast
- **Date Handling:** date-fns

---

## 🔐 Security Notes

- **Passwords:** Hashed with bcrypt (10 rounds)
- **Tokens:** JWT with 24-hour expiration
- **Cookies:** HTTP-only, Secure, SameSite flags set
- **Environment:** Use strong JWT_SECRET in production
- **Database:** Use proper database in production (PostgreSQL recommended)

---

## 📝 Default Seeded Data Summary

- **9 Staff Members** with different roles
- **7 Meeting Types** for various business needs
- **5 Sample Meetings:**
  - 2 Upcoming meetings
  - 1 Past meeting with documents
  - 1 Cancelled meeting
  - Various members assigned

---

## 🎯 Next Steps

1. ✅ Start dev server: `npm run dev`
2. ✅ Visit: http://localhost:3000
3. ✅ Login with test credentials
4. ✅ Test all features
5. ✅ Explore the dashboard
6. ✅ Create your own meetings

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Clear cache and rebuild: `rm -r .next && npm run build`
3. Reseed database: `npm run seed`

---

## 🎉 Ready to Use!

The project is **100% ready for development and testing**. All dependencies are installed, the database is configured, test data is seeded, and the application builds without errors.

**Happy coding! 🚀**
