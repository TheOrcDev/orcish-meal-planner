import DashboardWrapper from "@/components/dashboard/wrapper";
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
    <DashboardWrapper
      breadcrumb={[
        { title: "My Meal Plans", href: "/dashboard/my-meal-plans" },
        { title: mealPlan.title, href: `/dashboard/meal-plan/${mealPlanId}` },
      ]}
    >
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
    </DashboardWrapper>
  );
}
