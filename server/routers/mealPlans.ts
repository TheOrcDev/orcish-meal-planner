import db from "@/db/drizzle";
import { dailyPlans } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const mealPlansRouter = router({
    get: publicProcedure
        .input(
            z.object({ mealPlanId: z.string() })
        )
        .query(async (opts) => {
            const { input } = opts;

            try {
                const [dailyMealPlan] = await db.query.dailyPlans.findMany({
                    with: {
                        meals: true
                    },
                    where: eq(dailyPlans.id, input.mealPlanId)
                });

                return dailyMealPlan;
            } catch (error) {
                console.log(error)
                throw (error);
            }
        }),

})
