import { relations } from "drizzle-orm";
import { boolean, integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("gender", ["male", "female", "other"]);
export const heightUnitEnum = pgEnum("height_unit", ["cm", "in"]);
export const weightUnitEnum = pgEnum("weight_unit", ["kg", "lb"]);

export const user = pgTable("user", {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  dateOfBirth: timestamp('date_of_birth'),
  gender: genderEnum('gender').notNull().default("male"),
  height: integer('height'),
  heightUnit: heightUnitEnum('height_unit'),
  weight: integer('weight'),
  weightUnit: weightUnitEnum('weight_unit'),
  allergies: text('allergies'),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').$defaultFn(() => false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()).notNull()
});

export const session = pgTable("session", {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' })
});

export const account = pgTable("account", {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull()
});

export const verification = pgTable("verification", {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()),
  updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date())
});

export const products = pgTable("products", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  polarProductId: text("polar_product_id").notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  price: integer("price").notNull(),
  tokenAmount: integer("token_amount").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const purchases = pgTable("purchases", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const tokenSpends = pgTable("token_spends", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
  action: text("action").notNull(),
  amount: integer("amount").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const dailyPlans = pgTable("daily_plans", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
  totalCalories: text("total_calories").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type DailyPlan = typeof dailyPlans.$inferInsert;
export type DailyPlanWithMeals = typeof dailyPlans.$inferSelect & {
  meals: Array<
    typeof meals.$inferSelect & {
      ingredients: Array<typeof ingredients.$inferSelect>;
    }
  >;
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
  dailyPlanId: integer("daily_plan_id").references(() => dailyPlans.id, {
    onDelete: "cascade",
  }),
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
  mealId: integer("meal_id").references(() => meals.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Ingredient = typeof ingredients.$inferInsert;

export const ingredientsRelations = relations(ingredients, ({ one }) => ({
  meal: one(meals, {
    fields: [ingredients.mealId],
    references: [meals.id],
  }),
}));

export const schema = { user, session, account, verification };
