"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@/components/ui";
import { trpc } from "@/server/client";
import { CompletionModel } from "@/components/shared/types";
import { useState } from "react";

export const Goal = {
  LOSE_WEIGHT: "Lose Weight",
  HEALTHY: "To be Healthy",
  GAIN_MUSCLE: "Gain Muscle",
} as const;
export type Goal = (typeof Goal)[keyof typeof Goal];

const goalsArray = Object.values(Goal);

export const Diet = {
  ANY: "Any",
  MEDITERRANEAN: "Mediterranean Diet",
  KETO: "Ketogenic (Keto) Diet",
  PALEO: "Paleo Diet",
  VEGETARIAN: "Vegetarian Diet",
  VEGAN: "Vegan Diet",
  GLUTEN_FREE: "Gluten-Free Diet",
  LOW_CARB: "Low Carb Diet",
} as const;
export type Diet = (typeof Diet)[keyof typeof Diet];

const dietsArray = Object.values(Diet);

const formSchema = z.object({
  age: z.coerce.number().min(1).max(100),
  goal: z.nativeEnum(Goal),
  meals: z.coerce.number().min(2).max(12),
  sex: z.enum(["male", "female"]),
  diet: z.nativeEnum(Diet),
  allergies: z.string(),
});

interface Meal {
  mealTitle: string;
  calories: string;
  ingredients: string[];
}

export default function MealPlanner() {
  const [aiResult, setAiResult] = useState<Meal[] | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 18,
      goal: Goal.HEALTHY,
      meals: 2,
      sex: "male",
      diet: Diet.ANY,
      allergies: "",
    },
  });
  const getCompletion = trpc.ai.completion.useMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let prompt = `
    Give me a meal plan for the entire day.

    My age: ${values.age}
    My sex: ${values.sex}

    I want to have ${values.meals} meals a day.

    My diet should be: ${values.diet}

    My main goal is: ${values.goal}
    `;

    if (values.allergies) {
      prompt = `
      ${prompt}
      
      These are my allergies, and things I don't like: ${values.allergies}
      `;
    }

    const jsonFormat = `
    The result should be returned in the following format, and please keep it in one line, nothing should break the JSON formatting:

    { mealTitle: string, calories: string, ingredients: string[] }[]

    Ingredients should have amount of food in grams like this: Chicken Breasts (200g)
    `;

    try {
      const completion = await getCompletion.mutateAsync({
        prompt: `${prompt} ${jsonFormat}`,
        model: CompletionModel.GPT_3_5_TURBO,
      });

      setAiResult(JSON.parse(completion));
    } catch (e) {
      console.error("Error fetching AI completion:", e);
      console.log("restarting");

      const completion = await getCompletion.mutateAsync({
        prompt: `${prompt} ${jsonFormat}`,
        model: CompletionModel.GPT_3_5_TURBO,
      });

      setAiResult(JSON.parse(completion));
    }
    console.log(values);
  }

  return (
    <main className="flex flex-col items-center justify-center p-24">
      {getCompletion.isPending && (
        <div className="grid gap-5 md:grid-cols-2">
          <Skeleton className="h-52 w-96 rounded-xl" />
          <Skeleton className="h-52 w-96 rounded-xl" />
          <Skeleton className="h-52 w-96 rounded-xl" />
          <Skeleton className="h-52 w-96 rounded-xl" />
        </div>
      )}
      {aiResult && !getCompletion.isPending && (
        <div className="grid gap-5 md:grid-cols-2">
          {aiResult.map((meal, index) => (
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
      )}

      {!aiResult && !getCompletion.isPending && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-5 md:grid-cols-2"
          >
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Age" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="meals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of meals</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Number of meals"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sex</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Your Sex" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Your Goal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {goalsArray.map((goal) => (
                          <SelectItem key={goal} value={goal}>
                            {goal}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="diet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diet</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Your Diet" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dietsArray.map((diet) => (
                          <SelectItem key={diet} value={diet}>
                            {diet}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="allergies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allergies</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Some allergies or food that you don't like"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-full flex w-full justify-center">
              <Button type="submit">Get your meal plan!</Button>
            </div>
          </form>
        </Form>
      )}
    </main>
  );
}
