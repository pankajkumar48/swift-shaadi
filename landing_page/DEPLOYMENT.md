# Deployment Guide

This guide provides step-by-step instructions for deploying the Swift Shaadi landing page to various hosting platforms.

## Table of Contents

- [GitHub Pages](#github-pages)
- [Netlify](#netlify)
- [Vercel](#vercel)
- [Render](#render)
- [Cloudflare Pages](#cloudflare-pages)
- [Custom Domain Setup](#custom-domain-setup)

---

## GitHub Pages

### Automated Deployment with GitHub Actions

1. **Enable GitHub Pages in your repository:**
   - Go to repository Settings → Pages
   - Under "Source", select "GitHub Actions"

2. **Push your code:**
   ```bash
   git add .
   git commit -m "Add landing page"
   git push origin main
   ```

3. The workflow in `.github/workflows/deploy.yml` will automatically:
   - Install dependencies
   - Build the project
   - Deploy to GitHub Pages

4. Your site will be available at: `https://your-username.github.io/repository-name/`

### Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Install `gh-pages` package:
   ```bash
   npm install --save-dev gh-pages
   ```

3. Add deployment script to `package.json`:
   ```json
   {
     "scripts": {
       "deploy": "gh-pages -d dist"
     }
   }
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

---

## Netlify

### Option 1: Netlify CLI

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Deploy:
   ```bash
   netlify deploy --prod --dir=dist
   ```

### Option 2: Git Integration

1. Push your code to GitHub/GitLab/Bitbucket

2. Go to [Netlify](https://app.netlify.com/)

3. Click "Add new site" → "Import an existing project"

4. Configure build settings:
   - **Base directory:** `landing_page`
   - **Build command:** `npm run build`
   - **Publish directory:** `landing_page/dist`

5. Click "Deploy site"

### Option 3: Drag & Drop

1. Build the project:
   ```bash
   npm run build
   ```

2. Go to [Netlify Drop](https://app.netlify.com/drop)

3. Drag the `dist/` folder to the upload area

---

## Vercel

### Option 1: Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Build and deploy:
   ```bash
   npm run build
   vercel --prod
   ```

### Option 2: Git Integration

1. Push your code to GitHub/GitLab/Bitbucket

2. Go to [Vercel](https://vercel.com/)

3. Click "Add New" → "Project"

4. Import your repository

5. Configure project:
   - **Root Directory:** `landing_page`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

6. Click "Deploy"

---

## Render

### Static Site Deployment

1. Push your code to GitHub/GitLab

2. Go to [Render](https://render.com/)

3. Click "New" → "Static Site"

4. Connect your repository

5. Configure:
   - **Name:** swift-shaadi-landing
   - **Root Directory:** `landing_page`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `landing_page/dist`

6. Click "Create Static Site"

---

## Cloudflare Pages

### Option 1: Direct Upload

1. Build the project:
   ```bash
   npm run build
   ```

2. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

3. Login to Cloudflare:
   ```bash
   wrangler login
   ```

4. Deploy:
   ```bash
   wrangler pages deploy dist --project-name=swift-shaadi-landing
   ```

### Option 2: Git Integration

1. Push your code to GitHub/GitLab

2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)

3. Navigate to Workers & Pages → Create application → Pages

4. Connect your repository

5. Configure build:
   - **Production branch:** main
   - **Build command:** `cd landing_page && npm install && npm run build`
   - **Build output directory:** `landing_page/dist`

6. Click "Save and Deploy"

---

## Custom Domain Setup

### For GitHub Pages

1. Add a `CNAME` file to `public/` directory:
   ```
   yourdomain.com
   ```

2. In GitHub repository settings:
   - Go to Settings → Pages
   - Under "Custom domain", enter your domain
   - Save

3. Configure DNS records at your domain provider:
   ```
   Type: CNAME
   Name: www
   Value: your-username.github.io

   Type: A
   Name: @
   Value: 185.199.108.153
          185.199.109.153
          185.199.110.153
          185.199.111.153
   ```

### For Netlify

1. Go to Site settings → Domain management

2. Click "Add custom domain"

3. Enter your domain name

4. Configure DNS at your domain provider:
   ```
   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   ```

   Or use Netlify's nameservers for full DNS management.

### For Vercel

1. Go to Project settings → Domains

2. Add your domain

3. Configure DNS:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com

   Type: A
   Name: @
   Value: 76.76.21.21
   ```

### For Cloudflare Pages

Cloudflare automatically handles DNS for domains managed in your Cloudflare account:

1. Go to Workers & Pages → Your project → Custom domains

2. Click "Set up a custom domain"

3. Select your domain from the dropdown

4. Cloudflare will automatically configure the DNS

---

## Environment Variables

If you need to use different tracking IDs or API endpoints for different environments:

1. Create `.env.production` file:
   ```
   VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
   VITE_CLARITY_ID=xxxxxxxxxx
   VITE_APP_URL=https://app.swiftshaadi.com
   ```

2. Update `index.html` to use environment variables:
   ```html
   <script>
     gtag("config", import.meta.env.VITE_GOOGLE_ANALYTICS_ID);
   </script>
   ```

3. Update `Landing.tsx`:
   ```typescript
   const handleOpenApp = () => {
     window.location.href = import.meta.env.VITE_APP_URL || "https://swiftshaadi.com/app";
   };
   ```

---

## Troubleshooting

### Build Fails

- Ensure Node.js version is 18 or higher
- Delete `node_modules` and `package-lock.json`, then run `npm install`
- Check for TypeScript errors: `npm run build`

### Assets Not Loading

- Verify the base path in `vite.config.ts`
- For GitHub Pages subdirectory deployments, set base: `'/repository-name/'`

### 404 on Page Refresh

For SPAs deployed as static sites, configure redirects:

**Netlify:** Create `public/_redirects`:
```
/*    /index.html   200
```

**Vercel:** Create `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## Performance Optimization

After deployment, consider:

1. **Enable compression** (usually automatic on modern platforms)
2. **Configure CDN** (included with Netlify, Vercel, Cloudflare)
3. **Set up caching headers** for static assets
4. **Enable HTTP/2 or HTTP/3** (automatic on most platforms)
5. **Monitor with Google PageSpeed Insights**

---

## Security

1. **HTTPS:** All modern platforms provide automatic SSL certificates
2. **Security Headers:** Configure CSP, X-Frame-Options, etc.
3. **Analytics Privacy:** Ensure compliance with GDPR/privacy laws

---

## Support

For deployment issues:
- Netlify: https://answers.netlify.com/
- Vercel: https://vercel.com/support
- GitHub Pages: https://docs.github.com/pages
- Render: https://render.com/docs
- Cloudflare: https://community.cloudflare.com/
