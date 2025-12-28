# Swift Shaadi Landing Page

Standalone landing page for Swift Shaadi - Indian Wedding Planning App

## Overview

This is an independent landing page project built with React, TypeScript, Vite, and Tailwind CSS. It can be developed, built, and deployed separately from the main application.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

## Getting Started

### Installation

Install all dependencies:

```bash
npm install
```

### Development

Start the development server with hot reload:

```bash
npm run dev
```

The landing page will be available at `http://localhost:5173` (default Vite port).

### Build for Production

Build the project for production deployment:

```bash
npm run build
```

This will:
1. Compile TypeScript files
2. Bundle all assets
3. Optimize for production
4. Output everything to the `dist/` directory

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Deployment

### GitHub Pages

1. Build the project:
   ```bash
   npm run build
   ```

2. The `dist/` folder contains all static files ready to deploy

3. Configure GitHub Pages to serve from the `dist/` folder, or use GitHub Actions:

   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [ main ]

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3

         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'

         - name: Install dependencies
           working-directory: ./landing_page
           run: npm install

         - name: Build
           working-directory: ./landing_page
           run: npm run build

         - name: Deploy
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./landing_page/dist
   ```

### Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to Netlify via:
   - Drag & drop the `dist/` folder to Netlify dashboard
   - Or connect your Git repository with these settings:
     - Base directory: `landing_page`
     - Build command: `npm run build`
     - Publish directory: `landing_page/dist`

### Vercel

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy via Vercel CLI:
   ```bash
   npx vercel --prod
   ```

   Or connect your Git repository with these settings:
   - Root Directory: `landing_page`
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Other Static Hosting Services

The `dist/` folder can be deployed to any static hosting service:
- AWS S3 + CloudFront
- Google Cloud Storage
- Firebase Hosting
- Cloudflare Pages
- Render Static Sites

Simply upload the contents of the `dist/` folder.

## Project Structure

```
landing_page/
├── src/
│   ├── assets/          # Images and static assets
│   │   └── logo.png
│   ├── components/
│   │   └── ui/         # Reusable UI components
│   │       ├── button.tsx
│   │       └── card.tsx
│   ├── lib/
│   │   └── utils.ts    # Utility functions
│   ├── index.css       # Global styles and Tailwind directives
│   ├── Landing.tsx     # Main landing page component
│   └── main.tsx        # Application entry point
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite bundler configuration
├── tailwind.config.ts  # Tailwind CSS configuration
└── postcss.config.js   # PostCSS configuration
```

## Configuration

### Update App URL

To change where the "Open App" button redirects users, edit the `handleOpenApp` function in `src/Landing.tsx`:

```typescript
const handleOpenApp = () => {
  // Replace with your actual app URL
  window.location.href = "https://swiftshaadi.com/app";
};
```

### Analytics

The landing page includes:
- **Google Analytics** (GA4): Tracking ID `G-YEGS3WZ3SP`
- **Microsoft Clarity**: Project ID `ujvjvx80eu`

Update these in `index.html` if you need different tracking codes.

### Styling

The landing page uses the same design system as the main app:
- Color scheme defined in `src/index.css`
- Supports both light and dark modes
- Tailwind CSS for utility classes
- Custom elevation effects for interactive elements

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **class-variance-authority** - Component variant management

## Browser Support

Modern browsers including:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Contact

For questions or support, contact: contact@swiftshaadi.com
