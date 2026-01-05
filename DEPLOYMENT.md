# 🚀 Deployment Guide: GitHub + Netlify

## Step 1: Push to GitHub

### 1.1 Create GitHub Repository
1. Go to [github.com](https://github.com) and sign in
2. Click the "+" icon → "New repository"
3. Repository name: `badminton-payment-tracker`
4. Description: `Payment tracker for badminton club with WhatsApp integration`
5. Set to **Public** (required for free Netlify)
6. **Don't** initialize with README (we already have one)
7. Click "Create repository"

### 1.2 Push Your Code
Copy and run these commands in your terminal:

```bash
# Add GitHub as remote origin (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/badminton-payment-tracker.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Netlify

### 2.1 Connect GitHub to Netlify
1. Go to [netlify.com](https://netlify.com) and sign up/sign in
2. Click "Add new site" → "Import an existing project"
3. Choose "Deploy with GitHub"
4. Authorize Netlify to access your GitHub
5. Select your `badminton-payment-tracker` repository

### 2.2 Configure Build Settings
- **Branch to deploy**: `main`
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- Click "Deploy site"

### 2.3 Custom Domain (Optional)
1. In Netlify dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Enter your domain (e.g., `badminton.yourclub.com`)
4. Follow DNS setup instructions

## Step 3: Environment Variables (Optional)

If you want Google Sheets integration:

1. In Netlify dashboard → "Site settings" → "Environment variables"
2. Add these variables:
   - `VITE_GOOGLE_API_KEY`: Your Google API key
   - `VITE_SPREADSHEET_ID`: Your Google Sheet ID

## Step 4: Automatic Deployments

✅ **Automatic deployments are now set up!**

Every time you push changes to GitHub:
1. Netlify automatically detects the changes
2. Builds your app (`npm run build`)
3. Deploys the new version
4. Your site updates within 1-2 minutes

## Step 5: Making Updates

To update your app:

```bash
# Make your changes to the code
# Then commit and push:
git add .
git commit -m "Add new feature"
git push origin main
```

Netlify will automatically deploy the changes!

## 🎉 Your App is Live!

- **Netlify URL**: `https://your-site-name.netlify.app`
- **Custom Domain**: `https://your-domain.com` (if configured)
- **GitHub Repo**: `https://github.com/YOUR_USERNAME/badminton-payment-tracker`

## Troubleshooting

### Build Fails
- Check the build log in Netlify dashboard
- Make sure `package.json` has correct scripts
- Verify all dependencies are listed

### Site Not Loading
- Check if build command is `npm run build`
- Verify publish directory is `dist`
- Look for errors in Netlify function logs

### Need Help?
- Check Netlify docs: [docs.netlify.com](https://docs.netlify.com)
- GitHub issues: Create issues in your repo
- Netlify support: Available in dashboard

---

**🏸 Your badminton club payment tracker is now live and automatically updating!**