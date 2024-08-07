import { Meal } from "@/components/shared/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

interface Props {
  meals: Meal[];
}

export default function MealPlan({ meals }: Props) {
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
    </div>
  );
}
