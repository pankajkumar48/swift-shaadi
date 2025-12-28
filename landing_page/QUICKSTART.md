# Quick Start Guide

Get the Swift Shaadi landing page running in under 2 minutes.

## Prerequisites

Make sure you have **Node.js 18+** installed:
```bash
node --version  # Should be v18 or higher
```

## Development

### 1. Install Dependencies

```bash
cd landing_page
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The landing page will open at: **http://localhost:5173**

### 3. Make Changes

Edit files in `src/` folder:
- `src/Landing.tsx` - Main landing page component
- `src/index.css` - Global styles and theme
- `src/components/ui/` - Reusable UI components

Changes will hot-reload instantly! 🔥

## Production Build

### Build for Deployment

```bash
npm run build
```

This creates optimized files in the `dist/` folder ready for deployment.

### Preview Production Build

```bash
npm run preview
```

Opens the production build at: **http://localhost:4173**

## Deploy

Choose any platform:

### GitHub Pages (Easiest - Automated)

1. Push code to GitHub
2. Enable GitHub Pages (Settings → Pages → Source: GitHub Actions)
3. Done! Auto-deploys on every push

### Netlify (Drag & Drop)

1. Run `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag the `dist/` folder
4. Done!

### Vercel (CLI)

```bash
npm install -g vercel
npm run build
vercel --prod
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guides.

## Customize

### Update App URL

Edit `src/Landing.tsx` line ~41:

```typescript
const handleOpenApp = () => {
  window.location.href = "https://YOUR-APP-URL.com";
};
```

### Update Analytics

Edit `index.html`:
- Google Analytics: Line 30 - Replace `G-YEGS3WZ3SP`
- Clarity: Line 56 - Replace `ujvjvx80eu`

### Change Colors/Theme

Edit `src/index.css` - Modify CSS variables in `:root` and `.dark` sections

## Need Help?

- 📖 Full docs: [README.md](./README.md)
- 🚀 Deployment: [DEPLOYMENT.md](./DEPLOYMENT.md)
- 📧 Support: contact@swiftshaadi.com

---

**That's it!** You're ready to customize and deploy your landing page. 🎉
