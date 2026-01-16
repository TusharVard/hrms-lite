# Fix Render Deployment Error

## 🔴 Error
```
npm error path /opt/render/project/src/package.json
npm error errno -2
npm error enoent Could not read package.json
```

## ✅ Solution

Render is looking for `package.json` in the wrong location. Fix the **Root Directory** setting.

### Step 1: Check Root Directory in Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Open your **Web Service** (hrms-lite-backend)
3. Go to **Settings** tab
4. Find **"Root Directory"** field

### Step 2: Set Correct Root Directory

**Set Root Directory to:**
```
backend
```

**NOT:**
- ❌ `backend/src`
- ❌ `src`
- ❌ (empty)

### Step 3: Verify Build & Start Commands

**Build Command:**
```bash
npm install && npx prisma generate --schema=src/prisma/schema.prisma && npx prisma migrate deploy --schema=src/prisma/schema.prisma
```

**Start Command:**
```bash
node src/app.js
```

### Step 4: Save and Redeploy

1. Click **"Save Changes"**
2. Go to **"Manual Deploy"** tab
3. Click **"Deploy latest commit"**

---

## 📁 Directory Structure

Render expects this structure when Root Directory = `backend`:

```
/opt/render/project/src/
  └── backend/              ← Root Directory
      ├── package.json       ← Should be here
      ├── src/
      │   └── app.js
      └── prisma/
```

---

## 🔍 Why This Happens

Render clones your repo to `/opt/render/project/src/`, then looks for files relative to the **Root Directory** you specify.

If Root Directory = `backend`:
- Looks for: `/opt/render/project/src/backend/package.json` ✅

If Root Directory is wrong:
- Looks for: `/opt/render/project/src/package.json` ❌ (wrong!)

---

**Fix: Set Root Directory to `backend` in Render dashboard!**
