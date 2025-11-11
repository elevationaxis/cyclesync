import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { askAuntB } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Ask Aunt B chat endpoint
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

  const httpServer = createServer(app);

  return httpServer;
}
