import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("analyst"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const detections = pgTable("detections", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  type: varchar("type").notNull(), // 'settlement', 'dumping', 'pollution', 'deforestation', 'flood'
  location: varchar("location").notNull(),
  coordinates: text("coordinates").notNull(), // JSON string of lat/lng
  confidence: decimal("confidence", { precision: 5, scale: 2 }).notNull(),
  area: decimal("area", { precision: 10, scale: 2 }), // in hectares
  status: varchar("status").default("detected"), // 'detected', 'under_investigation', 'resolved'
  severity: varchar("severity").default("medium"), // 'low', 'medium', 'high'
  detectedAt: timestamp("detected_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const alerts = pgTable("alerts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  type: varchar("type").notNull(), // 'high_priority', 'change_detection', 'threshold_exceeded'
  severity: varchar("severity").default("medium"), // 'low', 'medium', 'high', 'critical'
  detectionId: uuid("detection_id").references(() => detections.id),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  type: varchar("type").notNull(), // 'monthly', 'change_detection', 'hotspot', 'custom'
  parameters: jsonb("parameters"), // Analysis parameters used
  filePath: varchar("file_path"), // Path to generated report file
  generatedBy: varchar("generated_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const analysisJobs = pgTable("analysis_jobs", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  type: varchar("type").notNull(),
  parameters: jsonb("parameters").notNull(),
  status: varchar("status").default("queued"), // 'queued', 'processing', 'completed', 'failed'
  priority: varchar("priority").default("medium"), // 'low', 'medium', 'high'
  progress: integer("progress").default(0), // 0-100
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  role: true,
});

export const insertDetectionSchema = createInsertSchema(detections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  createdAt: true,
});

export const insertAnalysisJobSchema = createInsertSchema(analysisJobs).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Detection = typeof detections.$inferSelect;
export type InsertDetection = z.infer<typeof insertDetectionSchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;
export type AnalysisJob = typeof analysisJobs.$inferSelect;
export type InsertAnalysisJob = z.infer<typeof insertAnalysisJobSchema>;
