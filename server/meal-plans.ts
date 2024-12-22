"use server";

import { currentUser } from "@clerk/nextjs/server";
import { asc, desc, eq } from "drizzle-orm";

import db from "@/db/drizzle";
import { dailyPlans, meals } from "@/db/schema";

export async function getMealPlan(mealPlanId: number) {
  try {
    const [dailyMealPlan] = await db.query.dailyPlans.findMany({
      with: {
        meals: {
          with: {
            ingredients: true,
          },
          orderBy: asc(meals.mealOrder),
        },
      },
      where: eq(dailyPlans.id, mealPlanId),
    });

    return dailyMealPlan;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getDailyPlans() {
  const user = await currentUser();

  try {
    return await db.query.dailyPlans.findMany({
      with: {
        meals: {
          with: {
            ingredients: true,
          },
          orderBy: desc(meals.createdAt),
        },
      },
      where: eq(dailyPlans.email, user?.emailAddresses[0].emailAddress!),
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteDailyPlan(mealPlanId: number) {
  try {
    await db.delete(dailyPlans).where(eq(dailyPlans.id, mealPlanId));

    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
