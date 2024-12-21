"use server";

import { openai } from "@ai-sdk/openai";
import { currentUser } from "@clerk/nextjs/server";
import { generateObject } from "ai";
import { z } from "zod";

import { getPrompt } from "@/components/shared/lib";
import db from "@/db/drizzle";
import { tokenSpends } from "@/db/schema";
import { addDailyPlanAndMeals, getTotalTokens } from "@/lib/queries";

import { mealPlannerSchema, mealPlanSchema } from "./schemas";

if (!process.env.OPENAI_API_KEY) {
  throw "No OpenAI API Key";
}

export async function getMealPlan(input: z.infer<typeof mealPlannerSchema>) {
  const user = await currentUser();

  try {
    const prompt = getPrompt(input);

    const totalUserTokens = await getTotalTokens(
      user?.emailAddresses[0].emailAddress!
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

    console.log(JSON.stringify(result.object, null, 2));

    const data = result.object;

    await db.insert(tokenSpends).values({
      amount: 1,
      email: user?.emailAddresses[0].emailAddress!,
      action: "daily meal plan",
    });

    const id = await addDailyPlanAndMeals(
      data,
      user?.emailAddresses[0].emailAddress!
    );

    return {
      id,
    };
  } catch (e) {
    throw e;
  }
}
