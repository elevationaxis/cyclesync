import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { askAuntB } from "./openai";
import multer from "multer";
import path from "path";
import fs from "fs";
import { insertRitualSchema, insertCareRequestSchema, insertCommunityPostSchema, insertCalendarEventSchema, insertSpoonEntrySchema, insertUserProfileSchema } from "@shared/schema";

const uploadsDir = path.join(process.cwd(), "attached_assets", "rituals");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp3|mp4|wav|m4a|mov|avi|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only audio and video files are allowed"));
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.use("/assets/rituals", express.static(uploadsDir));

  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Message is required" });
      }

      const reply = await askAuntB(message);
      return res.json({ reply });
    } catch (error) {
      console.error("Error in /api/chat:", error);
      return res.status(500).json({ 
        error: "Something went wrong. Take a breath — I'm here when you're ready to try again." 
      });
    }
  });

  app.post("/api/rituals/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const validPhases = ["menstrual", "follicular", "ovulatory", "luteal"];
      const { title, description, phase, duration } = req.body;

      if (!title || !description || !phase) {
        return res.status(400).json({ error: "Title, description, and phase are required" });
      }

      if (!validPhases.includes(phase)) {
        return res.status(400).json({ error: "Invalid phase" });
      }

      const fileType = req.file.mimetype.startsWith("audio") ? "audio" : "video";
      const filePath = `/assets/rituals/${req.file.filename}`;

      const ritualData = insertRitualSchema.parse({
        title: title.trim(),
        description: description.trim(),
        phase,
        fileType,
        filePath,
        duration: duration?.trim() || null,
      });

      const ritual = await storage.createRitual(ritualData);

      return res.json(ritual);
    } catch (error) {
      console.error("Error uploading ritual:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid ritual data" });
      }
      return res.status(500).json({ error: "Failed to upload ritual" });
    }
  });

  app.get("/api/rituals", async (req, res) => {
    try {
      const { phase } = req.query;
      const rituals = phase 
        ? await storage.getRitualsByPhase(phase as string)
        : await storage.getRituals();
      return res.json(rituals);
    } catch (error) {
      console.error("Error fetching rituals:", error);
      return res.status(500).json({ error: "Failed to fetch rituals" });
    }
  });

  app.delete("/api/rituals/:id", async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(400).json({ error: "Ritual ID is required" });
      }
      await storage.deleteRitual(req.params.id);
      return res.json({ success: true });
    } catch (error) {
      console.error("Error deleting ritual:", error);
      if (error instanceof Error && error.message === "Ritual not found") {
        return res.status(404).json({ error: "Ritual not found" });
      }
      return res.status(500).json({ error: "Failed to delete ritual" });
    }
  });

  app.post("/api/care-requests", async (req, res) => {
    try {
      const data = insertCareRequestSchema.parse(req.body);
      const request = await storage.createCareRequest(data);
      return res.json(request);
    } catch (error) {
      console.error("Error creating care request:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid request data" });
      }
      return res.status(500).json({ error: "Failed to create care request" });
    }
  });

  app.get("/api/care-requests", async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      const requests = await storage.getCareRequests(userId as string);
      return res.json(requests);
    } catch (error) {
      console.error("Error fetching care requests:", error);
      return res.status(500).json({ error: "Failed to fetch care requests" });
    }
  });

  app.patch("/api/care-requests/:id", async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(400).json({ error: "Care request ID is required" });
      }
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      const request = await storage.updateCareRequestStatus(req.params.id, status);
      return res.json(request);
    } catch (error) {
      console.error("Error updating care request:", error);
      if (error instanceof Error && error.message === "Care request not found") {
        return res.status(404).json({ error: "Care request not found" });
      }
      return res.status(500).json({ error: "Failed to update care request" });
    }
  });

  app.post("/api/community-posts", async (req, res) => {
    try {
      const data = insertCommunityPostSchema.parse(req.body);
      const post = await storage.createCommunityPost(data);
      return res.json(post);
    } catch (error) {
      console.error("Error creating community post:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid post data" });
      }
      return res.status(500).json({ error: "Failed to create community post" });
    }
  });

  app.get("/api/community-posts", async (req, res) => {
    try {
      const { phase } = req.query;
      const posts = phase
        ? await storage.getCommunityPostsByPhase(phase as string)
        : await storage.getCommunityPosts();
      return res.json(posts);
    } catch (error) {
      console.error("Error fetching community posts:", error);
      return res.status(500).json({ error: "Failed to fetch community posts" });
    }
  });

  app.post("/api/community-posts/:id/upvote", async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(400).json({ error: "Post ID is required" });
      }
      const post = await storage.upvoteCommunityPost(req.params.id);
      return res.json(post);
    } catch (error) {
      console.error("Error upvoting post:", error);
      if (error instanceof Error && error.message === "Post not found") {
        return res.status(404).json({ error: "Post not found" });
      }
      return res.status(500).json({ error: "Failed to upvote post" });
    }
  });

  app.post("/api/calendar-events", async (req, res) => {
    try {
      const data = insertCalendarEventSchema.parse(req.body);
      const event = await storage.createCalendarEvent(data);
      return res.json(event);
    } catch (error) {
      console.error("Error creating calendar event:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid event data" });
      }
      return res.status(500).json({ error: "Failed to create calendar event" });
    }
  });

  app.get("/api/calendar-events", async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      const events = await storage.getCalendarEvents(userId as string);
      return res.json(events);
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      return res.status(500).json({ error: "Failed to fetch calendar events" });
    }
  });

  app.delete("/api/calendar-events/:id", async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(400).json({ error: "Event ID is required" });
      }
      await storage.deleteCalendarEvent(req.params.id);
      return res.json({ success: true });
    } catch (error) {
      console.error("Error deleting calendar event:", error);
      if (error instanceof Error && error.message === "Event not found") {
        return res.status(404).json({ error: "Event not found" });
      }
      return res.status(500).json({ error: "Failed to delete calendar event" });
    }
  });

  app.post("/api/spoon-entries", async (req, res) => {
    try {
      const body = { ...req.body };
      if (body.date && typeof body.date === 'string') {
        body.date = new Date(body.date);
      }
      const data = insertSpoonEntrySchema.parse(body);
      const entry = await storage.createSpoonEntry(data);
      return res.json(entry);
    } catch (error) {
      console.error("Error creating spoon entry:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid spoon entry data" });
      }
      return res.status(500).json({ error: "Failed to create spoon entry" });
    }
  });

  app.get("/api/spoon-entries", async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      const entries = await storage.getSpoonEntries(userId as string);
      return res.json(entries);
    } catch (error) {
      console.error("Error fetching spoon entries:", error);
      return res.status(500).json({ error: "Failed to fetch spoon entries" });
    }
  });

  app.get("/api/spoon-entries/today", async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      const entry = await storage.getTodaySpoonEntry(userId as string);
      return res.json(entry || null);
    } catch (error) {
      console.error("Error fetching today's spoon entry:", error);
      return res.status(500).json({ error: "Failed to fetch today's spoon entry" });
    }
  });

  app.patch("/api/spoon-entries/:id", async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(400).json({ error: "Spoon entry ID is required" });
      }
      const { usedSpoons, totalSpoons, note } = req.body;
      const updates: Record<string, unknown> = {};
      if (usedSpoons !== undefined) updates.usedSpoons = usedSpoons;
      if (totalSpoons !== undefined) updates.totalSpoons = totalSpoons;
      if (note !== undefined) updates.note = note;
      
      const entry = await storage.updateSpoonEntry(req.params.id, updates);
      return res.json(entry);
    } catch (error) {
      console.error("Error updating spoon entry:", error);
      if (error instanceof Error && error.message === "Spoon entry not found") {
        return res.status(404).json({ error: "Spoon entry not found" });
      }
      return res.status(500).json({ error: "Failed to update spoon entry" });
    }
  });

  app.get("/api/profile/:id", async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(400).json({ error: "Profile ID is required" });
      }
      const profile = await storage.getUserProfile(req.params.id);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      return res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      return res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.post("/api/profile", async (req, res) => {
    try {
      const body = { ...req.body };
      if (body.lastPeriodStart && typeof body.lastPeriodStart === 'string') {
        body.lastPeriodStart = new Date(body.lastPeriodStart);
      }
      const data = insertUserProfileSchema.parse(body);
      const profile = await storage.createUserProfile(data);
      return res.json(profile);
    } catch (error) {
      console.error("Error creating profile:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid profile data" });
      }
      return res.status(500).json({ error: "Failed to create profile" });
    }
  });

  app.patch("/api/profile/:id", async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(400).json({ error: "Profile ID is required" });
      }
      const body = { ...req.body };
      if (body.lastPeriodStart && typeof body.lastPeriodStart === 'string') {
        body.lastPeriodStart = new Date(body.lastPeriodStart);
      }
      const profile = await storage.updateUserProfile(req.params.id, body);
      return res.json(profile);
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error instanceof Error && error.message === "User profile not found") {
        return res.status(404).json({ error: "Profile not found" });
      }
      return res.status(500).json({ error: "Failed to update profile" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
