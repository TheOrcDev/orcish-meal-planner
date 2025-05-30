import { z } from "zod";

import { ActivityLevel, Diet, Goal } from "@/components/features/create-meal-plan-form";

export const mealPlannerSchema = z.object({
  goal: z.nativeEnum(Goal),
  meals: z.coerce.number().min(2).max(12),
  diet: z.nativeEnum(Diet),
  activityLevel: z.nativeEnum(ActivityLevel),
});

export const mealPlanSchema = z.object({
  title: z.string(),
  meals: z.array(
    z.object({
      title: z.string(),
      calories: z.string(),
      ingredients: z.array(
        z.object({
          name: z.string(),
          grams: z.number(),
          calories: z.number(),
          protein: z.number(),
          carb: z.number(),
          fat: z.number(),
        })
      ),
      protein: z.number(),
      carb: z.number(),
      fat: z.number(),
    })
  ),
  totalCalories: z.string(),
});

export const userSchema = z.object({
  name: z.string().min(3),
  dateOfBirth: z.date().optional().nullable(),
  gender: z.enum(["male", "female", "other"]),
  height: z.number().optional().nullable(),
  heightUnit: z.enum(["cm", "in"]).optional().nullable(),
  weight: z.number().optional().nullable(),
  weightUnit: z.enum(["kg", "lb"]).optional().nullable(),
  allergies: z.string().optional().nullable(),
});
