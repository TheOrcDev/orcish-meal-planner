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
    mealPlanId: string;
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
                <CardDescription>Calories: {meal.calories}</CardDescription>
              </CardHeader>
              <CardContent>
                {JSON.parse(meal?.ingredients).map((ingredient: string) => (
                  <p key={ingredient}>{ingredient}</p>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
