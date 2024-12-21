import { count, eq, sum } from "drizzle-orm";
import { z } from "zod";

import db from "@/db/drizzle";
import {
  dailyPlans,
  ingredients,
  meals,
  purchases,
  tokenSpends,
} from "@/db/schema";
import { mealPlanSchema } from "@/server/schemas";

const FREE_TOKENS = 5;

export const getTotalTokens = async (email: string): Promise<number> => {
  try {
    const [tokens] = await db
      .select({ value: sum(purchases.amount) })
      .from(purchases)
      .where(eq(purchases.email, email));

    if (!tokens.value) {
      tokens.value = "0";
    }

    const [tokensSpend] = await db
      .select({ count: count() })
      .from(tokenSpends)
      .where(eq(tokenSpends.email, email));

    return +tokens.value - tokensSpend.count + FREE_TOKENS;
  } catch (e) {
    throw e;
  }
};

export const addDailyPlanAndMeals = async (
  data: z.infer<typeof mealPlanSchema>,
  email: string
) => {
  const { title, totalCalories } = data;

  const [dailyPlan] = await db
    .insert(dailyPlans)
    .values({
      email,
      title,
      totalCalories,
    })
    .returning({ id: dailyPlans.id });

  data.meals.map(async (meal, index: number) => {
    const [newMeal] = await db
      .insert(meals)
      .values({
        title: meal.title,
        calories: meal.calories,
        dailyPlanId: dailyPlan.id,
        protein: meal.protein,
        carb: meal.carb,
        fat: meal.fat,
        mealOrder: index + 1,
      })
      .returning({ id: meals.id });

    meal.ingredients.map(async (ingredient) => {
      await db.insert(ingredients).values({
        name: ingredient.name,
        grams: ingredient.grams,
        calories: ingredient.calories,
        protein: ingredient.protein,
        carb: ingredient.carb,
        fat: ingredient.fat,
        mealId: newMeal.id,
      });
    });
  });

  return dailyPlan.id;
};

export const spendTokens = async (
  amount: number,
  email: string,
  action: string
) => {
  await db.insert(tokenSpends).values({
    amount,
    email,
    action,
  });
};
