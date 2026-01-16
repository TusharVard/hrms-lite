# HRMS Lite - Human Resource Management System

A full-stack web application for managing employees and tracking attendance with a modern, professional interface.

## 📋 Overview

HRMS Lite is a comprehensive Human Resource Management System that provides:
- **Employee Management**: Add, view, and manage employee records
- **Attendance Tracking**: Mark and monitor employee attendance with check-in/check-out times
- **Real-time Data**: Fast and responsive API with proper error handling
- **Modern UI**: Clean, professional interface built with React

The application follows best practices with proper validation, error handling, and a scalable architecture.

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Prisma ORM** - Database toolkit and ORM
- **PostgreSQL** - Relational database
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **CSS3** - Styling with modern features

### Database
- **PostgreSQL** - Primary database
- **Prisma Migrations** - Database schema management

## 🚀 Local Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/hrms_lite?schema=public"
   PORT=3000
   NODE_ENV=development
   ```

4. **Generate Prisma Client:**
   ```bash
   npx prisma generate --schema=src/prisma/schema.prisma
   ```

5. **Run database migrations:**
   ```bash
   npx prisma migrate dev --schema=src/prisma/schema.prisma --name init
   ```

6. **Start the server:**
   ```bash
   node src/app.js
   ```

   Or with auto-reload:
   ```bash
   nodemon src/app.js
   ```

   Server will run on `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend/react+javascript
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## 📁 Project Structure

```
hrms-lite/
├── backend/
│   ├── src/
│   │   ├── app.js                 # Express app configuration
│   │   ├── controllers/           # Business logic
│   │   │   ├── employee.controller.js
│   │   │   └── attendance.controller.js
│   │   ├── routes/                # API routes
│   │   │   ├── employee.routes.js
│   │   │   └── attendance.routes.js
│   │   └── prisma/
│   │       ├── schema.prisma      # Database schema
│   │       └── prismaClient.js    # Prisma client instance
│   ├── prisma/
│   │   └── migrations/            # Database migrations
│   ├── package.json
│   └── .env                       # Environment variables
│
└── frontend/
    └── react+javascript/
        ├── src/
        │   ├── pages/             # Page components
        │   │   ├── Employees.jsx
        │   │   └── Attendance.jsx
        │   ├── components/        # Reusable components
        │   │   ├── EmployeeForm.jsx
        │   │   ├── EmployeeTable.jsx
        │   │   └── AttendanceForm.jsx
        │   ├── config/
        │   │   └── axios.js       # Axios configuration
        │   └── App.jsx
        ├── package.json
        └── .env                    # Environment variables
```

## 🔌 API Endpoints

### Employees
- `GET /api/employees` - List all employees (with pagination)
- `POST /api/employees` - Add new employee
- `DELETE /api/employees/:id` - Delete employee

### Attendance
- `POST /api/attendance` - Mark attendance
- `GET /api/attendance/employee/:employeeId` - Get attendance by employee (with filters)

### Health Check
- `GET /health` - Server health check

## 🚢 Deployment

### Backend Deployment (Render)

1. **Create a new Web Service on Render:**
   - Connect your GitHub repository
   - Select the `backend` directory as root

2. **Configure Environment Variables:**
   ```
   DATABASE_URL=your_postgresql_connection_string
   PORT=10000
   NODE_ENV=production
   ```

3. **Build Command:**
   ```bash
   npm install && npx prisma generate --schema=src/prisma/schema.prisma && npx prisma migrate deploy --schema=src/prisma/schema.prisma
   ```

4. **Start Command:**
   ```bash
   node src/app.js
   ```

5. **Important Notes:**
   - Render automatically provides a PostgreSQL database
   - Use the provided `DATABASE_URL` from Render's database dashboard
   - The build command runs migrations automatically

### Frontend Deployment (Vercel)

1. **Import GitHub Repository:**
   - Go to Vercel dashboard
   - Click "Import Project"
   - Select your GitHub repository

2. **Configure Project:**
   - **Root Directory:** `frontend/react+javascript`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

3. **Add Environment Variable:**
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```
   Replace `your-backend-url` with your actual Render backend URL

4. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically build and deploy your frontend

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🧪 Testing

### Backend Testing (Postman)

1. **Import Collection:**
   - Import `backend/HRMS_Lite_API.postman_collection.json` into Postman

2. **Set Environment:**
   - Create environment with `base_url` = `http://localhost:3000`

3. **Test Endpoints:**
   - Health Check
   - Add Employee
   - Duplicate Employee (should return error)
   - Mark Attendance
   - Fetch Attendance

See `backend/POSTMAN_TESTING.md` for detailed testing instructions.

### Manual Testing

Use the provided curl commands in `backend/API_TEST_CURL.md` or run:
```bash
cd backend
./test-api.sh
```

## 📝 Assumptions

1. **Database:**
   - PostgreSQL database is available and accessible
   - Database connection string is provided via `DATABASE_URL` environment variable
   - User has permissions to create tables and run migrations

2. **Environment:**
   - Node.js v18+ is installed
   - npm is available
   - Backend runs on port 3000 (or PORT from env)
   - Frontend connects to backend via `VITE_API_URL`

3. **Business Logic:**
   - Employee IDs (employeeId field) are unique identifiers (e.g., EMP001)
   - Email addresses are unique per employee
   - One attendance record per employee per day (updates existing if duplicate)
   - Employees must be ACTIVE to mark attendance
   - Working hours are calculated automatically from check-in/check-out times

4. **Deployment:**
   - Render provides PostgreSQL database for backend
   - Vercel handles frontend build and deployment automatically
   - Environment variables are configured in deployment platforms

## 🔧 Troubleshooting

### Backend Issues

**Prisma Client not found:**
```bash
cd backend
npx prisma generate --schema=src/prisma/schema.prisma
```

**Database tables don't exist:**
```bash
cd backend
npx prisma migrate dev --schema=src/prisma/schema.prisma --name init
```

**Port already in use:**
- Change `PORT` in `.env` file
- Or kill the process using port 3000

### Frontend Issues

**API connection errors:**
- Verify `VITE_API_URL` in `.env` matches backend URL
- Ensure backend server is running
- Check CORS configuration in backend

**Build errors:**
- Run `npm install` to ensure all dependencies are installed
- Clear `node_modules` and reinstall if needed

## 📚 Additional Documentation

- **Deployment Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Backend API Testing:** `backend/POSTMAN_TESTING.md`
- **Database Setup:** `backend/SETUP_DATABASE.md`
- **Prisma Configuration:** `backend/prisma.config.ts`
- **Environment Setup:** `frontend/react+javascript/README_ENV.md`

## 🎯 Features

### Employee Management
- ✅ Add new employees with validation
- ✅ List employees with pagination
- ✅ Delete employees
- ✅ Duplicate detection (employeeId and email)
- ✅ Status management (Active, Inactive, Terminated, On Leave)

### Attendance Management
- ✅ Mark attendance with check-in/check-out
- ✅ Break time tracking
- ✅ Automatic working hours calculation
- ✅ Status tracking (Present, Absent, Late, Half Day, On Leave)
- ✅ Filter by employee, date range, and status
- ✅ One record per employee per day (auto-updates)

### UI/UX
- ✅ Modern, responsive design
- ✅ Loading states
- ✅ Empty states
- ✅ Error handling with retry
- ✅ Form validation
- ✅ Modal dialogs
- ✅ Status badges
- ✅ Professional styling

## 📄 License

ISC

## 👤 Author

HRMS Lite Development Team

---

**Note:** Make sure to configure all environment variables before running the application. Refer to the setup sections above for detailed instructions.
