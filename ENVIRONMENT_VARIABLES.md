# Environment Variables Guide

## 📋 Overview

This document lists all environment variables used in the HRMS Lite application.

---

## 🔧 Backend Environment Variables

### Required Variables

#### `DATABASE_URL` (Required)
- **Description:** PostgreSQL database connection string
- **Format:** `postgresql://username:password@host:port/database?schema=public`
- **Used in:**
  - `backend/src/prisma/schema.prisma`
  - `backend/prisma.config.ts`
- **Example:**
  ```env
  DATABASE_URL="postgresql://user:password@localhost:5432/hrms_lite?schema=public"
  ```
- **For Render:** Use the database URL provided by Render's PostgreSQL service

### Optional Variables

#### `PORT` (Optional)
- **Description:** Port number for the Express server
- **Default:** `3000`
- **Used in:** `backend/src/app.js`
- **Example:**
  ```env
  PORT=3000
  ```
- **For Render:** Render auto-assigns a port, but you can set it explicitly

#### `NODE_ENV` (Optional)
- **Description:** Environment mode (development, production, etc.)
- **Default:** Not set (treated as development)
- **Used in:**
  - `backend/src/prisma/prismaClient.js` (for logging levels)
  - Controllers (for error message detail level)
- **Example:**
  ```env
  NODE_ENV=production
  ```
- **Values:**
  - `development` - Detailed error messages, query logging
  - `production` - Minimal error messages, error-only logging

---

## 🎨 Frontend Environment Variables

### Required Variables

#### `VITE_API_URL` (Required)
- **Description:** Backend API base URL
- **Format:** Full URL including `/api` path
- **Used in:** `frontend/react+javascript/src/config/axios.js`
- **Default:** `http://localhost:3000/api` (if not set)
- **Example (Local):**
  ```env
  VITE_API_URL=http://localhost:3000/api
  ```
- **Example (Production):**
  ```env
  VITE_API_URL=https://your-backend.onrender.com/api
  ```
- **Note:** Must start with `VITE_` prefix for Vite to expose it to the frontend

---

## 📝 Environment Files Setup

### Backend `.env` File

Create `backend/.env`:

```env
# Database Connection (Required)
DATABASE_URL="postgresql://username:password@localhost:5432/hrms_lite?schema=public"

# Server Port (Optional)
PORT=3000

# Environment (Optional)
NODE_ENV=development
```

### Frontend `.env` File

Create `frontend/react+javascript/.env`:

```env
# Backend API URL (Required)
VITE_API_URL=http://localhost:3000/api
```

---

## 🚀 Deployment Environment Variables

### Render (Backend)

Add these in Render dashboard:

```
DATABASE_URL=postgresql://user:password@host:port/database?schema=public
PORT=10000
NODE_ENV=production
```

### Vercel (Frontend)

Add this in Vercel dashboard:

```
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## 🔍 Variable Usage Summary

| Variable | Backend | Frontend | Required | Default |
|----------|---------|----------|----------|---------|
| `DATABASE_URL` | ✅ | ❌ | ✅ Yes | - |
| `PORT` | ✅ | ❌ | ❌ No | `3000` |
| `NODE_ENV` | ✅ | ❌ | ❌ No | - |
| `VITE_API_URL` | ❌ | ✅ | ✅ Yes* | `http://localhost:3000/api` |

*Required for production, has default for local development

---

## ⚠️ Important Notes

1. **Never commit `.env` files to Git**
   - Add `.env` to `.gitignore`
   - Use `.env.example` as a template

2. **Vite Environment Variables**
   - Frontend variables must start with `VITE_` prefix
   - They are exposed to the client-side code
   - Don't put sensitive data in `VITE_` variables

3. **Backend Environment Variables**
   - Loaded via `dotenv` package
   - Available via `process.env.VARIABLE_NAME`
   - Keep sensitive data (like DATABASE_URL) secure

4. **Production vs Development**
   - Use different values for production
   - Set `NODE_ENV=production` in production
   - Use production database URLs in production

---

## 🧪 Testing Environment Variables

### Check Backend Variables

```bash
cd backend
node -e "require('dotenv').config(); console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set'); console.log('PORT:', process.env.PORT || '3000 (default)');"
```

### Check Frontend Variables

The frontend will use the default if `VITE_API_URL` is not set. Check browser console or network tab to see which URL is being used.

---

## 📚 Related Documentation

- **Setup Guide:** See main README.md
- **Deployment:** See DEPLOYMENT.md
- **Database Setup:** See backend/POSTMAN_TESTING.md
