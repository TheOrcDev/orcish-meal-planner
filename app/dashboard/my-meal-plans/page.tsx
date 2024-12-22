import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import DashboardWrapper from "@/components/dashboard/wrapper";
import { DailyMealPlan } from "@/components/features";
import { Card, CardContent } from "@/components/ui/card";
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
            <Link href={"/dashboard/meal-planner"}>
              <Card className="size-72 h-full cursor-pointer from-primary/40 to-transparent p-5 transition duration-300 ease-in-out hover:-translate-y-2 hover:bg-primary/10 hover:bg-gradient-to-br">
                <CardContent className="flex size-full flex-col items-center justify-center gap-3">
                  <p className="text-2xl">New Plan</p>
                  <Plus className="size-10" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </Suspense>

        {!dailyPlans?.length && (
          <h2 className="text-2xl">No meal plans yet!</h2>
        )}
      </main>
    </DashboardWrapper>
  );
}
