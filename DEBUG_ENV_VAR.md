# 🔍 How to Debug Environment Variables

## ❌ Can't Use `import.meta` in Console

The error "Cannot use 'import.meta' outside a module" happens because `import.meta` only works in ES modules, not in the browser console directly.

## ✅ Better Ways to Check

### Method 1: Check Network Tab (Easiest)

1. Open **DevTools** (F12)
2. Go to **Network** tab
3. Try to **login** (or make any API call)
4. Find the request (e.g., `login` or `auth/login`)
5. Click on it
6. Check the **Request URL**:
   - Should be: `https://connectx-backend-p1n4.onrender.com/api/auth/login`
   - If you see `%20` or trailing `/`, the variable has issues

### Method 2: Add Temporary Console Log

Add this to `src/lib/apiClient.ts` temporarily:

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Temporary: Log the base URL
console.log("API Base URL:", api.defaults.baseURL);
```

Then:
1. Save the file
2. Redeploy (or check in dev mode)
3. Open browser console
4. You'll see the actual base URL being used

### Method 3: Check Built Files

1. After deployment, check the built files:
   - Go to Vercel → Your Deployment → **Source** tab
   - Look for the built JavaScript files
   - Search for your backend URL
   - You'll see what URL was baked into the build

### Method 4: Check Vercel Build Logs

1. Go to Vercel Dashboard → Your Project
2. Go to **Deployments** tab
3. Click on a deployment
4. Check **Build Logs**
5. Look for environment variable values (they might be logged during build)

## 🎯 Quick Test

**Easiest method:** Just check the Network tab:

1. Open DevTools (F12) → **Network** tab
2. Try to login
3. Look at the request URL
4. If it shows `https://connectx-backend-p1n4.onrender.com/api/auth/login` ✅
5. If it shows `https://connectx-backend-p1n4.onrender.com/api /auth/login` or has `%20` ❌

## 🔧 Fix if URL is Wrong

If the Network tab shows the wrong URL:

1. **Check Vercel Environment Variable:**
   - Go to Settings → Environment Variables
   - Verify `VITE_API_URL` is exactly: `https://connectx-backend-p1n4.onrender.com/api`
   - No spaces, no trailing slash

2. **Redeploy:**
   - Go to Deployments
   - Click Redeploy on latest deployment
   - Wait for completion

3. **Clear Cache:**
   - Hard refresh: `Ctrl + Shift + R`
   - Or clear browser cache

4. **Test Again:**
   - Check Network tab again
   - URL should be correct now

---

**Use the Network tab method - it's the easiest and most reliable!** 🚀

