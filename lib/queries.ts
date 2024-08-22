import { DailyMealPlan, Meal } from "@/components/shared/types";
import db from "@/db/drizzle";
import { dailyPlans, meals, purchases, tokenSpends } from "@/db/schema";
import { count, eq, sum } from "drizzle-orm";

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

export const addDailyPlanAndMeals = async (data: DailyMealPlan, email: string) => {
    const [dailyPlan] = await db.insert(dailyPlans).values({
        email,
        title: data.mealPlanTitle,
        totalCalories: data.totalCalories,
    }).returning({ id: dailyPlans.id });;

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