import { Meal } from "@/components/shared/types";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { ArrowLeft } from "lucide-react";

interface Props {
  meals: Meal[];
  back: () => void;
}

export default function MealPlan({ meals, back }: Props) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {meals.map((meal, index) => (
        <Card key={meal.mealTitle} className="min-w-96">
          <CardHeader>
            <CardTitle>
              Meal #{index + 1}: {meal.mealTitle}
            </CardTitle>
            <CardDescription>Calories: {meal.calories}</CardDescription>
          </CardHeader>
          <CardContent>
            {meal?.ingredients?.map((ingredient: string) => (
              <p key={ingredient}>{ingredient}</p>
            ))}
          </CardContent>
        </Card>
      ))}
      <div className="col-span-full flex items-center justify-center">
        <Button onClick={back}>
          <ArrowLeft className="mr-1 size-5" />
          New Meal Plan
        </Button>
      </div>
    </div>
  );
}
