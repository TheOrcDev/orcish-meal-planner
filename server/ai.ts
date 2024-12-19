import { currentUser } from "@clerk/nextjs/server";
import { OrcishOpenAIService } from "orcish-openai-connector";
import { z } from "zod";

import { getPrompt } from "@/components/shared/lib";
import { CompletionModel } from "@/components/shared/types";
import db from "@/db/drizzle";
import { tokenSpends } from "@/db/schema";
import {
  addDailyPlanAndMeals,
  addWeeklyPlan,
  getTotalTokens,
} from "@/lib/queries";

import { mealPlannerSchema } from "./schemas";

if (!process.env.OPENAI_API_KEY) {
  throw "No OpenAI API Key";
}

const orcishOpenAIService = new OrcishOpenAIService({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getMealPlan(
  input: z.infer<typeof mealPlannerSchema>,
  mealPlannerType: "weekly" | "daily"
) {
  const user = await currentUser();

  try {
    const prompt = getPrompt(input, mealPlannerType);

    const totalUserTokens = await getTotalTokens(
      user?.emailAddresses[0].emailAddress!
    );

    if (totalUserTokens <= 0) {
      return "Not enough tokens";
    }

    const result = await orcishOpenAIService.getChatGPTCompletion(prompt, {
      gptModel: CompletionModel.GPT_3_5_TURBO,
    });

    const data = JSON.parse(result);

    let id;

    if (mealPlannerType === "weekly") {
      await db.insert(tokenSpends).values({
        amount: 5,
        email: user?.emailAddresses[0].emailAddress!,
        action: "weekly meal plan",
      });
      id = await addWeeklyPlan(data, user?.emailAddresses[0].emailAddress!);
    } else {
      await db.insert(tokenSpends).values({
        amount: 1,
        email: user?.emailAddresses[0].emailAddress!,
        action: "daily meal plan",
      });
      id = await addDailyPlanAndMeals(
        data,
        user?.emailAddresses[0].emailAddress!
      );
    }

    return {
      type: mealPlannerType,
      id,
    };
  } catch (e) {
    throw e;
  }
}
