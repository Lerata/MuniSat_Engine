import {
  users,
  detections,
  alerts,
  reports,
  analysisJobs,
  type User,
  type UpsertUser,
  type Detection,
  type InsertDetection,
  type Alert,
  type InsertAlert,
  type Report,
  type InsertReport,
  type AnalysisJob,
  type InsertAnalysisJob,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, and, gte, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Detection operations
  getDetections(): Promise<Detection[]>;
  getDetectionById(id: string): Promise<Detection | undefined>;
  createDetection(detection: InsertDetection): Promise<Detection>;
  updateDetectionStatus(id: string, status: string): Promise<Detection | undefined>;

  // Alert operations
  getAlerts(): Promise<Alert[]>;
  getUnreadAlertsCount(): Promise<number>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  markAlertAsRead(id: string): Promise<void>;

  // Report operations
  getReports(): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;

  // Analysis job operations
  getAnalysisJobs(): Promise<AnalysisJob[]>;
  createAnalysisJob(job: InsertAnalysisJob): Promise<AnalysisJob>;
  updateAnalysisJobProgress(id: string, progress: number, status?: string): Promise<void>;

  // Dashboard stats
  getDashboardStats(): Promise<{
    activeAlerts: number;
    areasMonitored: number;
    coverage: number;
    queueLength: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Detection operations
  async getDetections(): Promise<Detection[]> {
    return await db.select().from(detections).orderBy(desc(detections.detectedAt));
  }

  async getDetectionById(id: string): Promise<Detection | undefined> {
    const [detection] = await db.select().from(detections).where(eq(detections.id, id));
    return detection;
  }

  async createDetection(detection: InsertDetection): Promise<Detection> {
    const [newDetection] = await db.insert(detections).values(detection).returning();
    return newDetection;
  }

  async updateDetectionStatus(id: string, status: string): Promise<Detection | undefined> {
    const [detection] = await db
      .update(detections)
      .set({ status, updatedAt: new Date() })
      .where(eq(detections.id, id))
      .returning();
    return detection;
  }

  // Alert operations
  async getAlerts(): Promise<Alert[]> {
    return await db.select().from(alerts).orderBy(desc(alerts.createdAt));
  }

  async getUnreadAlertsCount(): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(alerts)
      .where(eq(alerts.isRead, false));
    return result.count;
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const [newAlert] = await db.insert(alerts).values(alert).returning();
    return newAlert;
  }

  async markAlertAsRead(id: string): Promise<void> {
    await db.update(alerts).set({ isRead: true }).where(eq(alerts.id, id));
  }

  // Report operations
  async getReports(): Promise<Report[]> {
    return await db.select().from(reports).orderBy(desc(reports.createdAt));
  }

  async createReport(report: InsertReport): Promise<Report> {
    const [newReport] = await db.insert(reports).values(report).returning();
    return newReport;
  }

  // Analysis job operations
  async getAnalysisJobs(): Promise<AnalysisJob[]> {
    return await db.select().from(analysisJobs).orderBy(desc(analysisJobs.createdAt));
  }

  async createAnalysisJob(job: InsertAnalysisJob): Promise<AnalysisJob> {
    const [newJob] = await db.insert(analysisJobs).values(job).returning();
    return newJob;
  }

  async updateAnalysisJobProgress(id: string, progress: number, status?: string): Promise<void> {
    const updates: any = { progress };
    if (status) updates.status = status;
    if (status === 'completed') updates.completedAt = new Date();

    await db.update(analysisJobs).set(updates).where(eq(analysisJobs.id, id));
  }

  // Dashboard stats
  async getDashboardStats(): Promise<{
    activeAlerts: number;
    areasMonitored: number;
    coverage: number;
    queueLength: number;
  }> {
    const [alertsResult] = await db
      .select({ count: count() })
      .from(alerts)
      .where(eq(alerts.isRead, false));

    const [detectionsResult] = await db
      .select({ count: count() })
      .from(detections);

    const [jobsResult] = await db
      .select({ count: count() })
      .from(analysisJobs)
      .where(and(
        eq(analysisJobs.status, 'queued'),
        eq(analysisJobs.status, 'processing')
      ));

    return {
      activeAlerts: alertsResult.count,
      areasMonitored: detectionsResult.count,
      coverage: 94.2, // Mock coverage percentage
      queueLength: jobsResult.count,
    };
  }
}

export const storage = new DatabaseStorage();
