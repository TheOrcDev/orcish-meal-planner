import { z } from "zod";
import { formSchema } from "./create-meal-plan-form";

const formats = {
  daily: `
    { 
      meals: { mealTitle: string, calories: string, ingredients: string[] }[];
      totalCalories: string;
    }
  `,
  weekly: `
    {
      { 
        day: string;
        meals: { mealTitle: string, calories: string, ingredients: string[] }[];
        totalCalories: string;
      }[],
      totalCalories: string;
    }
  `,
};

export const getPrompt = (
  values: z.infer<typeof formSchema>,
  type: "daily" | "weekly"
) => {
  let prompt = `
    Create a customized meal plan for the entire ${type} based on the following details:

    - Age: ${values.age}
    - Sex: ${values.sex}
    - Number of meals per day: ${values.meals}
    - Diet type: ${values.diet} (e.g., vegetarian, keto, low-carb)
    - Primary goal: ${values.goal} (e.g., weight loss, muscle gain, maintenance)
  `;

  if (values.allergies) {
    prompt += `
      - Allergies and dislikes: ${values.allergies}
    `;
  }

  const jsonFormat = `
    Please ensure that the meal plan aligns with my nutritional needs and goals, 
    offering a balanced and varied diet. Provide detailed meal ideas with portion sizes, 
    ingredient suggestions, and nutritional information if possible.

    Ingredients should have amount of food in grams like this: Chicken Breasts (200g)

    The result should be returned in the following format, and please keep it in one line, nothing should break the JSON formatting:

    ${formats[type]}
  `;

  return `${prompt} ${jsonFormat}`;
};