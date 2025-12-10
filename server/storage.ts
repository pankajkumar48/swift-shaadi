import { 
  type User, type InsertUser,
  type Wedding, type InsertWedding,
  type TeamMember, type InsertTeamMember,
  type Guest, type InsertGuest,
  type TimelineEvent, type InsertTimelineEvent,
  type Task, type InsertTask,
  type BudgetItem, type InsertBudgetItem,
  users, weddings, weddingTeamMembers, guests, timelineEvents, tasks, budgetItems
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Weddings
  getWedding(id: string): Promise<Wedding | undefined>;
  getWeddingsByUserId(userId: string): Promise<Wedding[]>;
  createWedding(wedding: InsertWedding): Promise<Wedding>;
  updateWedding(id: string, wedding: Partial<InsertWedding>): Promise<Wedding | undefined>;

  // Team Members
  getTeamMembers(weddingId: string): Promise<TeamMember[]>;
  createTeamMember(member: InsertTeamMember): Promise<TeamMember>;
  updateTeamMember(id: string, member: Partial<InsertTeamMember>): Promise<TeamMember | undefined>;
  deleteTeamMember(id: string): Promise<void>;

  // Guests
  getGuests(weddingId: string): Promise<Guest[]>;
  createGuest(guest: InsertGuest): Promise<Guest>;
  updateGuest(id: string, guest: Partial<InsertGuest>): Promise<Guest | undefined>;
  deleteGuest(id: string): Promise<void>;

  // Timeline Events
  getTimelineEvents(weddingId: string): Promise<TimelineEvent[]>;
  createTimelineEvent(event: InsertTimelineEvent): Promise<TimelineEvent>;
  updateTimelineEvent(id: string, event: Partial<InsertTimelineEvent>): Promise<TimelineEvent | undefined>;
  deleteTimelineEvent(id: string): Promise<void>;

  // Tasks
  getTasks(weddingId: string): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<void>;

  // Budget Items
  getBudgetItems(weddingId: string): Promise<BudgetItem[]>;
  createBudgetItem(item: InsertBudgetItem): Promise<BudgetItem>;
  updateBudgetItem(id: string, item: Partial<InsertBudgetItem>): Promise<BudgetItem | undefined>;
  deleteBudgetItem(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Weddings
  async getWedding(id: string): Promise<Wedding | undefined> {
    const [wedding] = await db.select().from(weddings).where(eq(weddings.id, id));
    return wedding;
  }

  async getWeddingsByUserId(userId: string): Promise<Wedding[]> {
    return db.select().from(weddings).where(eq(weddings.ownerId, userId));
  }

  async createWedding(insertWedding: InsertWedding): Promise<Wedding> {
    const [wedding] = await db.insert(weddings).values(insertWedding).returning();
    return wedding;
  }

  async updateWedding(id: string, updates: Partial<InsertWedding>): Promise<Wedding | undefined> {
    const [wedding] = await db.update(weddings).set(updates).where(eq(weddings.id, id)).returning();
    return wedding;
  }

  // Team Members
  async getTeamMembers(weddingId: string): Promise<TeamMember[]> {
    return db.select().from(weddingTeamMembers).where(eq(weddingTeamMembers.weddingId, weddingId));
  }

  async createTeamMember(insertMember: InsertTeamMember): Promise<TeamMember> {
    const [member] = await db.insert(weddingTeamMembers).values(insertMember).returning();
    return member;
  }

  async updateTeamMember(id: string, updates: Partial<InsertTeamMember>): Promise<TeamMember | undefined> {
    const [member] = await db.update(weddingTeamMembers).set(updates).where(eq(weddingTeamMembers.id, id)).returning();
    return member;
  }

  async deleteTeamMember(id: string): Promise<void> {
    await db.delete(weddingTeamMembers).where(eq(weddingTeamMembers.id, id));
  }

  // Guests
  async getGuests(weddingId: string): Promise<Guest[]> {
    return db.select().from(guests).where(eq(guests.weddingId, weddingId));
  }

  async createGuest(insertGuest: InsertGuest): Promise<Guest> {
    const [guest] = await db.insert(guests).values(insertGuest).returning();
    return guest;
  }

  async updateGuest(id: string, updates: Partial<InsertGuest>): Promise<Guest | undefined> {
    const [guest] = await db.update(guests).set(updates).where(eq(guests.id, id)).returning();
    return guest;
  }

  async deleteGuest(id: string): Promise<void> {
    await db.delete(guests).where(eq(guests.id, id));
  }

  // Timeline Events
  async getTimelineEvents(weddingId: string): Promise<TimelineEvent[]> {
    return db.select().from(timelineEvents).where(eq(timelineEvents.weddingId, weddingId));
  }

  async createTimelineEvent(insertEvent: InsertTimelineEvent): Promise<TimelineEvent> {
    const [event] = await db.insert(timelineEvents).values(insertEvent).returning();
    return event;
  }

  async updateTimelineEvent(id: string, updates: Partial<InsertTimelineEvent>): Promise<TimelineEvent | undefined> {
    const [event] = await db.update(timelineEvents).set(updates).where(eq(timelineEvents.id, id)).returning();
    return event;
  }

  async deleteTimelineEvent(id: string): Promise<void> {
    await db.delete(timelineEvents).where(eq(timelineEvents.id, id));
  }

  // Tasks
  async getTasks(weddingId: string): Promise<Task[]> {
    return db.select().from(tasks).where(eq(tasks.weddingId, weddingId));
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db.insert(tasks).values(insertTask).returning();
    return task;
  }

  async updateTask(id: string, updates: Partial<InsertTask>): Promise<Task | undefined> {
    const [task] = await db.update(tasks).set(updates).where(eq(tasks.id, id)).returning();
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }

  // Budget Items
  async getBudgetItems(weddingId: string): Promise<BudgetItem[]> {
    return db.select().from(budgetItems).where(eq(budgetItems.weddingId, weddingId));
  }

  async createBudgetItem(insertItem: InsertBudgetItem): Promise<BudgetItem> {
    const [item] = await db.insert(budgetItems).values(insertItem).returning();
    return item;
  }

  async updateBudgetItem(id: string, updates: Partial<InsertBudgetItem>): Promise<BudgetItem | undefined> {
    const [item] = await db.update(budgetItems).set(updates).where(eq(budgetItems.id, id)).returning();
    return item;
  }

  async deleteBudgetItem(id: string): Promise<void> {
    await db.delete(budgetItems).where(eq(budgetItems.id, id));
  }
}

export const storage = new DatabaseStorage();
