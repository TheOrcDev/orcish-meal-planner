"use client";

import Link from "next/link";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DailyPlanWithMeals } from "@/db/schema";
import { deleteDailyPlan } from "@/server/meal-plans";

interface DailyMealPlanProps {
  plan: DailyPlanWithMeals;
}

export default function DailyMealPlan({ plan }: DailyMealPlanProps) {
  const handleDeleteMealPlan = async (mealPlanId: number) => {
    try {
      await deleteDailyPlan(mealPlanId);

      toast("Meal plan deleted");
    } catch (error) {
      toast("An error occurred while deleting your meal plan.");
      console.log(error);
    }
  };
  return (
    <Card
      key={plan.id}
      className="h-full cursor-pointer from-primary/40 to-transparent transition duration-300 ease-in-out hover:-translate-y-2 hover:bg-primary/10 hover:bg-linear-to-br"
    >
      <Link href={`/dashboard/meal-plan/${plan.id}`}>
        <CardHeader>
          <CardTitle>{plan.title}</CardTitle>
          <CardDescription>Calories: {plan.totalCalories}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col justify-between gap-3 ">
          <div>
            {plan.meals.map((meal) => (
              <p key={meal.id}>{meal.title}</p>
            ))}
          </div>
        </CardContent>
      </Link>
      <CardFooter className="flex items-center justify-between gap-3">
        <Link href={`/dashboard/meal-plan/${plan.id}`}>
          <Button>Go to plan</Button>
        </Link>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant={"destructive"}>Delete</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                meal plan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDeleteMealPlan(plan.id)}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
