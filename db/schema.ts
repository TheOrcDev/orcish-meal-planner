import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const purchases = pgTable("purchases", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: text("email").notNull(),
  paymentIntent: text("payment_intent").notNull(),
  paymentIntentSecret: text("payment_intent_secret").notNull().unique(),
  amount: integer("amount").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const tokenSpends = pgTable("token_spends", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: text("email").notNull(),
  action: text("action").notNull(),
  amount: integer("amount").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const dailyPlans = pgTable("daily_plans", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  email: text("email").notNull(),
  totalCalories: text("total_calories").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type DailyPlan = typeof dailyPlans.$inferInsert;
export type DailyPlanWithMeals = typeof dailyPlans.$inferSelect & {
  meals: Meal[] & { ingredients: Ingredient[] };
};

export const dailyPlansRelations = relations(dailyPlans, ({ many }) => ({
  meals: many(meals),
}));

export const meals = pgTable("meals", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  calories: text("calories").notNull(),
  protein: integer("protein").notNull(),
  carb: integer("carb").notNull(),
  fat: integer("fat").notNull(),
  mealOrder: integer("meal_order").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  dailyPlanId: integer("daily_plan_id").references(() => dailyPlans.id),
});

export type Meal = typeof meals.$inferInsert & { ingredients: Ingredient[] };
export const mealsRelations = relations(meals, ({ one, many }) => ({
  author: one(dailyPlans, {
    fields: [meals.dailyPlanId],
    references: [dailyPlans.id],
  }),
  ingredients: many(ingredients),
}));

export const ingredients = pgTable("ingredients", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  grams: integer("grams").notNull(),
  calories: integer("calories").notNull(),
  protein: integer("protein").notNull(),
  carb: integer("carb").notNull(),
  fat: integer("fat").notNull(),
  mealId: integer("meal_id").references(() => meals.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Ingredient = typeof ingredients.$inferInsert;

export const ingredientsRelations = relations(ingredients, ({ one }) => ({
  meal: one(meals, {
    fields: [ingredients.mealId],
    references: [meals.id],
  }),
}));
