import { router } from "./trpc";

import { aiRouter } from "./routers/ai";
import { mealPlansRouter } from "./routers/mealPlans";
import { tokensRouter } from "./routers/tokens";

export const appRouter = router({
  ai: aiRouter,
  tokens: tokensRouter,
  mealPlans: mealPlansRouter
});

export type AppRouter = typeof appRouter;
