import { count, eq } from "drizzle-orm";
import { z } from "zod";

import db from "@/db/drizzle";
import {
  dailyPlans,
  ingredients,
  meals,
  products,
  purchases,
  tokenSpends,
} from "@/db/schema";
import { mealPlanSchema } from "@/server/schemas";

const FREE_TOKENS = 5;

export const getTotalTokens = async (userId: string): Promise<number> => {
  try {
    let amount = 0;

    const tokens = await db
      .select({ value: purchases.productId })
      .from(purchases)
      .where(eq(purchases.userId, userId));

    if (tokens.length > 0) {
      tokens.map(async (token) => {
        const [product] = await db
          .select({ value: products.tokenAmount })
          .from(products)
          .where(eq(products.id, token.value));

        amount += +product.value;
      });
    }

    const [tokensSpend] = await db
      .select({ count: count() })
      .from(tokenSpends)
      .where(eq(tokenSpends.userId, userId));

    return amount - tokensSpend.count + FREE_TOKENS;
  } catch (e) {
    throw e;
  }
};

export const addDailyPlanAndMeals = async (
  data: z.infer<typeof mealPlanSchema>,
  userId: string
) => {
  const { title, totalCalories } = data;

  const [dailyPlan] = await db
    .insert(dailyPlans)
    .values({
      userId,
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