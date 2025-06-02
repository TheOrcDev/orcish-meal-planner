"use server";

import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

import { getPrompt } from "@/components/shared/lib";
import db from "@/db/drizzle";
import { tokenSpends } from "@/db/schema";
import { addDailyPlanAndMeals, getTotalTokens } from "@/lib/queries";

import { mealPlannerSchema, mealPlanSchema } from "./schemas";
import { getUserSession } from "./users";

if (!process.env.OPENAI_API_KEY) {
  throw "No OpenAI API Key";
}

export async function getMealPlan(input: z.infer<typeof mealPlannerSchema>) {
  const session = await getUserSession();

  try {
    const prompt = await getPrompt(input);

    const totalUserTokens = await getTotalTokens(
      session?.user?.id
    );

    if (totalUserTokens <= 0) {
      return "Not enough tokens";
    }

    const result = await generateObject({
      model: openai("gpt-4o-mini-2024-07-18", {
        structuredOutputs: true,
      }),
      schemaName: "mealPlan",
      schemaDescription: "A meal plan for one day.",
      schema: mealPlanSchema,
      prompt,
    });

    const data = result.object;

    await db.insert(tokenSpends).values({
      amount: 1,
      userId: session?.user?.id,
      action: "daily meal plan",
    });

    const id = await addDailyPlanAndMeals(
      data,
      session?.user?.id
    );

    return {
      id,
    };
  } catch (e) {
    throw e;
  }
}
