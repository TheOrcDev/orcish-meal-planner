"use client";

import { MealPlan } from "@/components/features";
import { trpc } from "@/server/client";

export default function MealPlanPage({
  params,
}: {
  params: { mealPlanId: string };
}) {
  const mealPlan = trpc.mealPlans.get.useQuery({
    mealPlanId: params.mealPlanId,
  });

  return (
    <main className="flex flex-col items-center justify-center gap-5 p-24">
      {!mealPlan.isPending && <MealPlan daily={mealPlan.data!} />}
    </main>
  );
}
