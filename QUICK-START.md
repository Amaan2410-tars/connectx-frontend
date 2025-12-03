# 🚀 Quick Start Guide for Testing

## Step 1: Start Backend Server

```powershell
cd ..\..\backend
npm run dev
```

Wait for: `🚀 Server running on port 4000`

## Step 2: Start Frontend Server

```powershell
cd ..\frontend\neon-connectx-vibe-main
npm run dev
```

Wait for: `Local: http://localhost:8080`

## Step 3: Test Backend API (Optional)

```powershell
cd ..\frontend\neon-connectx-vibe-main
.\test-api.ps1
```

## Step 4: Open Browser

1. Open: `http://localhost:8080`
2. You should see the ConnectX app

## Step 5: Test Features

### Quick Test Flow:

1. **Sign Up**
   - Click "Sign up" or go to `/signup`
   - Fill in details
   - Submit

2. **Create Post**
   - Click the "+" button
   - Add caption and/or image
   - Submit

3. **Like & Comment**
   - Click heart to like
   - Click comment icon to comment

4. **Verification**
   - Click shield icon
   - Upload ID card
   - Upload face image
   - Submit

5. **Clubs & Events**
   - Go to Campus Hub tab
   - Join a club
   - RSVP to an event

6. **Rewards & Coupons**
   - Go to Rewards tab
   - Redeem a reward
   - Click ticket icon for coupons

## 🐛 Troubleshooting

### Backend not starting?
- Check if port 4000 is available
- Check `.env` file exists in backend
- Check database connection

### Frontend not connecting?
- Check `.env` file has `VITE_API_URL=http://localhost:4000/api`
- Check backend is running
- Check browser console for errors

### CORS errors?
- Backend should have CORS enabled (already configured)
- Make sure backend is running

### 401 Unauthorized?
- Token expired, try logging in again
- Check localStorage has token

## 📝 Testing Checklist

- [ ] Backend running on port 4000
- [ ] Frontend running on port 8080
- [ ] Can sign up
- [ ] Can login
- [ ] Can create post
- [ ] Can like post
- [ ] Can comment
- [ ] Can upload verification
- [ ] Can join club
- [ ] Can RSVP event
- [ ] Can redeem reward
- [ ] Can redeem coupon
- [ ] Profile updates work

## 🎯 Ready to Test!

Open `http://localhost:8080` and start testing! 🚀

