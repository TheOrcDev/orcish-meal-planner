import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import DashboardWrapper from "@/components/dashboard/wrapper";
import { DailyMealPlan } from "@/components/features";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getDailyPlans } from "@/server/meal-plans";

export default async function MyMealPlansPage() {
  const dailyPlans = await getDailyPlans();

  if (!dailyPlans.length) {
    return (
      <DashboardWrapper
        breadcrumb={[
          { title: "My Meal Plans", href: "/dashboard/my-meal-plans" },
        ]}
      >
        <div className="flex flex-col items-center justify-center gap-5 p-24">
          <Image
            src={"/meal-planner.png"}
            width={300}
            height={300}
            alt="Meal Planner 404"
          />
          <h1 className="text-2xl font-bold">No meal plans yet!</h1>
          <Link href={"/dashboard/meal-planner"}>
            <Button variant={"outline"}>Create a new meal plan</Button>
          </Link>
        </div>
      </DashboardWrapper>
    );
  }

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
      </main>
    </DashboardWrapper>
  );
}
