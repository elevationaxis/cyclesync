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
  type InsertSpoonEntry,
  type UserProfile,
  type InsertUserProfile,
  type CheckIn,
  type InsertCheckIn,
  type PartnerLink,
  type InsertPartnerLink
} from "@shared/schema";

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
  
  // User Profiles
  getUserProfile(id: string): Promise<UserProfile | undefined>;
  getUserProfileByUserId(userId: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(id: string, updates: Partial<InsertUserProfile>): Promise<UserProfile>;

  // Check-ins
  createCheckIn(checkIn: InsertCheckIn): Promise<CheckIn>;
  getCheckIns(userId: string, limit?: number): Promise<CheckIn[]>;
  getLatestCheckIn(userId: string): Promise<CheckIn | undefined>;

  // Partner Links (CyncLink)
  createPartnerLink(link: InsertPartnerLink): Promise<PartnerLink>;
  getPartnerLinkByToken(token: string): Promise<PartnerLink | undefined>;
  getPartnerLinksByUser(userId: string): Promise<PartnerLink[]>;
  deactivatePartnerLink(id: string): Promise<void>;
}

import { db } from "./db";
import { rituals, careRequests, communityPosts, calendarEvents, spoonEntries, userProfiles, checkIns, partnerLinks, users } from "@shared/schema";
import { eq, and, gte, lt, desc } from "drizzle-orm";

export class MemStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email!));
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

  async getUserProfile(id: string): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.id, id));
    return profile;
  }

  async getUserProfileByUserId(userId: string): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return profile;
  }

  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const [newProfile] = await db.insert(userProfiles).values(profile).returning();
    return newProfile;
  }

  async updateUserProfile(id: string, updates: Partial<InsertUserProfile>): Promise<UserProfile> {
    const [updated] = await db
      .update(userProfiles)
      .set(updates)
      .where(eq(userProfiles.id, id))
      .returning();
    if (!updated) {
      throw new Error("User profile not found");
    }
    return updated;
  }

  // Check-ins
  async createCheckIn(checkIn: InsertCheckIn): Promise<CheckIn> {
    const [newCheckIn] = await db.insert(checkIns).values(checkIn).returning();
    return newCheckIn;
  }

  async getCheckIns(userId: string, limit = 30): Promise<CheckIn[]> {
    return await db.select().from(checkIns)
      .where(eq(checkIns.userId, userId))
      .orderBy(desc(checkIns.createdAt))
      .limit(limit);
  }

  async getLatestCheckIn(userId: string): Promise<CheckIn | undefined> {
    const [latest] = await db.select().from(checkIns)
      .where(eq(checkIns.userId, userId))
      .orderBy(desc(checkIns.createdAt))
      .limit(1);
    return latest;
  }

  // Partner Links (CyncLink)
  async createPartnerLink(link: InsertPartnerLink): Promise<PartnerLink> {
    const [newLink] = await db.insert(partnerLinks).values(link).returning();
    return newLink;
  }

  async getPartnerLinkByToken(token: string): Promise<PartnerLink | undefined> {
    const [link] = await db.select().from(partnerLinks)
      .where(and(eq(partnerLinks.token, token), eq(partnerLinks.active, true)));
    return link;
  }

  async getPartnerLinksByUser(userId: string): Promise<PartnerLink[]> {
    return await db.select().from(partnerLinks)
      .where(and(eq(partnerLinks.userId, userId), eq(partnerLinks.active, true)))
      .orderBy(desc(partnerLinks.createdAt));
  }

  async deactivatePartnerLink(id: string): Promise<void> {
    await db.update(partnerLinks).set({ active: false }).where(eq(partnerLinks.id, id));
  }
}

export const storage = new MemStorage();

