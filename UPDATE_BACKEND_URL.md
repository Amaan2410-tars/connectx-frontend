# 🔄 Update Backend URL in Vercel

## ⚠️ IMPORTANT: Backend URL Changed

Your Render backend URL has changed to:
**`https://connectx-backend-p1n4.onrender.com`**

## ✅ Quick Fix (2 Minutes)

### Step 1: Update Vercel Environment Variable

1. Go to **Vercel Dashboard** → Your Frontend Project
2. Click **Settings** → **Environment Variables**
3. Find `VITE_API_URL` (or add it if missing)
4. **Update the value to:**
   ```
   https://connectx-backend-p1n4.onrender.com/api
   ```
   **Important:** Include `/api` at the end!
5. Click **Save**

### Step 2: Redeploy Frontend

After updating the environment variable:

1. Go to **Deployments** tab
2. Click the **three dots** (⋯) on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete (~2 minutes)

**OR** Vercel will auto-redeploy if you have auto-deploy enabled.

### Step 3: Verify It Works

1. Open your frontend URL (e.g., `https://connectx-frontend.vercel.app`)
2. Open Browser DevTools (F12) → **Network** tab
3. Try to login or make any API call
4. Check the Network tab - API calls should go to:
   ```
   https://connectx-backend-p1n4.onrender.com/api/...
   ```

## ✅ Verification Checklist

- [ ] `VITE_API_URL` updated in Vercel
- [ ] Frontend redeployed
- [ ] API calls going to new backend URL
- [ ] Login/signup working
- [ ] No CORS errors in console

## 🔍 How to Check Current Value

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Look for `VITE_API_URL`
3. Current value should be: `https://connectx-backend-p1n4.onrender.com/api`

## 🚨 If Still Not Working

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Hard refresh** (Ctrl+Shift+R)
3. **Check browser console** for errors
4. **Verify backend is accessible:**
   ```bash
   curl https://connectx-backend-p1n4.onrender.com/
   ```
   Should return: `{"success":true,"status":"ConnectX Backend is Running",...}`

## 📝 New URLs Summary

**Backend:**
- Health: `https://connectx-backend-p1n4.onrender.com/`
- API: `https://connectx-backend-p1n4.onrender.com/api`

**Frontend:**
- Your Vercel URL (e.g., `https://connectx-frontend.vercel.app`)

---

**That's it! Your frontend should now connect to the new backend URL.** 🚀

