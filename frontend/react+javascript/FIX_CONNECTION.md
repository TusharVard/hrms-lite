# Fix Backend Connection

## 🔴 Current Issue
"Network error. Please check your connection."

This means the frontend can't reach the backend API.

## ✅ Solutions

### Option 1: Use Local Backend (Recommended for Development)

1. **Start Backend Locally:**
   ```bash
   cd backend
   node src/app.js
   ```
   
   Backend should run on `http://localhost:3000`

2. **Verify Backend is Running:**
   ```bash
   curl http://localhost:3000/health
   ```
   
   Should return: `{"status":"OK","message":"Server is running",...}`

3. **Frontend will automatically use:** `http://localhost:3000/api` (default fallback)

### Option 2: Use Deployed Backend (Vercel)

1. **Create `.env` file** in `frontend/react+javascript/`:
   ```env
   VITE_API_URL=https://your-backend.vercel.app/api
   ```
   
   Replace `your-backend.vercel.app` with your actual Vercel backend URL.

2. **Restart Dev Server:**
   - Stop the current dev server (Ctrl+C)
   - Run `npm run dev` again

## 🔍 Check Current Configuration

The axios config uses:
- `import.meta.env.VITE_API_URL` if set
- Falls back to `http://localhost:3000/api` if not set

## 🧪 Test Connection

Open browser console (F12) and check:
- Network tab for failed requests
- Console for error messages
- Verify the API URL being used

---

**Quick Fix:** Start your backend locally on port 3000, and the frontend will connect automatically!
