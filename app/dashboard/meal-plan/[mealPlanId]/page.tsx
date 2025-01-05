import Image from "next/image";
import Link from "next/link";

import DashboardWrapper from "@/components/dashboard/wrapper";
import { Button } from "@/components/ui/button";
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

  if (!mealPlan) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 p-24">
        <h1 className="text-2xl font-bold">No meal plan found</h1>
        <Image
          src={"/meal-planner.png"}
          width={300}
          height={300}
          alt="Meal Planner 404"
        />
        <Link href={"/dashboard/meal-planner"}>
          <Button variant={"outline"}>Create a new meal plan</Button>
        </Link>
      </div>
    );
  }

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
