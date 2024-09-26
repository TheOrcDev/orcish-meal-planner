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
import { useToast } from "@/hooks/use-toast";
import { DailyMealPlan } from "@/components/features";

export default function MyMealPlansPage() {
  const dailyPlans = trpc.mealPlans.getDailyPlans.useQuery();
  const deleteMealPlan = trpc.mealPlans.delete.useMutation();
  const utils = trpc.useUtils();

  const { toast } = useToast();

  utils.mealPlans.getDailyPlans.refetch();

  const handleDeleteMealPlan = (mealPlanId: string) => {
    deleteMealPlan.mutate({ mealPlanId });
    toast({
      title: "Meal plan deleted",
      description: "Your meal plan has been deleted.",
    });
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
        {!dailyPlans.isPending && (
          <>
            {dailyPlans.data?.map((plan) => (
              <DailyMealPlan key={plan.id} plan={plan} />
            ))}
            <Link href={"meal-planner"}>
              <Card className="size-72 h-full cursor-pointer from-primary/40 to-transparent transition duration-300 ease-in-out hover:-translate-y-2 hover:bg-primary/10 hover:bg-gradient-to-br">
                <CardContent className="flex size-full flex-col items-center justify-center gap-3">
                  <p className="text-2xl">Create a new plan</p>
                  <Plus className="size-10" />
                </CardContent>
              </Card>
            </Link>
          </>
        )}
      </div>
      {!dailyPlans.isPending && !dailyPlans.data?.length && (
        <h2 className="text-2xl">No meal plans yet!</h2>
      )}
    </main>
  );
}
