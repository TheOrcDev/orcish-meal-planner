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
import { ArrowRight, Plus } from "lucide-react";

export default function MyMealPlansPage() {
  const dailyPlans = trpc.mealPlans.getDailyPlans.useQuery();

  return (
    <main className="flex flex-col items-center justify-center gap-5 p-24">
      <h2 className="text-2xl">My Meal Plans</h2>
      <Link href={"/meal-planner"}>
        <Button>
          Create More Plans <ArrowRight className="size-5" />
        </Button>
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
              <Card className="h-full cursor-pointer from-primary/40 to-transparent transition duration-300 ease-in-out hover:-translate-y-2 hover:bg-primary/10 hover:bg-gradient-to-br">
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
        <Link href={"meal-planner"}>
          <Card className="h-full cursor-pointer from-primary/40 to-transparent transition duration-300 ease-in-out hover:-translate-y-2 hover:bg-primary/10 hover:bg-gradient-to-br size-72">
            <CardContent className="flex flex-col gap-3 items-center justify-center size-full">
              <p className="text-2xl">Create a new plan</p>
              <Plus className="size-10" />
            </CardContent>
          </Card>
        </Link>
      </div>
      {!dailyPlans.isPending && !dailyPlans.data?.length && (
        <h2 className="text-2xl">No meal plans yet!</h2>
      )}
    </main>
  );
}
