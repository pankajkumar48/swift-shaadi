from fastapi import FastAPI, HTTPException, Depends, Response, Cookie, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from typing import Optional
import uuid
import hashlib
import os
import traceback
import secrets
import httpx
from urllib.parse import urlencode
from dotenv import load_dotenv

from .database import supabase
from .models import (
    UserCreate, UserLogin, User,
    WeddingCreate, WeddingUpdate, Wedding,
    TeamMemberCreate, TeamMemberUpdate, TeamMember,
    GuestCreate, GuestUpdate, Guest,
    TimelineEventCreate, TimelineEventUpdate, TimelineEvent,
    TaskCreate, TaskUpdate, Task,
    BudgetItemCreate, BudgetItemUpdate, BudgetItem,
)


load_dotenv()


# Google OAuth Configuration
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "")

# OAuth configuration
import time
import hmac
import base64
import json

OAUTH_STATE_EXPIRY = 600  # 10 minutes

# SESSION_SECRET is required for secure OAuth state signing
SESSION_SECRET = os.getenv("SESSION_SECRET")
if not SESSION_SECRET:
    # Generate a warning but don't fail - use a temporary secret for dev
    print("[WARNING] SESSION_SECRET not set - OAuth states won't survive server restarts")
    SESSION_SECRET = secrets.token_hex(32)

# Track used state nonces with timestamps to prevent replay attacks
used_state_nonces: dict[str, float] = {}  # nonce -> timestamp when used


def create_signed_state(initiator_nonce: str) -> str:
    """Create a signed OAuth state token with embedded timestamp and client binding"""
    payload = {
        "nonce": secrets.token_urlsafe(16),
        "ts": int(time.time()),
        "initiator": initiator_nonce  # Binds state to the initiating browser's cookie
    }
    payload_json = json.dumps(payload)
    payload_b64 = base64.urlsafe_b64encode(payload_json.encode()).decode()
    signature = hmac.new(SESSION_SECRET.encode(), payload_b64.encode(), "sha256").hexdigest()
    return f"{payload_b64}.{signature}"


def cleanup_used_nonces():
    """Remove expired nonces from the used set"""
    global used_state_nonces
    current_time = time.time()
    expired = [n for n, t in used_state_nonces.items() if current_time - t > OAUTH_STATE_EXPIRY * 2]
    for n in expired:
        del used_state_nonces[n]


def verify_signed_state(state: str, initiator_cookie: str) -> bool:
    """Verify a signed OAuth state token, check expiry, enforce single-use, and validate client binding"""
    global used_state_nonces
    try:
        if not initiator_cookie:
            return False
            
        parts = state.split(".")
        if len(parts) != 2:
            return False
        
        payload_b64, signature = parts
        expected_sig = hmac.new(SESSION_SECRET.encode(), payload_b64.encode(), "sha256").hexdigest()
        
        if not hmac.compare_digest(signature, expected_sig):
            return False
        
        payload_json = base64.urlsafe_b64decode(payload_b64.encode()).decode()
        payload = json.loads(payload_json)
        
        ts = payload.get("ts", 0)
        nonce = payload.get("nonce", "")
        initiator = payload.get("initiator", "")
        
        # Verify client binding - state must match the cookie set during initiation
        if not hmac.compare_digest(initiator, initiator_cookie):
            return False
        
        # Check expiry
        if time.time() - ts > OAUTH_STATE_EXPIRY:
            return False
        
        # Check if nonce was already used (prevent replay attacks)
        if nonce in used_state_nonces:
            return False
        
        # Mark nonce as used with timestamp for cleanup
        used_state_nonces[nonce] = time.time()
        
        # Periodic cleanup of expired nonces
        cleanup_used_nonces()
        
        return True
    except Exception:
        return False

app = FastAPI(title="Swift Shaadi API", version="1.0.0")

# Log errors for debugging
def log_error(context: str, error: Exception):
    print(f"[ERROR] {context}: {str(error)}")
    traceback.print_exc()

# Configure CORS - allow all origins for now, but in production you should restrict this
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")
if allowed_origins == ["*"]:
    allowed_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sessions: dict[str, str] = {}


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def get_current_user(session_id: Optional[str] = Cookie(None, alias="session_id")) -> str:
    if not session_id or session_id not in sessions:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return sessions[session_id]


