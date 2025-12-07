# 🚨 URGENT: Update Vercel Environment Variable

## Current Issue

Your frontend is calling the **OLD** backend URL:
- ❌ `https://connectx-backend.onrender.com` (404 - Not Found)

It needs to call the **NEW** backend URL:
- ✅ `https://connectx-backend-p1n4.onrender.com`

## Step-by-Step Fix

### Step 1: Go to Vercel Dashboard

1. Open [Vercel Dashboard](https://vercel.com/dashboard)
2. Sign in if needed
3. Find and click on your **ConnectX Frontend** project

### Step 2: Navigate to Environment Variables

1. Click on **Settings** (in the top navigation)
2. Click on **Environment Variables** (in the left sidebar)

### Step 3: Update or Add VITE_API_URL

**If `VITE_API_URL` already exists:**
1. Find `VITE_API_URL` in the list
2. Click the **pencil/edit icon** (✏️) next to it
3. **Delete the old value**
4. **Enter the new value:**
   ```
   https://connectx-backend-p1n4.onrender.com/api
   ```
5. **Important:** Make sure `/api` is at the end!
6. Click **Save**

**If `VITE_API_URL` doesn't exist:**
1. Click **Add New** button
2. **Key:** `VITE_API_URL`
3. **Value:** `https://connectx-backend-p1n4.onrender.com/api`
4. **Environment:** Select **Production**, **Preview**, and **Development** (or just Production)
5. Click **Save**

### Step 4: Redeploy Frontend

**Option A: Manual Redeploy (Recommended)**
1. Go to **Deployments** tab (top navigation)
2. Find the **latest deployment**
3. Click the **three dots** (⋯) menu on the right
4. Click **Redeploy**
5. Wait for deployment to complete (~2-3 minutes)

**Option B: Auto-Redeploy**
- If you have auto-deploy enabled, Vercel will automatically redeploy after you save the environment variable
- Check the **Deployments** tab to see if a new deployment started

### Step 5: Verify It Works

1. Wait for deployment to complete (status shows "Ready")
2. Open your frontend URL: `https://connectx-frontend.vercel.app`
3. Open **Browser DevTools** (F12) → **Network** tab
4. Try to **login**
5. Check the Network tab - the API call should now go to:
   ```
   https://connectx-backend-p1n4.onrender.com/api/auth/login
   ```
   ✅ Should return `200 OK` (not 404)

## ✅ Verification Checklist

After redeploy:

- [ ] `VITE_API_URL` updated in Vercel to new URL
- [ ] Frontend redeployed (check Deployments tab)
- [ ] Network tab shows calls to `connectx-backend-p1n4.onrender.com`
- [ ] Login works (no 404 errors)
- [ ] No CORS errors in console

## 🔍 How to Check Current Environment Variable

1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Look for `VITE_API_URL`
3. Current value should be: `https://connectx-backend-p1n4.onrender.com/api`

## 🚨 Common Mistakes

❌ **Wrong:** `https://connectx-backend-p1n4.onrender.com` (missing `/api`)
✅ **Correct:** `https://connectx-backend-p1n4.onrender.com/api`

❌ **Wrong:** `https://connectx-backend.onrender.com/api` (old URL)
✅ **Correct:** `https://connectx-backend-p1n4.onrender.com/api` (new URL)

## 📸 Visual Guide

**Environment Variables Page:**
```
┌─────────────────────────────────────┐
│ Settings → Environment Variables   │
├─────────────────────────────────────┤
│ Key              │ Value            │
├─────────────────────────────────────┤
│ VITE_API_URL     │ [Edit] ✏️        │
│                  │ https://connectx-│
│                  │ backend-p1n4...  │
└─────────────────────────────────────┘
```

**After Update:**
```
VITE_API_URL = https://connectx-backend-p1n4.onrender.com/api
```

## ⚡ Quick Test

After redeploy, test in browser console:
```javascript
// Should show the new URL
console.log(import.meta.env.VITE_API_URL);
// Expected: "https://connectx-backend-p1n4.onrender.com/api"
```

## 🆘 Still Not Working?

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Hard refresh** (Ctrl+Shift+R or Ctrl+F5)
3. **Check deployment logs** in Vercel for errors
4. **Verify environment variable** is set correctly
5. **Check Network tab** to see what URL is actually being called

---

**Once you update the environment variable and redeploy, the frontend will connect to the new backend!** 🚀



