from fastapi import FastAPI, HTTPException, Depends, Response, Cookie
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import uuid
import hashlib
import os
import traceback

from .database import supabase
from .models import (
    UserCreate, UserLogin, User, PhoneLogin,
    WeddingCreate, WeddingUpdate, Wedding,
    TeamMemberCreate, TeamMemberUpdate, TeamMember,
    GuestCreate, GuestUpdate, Guest,
    TimelineEventCreate, TimelineEventUpdate, TimelineEvent,
    TaskCreate, TaskUpdate, Task,
    BudgetItemCreate, BudgetItemUpdate, BudgetItem,
)

app = FastAPI(title="Swift Shaadi API", version="1.0.0")

# Log errors for debugging
def log_error(context: str, error: Exception):
    print(f"[ERROR] {context}: {str(error)}")
    traceback.print_exc()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
async def signup(user: UserCreate, response: Response):
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
        response.set_cookie("session_id", session_id, httponly=True, samesite="lax")
        
        return {"user": {"id": user_id, "name": user.name, "email": user.email}}
    except HTTPException:
        raise
    except Exception as e:
        log_error("signup", e)
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@app.post("/api/auth/login")
async def login(credentials: UserLogin, response: Response):
    result = supabase.table("users").select("*").eq("email", credentials.email).execute()
    
    if not result.data:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user = result.data[0]
    if user["password"] != hash_password(credentials.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    session_id = str(uuid.uuid4())
    sessions[session_id] = user["id"]
    response.set_cookie("session_id", session_id, httponly=True)
    
    return {"user": {"id": user["id"], "name": user["name"], "email": user["email"]}}


@app.post("/api/auth/logout")
async def logout(response: Response, session_id: Optional[str] = Cookie(None, alias="session_id")):
    if session_id and session_id in sessions:
        del sessions[session_id]
    response.delete_cookie("session_id")
    return {"success": True}


@app.get("/api/auth/me")
async def get_me(user_id: str = Depends(get_current_user)):
    result = supabase.table("users").select("id, name, email, phone").eq("id", user_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="User not found")
    return {"user": result.data[0]}


from fastapi import Header

@app.post("/api/auth/phone")
async def phone_login(
    credentials: PhoneLogin, 
    response: Response,
    x_phone_verified: Optional[str] = Header(None, alias="X-Phone-Verified")
):
    """Login or signup with phone number (after OTP verification)
    
    Security: This endpoint must only be called from Express after OTP verification.
    The X-Phone-Verified header is required and set by Express proxy.
    """
    # Verify request comes from Express after OTP verification
    if x_phone_verified != "true":
        raise HTTPException(
            status_code=403, 
            detail="Direct access not allowed. Please verify your phone via OTP first."
        )
    
    try:
        # Check if user exists with this phone
        result = supabase.table("users").select("*").eq("phone", credentials.phone).execute()
        
        if result.data:
            # User exists - log them in
            user = result.data[0]
            session_id = str(uuid.uuid4())
            sessions[session_id] = user["id"]
            response.set_cookie("session_id", session_id, httponly=True, samesite="lax")
            return {"user": {"id": user["id"], "name": user["name"], "email": user.get("email"), "phone": user["phone"]}}
        else:
            # Create new user with phone
            user_id = str(uuid.uuid4())
            name = credentials.name or f"User {credentials.phone[-4:]}"
            new_user = {
                "id": user_id,
                "name": name,
                "phone": credentials.phone,
            }
            
            insert_result = supabase.table("users").insert(new_user).execute()
            
            if not insert_result.data:
                raise HTTPException(status_code=500, detail="Failed to create user")
            
            session_id = str(uuid.uuid4())
            sessions[session_id] = user_id
            response.set_cookie("session_id", session_id, httponly=True, samesite="lax")
            
            return {"user": {"id": user_id, "name": name, "phone": credentials.phone}, "isNewUser": True}
    except HTTPException:
        raise
    except Exception as e:
        log_error("phone_login", e)
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


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
