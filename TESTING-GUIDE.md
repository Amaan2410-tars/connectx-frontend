# ConnectX Testing Guide

## 🧪 Testing Checklist

### 1. **Backend Server**
- ✅ Backend should be running on `http://localhost:4000`
- ✅ Check health endpoint: `http://localhost:4000/`
- ✅ Should return: `{"success":true,"status":"ConnectX Backend is Running"}`

### 2. **Frontend Server**
- ✅ Frontend should be running on `http://localhost:8080` (or port shown in terminal)
- ✅ Open browser to see the ConnectX app

### 3. **Authentication Testing**

#### Sign Up
1. Navigate to `/signup` or click sign up
2. Fill in:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "password123"
   - Phone (optional)
   - Batch (optional)
3. Click "Sign Up"
4. ✅ Should redirect to home page
5. ✅ Should see user profile in top right

#### Login
1. Navigate to `/login`
2. Enter credentials:
   - Email: "test@example.com"
   - Password: "password123"
3. Click "Login"
4. ✅ Should redirect to home page
5. ✅ Should be authenticated

#### Logout
1. Click profile/settings
2. Find logout option (or clear localStorage)
3. ✅ Should redirect to login page

### 4. **Post Testing**

#### Create Post
1. Click the "+" button (floating action button on home feed)
2. Enter caption: "My first post!"
3. Optionally upload an image
4. Click "Create Post"
5. ✅ Post should appear in feed
6. ✅ Should see success toast

#### View Feed
1. Navigate to home feed
2. ✅ Should see posts from all users
3. ✅ Should see user avatars, names, captions, images
4. ✅ Should see like/comment counts

#### Like Post
1. Click heart icon on any post
2. ✅ Heart should fill (turn pink)
3. ✅ Like count should increase
4. ✅ Click again to unlike

#### Comment on Post
1. Click comment icon on any post
2. Enter comment text
3. Click "Post Comment"
4. ✅ Comment should be added
5. ✅ Comment count should increase

### 5. **Profile Testing**

#### View Profile
1. Click on profile tab
2. ✅ Should see:
   - Avatar
   - Name
   - Email
   - Points
   - Verification status
   - Stats

#### Update Profile
1. Click "Edit Profile"
2. Update:
   - Name
   - Batch
   - Upload new avatar
   - Upload new banner
3. Click "Update Profile"
4. ✅ Changes should be saved
5. ✅ Should see updated info

### 6. **Verification Testing**

#### Submit Verification
1. Click verification icon (shield) in top bar
2. Step 1: Upload ID Card
   - Click "Upload" or "Camera"
   - Select/upload ID card image
   - ✅ Should show preview
3. Step 2: Upload Face Image
   - Click "Upload" or "Camera"
   - Select/upload face image
   - ✅ Should show preview
4. Click "Submit Verification"
5. ✅ Should show "Verification Submitted" message
6. ✅ Status should be "pending"

#### Check Verification Status
1. Navigate to verification flow again
2. ✅ Should see current status:
   - Pending (if under review)
   - Approved (if verified)
   - Rejected (if rejected)

### 7. **Clubs Testing**

#### View Clubs
1. Navigate to Campus Hub tab
2. Scroll to "Clubs" section
3. ✅ Should see list of clubs
4. ✅ Should see club names, descriptions, member counts

#### Join Club
1. Find a club
2. Click "Join" button
3. ✅ Should see success toast
4. ✅ Member count should increase

### 8. **Events Testing**

#### View Events
1. Navigate to Campus Hub tab
2. Scroll to "Events" section
3. ✅ Should see list of events
4. ✅ Should see event titles, descriptions, dates, attendee counts

#### RSVP to Event
1. Find an event
2. Click "RSVP" button
3. ✅ Should see success toast
4. ✅ Attendee count should increase

### 9. **Rewards Testing**

#### View Rewards
1. Navigate to Rewards tab
2. ✅ Should see list of available rewards
3. ✅ Should see:
   - Reward titles
   - Points required
   - Images (if available)

