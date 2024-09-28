import db from "@/db/drizzle";
import { dailyPlans, meals } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const mealPlansRouter = router({
  get: publicProcedure
    .input(z.object({ mealPlanId: z.string() }))
    .query(async (opts) => {
      const { input } = opts;

      try {
        const [dailyMealPlan] = await db.query.dailyPlans.findMany({
          with: {
            meals: {
              orderBy: desc(meals.mealOrder),
            },
          },
          where: eq(dailyPlans.id, input.mealPlanId),
        });

        return dailyMealPlan;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }),
  getDailyPlans: publicProcedure.query(async () => {
    try {
      const user = await currentUser();

      return await db.query.dailyPlans.findMany({
        with: {
          meals: {
            orderBy: desc(meals.createdAt),
          },
        },
        where: eq(dailyPlans.email, user?.emailAddresses[0].emailAddress!),
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }),
  delete: publicProcedure
    .input(z.object({ mealPlanId: z.string() }))
    .mutation(async (opts) => {
      const { input } = opts;

      return await db
        .delete(dailyPlans)
        .where(eq(dailyPlans.id, input.mealPlanId));
    }),
});
