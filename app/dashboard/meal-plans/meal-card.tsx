import { Coffee, Cookie, Salad, UtensilsCrossed } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Meal } from "@/db/schema";

interface MealProps {
  meal: Meal;
}

const mealIcons = {
  Breakfast: Coffee,
  Lunch: UtensilsCrossed,
  Dinner: UtensilsCrossed,
  Snack: Cookie,
};

export function MealCard({ meal }: MealProps) {
  const { title, calories, protein, carb, fat, ingredients, mealOrder } = meal;
  const totalNutrients = protein + carb + fat;

  return (
    <Card className="h-full">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="rounded-full bg-primary/10 p-1">
              {/* <Icon className="size-4 text-primary" /> */}
            </div>
            <span className="text-sm text-muted-foreground">
              Meal #{mealOrder}
            </span>
          </div>
          <span className="text-sm font-medium">{calories} cal</span>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Protein</span>
            <span>{protein}g</span>
          </div>
          <Progress
            value={(protein / totalNutrients) * 100}
            className="h-1.5"
          />
          <div className="flex justify-between text-sm">
            <span>Carbs</span>
            <span>{carb}g</span>
          </div>
          <Progress value={(carb / totalNutrients) * 100} className="h-1.5" />
          <div className="flex justify-between text-sm">
            <span>Fat</span>
            <span>{fat}g</span>
          </div>
          <Progress value={(fat / totalNutrients) * 100} className="h-1.5" />
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Ingredients</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {ingredients.map((ingredient, index) => (
              <li key={index} className="flex justify-between">
                <span>{ingredient.name}</span>
                <span>{ingredient.grams}g</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
