import { z } from "zod";

import { formSchema } from "./create-meal-plan-form";

export const getPrompt = (values: z.infer<typeof formSchema>): string => {
  let prompt = `
    Give me a meal plan for the entire day.

    My age: ${values.age}
    My sex: ${values.sex}

    I want to have ${values.meals} meals a day.

    My diet should be: ${values.diet}

    My main goal is: ${values.goal}
    `;

  if (values.allergies) {
    prompt = `
      ${prompt}
      
      These are my allergies, and things I don't like: ${values.allergies}
      `;
  }

  const jsonFormat = `
    The result should be returned in the following format, and please keep it in one line, nothing should break the JSON formatting:

    { mealTitle: string, calories: string, ingredients: string[] }[]

    Ingredients should have amount of food in grams like this: Chicken Breasts (200g)
    `;

  return `${prompt} ${jsonFormat}`;
}