"use client";
import Link from "next/link";

import { DailyMealPlan as DailyMealPlanType } from "@/components/shared/types";
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
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { useToast } from "@/hooks/use-toast";
import { trpc } from "@/server/client";

interface DailyMealPlanProps {
  plan: DailyMealPlanType;
}
export default function DailyMealPlan({ plan }: DailyMealPlanProps) {
  const deleteMealPlan = trpc.mealPlans.delete.useMutation();
  const utils = trpc.useUtils();
  const { toast } = useToast();

  const handleDeleteMealPlan = (mealPlanId: string) => {
    deleteMealPlan.mutate({ mealPlanId });

    utils.mealPlans.getDailyPlans.refetch();

    toast({
      title: "Meal plan deleted",
      description: "Your meal plan has been deleted.",
    });
  };
  return (
    <Card
      key={plan.id}
      className="h-full cursor-pointer from-primary/40 to-transparent transition duration-300 ease-in-out hover:-translate-y-2 hover:bg-primary/10 hover:bg-gradient-to-br"
    >
      <Link href={`/meal-plan/${plan.id}`}>
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
        <Link href={`/meal-plan/${plan.id}`}>
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
