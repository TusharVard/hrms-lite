# Deploy Frontend on Vercel

## 🚀 Quick Deployment Steps

### Step 1: Go to Vercel Dashboard
Visit: https://vercel.com/dashboard

### Step 2: Import Your GitHub Repository
1. Click **"Add New..."** → **"Project"**
2. Select your GitHub repository: `TusharVard/hrms-lite`
3. Click **"Import"**

### Step 3: Configure Project Settings

**IMPORTANT - Set these correctly:**

- **Framework Preset:** `Vite` (should auto-detect)
- **Root Directory:** `frontend/react+javascript` ⚠️ **MUST SET THIS**
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `dist` (auto-detected)
- **Install Command:** `npm install` (auto-detected)

### Step 4: Add Environment Variable

Click **"Environment Variables"** → **"Add New"**

| Variable Name | Value |
|--------------|-------|
| `VITE_API_URL` | `https://hrms-lite-yo3x.onrender.com/api` |

**Important:** This connects your frontend to your deployed backend!

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (~1-2 minutes)
3. Your frontend will be live!

### Step 6: Verify Deployment

1. Visit your Vercel URL (e.g., `https://hrms-lite.vercel.app`)
2. Test adding an employee
3. Test marking attendance
4. Verify data is saved to your backend

---

## ✅ Checklist

- [ ] Repository imported from GitHub
- [ ] Root directory set to `frontend/react+javascript`
- [ ] Framework preset: Vite
- [ ] `VITE_API_URL` environment variable set
- [ ] Value: `https://hrms-lite-yo3x.onrender.com/api`
- [ ] Build completes successfully
- [ ] Frontend deployed and accessible
- [ ] Can connect to backend API

---

## 🔗 Your URLs

After deployment:
- **Frontend:** `https://your-project.vercel.app`
- **Backend:** `https://hrms-lite-yo3x.onrender.com`
- **API:** `https://hrms-lite-yo3x.onrender.com/api`

---

## 🐛 Troubleshooting

### Build Fails
- Check Vercel build logs
- Verify root directory is correct
- Ensure all dependencies are in `package.json`

### Can't Connect to Backend
- Verify `VITE_API_URL` is set correctly
- Check backend is running (visit backend URL)
- Check browser console for CORS errors

### Environment Variable Not Working
- Restart deployment after adding env var
- Verify variable name is exactly `VITE_API_URL`
- Check variable is set in Vercel dashboard

---

**Ready to deploy! Follow the steps above.** 🚀
