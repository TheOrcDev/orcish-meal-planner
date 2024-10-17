"use client";

import { trpc } from "@/server/client";
import { Card, CardContent, Skeleton } from "@/components/ui";

import Link from "next/link";
import { Plus } from "lucide-react";
import { DailyMealPlan } from "@/components/features";

export default function MyMealPlansPage() {
  const dailyPlans = trpc.mealPlans.getDailyPlans.useQuery();
  const utils = trpc.useUtils();

  utils.mealPlans.getDailyPlans.refetch();

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
              <Card className="size-72 h-full cursor-pointer from-primary/40 to-transparent p-5 transition duration-300 ease-in-out hover:-translate-y-2 hover:bg-primary/10 hover:bg-gradient-to-br">
                <CardContent className="flex size-full flex-col items-center justify-center gap-3">
                  <p className="text-2xl">New Plan</p>
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
