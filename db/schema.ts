import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const purchases = pgTable("purchases", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  paymentIntent: text("payment_intent").notNull(),
  paymentIntentSecret: text("payment_intent_secret").notNull().unique(),
  amount: integer("amount").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const tokenSpends = pgTable("token_spends", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  action: text("action").notNull(),
  amount: integer("amount").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const weeklyPlans = pgTable("weekly_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  email: text("email").notNull(),
  totalCalories: text("total_calories").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const weeklyPlansRelations = relations(weeklyPlans, ({ many }) => ({
  dailyPlans: many(dailyPlans),
}));

export const dailyPlans = pgTable("daily_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  email: text("email").notNull(),
  totalCalories: text("total_calories").notNull(),
  weeklyPlanId: uuid("weekly_plan_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const dailyPlansRelations = relations(dailyPlans, ({ many }) => ({
  meals: many(meals),
}));

export const meals = pgTable("meals", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  calories: text("calories").notNull(),
  ingredients: text("ingredients").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  dailyPlanId: uuid("daily_plan_id"),
});

export const mealsRelations = relations(meals, ({ one }) => ({
  author: one(dailyPlans, {
    fields: [meals.dailyPlanId],
    references: [dailyPlans.id],
  }),
}));