# Health check endpoint
@app.get("/api/health")
async def health_check():
    try:
        result = supabase.table("users").select("id").limit(1).execute()
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        log_error("health_check", e)
        return {"status": "error", "database": "disconnected", "message": str(e)}


# Auth Routes
@app.post("/api/auth/signup")
async def signup(user: UserCreate, request: Request, response: Response):
    try:
        existing = supabase.table("users").select("id").eq("email", user.email).execute()
        if existing.data:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        user_id = str(uuid.uuid4())
        new_user = {
            "id": user_id,
            "name": user.name,
            "email": user.email,
            "password": hash_password(user.password),
        }
        
        result = supabase.table("users").insert(new_user).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create user")
        
        session_id = str(uuid.uuid4())
        sessions[session_id] = user_id
        
        host = request.headers.get("host", "localhost:5000")
        scheme = request.headers.get("x-forwarded-proto", "https" if "replit" in host else "http")
        is_secure = scheme == "https"
        response.set_cookie("session_id", session_id, httponly=True, samesite="lax", secure=is_secure)
        
        return {"user": {"id": user_id, "name": user.name, "email": user.email}}
    except HTTPException:
        raise
    except Exception as e:
        log_error("signup", e)
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@app.post("/api/auth/login")
async def login(credentials: UserLogin, request: Request, response: Response):
    result = supabase.table("users").select("*").eq("email", credentials.email).execute()
    
    if not result.data:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user = result.data[0]
    if user["password"] != hash_password(credentials.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    session_id = str(uuid.uuid4())
    sessions[session_id] = user["id"]
    
    host = request.headers.get("host", "localhost:5000")
    scheme = request.headers.get("x-forwarded-proto", "https" if "replit" in host else "http")
    is_secure = scheme == "https"
    response.set_cookie("session_id", session_id, httponly=True, samesite="lax", secure=is_secure)
    
    return {"user": {"id": user["id"], "name": user["name"], "email": user["email"]}}


@app.post("/api/auth/logout")
async def logout(response: Response, session_id: Optional[str] = Cookie(None, alias="session_id")):
    if session_id and session_id in sessions:
        del sessions[session_id]
    response.delete_cookie("session_id")
    return {"success": True}


@app.get("/api/auth/me")
async def get_me(user_id: str = Depends(get_current_user)):
    result = supabase.table("users").select("id, name, email").eq("id", user_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="User not found")
    return {"user": result.data[0]}


# Google OAuth Routes
@app.get("/api/auth/google")
async def google_login(request: Request):
    """Initiate Google OAuth flow"""
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=500, detail="Google OAuth not configured")
    
    # Generate initiator nonce for client binding
    initiator_nonce = secrets.token_urlsafe(16)
    
    # Generate signed state token with client binding
    state = create_signed_state(initiator_nonce)
    
    # Build the redirect URI dynamically based on the request
    # Debug: log all relevant headers
    print(f"[DEBUG] OAuth Headers: host={request.headers.get('host')}, x-forwarded-host={request.headers.get('x-forwarded-host')}, origin={request.headers.get('origin')}, referer={request.headers.get('referer')}")
    
    # Try to get the original domain from various headers
    # Priority: referer (most reliable for custom domains) > origin > x-forwarded-host > host
    host = None
    referer = request.headers.get("referer", "")
    origin = request.headers.get("origin", "")
    
    # Extract host from referer URL (e.g., "https://swiftshaadi.com/app" -> "swiftshaadi.com")
    if referer and ("swiftshaadi.com" in referer or "swiftshaadi.replit.app" in referer):
        from urllib.parse import urlparse
        parsed = urlparse(referer)
        if parsed.netloc:
            host = parsed.netloc
    
    # Fallback to origin header
    if not host and origin:
        from urllib.parse import urlparse
        parsed = urlparse(origin)
        if parsed.netloc:
            host = parsed.netloc
    
    # Fallback to x-forwarded-host or host header
    if not host:
        host = request.headers.get("x-forwarded-host") or request.headers.get("host", "localhost:5000")
    
    scheme = request.headers.get("x-forwarded-proto", "https" if "replit" in host or "swiftshaadi" in host else "http")
    # Always use dynamic redirect URI for multi-domain support (ignore GOOGLE_REDIRECT_URI env var)
    redirect_uri = f"{scheme}://{host}/api/auth/google/callback"
    is_secure = scheme == "https"
    
    print(f"[DEBUG] Using redirect_uri: {redirect_uri}")
    
    # Build Google authorization URL
    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": redirect_uri,
        "response_type": "code",
        "scope": "openid email profile",
        "state": state,
        "access_type": "offline",
        "prompt": "consent",
    }
    auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"
    
    # Set initiator cookie for CSRF protection (binds state to this browser)
    response = RedirectResponse(url=auth_url)
    response.set_cookie(
        "oauth_initiator",
        initiator_nonce,
        httponly=True,
        samesite="lax",
        secure=is_secure,
        max_age=OAUTH_STATE_EXPIRY,
    )
    return response


