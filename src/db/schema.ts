import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const apps = sqliteTable("apps", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  pricingType: text("pricing_type", { enum: ["free", "paid"] })
    .notNull()
    .default("free"),
  subscriptionPlan: text("subscription_plan"),
  nextDueDate: text("next_due_date"),
  platforms: text("platforms").notNull().default(""),
  status: text("status", {
    enum: ["using", "not_using", "watching", "sunset"],
  })
    .notNull()
    .default("using"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});
