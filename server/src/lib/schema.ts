import { pgTable, serial, text, real, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const exercises = pgTable("exercises", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  bodyPart: text("body_part"),
  equipment: text("equipment"),
  target: text("target"),
  category: text("category"),
  difficulty: text("difficulty"),
  mechanic: text("mechanic"),
  force: text("force"),
  secondaryMuscles: text("secondary_muscles").array(),
  instructions: text("instructions").array(),
  met: real("met"),
  caloriesPerMinute: real("calories_per_minute"),
  description: text("description"),
  gifUrl: text("gif_url"),
  localGifUrl: text("local_gif_url"),
  fetchedAt: timestamp("fetched_at").defaultNow(),
});