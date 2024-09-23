import db from "@/db/drizzle";
import { dailyPlans, meals, purchases, tokenSpends, weeklyPlans } from "@/db/schema";
import { count, eq, sum } from "drizzle-orm";

import { DailyMealPlan, Meal, WeeklyMealPlan } from "@/components/shared/types";

const FREE_TOKENS = 5;

export const getTotalTokens = async (email: string): Promise<number> => {
    try {
        const [tokens] = await db.
            select({ value: sum(purchases.amount) }).
            from(purchases).
            where(eq(purchases.email, email));

        if (!tokens.value) {
            tokens.value = "0"
        }

        const [tokensSpend] = await db.select({ count: count() }).
            from(tokenSpends).
            where(eq(tokenSpends.email, email));

        return +tokens.value - tokensSpend.count + FREE_TOKENS;
    } catch (e) {
        throw (e);
    }
}

export const addDailyPlanAndMeals = async (data: DailyMealPlan, email: string, weeklyPlanId?: string) => {
    const [dailyPlan] = await db.insert(dailyPlans).values({
        email,
        title: data.mealPlanTitle,
        totalCalories: data.totalCalories,
        weeklyPlanId,
    }).returning({ id: dailyPlans.id });

    data.meals.map(async (meal: Meal) => {
        await db.insert(meals).values({
            title: meal.title,
            calories: meal.calories,
            ingredients: JSON.stringify(meal.ingredients),
            dailyPlanId: dailyPlan.id,
        })
    })

    return dailyPlan.id;
}

export const addWeeklyPlan = async (data: WeeklyMealPlan, email: string) => {
    const [weeklyPlan] = await db.insert(weeklyPlans).values({
        email,
        title: data.weeklyMealPlanTitle,
        totalCalories: data.totalCalories,
    }).returning({ id: weeklyPlans.id });

    data.days.map((dailyPlan) => {
        addDailyPlanAndMeals(dailyPlan, email, weeklyPlan.id);
    })

}

export const spendTokens = async (amount: number, email: string, action: string) => {
    await db.insert(tokenSpends).values({
        amount,
        email,
        action
    });
}