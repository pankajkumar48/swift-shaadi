# Swift Shaadi - Indian Wedding Planning PWA

## Overview
Swift Shaadi is a mobile-first Progressive Web App for Indian wedding planning. It features a React + TypeScript frontend, Python FastAPI backend, and Supabase database.

## Architecture

### Frontend (React + TypeScript)
- Located in `client/src/`
- Uses React Query for data fetching
- Shadcn UI components in `client/src/components/ui/`
- Custom hooks for API integration in `client/src/hooks/`
- Pages in `client/src/pages/`

### Backend (Python FastAPI)
- Located in `backend/`
- Main app: `backend/main.py`
- Database models: `backend/models.py`
- Supabase connection: `backend/database.py`
- Runs on port 8000

### Dual-Server Setup
- Express (port 5000) serves frontend and proxies `/api/*` to FastAPI (port 8000)
- Proxy config in `server/routes.ts`

## Database (Supabase)
- Schema defined in `supabase_schema.sql`
- Tables: users, weddings, wedding_team_members, guests, timeline_events, tasks, budget_items
- User must run schema SQL in Supabase dashboard to create tables

## Environment Variables Required
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key
- `SESSION_SECRET`: Session encryption secret

## Running the App
1. Run `npm run dev` - This starts Express on port 5000 AND automatically spawns FastAPI on port 8000
2. No need to manually start FastAPI - it's started automatically by Express

## IMPORTANT: Database Setup Required
Before the app can work, you MUST create the database tables in Supabase:
1. Go to your Supabase Dashboard
2. Click on "SQL Editor" in the left sidebar
3. Copy the contents of `supabase_schema.sql` 
4. Paste and run it in the SQL Editor
5. This creates all required tables: users, weddings, guests, tasks, etc.

Without running this SQL, the app will show "Database error" messages.

## Features (MVP)
- User authentication (signup/login/logout)
- Wedding setup with couple names, date, city
- Guest management with RSVP tracking
- Timeline/events CRUD
- Task planner with status tracking
- Budget tracker with categories
- Team role management (Owner/FamilyAdmin/Helper)
- Invitation message generator with cultural templates

## Design
- Soft pastel wedding theme (peach, blush pink, mint, lavender, light gold)
- Mobile-first, card-based UI
- Design guidelines in `design_guidelines.md`

## API Endpoints
- Auth: `/api/auth/signup`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`
- Weddings: `/api/weddings`, `/api/weddings/:id`
- Guests: `/api/weddings/:id/guests`, `/api/guests/:id`
- Events: `/api/weddings/:id/events`, `/api/events/:id`
- Tasks: `/api/weddings/:id/tasks`, `/api/tasks/:id`
- Budget: `/api/weddings/:id/budget`, `/api/budget/:id`
- Team: `/api/weddings/:id/team`, `/api/team/:id`
- Stats: `/api/weddings/:id/stats`
