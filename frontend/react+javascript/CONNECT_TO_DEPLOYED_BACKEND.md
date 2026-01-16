# Connect Frontend to Deployed Backend

## Your Backend URL
**Base URL:** https://hrms-lite-yo3x.onrender.com  
**API URL:** https://hrms-lite-yo3x.onrender.com/api

## Quick Setup

### Step 1: Create `.env` File

Create a file named `.env` in `frontend/react+javascript/` directory with:

```env
VITE_API_URL=https://hrms-lite-yo3x.onrender.com/api
```

### Step 2: Restart Dev Server

1. Stop the current dev server (press `Ctrl+C` in terminal)
2. Start it again:
   ```bash
   npm run dev
   ```

### Step 3: Verify Connection

The frontend should now connect to your deployed backend!

## Manual Steps

1. **Navigate to frontend directory:**
   ```bash
   cd frontend/react+javascript
   ```

2. **Create `.env` file:**
   ```bash
   echo 'VITE_API_URL=https://hrms-lite-yo3x.onrender.com/api' > .env
   ```

3. **Restart dev server:**
   ```bash
   npm run dev
   ```

## Test Backend

Your backend is accessible at:
- **Root:** https://hrms-lite-yo3x.onrender.com
- **Health Check:** https://hrms-lite-yo3x.onrender.com/health
- **API Base:** https://hrms-lite-yo3x.onrender.com/api

## After Setup

Once you restart the dev server with the `.env` file:
- ✅ Frontend will connect to deployed backend
- ✅ No more "Network error" message
- ✅ You can add employees and mark attendance
- ✅ All data will be saved to your deployed database

---

**Note:** The `.env` file is gitignored, so it won't be committed to your repository.
