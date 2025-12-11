from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime

# Enums as Literals
TeamRole = Literal["owner", "bride", "groom", "family_admin", "helper"]
GuestSide = Literal["bride", "groom"]
RsvpStatus = Literal["invited", "going", "not_going", "maybe"]
TaskStatus = Literal["todo", "in_progress", "done"]


# User Models
class UserBase(BaseModel):
    name: str
    email: str


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class User(UserBase):
    id: str


# Wedding Models
class WeddingBase(BaseModel):
    couple_names: str
    date: str
    city: str
    haldi_date_time: Optional[str] = None
    sangeet_date_time: Optional[str] = None
    wedding_date_time: Optional[str] = None
    total_budget: int = 0


class WeddingCreate(WeddingBase):
    owner_name: Optional[str] = None
    owner_email: Optional[str] = None


class WeddingUpdate(BaseModel):
    couple_names: Optional[str] = None
    date: Optional[str] = None
    city: Optional[str] = None
    haldi_date_time: Optional[str] = None
    sangeet_date_time: Optional[str] = None
    wedding_date_time: Optional[str] = None
    total_budget: Optional[int] = None


class Wedding(WeddingBase):
    id: str
    owner_id: str


# Team Member Models
class TeamMemberBase(BaseModel):
    name: str
    email: str
    role: TeamRole


class TeamMemberCreate(TeamMemberBase):
    user_id: Optional[str] = None


class TeamMemberUpdate(BaseModel):
    role: Optional[TeamRole] = None


class TeamMember(TeamMemberBase):
    id: str
    wedding_id: str
    user_id: Optional[str] = None


# Guest Models
class GuestBase(BaseModel):
    name: str
    accompanying_count: int = 0
    phone: Optional[str] = None
    email: Optional[str] = None
    side: GuestSide
    group: Optional[str] = None
    rsvp_status: RsvpStatus = "invited"


class GuestCreate(GuestBase):
    pass


class GuestUpdate(BaseModel):
    name: Optional[str] = None
    accompanying_count: Optional[int] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    side: Optional[GuestSide] = None
    group: Optional[str] = None
    rsvp_status: Optional[RsvpStatus] = None


class Guest(GuestBase):
    id: str
    wedding_id: str


# Timeline Event Models
class TimelineEventBase(BaseModel):
    name: str
    date_time: str
    location: str
    notes: Optional[str] = None


class TimelineEventCreate(TimelineEventBase):
    pass


class TimelineEventUpdate(BaseModel):
    name: Optional[str] = None
    date_time: Optional[str] = None
    location: Optional[str] = None
    notes: Optional[str] = None


class TimelineEvent(TimelineEventBase):
    id: str
    wedding_id: str


# Task Models
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[str] = None
    status: TaskStatus = "todo"
    assignee_name: Optional[str] = None
    linked_event: Optional[str] = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[str] = None
    status: Optional[TaskStatus] = None
    assignee_name: Optional[str] = None
    linked_event: Optional[str] = None


class Task(TaskBase):
    id: str
    wedding_id: str


# Budget Item Models
class BudgetItemBase(BaseModel):
    category: str
    planned: int = 0
    actual: int = 0


class BudgetItemCreate(BudgetItemBase):
    pass


class BudgetItemUpdate(BaseModel):
    category: Optional[str] = None
    planned: Optional[int] = None
    actual: Optional[int] = None


class BudgetItem(BudgetItemBase):
    id: str
    wedding_id: str
