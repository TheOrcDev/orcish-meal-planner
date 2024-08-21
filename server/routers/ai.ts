import * as fs from "fs";
import { OrcishOpenAIService } from "orcish-openai-connector";
import path from "path";
import { z } from "zod";

import {
  CompletionModel,
  ImageModel,
  Meal,
  Resolution,
  Voice,
  VoiceModel,
} from "@/components/shared/types";

import db from "@/db/drizzle";
import { dailyPlans, meals, tokenSpends } from "@/db/schema";
import { getTotalTokens } from "@/lib/queries";
import { createFileName } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { publicProcedure, router } from "../trpc";

if (!process.env.OPENAI_API_KEY) {
  throw "No OpenAI API Key";
}

const orcishOpenAIService = new OrcishOpenAIService({
  apiKey: process.env.OPENAI_API_KEY,
});

export const aiRouter = router({
  getMealPlan: publicProcedure
    .input(
      z.object({ prompt: z.string(), model: z.nativeEnum(CompletionModel) })
    )
    .mutation(async (opts) => {
      const { input } = opts;
      const user = await currentUser();

      try {
        const totalUserTokens = await getTotalTokens(user?.emailAddresses[0].emailAddress!);

        if (totalUserTokens <= 0) {
          return "Not enough tokens";
        }

        const result = await orcishOpenAIService.getChatGPTCompletion(
          input.prompt,
          {
            gptModel: input.model,
          }
        );

        await db.insert(tokenSpends).values({
          amount: 1,
          email: user?.emailAddresses[0].emailAddress!,
          action: "completion"
        });

        const data = JSON.parse(result);

        const [dailyPlan] = await db.insert(dailyPlans).values({
          email: user?.emailAddresses[0].emailAddress!,
          title: "Monday",
          totalCalories: data.totalCalories,
        }).returning({ id: dailyPlans.id });;

        data.meals.map(async (meal: Meal) => {
          await db.insert(meals).values({
            title: meal.mealTitle,
            calories: meal.calories,
            ingredients: JSON.stringify(meal.ingredients),
            dailyPlanId: dailyPlan.id,
          })
        })

        return dailyPlan.id;
      } catch (e) {
        throw (e);
      }
    }),
  image: publicProcedure
    .input(z.object({
      prompt: z.string(),
      model: z.nativeEnum(ImageModel),
      resolution: z.nativeEnum(Resolution)
    }))
    .mutation(async (opts) => {
      const { input } = opts;

      const user = await currentUser();

      try {
        const totalUserTokens = await getTotalTokens(user?.emailAddresses[0].emailAddress!);

        if (totalUserTokens <= 0) {
          return "Not enough tokens";
        }

        const image = await orcishOpenAIService.getDalle3Image(input.prompt, {
          imageModel: input.model,
          imageResolution: input.resolution
        });

        await db.insert(tokenSpends).values({
          amount: 1,
          email: user?.emailAddresses[0].emailAddress!,
          action: "image"
        });

        return image;
      } catch (e) {
        throw (e);
      }
    }),
  voice: publicProcedure
    .input(
      z.object({
        prompt: z.string(),
        model: z.nativeEnum(VoiceModel),
        voice: z.nativeEnum(Voice),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;
      const user = await currentUser();

      try {
        const totalUserTokens = await getTotalTokens(user?.emailAddresses[0].emailAddress!);

        if (totalUserTokens <= 0) {
          return "Not enough tokens";
        }

        const sound = await orcishOpenAIService.textToSpeech(input.prompt, {
          voiceModel: input.model,
          voice: input.voice,
        });

        const fileName = createFileName(input.prompt);

        // TODO: save all text to voice files on cloud (supabase or something else)
        const outputPath = `/tts/${fileName}.mp3`;
        const _output = path.resolve(outputPath);

        const soundBuffer = await sound.arrayBuffer();
        const buffer = Buffer.from(soundBuffer);
        await fs.promises.writeFile(`./public/${_output}`, buffer);

        await db.insert(tokenSpends).values({
          amount: 1,
          email: user?.emailAddresses[0].emailAddress!,
          action: "image"
        });

        return outputPath;
      } catch (e) {
        throw (e);
      }
    }),
});
