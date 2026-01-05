# Deployment Guide

## Option 1: Netlify (Recommended)

### Using Netlify CLI
1. Install Netlify CLI: `npm install -g netlify-cli`
2. Build the app: `npm run build`
3. Deploy: `netlify deploy --prod --dir=dist`

### Using Netlify Web Interface
1. Build the app: `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag and drop the `dist` folder
4. Your app is live!

### Continuous Deployment
1. Push code to GitHub
2. Connect GitHub repo to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Auto-deploy on every push!

## Option 2: Vercel

1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel`
3. Follow the prompts
4. Your app is deployed!

## Option 3: GitHub Pages

1. Install gh-pages: `npm install -D gh-pages`
2. Add to package.json scripts:
   ```json
   "deploy": "npm run build && gh-pages -d dist"
   ```
3. Run: `npm run deploy`
4. Enable GitHub Pages in repo settings

## Custom Domain

After deployment, you can add a custom domain like:
- `badminton.yourclub.com`
- `payments.yourclub.com`

## Environment Variables

For Google Sheets integration, add these to your hosting platform:
- `VITE_GOOGLE_API_KEY`
- `VITE_SPREADSHEET_ID`

## Mobile App (PWA)

The app is PWA-ready! Users can:
1. Open in mobile browser
2. Tap "Add to Home Screen"
3. Use like a native app

## Security Notes

- Data is stored locally in browser
- No sensitive data is transmitted
- Google Sheets integration is optional
- Use HTTPS in production (automatic with Netlify/Vercel)