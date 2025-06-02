import Link from "next/link";

import DashboardWrapper from "@/components/dashboard/wrapper";
import { Button } from "@/components/ui/button";

export default function Success() {
  return (
    <DashboardWrapper
      breadcrumb={[
        { title: "Payment Success", href: "/dashboard/payment/success" },
      ]}
    >
      <h1 className="text-2xl font-bold">
        You have successfully purchased tokens!
      </h1>
      <p>You can see them in the sidebar.</p>
      <p>
        Go to{" "}
        <Link href="/dashboard/meal-planner">
          <Button>Meal Planner</Button>
        </Link>{" "}
        to start planning your meals.
      </p>
    </DashboardWrapper>
  );
}
