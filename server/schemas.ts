import { z } from "zod";

import { Diet, Goal } from "@/components/features/create-meal-plan-form";

export const mealPlannerSchema = z.object({
  age: z.coerce.number().min(1).max(100),
  goal: z.nativeEnum(Goal),
  meals: z.coerce.number().min(2).max(12),
  gender: z.enum(["male", "female"]),
  diet: z.nativeEnum(Diet),
  weight: z.coerce.number().min(1).max(400).optional(),
  height: z.coerce.number().min(1).max(400).optional(),
  weightUnit: z.enum(["kg", "lb"]),
  heightUnit: z.enum(["cm", "in"]),
  allergies: z.string(),
});