@app.get("/api/auth/google/callback")
async def google_callback(
    request: Request, 
    code: str = None, 
    state: str = None, 
    error: str = None,
    oauth_initiator: Optional[str] = Cookie(None)
):
    """Handle Google OAuth callback"""
    if error:
        return RedirectResponse(url="/app?error=google_auth_denied")
    
    if not code or not state:
        return RedirectResponse(url="/app?error=missing_params")
    
    # Verify signed state token with client binding (handles expiry, CSRF, and replay protection)
    if not verify_signed_state(state, oauth_initiator or ""):
        return RedirectResponse(url="/app?error=invalid_state")
    
    # Build the redirect URI dynamically
    # Prefer x-forwarded-host to get the original domain when behind proxy
    host = request.headers.get("x-forwarded-host") or request.headers.get("host", "localhost:5000")
    scheme = request.headers.get("x-forwarded-proto", "https" if "replit" in host or "swiftshaadi" in host else "http")
    # Always use dynamic redirect URI for multi-domain support
    redirect_uri = f"{scheme}://{host}/api/auth/google/callback"
    
    try:
        # Exchange code for tokens
        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "client_id": GOOGLE_CLIENT_ID,
                    "client_secret": GOOGLE_CLIENT_SECRET,
                    "code": code,
                    "grant_type": "authorization_code",
                    "redirect_uri": redirect_uri,
                },
            )
            
            if token_response.status_code != 200:
                print(f"[ERROR] Token exchange failed: {token_response.text}")
                return RedirectResponse(url="/app?error=token_exchange_failed")
            
            tokens = token_response.json()
            access_token = tokens.get("access_token")
            
            # Get user info from Google
            userinfo_response = await client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {access_token}"},
            )
            
            if userinfo_response.status_code != 200:
                print(f"[ERROR] User info failed: {userinfo_response.text}")
                return RedirectResponse(url="/app?error=userinfo_failed")
            
            userinfo = userinfo_response.json()
            email = userinfo.get("email")
            name = userinfo.get("name", email.split("@")[0] if email else "User")
            google_id = userinfo.get("id")
            
            if not email:
                return RedirectResponse(url="/app?error=no_email")
            
            # Check if user exists
            existing = supabase.table("users").select("*").eq("email", email).execute()
            
            if existing.data:
                user = existing.data[0]
                user_id = user["id"]
            else:
                # Create new user
                user_id = str(uuid.uuid4())
                new_user = {
                    "id": user_id,
                    "name": name,
                    "email": email,
                    "password": hash_password(f"google_{google_id}_{secrets.token_hex(16)}"),
                    "google_id": google_id,
                }
                result = supabase.table("users").insert(new_user).execute()
                if not result.data:
                    return RedirectResponse(url="/app?error=user_creation_failed")
            
            # Create session
            session_id = str(uuid.uuid4())
            sessions[session_id] = user_id
            
            # Redirect to app with session cookie
            response = RedirectResponse(url="/app", status_code=302)
            
            # Set secure flag based on protocol
            is_secure = scheme == "https"
            response.set_cookie(
                "session_id", 
                session_id, 
                httponly=True, 
                samesite="lax",
                secure=is_secure,
                max_age=60 * 60 * 24 * 7,  # 7 days
            )
            # Delete the oauth_initiator cookie after successful use
            response.delete_cookie("oauth_initiator")
            return response
            
    except Exception as e:
        log_error("google_callback", e)
        return RedirectResponse(url="/app?error=oauth_error")


# Wedding Routes
@app.get("/api/weddings")
async def get_weddings(user_id: str = Depends(get_current_user)):
    result = supabase.table("weddings").select("*").eq("owner_id", user_id).execute()
    return result.data


