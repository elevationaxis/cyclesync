import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const rituals = pgTable("rituals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  phase: text("phase").notNull(),
  fileType: text("file_type").notNull(),
  filePath: text("file_path").notNull(),
  duration: text("duration"),
});

export const insertRitualSchema = createInsertSchema(rituals).omit({ id: true });
export type InsertRitual = z.infer<typeof insertRitualSchema>;
export type Ritual = typeof rituals.$inferSelect;

export const careRequests = pgTable("care_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(),
  message: text("message"),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  userId: varchar("user_id").notNull(),
});

export const insertCareRequestSchema = createInsertSchema(careRequests).omit({ 
  id: true, 
  createdAt: true 
});
export type InsertCareRequest = z.infer<typeof insertCareRequestSchema>;
export type CareRequest = typeof careRequests.$inferSelect;

export const communityPosts = pgTable("community_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  phase: text("phase").notNull(),
  upvotes: integer("upvotes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCommunityPostSchema = createInsertSchema(communityPosts).omit({ 
  id: true, 
  createdAt: true 
});
export type InsertCommunityPost = z.infer<typeof insertCommunityPostSchema>;
export type CommunityPost = typeof communityPosts.$inferSelect;

export const calendarEvents = pgTable("calendar_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  date: timestamp("date").notNull(),
  phase: text("phase"),
  userId: varchar("user_id").notNull(),
});

export const insertCalendarEventSchema = createInsertSchema(calendarEvents).omit({ id: true });
export type InsertCalendarEvent = z.infer<typeof insertCalendarEventSchema>;
export type CalendarEvent = typeof calendarEvents.$inferSelect;

export const spoonEntries = pgTable("spoon_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  date: timestamp("date").notNull(),
  totalSpoons: integer("total_spoons").notNull().default(12),
  usedSpoons: integer("used_spoons").notNull().default(0),
  note: text("note"),
  phase: text("phase"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSpoonEntrySchema = createInsertSchema(spoonEntries).omit({ 
  id: true, 
  createdAt: true 
});
export type InsertSpoonEntry = z.infer<typeof insertSpoonEntrySchema>;
export type SpoonEntry = typeof spoonEntries.$inferSelect;

export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").unique(),
  name: text("name").notNull(),
  lastPeriodStart: timestamp("last_period_start").notNull(),
  cycleLength: integer("cycle_length").notNull().default(28),
  concerns: text("concerns"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({ 
  id: true, 
  createdAt: true 
});
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;

// Daily check-ins stored in DB (replaces localStorage)
export const checkIns = pgTable("check_ins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  energy: text("energy").notNull(),
  mood: text("mood").notNull(),
  symptoms: text("symptoms").notNull().default("[]"), // JSON array stored as text
  notes: text("notes").default(""),
  phase: text("phase"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCheckInSchema = createInsertSchema(checkIns).omit({ 
  id: true, 
  createdAt: true 
});
export type InsertCheckIn = z.infer<typeof insertCheckInSchema>;
export type CheckIn = typeof checkIns.$inferSelect;

// CyncLink — shareable partner access tokens
export const partnerLinks = pgTable("partner_links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  token: text("token").notNull().unique(),
  label: text("label").default("My Partner"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

export const insertPartnerLinkSchema = createInsertSchema(partnerLinks).omit({ 
  id: true, 
  createdAt: true 
});
export type InsertPartnerLink = z.infer<typeof insertPartnerLinkSchema>;
export type PartnerLink = typeof partnerLinks.$inferSelect;
