"use client";

import { trpc } from "@/server/client";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@/components/ui";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function MyMealPlansPage() {
  const dailyPlans = trpc.mealPlans.getDailyPlans.useQuery();

  return (
    <main className="flex flex-col items-center justify-center gap-5 p-24">
      <h2 className="text-2xl">My Meal Plans</h2>
      <Link href={"/meal-planner"}>
        <Button>Create More Plans</Button>
      </Link>

      {dailyPlans.isPending && (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="size-72" />
          <Skeleton className="size-72" />
          <Skeleton className="size-72" />
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {!dailyPlans.isPending &&
          dailyPlans.data?.map((plan) => (
            <Link key={plan.id} href={`/meal-plan/${plan.id}`}>
              <Card className="h-full cursor-pointer transition duration-300 ease-in-out hover:bg-primary/10">
                <CardHeader>
                  <CardTitle>{plan.title}</CardTitle>
                  <CardDescription>
                    Calories: {plan.totalCalories}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {plan.meals.map((meal) => (
                    <p key={meal.id}>{meal.title}</p>
                  ))}
                </CardContent>
              </Card>
            </Link>
          ))}
      </div>
      {!dailyPlans.isPending && !dailyPlans.data?.length && (
        <h2 className="text-2xl">No meal plans yet!</h2>
      )}
    </main>
  );
}
