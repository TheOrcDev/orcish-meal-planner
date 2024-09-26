import db from "@/db/drizzle";
import { weeklyPlans } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const weeklyMealPlansRouter = router({
  get: publicProcedure.query(async () => {
    try {
      const user = await currentUser();

      const weeklyMealPlans = await db.query.weeklyPlans.findMany({
        with: {
          dailyPlans: {
            with: {
              meals: true,
            },
          },
        },
        where: eq(weeklyPlans.email, user?.emailAddresses[0].emailAddress!),
      });

      return weeklyMealPlans;
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
        .delete(weeklyPlans)
        .where(eq(weeklyPlans.id, input.mealPlanId));
    }),
});
