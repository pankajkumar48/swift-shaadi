import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertWeddingSchema, 
  insertGuestSchema, 
  insertTimelineEventSchema, 
  insertTaskSchema, 
  insertBudgetItemSchema,
  insertTeamMemberSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Auth routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { name, email, password } = req.body;
      
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }
      
      const user = await storage.createUser({ name, email, password });
      const { password: _, ...userWithoutPassword } = user;
      
      req.session.userId = user.id;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ error: "Failed to create account" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      req.session.userId = user.id;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  });

  // Wedding routes
  app.get("/api/weddings", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    const weddings = await storage.getWeddingsByUserId(req.session.userId);
    res.json(weddings);
  });

  app.get("/api/weddings/:id", async (req, res) => {
    const wedding = await storage.getWedding(req.params.id);
    if (!wedding) {
      return res.status(404).json({ error: "Wedding not found" });
    }
    res.json(wedding);
  });

  app.post("/api/weddings", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const weddingData = { ...req.body, ownerId: req.session.userId };
      const wedding = await storage.createWedding(weddingData);
      
      // Also add the owner as a team member
      await storage.createTeamMember({
        weddingId: wedding.id,
        userId: req.session.userId,
        role: "owner",
        name: req.body.ownerName || "Owner",
        email: req.body.ownerEmail || "",
      });
      
      res.json(wedding);
    } catch (error) {
      res.status(500).json({ error: "Failed to create wedding" });
    }
  });

  app.patch("/api/weddings/:id", async (req, res) => {
    try {
      const wedding = await storage.updateWedding(req.params.id, req.body);
      if (!wedding) {
        return res.status(404).json({ error: "Wedding not found" });
      }
      res.json(wedding);
    } catch (error) {
      res.status(500).json({ error: "Failed to update wedding" });
    }
  });

  // Guests routes
  app.get("/api/weddings/:weddingId/guests", async (req, res) => {
    const guests = await storage.getGuests(req.params.weddingId);
    res.json(guests);
  });

  app.post("/api/weddings/:weddingId/guests", async (req, res) => {
    try {
      const guestData = { ...req.body, weddingId: req.params.weddingId };
      const guest = await storage.createGuest(guestData);
      res.json(guest);
    } catch (error) {
      res.status(500).json({ error: "Failed to create guest" });
    }
  });

  app.patch("/api/guests/:id", async (req, res) => {
    try {
      const guest = await storage.updateGuest(req.params.id, req.body);
      if (!guest) {
        return res.status(404).json({ error: "Guest not found" });
      }
      res.json(guest);
    } catch (error) {
      res.status(500).json({ error: "Failed to update guest" });
    }
  });

  app.delete("/api/guests/:id", async (req, res) => {
    try {
      await storage.deleteGuest(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete guest" });
    }
  });

  // Timeline Events routes
  app.get("/api/weddings/:weddingId/events", async (req, res) => {
    const events = await storage.getTimelineEvents(req.params.weddingId);
    res.json(events);
  });

  app.post("/api/weddings/:weddingId/events", async (req, res) => {
    try {
      const eventData = { 
        ...req.body, 
        weddingId: req.params.weddingId,
        dateTime: new Date(req.body.dateTime)
      };
      const event = await storage.createTimelineEvent(eventData);
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to create event" });
    }
  });

  app.patch("/api/events/:id", async (req, res) => {
    try {
      const updates = { ...req.body };
      if (updates.dateTime) {
        updates.dateTime = new Date(updates.dateTime);
      }
      const event = await storage.updateTimelineEvent(req.params.id, updates);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to update event" });
    }
  });

  app.delete("/api/events/:id", async (req, res) => {
    try {
      await storage.deleteTimelineEvent(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete event" });
    }
  });

  // Tasks routes
  app.get("/api/weddings/:weddingId/tasks", async (req, res) => {
    const tasks = await storage.getTasks(req.params.weddingId);
    res.json(tasks);
  });

  app.post("/api/weddings/:weddingId/tasks", async (req, res) => {
    try {
      const taskData = { 
        ...req.body, 
        weddingId: req.params.weddingId,
        dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null
      };
      const task = await storage.createTask(taskData);
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to create task" });
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const updates = { ...req.body };
      if (updates.dueDate) {
        updates.dueDate = new Date(updates.dueDate);
      }
      const task = await storage.updateTask(req.params.id, updates);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      await storage.deleteTask(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  // Budget Items routes
  app.get("/api/weddings/:weddingId/budget", async (req, res) => {
    const items = await storage.getBudgetItems(req.params.weddingId);
    res.json(items);
  });

  app.post("/api/weddings/:weddingId/budget", async (req, res) => {
    try {
      const itemData = { ...req.body, weddingId: req.params.weddingId };
      const item = await storage.createBudgetItem(itemData);
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to create budget item" });
    }
  });

  app.patch("/api/budget/:id", async (req, res) => {
    try {
      const item = await storage.updateBudgetItem(req.params.id, req.body);
      if (!item) {
        return res.status(404).json({ error: "Budget item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to update budget item" });
    }
  });

  app.delete("/api/budget/:id", async (req, res) => {
    try {
      await storage.deleteBudgetItem(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete budget item" });
    }
  });

  // Team Members routes
  app.get("/api/weddings/:weddingId/team", async (req, res) => {
    const members = await storage.getTeamMembers(req.params.weddingId);
    res.json(members);
  });

  app.post("/api/weddings/:weddingId/team", async (req, res) => {
    try {
      const memberData = { ...req.body, weddingId: req.params.weddingId };
      const member = await storage.createTeamMember(memberData);
      res.json(member);
    } catch (error) {
      res.status(500).json({ error: "Failed to add team member" });
    }
  });

  app.patch("/api/team/:id", async (req, res) => {
    try {
      const member = await storage.updateTeamMember(req.params.id, req.body);
      if (!member) {
        return res.status(404).json({ error: "Team member not found" });
      }
      res.json(member);
    } catch (error) {
      res.status(500).json({ error: "Failed to update team member" });
    }
  });

  app.delete("/api/team/:id", async (req, res) => {
    try {
      await storage.deleteTeamMember(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove team member" });
    }
  });

  return httpServer;
}
