import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { DailyMealPlan } from "@/components/shared/types";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

interface Props {
  daily: DailyMealPlan;
}

export default function MealPlan({ daily }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <h2 className="text-3xl text-primary">{daily.totalCalories} Calories</h2>
      <div className="grid gap-5 md:grid-cols-2">
        {daily.meals.map((meal, index) => (
          <Card key={meal.title} className="min-w-96">
            <CardHeader>
              <CardTitle>
                Meal #{index + 1}: {meal.title}
              </CardTitle>
              <CardDescription>Calories: {meal.calories}</CardDescription>
            </CardHeader>
            <CardContent>
              {JSON.parse(meal?.ingredients).map((ingredient: string) => (
                <p key={ingredient}>{ingredient}</p>
              ))}
            </CardContent>
          </Card>
        ))}
        <div className="col-span-full flex items-center justify-center">
          <Link href={"/meal-planner"}>
            <Button>
              <ArrowLeft className="mr-1 size-5" />
              New Meal Plan
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