#### Redeem Reward
1. Find a reward you have enough points for
2. Click "Redeem" button
3. ✅ Should see success toast
4. ✅ Points should be deducted
5. ✅ Reward should be marked as redeemed

### 10. **Coupons Testing**

#### View Coupons
1. Click coupon icon (ticket) in top bar
2. ✅ Should see list of coupons
3. ✅ Should see:
   - Vendor names
   - Discount values
   - Expiry dates
   - Categories

#### Redeem Coupon
1. Click on a coupon
2. ✅ Should see QR code modal
3. Click "Redeem Coupon"
4. ✅ Should see success toast
5. ✅ Coupon should be marked as used

### 11. **Error Testing**

#### Invalid Login
1. Try logging in with wrong password
2. ✅ Should see error toast
3. ✅ Should not redirect

#### Network Error
1. Stop backend server
2. Try any API call
3. ✅ Should handle error gracefully
4. ✅ Should show error message

#### Unauthorized Access
1. Clear localStorage (remove tokens)
2. Try accessing protected route
3. ✅ Should redirect to login

## 🔍 API Testing with Postman/Thunder Client

### Test Backend Directly

1. **Health Check**
   ```
   GET http://localhost:4000/
   ```

2. **Sign Up**
   ```
   POST http://localhost:4000/api/auth/signup
   Body: {
     "name": "Test User",
     "email": "test@example.com",
     "password": "password123"
   }
   ```

3. **Login**
   ```
   POST http://localhost:4000/api/auth/login
   Body: {
     "email": "test@example.com",
     "password": "password123"
   }
   Response: { accessToken, refreshToken, user }
   ```

4. **Get Profile (with token)**
   ```
   GET http://localhost:4000/api/auth/me
   Headers: {
     "Authorization": "Bearer YOUR_ACCESS_TOKEN"
   }
   ```

5. **Create Post (with token)**
   ```
   POST http://localhost:4000/api/student/posts
   Headers: {
     "Authorization": "Bearer YOUR_ACCESS_TOKEN",
     "Content-Type": "multipart/form-data"
   }
   Body (form-data):
     - caption: "Test post"
     - postImage: [file]
   ```

## 🐛 Common Issues & Solutions

### Issue: "Network Error" or "Failed to fetch"
- **Solution**: Check if backend is running on port 4000
- **Solution**: Check `.env` file has correct `VITE_API_URL`

### Issue: "401 Unauthorized"
- **Solution**: Token expired, try logging in again
- **Solution**: Check if token is in localStorage

### Issue: "CORS Error"
- **Solution**: Backend should have CORS enabled (already configured)
- **Solution**: Check backend is running

### Issue: Images not uploading
- **Solution**: Check file size (max 5MB)
- **Solution**: Check file type (JPEG, PNG, GIF, WebP)
- **Solution**: Check backend uploads folder exists

### Issue: Feed not loading
- **Solution**: Check if there are posts in database
- **Solution**: Check network tab for API errors
- **Solution**: Try creating a post first

## ✅ Success Criteria

All tests pass if:
- ✅ Can sign up and login
- ✅ Can create and view posts
- ✅ Can like and comment on posts
- ✅ Can upload verification images
- ✅ Can join clubs and RSVP to events
- ✅ Can view and redeem rewards
- ✅ Can view and redeem coupons
- ✅ Profile updates work
- ✅ File uploads work
- ✅ Error handling works
- ✅ Protected routes work

## 📊 Performance Testing

1. **Load Time**: App should load in < 3 seconds
2. **API Response**: API calls should complete in < 1 second
3. **Image Upload**: Should upload in < 5 seconds (depends on size)
4. **Feed Scroll**: Should be smooth with pagination

## 🎯 Next Steps After Testing

1. Fix any bugs found
2. Add more error handling if needed
3. Optimize performance
4. Add loading states where missing
5. Improve UX based on testing feedback

