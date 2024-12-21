import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getMealPlan } from "@/server/meal-plans";

interface MealPlanPageProps {
  params: Promise<{
    mealPlanId: number;
  }>;
}

export default async function MealPlanPage({ params }: MealPlanPageProps) {
  const { mealPlanId } = await params;

  const mealPlan = await getMealPlan(mealPlanId);

  return (
    <main className="flex flex-col items-center justify-center gap-5">
      <div className="flex flex-col items-center justify-center gap-10">
        <h2 className="text-3xl text-primary">
          {mealPlan.totalCalories} Calories
        </h2>
        <div className="grid gap-5 md:grid-cols-2">
          {mealPlan.meals.map((meal, index) => (
            <Card key={meal.title} className="min-w-96">
              <CardHeader>
                <CardTitle>
                  Meal #{index + 1}: {meal.title}
                </CardTitle>
                <CardDescription className="flex gap-1">
                  <span>Calories: {meal.calories}</span>
                  <span>Protein: {meal.protein}</span>
                  <span>Carbs: {meal.carb}</span>
                  <span>Fat: {meal.fat}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {meal.ingredients.map((ingredient) => (
                  <p key={ingredient.name}>
                    {ingredient.name} ({ingredient.grams}g)
                  </p>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
