import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getMealPlan } from "@/server/meal-plans";

import { MealCard } from "../../meal-plans/meal-card";

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
          {mealPlan.meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      </div>
    </main>
  );
}
