# Deploy Swift-Shaadi to Render

Complete step-by-step guide to deploy your wedding planning app to Render.

---

## Prerequisites

Before deploying, ensure you have:
- [ ] GitHub account
- [ ] Render account (sign up at https://render.com)
- [ ] Supabase account with database setup
- [ ] Google OAuth credentials

---

## Step 1: Prepare Your Supabase Database

### 1.1 Create/Login to Supabase Project
1. Go to https://supabase.com/dashboard
2. Create a new project or use existing one
3. Wait for project to finish provisioning

### 1.2 Run Database Schema
1. Click **SQL Editor** in left sidebar
2. Copy contents of `supabase_schema.sql` from your project
3. Paste and click **Run** to create all tables
4. If you have existing tables, also run `supabase_update_guests.sql`

### 1.3 Get Supabase Credentials
1. Go to **Project Settings** → **API**
2. Copy these values (you'll need them later):
   - `Project URL` → This is your `SUPABASE_URL`
   - `anon public` key → This is your `SUPABASE_ANON_KEY`

---

## Step 2: Setup Google OAuth

### 2.1 Create Google Cloud Project
1. Go to https://console.cloud.google.com
2. Create a new project or select existing one
3. Enable **Google+ API** (if not enabled)

### 2.2 Create OAuth Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth Client ID**
3. Choose **Web Application**
4. Configure:
   - **Name**: Swift Shaadi Production
   - **Authorized JavaScript origins**:
     - `https://swift-shaadi.onrender.com` (replace with your Render URL)
   - **Authorized redirect URIs**:
     - `https://swift-shaadi.onrender.com/api/auth/google/callback`
   - Click **Create**

5. Copy these values (you'll need them later):
   - `Client ID` → This is your `GOOGLE_CLIENT_ID`
   - `Client Secret` → This is your `GOOGLE_CLIENT_SECRET`

**Note**: You'll update the Render URL after deployment in Step 4.

---

## Step 3: Push Code to GitHub

### 3.1 Initialize Git (if not already done)
```bash
cd /Users/pankajkumar/Downloads/Swift-Shaadi
git init
git add .
git commit -m "Initial commit - ready for deployment"
```

### 3.2 Create GitHub Repository
1. Go to https://github.com/new
2. Create a new repository (e.g., `swift-shaadi`)
3. **Do not** initialize with README (you already have code)
4. Click **Create repository**

### 3.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/swift-shaadi.git
git branch -M main
git push -u origin main
```

---

## Step 4: Deploy to Render

### 4.1 Create New Web Service
1. Go to https://dashboard.render.com
2. Click **New +** → **Web Service**
3. Connect your GitHub account if not connected
4. Select your `swift-shaadi` repository

### 4.2 Configure Service

Fill in the following settings:

| Field | Value |
|-------|-------|
| **Name** | `swift-shaadi` (or your preferred name) |
| **Region** | Choose closest to you (e.g., Oregon) |
| **Branch** | `main` |
| **Root Directory** | Leave empty |
| **Runtime** | **Node** |
| **Build Command** | See below ⬇️ |
| **Start Command** | `npm run start` |
| **Plan** | Free or Starter ($7/month for better performance) |

**Build Command** (copy exactly):
```bash
pip install -r requirements.txt && npm install && npm run build
```

### 4.3 Add Environment Variables

Click **Advanced** and add these environment variables:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Required |
| `SUPABASE_URL` | Your Supabase URL | From Step 1.3 |
| `SUPABASE_ANON_KEY` | Your Supabase anon key | From Step 1.3 |
| `GOOGLE_CLIENT_ID` | Your Google Client ID | From Step 2.2 |
| `GOOGLE_CLIENT_SECRET` | Your Google Client Secret | From Step 2.2 |
| `SESSION_SECRET` | Click "Generate" | Auto-generates secure key |

**Optional** (if using Render PostgreSQL instead of Supabase):
| Key | Value |
|-----|-------|
| `DATABASE_URL` | Your Render PostgreSQL URL |

### 4.4 Deploy
1. Click **Create Web Service**
2. Render will start building your app
3. Wait 5-10 minutes for first build (installs Node + Python dependencies)
4. Watch build logs for any errors

---

## Step 5: Update Google OAuth Redirect URIs

After deployment succeeds:

1. Note your Render URL (e.g., `https://swift-shaadi.onrender.com`)
2. Go back to **Google Cloud Console** → **APIs & Services** → **Credentials**
3. Click on your OAuth Client ID
4. Update **Authorized redirect URIs** with your actual Render URL:
   - `https://YOUR-APP-NAME.onrender.com/api/auth/google/callback`
5. Click **Save**

---

## Step 6: Test Your Deployment

1. Visit your Render URL: `https://YOUR-APP-NAME.onrender.com`
2. Test the landing page loads
3. Click **Get Started** or **Login**
4. Test Google OAuth login
5. Test creating a wedding
6. Test all features (guests, timeline, tasks, budget)

### Common Issues & Fixes

**Issue**: "Database error" messages
- **Fix**: Make sure you ran the SQL schema in Supabase (Step 1.2)
- **Fix**: Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct

**Issue**: Google OAuth fails
- **Fix**: Verify redirect URIs match exactly in Google Console
- **Fix**: Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct

**Issue**: Build fails with Python errors
- **Fix**: Check `requirements.txt` is in root directory
- **Fix**: Verify build command includes `pip install -r requirements.txt`

**Issue**: App shows "Service Unavailable"
- **Fix**: Check Render logs for errors
- **Fix**: Ensure both Express and FastAPI are starting (check logs)

---

## Step 7: Custom Domain (Optional)

### 7.1 Add Custom Domain in Render
1. Go to your Render service dashboard
2. Click **Settings** → **Custom Domains**
3. Click **Add Custom Domain**
4. Enter your domain (e.g., `swiftshaadi.com`)
5. Render will provide DNS records

### 7.2 Update DNS
1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Add the DNS records provided by Render
3. Wait for DNS propagation (5-60 minutes)

### 7.3 Update Google OAuth
1. Go back to Google Cloud Console
2. Add your custom domain to authorized origins and redirect URIs:
   - Origin: `https://swiftshaadi.com`
   - Redirect URI: `https://swiftshaadi.com/api/auth/google/callback`

---

## Step 8: Monitoring & Maintenance

### Enable Auto-Deploy
- In Render dashboard, go to **Settings**
- Auto-deploy is ON by default for the `main` branch
- Every `git push` to `main` will trigger automatic deployment

### View Logs
- Go to **Logs** tab in Render dashboard
- Monitor for errors or issues
- Logs show both Express and FastAPI output

### Update Environment Variables
- Go to **Environment** tab
- Click **Edit** to modify any variable
- Service will automatically redeploy after changes

---

## Cost Estimate

**Free Tier**:
- Web Service: Free (spins down after inactivity, 750 hrs/month)
- Supabase: Free (up to 500MB database, 2GB bandwidth)
- **Total**: $0/month

**Starter Plan** (Recommended for production):
- Web Service: $7/month (always on, no spin down)
- Supabase: Free tier or Pro ($25/month for more resources)
- **Total**: $7-32/month

---

## Next Steps After Deployment

1. **Test thoroughly** - Create test weddings, guests, etc.
2. **Invite beta users** - Get feedback from real users
3. **Monitor performance** - Check Render metrics and logs
4. **Set up backups** - Supabase has automatic backups
5. **Add analytics** - Consider Google Analytics or PostHog
6. **Custom domain** - Make it professional with your own domain

---

## Support

- **Render Docs**: https://render.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Google OAuth**: https://developers.google.com/identity/protocols/oauth2

---

## Troubleshooting Commands

If you need to debug locally before deploying:

```bash
# Test build locally
pip install -r requirements.txt
npm install
npm run build

# Test production locally
NODE_ENV=production npm run start

# Check if FastAPI is accessible
curl http://localhost:8000/api/health

# Check if Express is accessible
curl http://localhost:5000/api/health
```

---

**Congratulations!** 🎉 Your Swift-Shaadi wedding planning app is now live on Render!