# 🚀 Vercel Deployment Guide for ConnectX Frontend

## Quick Setup on Vercel

### Step 1: Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com)
2. Click **Add New** → **Project**
3. Import your Git repository (frontend repository)
4. Select the repository

### Step 2: Configure Project

**Project Settings:**
- **Framework Preset**: Vite (or Other)
- **Root Directory**: Leave empty (or `frontend/neon-connectx-vibe-main` if repo root)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 3: Add Environment Variables

Go to **Settings** → **Environment Variables** and add:

```
VITE_API_URL=https://connectx-backend-p1n4.onrender.com/api
```

**Important**: This is the current Render backend URL. If it changes, update this variable.

### Step 4: Deploy

Click **Deploy** - Vercel will automatically:
- Install dependencies
- Build the project
- Deploy to production

### Step 5: Get Your Frontend URL

Your frontend will be at: `https://your-project.vercel.app`

---

## 🔄 Update Backend CORS

After Vercel deployment, update your Render backend:

1. Go to Render dashboard → Your backend service
2. Update environment variable:
   ```
   FRONTEND_URL=https://your-project.vercel.app
   ```
3. Redeploy backend (or it will auto-redeploy)

---

## 📝 Environment Variables

### Required
- `VITE_API_URL` - Your backend API URL (e.g., `https://connectx-backend-p1n4.onrender.com/api`)

### Optional
- None required for basic deployment

---

## 🎯 Post-Deployment Checklist

- [ ] Frontend deployed on Vercel
- [ ] Environment variable `VITE_API_URL` set
- [ ] Backend `FRONTEND_URL` updated with Vercel URL
- [ ] CORS working (test API calls)
- [ ] Authentication working
- [ ] All pages loading correctly
- [ ] API calls successful

---

## 🔧 Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all dependencies in `package.json`
- Ensure Node.js version is compatible

### API Calls Failing
- Verify `VITE_API_URL` is correct
- Check CORS settings in backend
- Verify backend is accessible

### Routing Issues
- Vercel.json includes rewrite rules for SPA routing
- All routes should redirect to `index.html`

### Environment Variables Not Working
- Vercel requires `VITE_` prefix for Vite projects
- Redeploy after adding environment variables
- Check variable names match exactly

---

## 📊 Vercel Configuration

The `vercel.json` file includes:
- Build configuration
- SPA routing rewrites
- Framework detection

---

## 🚀 Custom Domain (Optional)

1. Go to project → **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Update `VITE_API_URL` if needed

---

## ⚡ Performance

Vercel automatically:
- Optimizes assets
- Enables CDN
- Provides SSL/HTTPS
- Handles caching

---

## 📞 Support

For deployment issues:
- Check Vercel build logs
- Review error messages
- Verify environment variables
- Test API connectivity

---

**Your frontend is ready! Follow the steps above to deploy on Vercel.** 🎉

