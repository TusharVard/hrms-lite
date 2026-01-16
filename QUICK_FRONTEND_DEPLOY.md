# 🚀 Frontend Deployment - Quick Guide

Since your backend is already deployed on Vercel, here's how to deploy the frontend:

## Step-by-Step

### 1. Go to Vercel Dashboard
Visit: https://vercel.com/dashboard

### 2. Import Your Repository
- Click **"Add New..."** → **"Project"**
- Select your GitHub repository

### 3. Configure Project

**CRITICAL SETTINGS:**
- **Root Directory:** `frontend/react+javascript` ⚠️ **MUST SET THIS**
- **Framework Preset:** `Vite` (auto-detected)
- **Build Command:** `npm run build` (auto)
- **Output Directory:** `dist` (auto)

### 4. Set Environment Variable

Click **"Environment Variables"** → **"Add New"**

| Variable Name | Value |
|--------------|-------|
| `VITE_API_URL` | `https://your-backend.vercel.app/api` |

**Replace `your-backend.vercel.app` with your actual backend URL!**

### 5. Deploy
Click **"Deploy"** and wait ~2 minutes.

---

## ✅ Quick Checklist

- [ ] Root directory: `frontend/react+javascript`
- [ ] `VITE_API_URL` = `https://your-backend.vercel.app/api`
- [ ] Deployed successfully
- [ ] Test in browser

---

## 🔍 Find Your Backend URL

1. Go to Vercel Dashboard
2. Find your backend project
3. Copy the URL (e.g., `https://hrms-backend.vercel.app`)
4. Add `/api` → `https://hrms-backend.vercel.app/api`

---

**That's it! Your frontend will be live in minutes.** 🎉
