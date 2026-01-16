# Frontend Deployment on Vercel

## 🚀 Quick Deploy Steps

### Step 1: Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Select the repository containing this project

### Step 2: Configure Project Settings

**Important Settings:**
- **Framework Preset:** `Vite` (should auto-detect)
- **Root Directory:** `frontend/react+javascript` ⚠️ **CRITICAL**
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `dist` (auto-detected)
- **Install Command:** `npm install` (auto-detected)

### Step 3: Set Environment Variable

Click **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://your-backend-url.vercel.app/api` |

**Important:**
- Replace `your-backend-url` with your actual Vercel backend URL
- Make sure to include `/api` at the end
- Example: `https://hrms-lite-backend.vercel.app/api`

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (~1-2 minutes)
3. Your frontend will be live!

### Step 5: Verify

1. Visit your Vercel frontend URL
2. Open browser console (F12)
3. Check for any errors
4. Test adding an employee
5. Test marking attendance

---

## 🔍 Finding Your Backend URL

If you're not sure what your backend URL is:

1. Go to Vercel Dashboard
2. Find your backend service/project
3. Copy the URL (e.g., `https://hrms-lite-backend.vercel.app`)
4. Add `/api` to it for the `VITE_API_URL`

---

## ✅ Checklist

- [ ] Project imported to Vercel
- [ ] Root directory set to `frontend/react+javascript`
- [ ] Framework preset: Vite
- [ ] `VITE_API_URL` environment variable set
- [ ] Value points to your Vercel backend URL + `/api`
- [ ] Deployed successfully
- [ ] Frontend loads without errors
- [ ] Can connect to backend API

---

## 🐛 Troubleshooting

### Build Fails
- Check Vercel build logs
- Verify root directory is `frontend/react+javascript`
- Ensure all dependencies are in `package.json`

### Can't Connect to Backend
- Verify `VITE_API_URL` is correct
- Check backend is running (visit backend URL)
- Check browser console for CORS errors
- Verify backend CORS is configured to allow your frontend domain

### Environment Variable Not Working
- Restart deployment after adding env var
- Verify variable name is exactly `VITE_API_URL`
- Check variable is set in Vercel dashboard (not just local `.env`)

---

## 📝 Notes

- Vercel automatically builds on every push to main branch
- Environment variables are set per project
- Frontend will be available at: `https://your-project.vercel.app`

---

**Ready to deploy! Follow the steps above.** 🚀
