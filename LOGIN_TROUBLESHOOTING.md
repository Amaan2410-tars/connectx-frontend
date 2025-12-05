# 🔍 Login Troubleshooting Guide

## Common Login Issues & Solutions

### Issue 1: "Login failed" Error

**Possible Causes:**

1. **VITE_API_URL Not Set in Vercel**
   - Check Vercel Dashboard → Settings → Environment Variables
   - Ensure `VITE_API_URL` is set to: `https://connectx-backend.onrender.com/api`
   - **Important**: Must include `/api` at the end
   - Redeploy after adding/updating

2. **Backend Not Accessible**
   - Test backend health: `https://connectx-backend.onrender.com/`
   - Should return: `{"success": true, "status": "ConnectX Backend is Running"}`
   - If not accessible, check Render deployment status

3. **CORS Issue**
   - Verify `FRONTEND_URL` in Render backend environment variables
   - Should be: `https://connectx-frontend.vercel.app`
   - Redeploy backend after updating

4. **User Doesn't Exist**
   - User must be created first via signup
   - Check Supabase database → User table
   - Verify user exists with correct email

5. **Wrong Password**
   - Passwords are hashed with bcrypt
   - Cannot be viewed in database
   - Must use signup or reset password

### How to Debug

1. **Open Browser Console (F12)**
   - Look for error messages
   - Check Network tab for failed requests
   - See what URL is being called

2. **Check API Call**
   - Should be: `POST https://connectx-backend.onrender.com/api/auth/login`
   - If it's `http://localhost:4000/api/auth/login`, VITE_API_URL is not set

3. **Check Response**
   - Network tab → Login request → Response
   - Look for error message from backend

### Quick Fixes

**Fix 1: Set VITE_API_URL in Vercel**
1. Go to Vercel Dashboard
2. Your Project → Settings → Environment Variables
3. Add: `VITE_API_URL` = `https://connectx-backend.onrender.com/api`
4. Redeploy

**Fix 2: Update Backend CORS**
1. Go to Render Dashboard
2. Your Backend Service → Environment
3. Update: `FRONTEND_URL` = `https://connectx-frontend.vercel.app`
4. Redeploy

**Fix 3: Create Test User**
1. Use Signup page to create account
2. Or create directly in Supabase (password will need to be hashed)

### Testing Steps

1. **Test Backend Health**
   ```bash
   curl https://connectx-backend.onrender.com/
   ```

2. **Test Login Endpoint**
   ```bash
   curl -X POST https://connectx-backend.onrender.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

3. **Check Browser Console**
   - Open DevTools (F12)
   - Try login
   - Check Console and Network tabs

### Expected Behavior

**Successful Login:**
- API call to: `POST /api/auth/login`
- Response: `200 OK` with tokens
- Redirects to `/`
- User data stored in localStorage

**Failed Login:**
- Shows specific error message
- Console shows error details
- Network tab shows failed request

### Still Not Working?

1. Check browser console for detailed errors
2. Verify environment variables are set correctly
3. Test backend endpoint directly
4. Check Render/Vercel deployment logs
5. Verify user exists in database

