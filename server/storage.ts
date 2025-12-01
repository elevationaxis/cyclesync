import { 
  type User, 
  type InsertUser,
  type Ritual,
  type InsertRitual,
  type CareRequest,
  type InsertCareRequest,
  type CommunityPost,
  type InsertCommunityPost,
  type CalendarEvent,
  type InsertCalendarEvent,
  type SpoonEntry,
  type InsertSpoonEntry
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Rituals
  createRitual(ritual: InsertRitual): Promise<Ritual>;
  getRituals(): Promise<Ritual[]>;
  getRitualsByPhase(phase: string): Promise<Ritual[]>;
  deleteRitual(id: string): Promise<void>;
  
  // Care Requests
  createCareRequest(request: InsertCareRequest): Promise<CareRequest>;
  getCareRequests(userId: string): Promise<CareRequest[]>;
  updateCareRequestStatus(id: string, status: string): Promise<CareRequest>;
  
  // Community Posts
  createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost>;
  getCommunityPosts(): Promise<CommunityPost[]>;
  getCommunityPostsByPhase(phase: string): Promise<CommunityPost[]>;
  upvoteCommunityPost(id: string): Promise<CommunityPost>;
  
  // Calendar Events
  createCalendarEvent(event: InsertCalendarEvent): Promise<CalendarEvent>;
  getCalendarEvents(userId: string): Promise<CalendarEvent[]>;
  deleteCalendarEvent(id: string): Promise<void>;
  
  // Spoon Entries
  createSpoonEntry(entry: InsertSpoonEntry): Promise<SpoonEntry>;
  getSpoonEntries(userId: string): Promise<SpoonEntry[]>;
  getTodaySpoonEntry(userId: string): Promise<SpoonEntry | undefined>;
  updateSpoonEntry(id: string, updates: Partial<InsertSpoonEntry>): Promise<SpoonEntry>;
}

import { db } from "./db";
import { rituals, careRequests, communityPosts, calendarEvents, spoonEntries } from "@shared/schema";
import { eq, and, gte, lt } from "drizzle-orm";

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createRitual(ritual: InsertRitual): Promise<Ritual> {
    const [newRitual] = await db.insert(rituals).values(ritual).returning();
    return newRitual;
  }

  async getRituals(): Promise<Ritual[]> {
    return await db.select().from(rituals);
  }

  async getRitualsByPhase(phase: string): Promise<Ritual[]> {
    return await db.select().from(rituals).where(eq(rituals.phase, phase));
  }

  async deleteRitual(id: string): Promise<void> {
    const result = await db.delete(rituals).where(eq(rituals.id, id)).returning();
    if (result.length === 0) {
      throw new Error("Ritual not found");
    }
  }

  async createCareRequest(request: InsertCareRequest): Promise<CareRequest> {
    const [newRequest] = await db.insert(careRequests).values(request).returning();
    return newRequest;
  }

  async getCareRequests(userId: string): Promise<CareRequest[]> {
    return await db.select().from(careRequests).where(eq(careRequests.userId, userId));
  }

  async updateCareRequestStatus(id: string, status: string): Promise<CareRequest> {
    const [updated] = await db
      .update(careRequests)
      .set({ status })
      .where(eq(careRequests.id, id))
      .returning();
    if (!updated) {
      throw new Error("Care request not found");
    }
    return updated;
  }

  async createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost> {
    const [newPost] = await db.insert(communityPosts).values(post).returning();
    return newPost;
  }

  async getCommunityPosts(): Promise<CommunityPost[]> {
    return await db.select().from(communityPosts);
  }

  async getCommunityPostsByPhase(phase: string): Promise<CommunityPost[]> {
    return await db.select().from(communityPosts).where(eq(communityPosts.phase, phase));
  }

  async upvoteCommunityPost(id: string): Promise<CommunityPost> {
    const [post] = await db.select().from(communityPosts).where(eq(communityPosts.id, id));
    if (!post) throw new Error("Post not found");
    
    const [updated] = await db
      .update(communityPosts)
      .set({ upvotes: (post.upvotes || 0) + 1 })
      .where(eq(communityPosts.id, id))
      .returning();
    return updated;
  }

  async createCalendarEvent(event: InsertCalendarEvent): Promise<CalendarEvent> {
    const [newEvent] = await db.insert(calendarEvents).values(event).returning();
    return newEvent;
  }

  async getCalendarEvents(userId: string): Promise<CalendarEvent[]> {
    return await db.select().from(calendarEvents).where(eq(calendarEvents.userId, userId));
  }

  async deleteCalendarEvent(id: string): Promise<void> {
    const result = await db.delete(calendarEvents).where(eq(calendarEvents.id, id)).returning();
    if (result.length === 0) {
      throw new Error("Event not found");
    }
  }

  async createSpoonEntry(entry: InsertSpoonEntry): Promise<SpoonEntry> {
    const [newEntry] = await db.insert(spoonEntries).values(entry).returning();
    return newEntry;
  }

  async getSpoonEntries(userId: string): Promise<SpoonEntry[]> {
    return await db.select().from(spoonEntries).where(eq(spoonEntries.userId, userId));
  }

  async getTodaySpoonEntry(userId: string): Promise<SpoonEntry | undefined> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const entries = await db
      .select()
      .from(spoonEntries)
      .where(
        and(
          eq(spoonEntries.userId, userId),
          gte(spoonEntries.date, today),
          lt(spoonEntries.date, tomorrow)
        )
      );
    return entries[0];
  }

  async updateSpoonEntry(id: string, updates: Partial<InsertSpoonEntry>): Promise<SpoonEntry> {
    const [updated] = await db
      .update(spoonEntries)
      .set(updates)
      .where(eq(spoonEntries.id, id))
      .returning();
    if (!updated) {
      throw new Error("Spoon entry not found");
    }
    return updated;
  }
}

export const storage = new MemStorage();
