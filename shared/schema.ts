import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const weddings = pgTable("weddings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  coupleNames: text("couple_names").notNull(),
  date: text("date").notNull(),
  city: text("city").notNull(),
  haldiDateTime: text("haldi_date_time"),
  sangeetDateTime: text("sangeet_date_time"),
  weddingDateTime: text("wedding_date_time"),
  totalBudget: integer("total_budget").default(0),
  ownerId: varchar("owner_id").notNull().references(() => users.id),
});

export const insertWeddingSchema = createInsertSchema(weddings).omit({ id: true });
export type InsertWedding = z.infer<typeof insertWeddingSchema>;
export type Wedding = typeof weddings.$inferSelect;

export const teamRoleEnum = ["owner", "family_admin", "helper"] as const;
export type TeamRole = typeof teamRoleEnum[number];

export const weddingTeamMembers = pgTable("wedding_team_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  weddingId: varchar("wedding_id").notNull().references(() => weddings.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  role: text("role").notNull().$type<TeamRole>(),
  name: text("name").notNull(),
  email: text("email").notNull(),
});

export const insertTeamMemberSchema = createInsertSchema(weddingTeamMembers).omit({ id: true });
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type TeamMember = typeof weddingTeamMembers.$inferSelect;

export const guestSideEnum = ["bride", "groom"] as const;
export type GuestSide = typeof guestSideEnum[number];

export const rsvpStatusEnum = ["invited", "going", "not_going", "maybe"] as const;
export type RsvpStatus = typeof rsvpStatusEnum[number];

export const guests = pgTable("guests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  weddingId: varchar("wedding_id").notNull().references(() => weddings.id),
  name: text("name").notNull(),
  phone: text("phone"),
  email: text("email"),
  side: text("side").notNull().$type<GuestSide>(),
  group: text("group"),
  rsvpStatus: text("rsvp_status").notNull().$type<RsvpStatus>().default("invited"),
});

export const insertGuestSchema = createInsertSchema(guests).omit({ id: true });
export type InsertGuest = z.infer<typeof insertGuestSchema>;
export type Guest = typeof guests.$inferSelect;

export const timelineEvents = pgTable("timeline_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  weddingId: varchar("wedding_id").notNull().references(() => weddings.id),
  name: text("name").notNull(),
  dateTime: timestamp("date_time").notNull(),
  location: text("location").notNull(),
  notes: text("notes"),
});

export const insertTimelineEventSchema = createInsertSchema(timelineEvents).omit({ id: true });
export type InsertTimelineEvent = z.infer<typeof insertTimelineEventSchema>;
export type TimelineEvent = typeof timelineEvents.$inferSelect;

export const taskStatusEnum = ["todo", "in_progress", "done"] as const;
export type TaskStatus = typeof taskStatusEnum[number];

export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  weddingId: varchar("wedding_id").notNull().references(() => weddings.id),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  status: text("status").notNull().$type<TaskStatus>().default("todo"),
  assigneeName: text("assignee_name"),
  linkedEvent: text("linked_event"),
});

export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true });
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

export const budgetItems = pgTable("budget_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  weddingId: varchar("wedding_id").notNull().references(() => weddings.id),
  category: text("category").notNull(),
  planned: integer("planned").notNull().default(0),
  actual: integer("actual").notNull().default(0),
});

export const insertBudgetItemSchema = createInsertSchema(budgetItems).omit({ id: true });
export type InsertBudgetItem = z.infer<typeof insertBudgetItemSchema>;
export type BudgetItem = typeof budgetItems.$inferSelect;
