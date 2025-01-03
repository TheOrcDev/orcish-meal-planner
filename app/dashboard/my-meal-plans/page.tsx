import { Suspense } from "react";

import DashboardWrapper from "@/components/dashboard/wrapper";
import { DailyMealPlan } from "@/components/features";
import { Skeleton } from "@/components/ui/skeleton";
import { getDailyPlans } from "@/server/meal-plans";

export default async function MyMealPlansPage() {
  const dailyPlans = await getDailyPlans();

  return (
    <DashboardWrapper
      breadcrumb={[
        { title: "My Meal Plans", href: "/dashboard/my-meal-plans" },
      ]}
    >
      <main className="flex flex-col items-center justify-center gap-5">
        <h2 className="text-2xl">My Meal Plans</h2>

        <Suspense
          fallback={
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <Skeleton className="size-72" />
              <Skeleton className="size-72" />
              <Skeleton className="size-72" />
            </div>
          }
        >
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {dailyPlans?.map((plan) => (
              <DailyMealPlan key={plan.id} plan={plan} />
            ))}
          </div>
        </Suspense>

        {!dailyPlans?.length && (
          <h2 className="text-2xl">No meal plans yet!</h2>
        )}
      </main>
    </DashboardWrapper>
  );
}
