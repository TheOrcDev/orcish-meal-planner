import { z } from "zod";

import { mealPlannerSchema } from "@/server/schemas";

export const getPrompt = (values: z.infer<typeof mealPlannerSchema>) => {
  let prompt = `
    You are a professional nutritionist’s assistant.

    Based on the information provided below, generate a personalized full-day meal plan that aligns with the user’s dietary needs and health goals. Ensure the meals are well-balanced, realistic, and tailored to their preferences.

    User Details:

    Age: ${values.age}

    Gender: ${values.gender}

    Meals per day: ${values.meals}

    Activity level: ${values.activityLevel}

    Dietary preference: ${values.diet}

    Primary goal: ${values.goal}
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
