import DashboardWrapper from "@/components/dashboard/wrapper";
import { CreateMealPlanForm } from "@/components/features";

export default function MealPlannerPage() {
  return (
    <DashboardWrapper
      breadcrumb={[{ title: "Meal Planner", href: "/dashboard/meal-planner" }]}
    >
      <CreateMealPlanForm />
    </DashboardWrapper>
  );
}
