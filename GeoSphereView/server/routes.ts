import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertDetectionSchema, insertAlertSchema, insertReportSchema, insertAnalysisJobSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard stats
  app.get('/api/dashboard/stats', isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Detection routes
  app.get('/api/detections', isAuthenticated, async (req, res) => {
    try {
      const detections = await storage.getDetections();
      res.json(detections);
    } catch (error) {
      console.error("Error fetching detections:", error);
      res.status(500).json({ message: "Failed to fetch detections" });
    }
  });

  app.get('/api/detections/:id', isAuthenticated, async (req, res) => {
    try {
      const detection = await storage.getDetectionById(req.params.id);
      if (!detection) {
        return res.status(404).json({ message: "Detection not found" });
      }
      res.json(detection);
    } catch (error) {
      console.error("Error fetching detection:", error);
      res.status(500).json({ message: "Failed to fetch detection" });
    }
  });

  app.post('/api/detections', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertDetectionSchema.parse(req.body);
      const detection = await storage.createDetection(validatedData);
      res.status(201).json(detection);
    } catch (error) {
      console.error("Error creating detection:", error);
      res.status(400).json({ message: "Invalid detection data" });
    }
  });

  app.patch('/api/detections/:id/status', isAuthenticated, async (req, res) => {
    try {
      const { status } = req.body;
      const detection = await storage.updateDetectionStatus(req.params.id, status);
      if (!detection) {
        return res.status(404).json({ message: "Detection not found" });
      }
      res.json(detection);
    } catch (error) {
      console.error("Error updating detection status:", error);
      res.status(500).json({ message: "Failed to update detection status" });
    }
  });

  // Alert routes
  app.get('/api/alerts', isAuthenticated, async (req, res) => {
    try {
      const alerts = await storage.getAlerts();
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.post('/api/alerts', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(validatedData);
      res.status(201).json(alert);
    } catch (error) {
      console.error("Error creating alert:", error);
      res.status(400).json({ message: "Invalid alert data" });
    }
  });

  app.patch('/api/alerts/:id/read', isAuthenticated, async (req, res) => {
    try {
      await storage.markAlertAsRead(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking alert as read:", error);
      res.status(500).json({ message: "Failed to mark alert as read" });
    }
  });

  // Report routes
  app.get('/api/reports', isAuthenticated, async (req, res) => {
    try {
      const reports = await storage.getReports();
      res.json(reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  app.post('/api/reports', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertReportSchema.parse({
        ...req.body,
        generatedBy: userId,
      });
      const report = await storage.createReport(validatedData);
      res.status(201).json(report);
    } catch (error) {
      console.error("Error creating report:", error);
      res.status(400).json({ message: "Invalid report data" });
    }
  });

  // Analysis job routes
  app.get('/api/analysis-jobs', isAuthenticated, async (req, res) => {
    try {
      const jobs = await storage.getAnalysisJobs();
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching analysis jobs:", error);
      res.status(500).json({ message: "Failed to fetch analysis jobs" });
    }
  });

  app.post('/api/analysis-jobs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertAnalysisJobSchema.parse({
        ...req.body,
        createdBy: userId,
      });
      const job = await storage.createAnalysisJob(validatedData);
      res.status(201).json(job);
    } catch (error) {
      console.error("Error creating analysis job:", error);
      res.status(400).json({ message: "Invalid analysis job data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
