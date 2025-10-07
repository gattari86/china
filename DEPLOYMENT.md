# 🚀 Deployment Guide - Discover China!

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Visit Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Repository**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Choose `gattari86/china`
   - Click "Import"

3. **Configure (Optional)**
   - **Project Name**: `discover-china` (or your preference)
   - **Framework Preset**: Other (it's vanilla HTML/CSS/JS)
   - **Root Directory**: `./`
   - **Build Command**: (leave empty - no build needed!)
   - **Output Directory**: (leave empty - serves root)

4. **Deploy**
   - Click "Deploy"
   - Wait 30-60 seconds
   - Your site is live! 🎉

5. **Get Your URL**
   - Vercel provides: `https://discover-china-xxx.vercel.app`
   - Custom domain can be added in project settings

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI (one-time)
npm install -g vercel

# Navigate to project
cd ~/Desktop/discover-china

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project or create new? → Create new
# - What's your project's name? → discover-china
# - In which directory is your code located? → ./
# - Deploy? → Yes

# Get production URL
vercel --prod
```

## Deploy to GitHub Pages

### Enable GitHub Pages

1. **Push to GitHub** (already done!)
   ```bash
   cd ~/Desktop/discover-china
   git add .
   git commit -m "Add Vercel config and deployment docs"
   git push
   ```

2. **Configure GitHub Pages**
   - Go to: https://github.com/gattari86/china/settings/pages
   - Under "Build and deployment":
     - Source: Deploy from a branch
     - Branch: `main` / `root`
   - Click "Save"

3. **Wait 2-3 minutes**

4. **Visit Your Site**
   - URL: `https://gattari86.github.io/china/`

### Custom Domain for GitHub Pages

1. **Add CNAME file**
   ```bash
   echo "your-domain.com" > CNAME
   git add CNAME
   git commit -m "Add custom domain"
   git push
   ```

2. **Update DNS**
   - Add CNAME record pointing to `gattari86.github.io`
   - Or A records to GitHub IPs

3. **Configure in GitHub**
   - Settings → Pages → Custom domain
   - Enter your domain
   - Check "Enforce HTTPS"

## Deploy to Netlify

### Via Netlify Dashboard

1. **Visit Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign in with GitHub

2. **New Site from Git**
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub
   - Select `gattari86/china`

3. **Configure**
   - Build command: (leave empty)
   - Publish directory: (leave empty or `.`)
   - Click "Deploy site"

4. **Live in 30 seconds!**
   - Default URL: `https://random-name.netlify.app`
   - Can customize in Site settings

### Via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to project
cd ~/Desktop/discover-china

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

## Environment Variables

This project has **NO environment variables** or secrets. Everything is static HTML/CSS/JS.

## Post-Deployment Checklist

### ✅ Verify Deployment

1. **Visit the live URL**
   - Check hero section loads
   - Verify all images display
   - Test navigation links

2. **Test Interactivity**
   - Click audio buttons
   - Test drag-and-drop game
   - Open modals
   - Check soundboard

3. **Mobile Testing**
   - Open on phone/tablet
   - Test touch interactions
   - Verify responsive layout

4. **Accessibility Check**
   - Tab through all interactive elements
   - Test keyboard navigation
   - Verify focus indicators
   - Check screen reader compatibility

5. **Performance**
   - Run Lighthouse audit
   - Verify scores:
     - Performance: ≥90
     - Accessibility: ≥95
     - Best Practices: ≥90
     - SEO: ≥90

### 🐛 Common Issues

**Images not loading?**
- Check paths in HTML (should be relative: `assets/images/...`)
- Verify all SVG files are committed
- Check browser console for 404 errors

**Audio not playing?**
- Audio files are placeholders (0 bytes)
- Replace with actual MP3 files
- Ensure MIME types are correct

**Content not rendering?**
- Check `assets/content.json` is valid JSON
- Open browser console for errors
- Verify fetch is allowed (CORS)

**Styles broken?**
- Check `css/styles.css` path in HTML
- Verify CSS file is committed
- Check for CSS syntax errors

## SSL/HTTPS

All deployment platforms provide free SSL:
- **Vercel**: Automatic HTTPS ✅
- **GitHub Pages**: Free SSL (enable in settings) ✅
- **Netlify**: Automatic HTTPS ✅

## Custom Domain Setup

### Vercel Custom Domain

1. **Add Domain in Vercel Dashboard**
   - Project Settings → Domains
   - Enter your domain
   - Follow DNS instructions

2. **Update DNS**
   - Add CNAME: `www` → `cname.vercel-dns.com`
   - Add A record: `@` → Vercel IP
   - Or use Vercel nameservers

3. **Wait for SSL** (automatic, ~1 hour)

### GitHub Pages Custom Domain

1. **Add CNAME file** (see above)

2. **DNS Settings**
   ```
   Type: CNAME
   Name: www
   Value: gattari86.github.io
   ```

3. **Enable HTTPS** in GitHub settings

## Monitoring & Analytics

### Optional: Add Analytics

If you want to track visitors, add one of these:

**Vercel Analytics** (recommended)
```html
<!-- Add before </body> in index.html -->
<script defer src="/_vercel/insights/script.js"></script>
```

**Google Analytics**
```html
<!-- Add in <head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Privacy-First Option: Plausible**
- No cookies, GDPR compliant
- Add script tag from Plausible dashboard

## Continuous Deployment

All platforms support automatic deployment:

✅ **Push to GitHub** → **Auto-deploy**

Every push to `main` branch triggers new deployment!

```bash
# Make changes
git add .
git commit -m "Update content"
git push

# Deployment starts automatically!
```

## Rollback/Revert

### Vercel
- Dashboard → Deployments
- Click any previous deployment
- Click "Promote to Production"

### Netlify
- Site → Deploys
- Find previous deploy
- Click "Publish deploy"

### GitHub Pages
- Revert commit: `git revert HEAD`
- Push: `git push`

## Performance Optimization

Already implemented:
- ✅ Lazy loading images
- ✅ Efficient CSS (no frameworks)
- ✅ Minimal JavaScript
- ✅ SVG images (scalable, small)
- ✅ No external dependencies

Future improvements:
- [ ] Replace placeholder audio with optimized MP3s
- [ ] Add service worker for offline support
- [ ] Implement image preloading for critical assets
- [ ] Add WebP versions of images

## Support & Help

**Vercel Support**: [vercel.com/support](https://vercel.com/support)
**GitHub Pages Docs**: [docs.github.com/pages](https://docs.github.com/pages)
**Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)

## Status

✅ **Project is deployed!**
- GitHub: https://github.com/gattari86/china
- Ready for Vercel deployment
- Ready for GitHub Pages
- Ready for Netlify

🎉 **Share your site and inspire young learners!**
