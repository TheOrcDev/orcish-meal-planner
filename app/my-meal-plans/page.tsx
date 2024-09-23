"use client";

import { trpc } from "@/server/client";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Skeleton,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui";

import Link from "next/link";
import { Plus } from "lucide-react";

export default function MyMealPlansPage() {
  const dailyPlans = trpc.mealPlans.getDailyPlans.useQuery();
  const deleteMealPlan = trpc.mealPlans.delete.useMutation();
  const utils = trpc.useUtils();

  utils.mealPlans.getDailyPlans.refetch();

  const handleDeleteMealPlan = (mealPlanId: string) => {
    deleteMealPlan.mutate({ mealPlanId });
  };

  return (
    <main className="flex flex-col items-center justify-center gap-5 p-24">
      <h2 className="text-2xl">My Meal Plans</h2>

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
            <Card
              key={plan.id}
              className="h-full cursor-pointer from-primary/40 to-transparent transition duration-300 ease-in-out hover:-translate-y-2 hover:bg-primary/10 hover:bg-gradient-to-br"
            >
              <Link href={`/meal-plan/${plan.id}`}>
                <CardHeader>
                  <CardTitle>{plan.title}</CardTitle>
                  <CardDescription>
                    Calories: {plan.totalCalories}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 justify-between ">
                  <div>
                    {plan.meals.map((meal) => (
                      <p key={meal.id}>{meal.title}</p>
                    ))}
                  </div>
                </CardContent>
              </Link>
              <CardFooter className="flex items-center justify-center gap-3">
                <Link href={`/meal-plan/${plan.id}`}>
                  <Button>Go to plan</Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant={"destructive"}>Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your meal plan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteMealPlan(plan.id)}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
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
