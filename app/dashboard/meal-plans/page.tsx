import { CheckCircledIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import DashboardWrapper from "@/components/dashboard/wrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const dailyBenefits = [
  "Meal plan for one day",
  "Personalized to your diet and preferences",
  "Adjustable number of meals",
  "Flexible and quick to set up",
];

const weeklyBenefits = [
  "Meal plan for the entire week",
  "Customizable to fit your lifestyle",
  "Consistent and organized approach",
  "More affordable, you save 2 tokens",
];

export default function MealPlansPage() {
  return (
    <DashboardWrapper
      breadcrumb={[{ title: "Meal Plans", href: "/dashboard/meal-plans" }]}
    >
      <div className="flex flex-col items-center justify-center gap-10 p-24">
        <h1 className="text-3xl">Choose your meal plan</h1>

        <div className="grid w-full gap-5 md:grid-cols-2 lg:px-20">
          <Link href={"/meal-planner?type=daily"}>
            <Card className="cursor-pointer from-primary/40 to-transparent transition duration-300 ease-in-out hover:-translate-y-2 hover:bg-primary/10 hover:bg-gradient-to-br">
              <CardHeader>
                <CardTitle>Daily</CardTitle>
                <CardDescription>1 token</CardDescription>
              </CardHeader>
              <CardContent className="md:min-h-96">
                <div className="flex flex-col gap-5">
                  {dailyBenefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-1">
                      <CheckCircledIcon className="size-5 text-primary" />{" "}
                      {benefit}
                    </div>
                  ))}

                  <p>
                    Create a personalized meal plan for today. Customize based
                    on your desired diet, number of meals, and personal
                    preferences. Ideal for staying flexible and adapting to your
                    daily nutritional needs.
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href={"/meal-planner?type=weekly"}>
            <Card className="cursor-pointer from-primary/40 to-transparent transition duration-300 ease-in-out hover:-translate-y-2 hover:bg-primary/10 hover:bg-gradient-to-br">
              <CardHeader>
                <CardTitle>Weekly</CardTitle>
                <CardDescription>5 tokens</CardDescription>
              </CardHeader>
              <CardContent className="md:min-h-96">
                <div className="flex flex-col gap-5">
                  {weeklyBenefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-1">
                      <CheckCircledIcon className="size-5 text-primary" />{" "}
                      {benefit}
                    </div>
                  ))}

                  <p>
                    Plan your entire week with a personalized approach. Tailor
                    your meals based on diet, preferences, and lifestyle.
                    Perfect for those who want a structured and time-saving way
                    to stay on track with their goals.
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </DashboardWrapper>
  );
}
