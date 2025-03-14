import { z } from "zod";

import { mealPlannerSchema } from "@/server/schemas";

export const getPrompt = (values: z.infer<typeof mealPlannerSchema>) => {
  let prompt = `
    Create a customized meal plan for the entire day based on the following details:

    - Age: ${values.age}
    - Gender: ${values.gender}
    - Number of meals per day: ${values.meals}
    - Diet type: ${values.diet} (e.g., vegetarian, keto, low-carb)
    - Primary goal: ${values.goal} (e.g., weight loss, muscle gain, maintenance)
   
  `;

  if (values.weight) {
    prompt += `
      - Weight: ${values.weight} ${values.weightUnit}
    `;
  }

  if (values.height) {
    prompt += `
      - Height: ${values.height} ${values.heightUnit}
    `;
  }

  if (values.allergies) {
    prompt += `
      - Allergies and dislikes: ${values.allergies}
    `;
  }

  const jsonFormat = `
    Ensure that the meal plan aligns with nutritional needs and goals, 
    offering a balanced and varied diet. Provide detailed meal ideas with portion sizes, 
    ingredient suggestions, and nutritional information. 
    Ingredients should have amounts in grams.
    Title should be something logical, connected to the diet type, and goal.
    Meal title should be connected to food ingredients inside that specific meal.
    Be aware of calories intake. Minimum 1500 calories per day, and maximum 4500 calories per day based on the goal.
  `;

  return `${prompt} ${jsonFormat}`;
};
