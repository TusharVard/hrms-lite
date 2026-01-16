# Fix Vercel Deployment Error

## ✅ Fixed!

The error was: **"Invalid request: should NOT have additional property 'rootDirectory'"**

### What I Fixed:
- Removed `rootDirectory` from `vercel.json`
- This property should be set in Vercel dashboard UI, not in the JSON file

## 🚀 Now Deploy Again

### Step 1: In Vercel Dashboard
1. The error should be gone now
2. **Set Root Directory manually in the UI:**
   - Find the "Root Directory" field
   - Enter: `frontend/react+javascript`
   - Click "Edit" if needed

### Step 2: Add Environment Variable
- **Variable:** `VITE_API_URL`
- **Value:** `https://hrms-lite-yo3x.onrender.com/api`

### Step 3: Deploy
- Click "Deploy"
- Should work now! ✅

---

**The `vercel.json` is now fixed. Set Root Directory in the UI and deploy!**