@app.get("/api/weddings/{wedding_id}")
async def get_wedding(wedding_id: str):
    result = supabase.table("weddings").select("*").eq("id", wedding_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Wedding not found")
    return result.data[0]


@app.post("/api/weddings")
async def create_wedding(wedding: WeddingCreate, user_id: str = Depends(get_current_user)):
    wedding_id = str(uuid.uuid4())
    
    user_result = supabase.table("users").select("name, email").eq("id", user_id).execute()
    user_data = user_result.data[0] if user_result.data else {}
    
    new_wedding = {
        "id": wedding_id,
        "couple_names": wedding.couple_names,
        "date": wedding.date,
        "city": wedding.city,
        "haldi_date_time": wedding.haldi_date_time,
        "sangeet_date_time": wedding.sangeet_date_time,
        "wedding_date_time": wedding.wedding_date_time,
        "total_budget": wedding.total_budget,
        "owner_id": user_id,
    }
    
    result = supabase.table("weddings").insert(new_wedding).execute()
    
    team_member = {
        "id": str(uuid.uuid4()),
        "wedding_id": wedding_id,
        "user_id": user_id,
        "role": "owner",
        "name": wedding.owner_name or user_data.get("name", "Owner"),
        "email": wedding.owner_email or user_data.get("email", ""),
    }
    supabase.table("wedding_team_members").insert(team_member).execute()
    
    return result.data[0]


@app.patch("/api/weddings/{wedding_id}")
async def update_wedding(wedding_id: str, updates: WeddingUpdate):
    update_data = {k: v for k, v in updates.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No updates provided")
    
    result = supabase.table("weddings").update(update_data).eq("id", wedding_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Wedding not found")
    return result.data[0]


# Guest Routes
@app.get("/api/weddings/{wedding_id}/guests")
async def get_guests(wedding_id: str):
    result = supabase.table("guests").select("*").eq("wedding_id", wedding_id).execute()
    return result.data


@app.post("/api/weddings/{wedding_id}/guests")
async def create_guest(wedding_id: str, guest: GuestCreate):
    guest_id = str(uuid.uuid4())
    new_guest = {
        "id": guest_id,
        "wedding_id": wedding_id,
        **guest.model_dump(),
    }
    result = supabase.table("guests").insert(new_guest).execute()
    return result.data[0]


@app.patch("/api/guests/{guest_id}")
async def update_guest(guest_id: str, updates: GuestUpdate):
    update_data = {k: v for k, v in updates.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No updates provided")
    
    result = supabase.table("guests").update(update_data).eq("id", guest_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Guest not found")
    return result.data[0]


@app.delete("/api/guests/{guest_id}")
async def delete_guest(guest_id: str):
    supabase.table("guests").delete().eq("id", guest_id).execute()
    return {"success": True}


# Timeline Event Routes
@app.get("/api/weddings/{wedding_id}/events")
async def get_events(wedding_id: str):
    result = supabase.table("timeline_events").select("*").eq("wedding_id", wedding_id).execute()
    return result.data


@app.post("/api/weddings/{wedding_id}/events")
async def create_event(wedding_id: str, event: TimelineEventCreate):
    event_id = str(uuid.uuid4())
    new_event = {
        "id": event_id,
        "wedding_id": wedding_id,
        **event.model_dump(),
    }
    result = supabase.table("timeline_events").insert(new_event).execute()
    return result.data[0]


@app.patch("/api/events/{event_id}")
async def update_event(event_id: str, updates: TimelineEventUpdate):
    update_data = {k: v for k, v in updates.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No updates provided")
    
    result = supabase.table("timeline_events").update(update_data).eq("id", event_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Event not found")
    return result.data[0]


@app.delete("/api/events/{event_id}")
async def delete_event(event_id: str):
    supabase.table("timeline_events").delete().eq("id", event_id).execute()
    return {"success": True}


# Task Routes
@app.get("/api/weddings/{wedding_id}/tasks")
async def get_tasks(wedding_id: str):
    result = supabase.table("tasks").select("*").eq("wedding_id", wedding_id).execute()
    return result.data


@app.post("/api/weddings/{wedding_id}/tasks")
async def create_task(wedding_id: str, task: TaskCreate):
    task_id = str(uuid.uuid4())
    new_task = {
        "id": task_id,
        "wedding_id": wedding_id,
        **task.model_dump(),
    }
    result = supabase.table("tasks").insert(new_task).execute()
    return result.data[0]


@app.patch("/api/tasks/{task_id}")
async def update_task(task_id: str, updates: TaskUpdate):
    update_data = {k: v for k, v in updates.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No updates provided")
    
    result = supabase.table("tasks").update(update_data).eq("id", task_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Task not found")
    return result.data[0]


@app.delete("/api/tasks/{task_id}")
async def delete_task(task_id: str):
    supabase.table("tasks").delete().eq("id", task_id).execute()
    return {"success": True}


# Budget Routes
@app.get("/api/weddings/{wedding_id}/budget")
async def get_budget_items(wedding_id: str):
    result = supabase.table("budget_items").select("*").eq("wedding_id", wedding_id).execute()
    return result.data


@app.post("/api/weddings/{wedding_id}/budget")
async def create_budget_item(wedding_id: str, item: BudgetItemCreate):
    item_id = str(uuid.uuid4())
    new_item = {
        "id": item_id,
        "wedding_id": wedding_id,
        **item.model_dump(),
    }
    result = supabase.table("budget_items").insert(new_item).execute()
    return result.data[0]


@app.patch("/api/budget/{item_id}")
async def update_budget_item(item_id: str, updates: BudgetItemUpdate):
    update_data = {k: v for k, v in updates.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No updates provided")
    
    result = supabase.table("budget_items").update(update_data).eq("id", item_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Budget item not found")
    return result.data[0]


@app.delete("/api/budget/{item_id}")
async def delete_budget_item(item_id: str):
    supabase.table("budget_items").delete().eq("id", item_id).execute()
    return {"success": True}


# Team Routes
@app.get("/api/weddings/{wedding_id}/team")
async def get_team_members(wedding_id: str):
    result = supabase.table("wedding_team_members").select("*").eq("wedding_id", wedding_id).execute()
    return result.data


@app.post("/api/weddings/{wedding_id}/team")
async def create_team_member(wedding_id: str, member: TeamMemberCreate):
    member_id = str(uuid.uuid4())
    new_member = {
        "id": member_id,
        "wedding_id": wedding_id,
        "user_id": member.user_id,
        "name": member.name,
        "email": member.email,
        "role": member.role,
    }
    result = supabase.table("wedding_team_members").insert(new_member).execute()
    return result.data[0]


@app.patch("/api/team/{member_id}")
async def update_team_member(member_id: str, updates: TeamMemberUpdate):
    update_data = {k: v for k, v in updates.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No updates provided")
    
    result = supabase.table("wedding_team_members").update(update_data).eq("id", member_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Team member not found")
    return result.data[0]


@app.delete("/api/team/{member_id}")
async def delete_team_member(member_id: str):
    supabase.table("wedding_team_members").delete().eq("id", member_id).execute()
    return {"success": True}


# Dashboard Stats
@app.get("/api/weddings/{wedding_id}/stats")
async def get_wedding_stats(wedding_id: str):
    guests = supabase.table("guests").select("rsvp_status, accompanying_count").eq("wedding_id", wedding_id).execute()
    tasks = supabase.table("tasks").select("status").eq("wedding_id", wedding_id).execute()
    budget = supabase.table("budget_items").select("planned, actual").eq("wedding_id", wedding_id).execute()
    wedding = supabase.table("weddings").select("total_budget").eq("id", wedding_id).execute()
    
    guest_stats = {"total": 0, "going": 0, "not_going": 0, "maybe": 0, "pending": 0}
    for g in guests.data:
        count = 1 + (g.get("accompanying_count") or 0)
        guest_stats["total"] += count
        status = g["rsvp_status"]
        if status == "going":
            guest_stats["going"] += count
        elif status == "not_going":
            guest_stats["not_going"] += count
        elif status == "maybe":
            guest_stats["maybe"] += count
        else:
            guest_stats["pending"] += count
    
    task_stats = {"total": 0, "completed": 0, "overdue": 0}
    for t in tasks.data:
        task_stats["total"] += 1
        if t["status"] == "done":
            task_stats["completed"] += 1
    
    budget_stats = {
        "total_budget": wedding.data[0]["total_budget"] if wedding.data else 0,
        "total_spent": sum(b["actual"] for b in budget.data),
        "total_planned": sum(b["planned"] for b in budget.data),
    }
    
    return {
        "guests": guest_stats,
        "tasks": task_stats,
        "budget": budget_stats,
    }
