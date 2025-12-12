"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Activity, Leaf, Loader2, Target, Utensils } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { NotEnoughTokens } from "@/components/features";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getMealPlan } from "@/server/ai";
import { mealPlannerSchema } from "@/server/schemas";

import { ActivityLevel, Diet, Goal } from ".";

const goals = Object.values(Goal);
const diets = Object.values(Diet);
const activityLevels = Object.values(ActivityLevel);

export default function CreateMealPlanForm() {
  const router = useRouter();
  const [notEnoughTokens, setNotEnoughTokens] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");
  const [heightUnit, setHeightUnit] = useState<"cm" | "in">("cm");

  const form = useForm<z.infer<typeof mealPlannerSchema>>({
    resolver: zodResolver(mealPlannerSchema),
    defaultValues: {
      goal: Goal.HEALTHY,
      meals: 3,
      diet: Diet.ANY,
      activityLevel: ActivityLevel.MODERATE,
    },
  });

  async function onSubmit(values: z.infer<typeof mealPlannerSchema>) {
    try {
      setIsLoading(true);
      const completionValues = {
        ...values,
        weightUnit,
        heightUnit,
      };
      const completion = await getMealPlan(completionValues);

      if (completion === "Not enough tokens") {
        setNotEnoughTokens(true);
        return;
      }

      router.push(`/dashboard/meal-plan/${completion.id}`);
    } catch (e) {
      console.error("Error fetching AI completion:", e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-2xl bg-background">
        <CardContent className="space-y-8 p-6">
          {notEnoughTokens && <NotEnoughTokens />}

          {!notEnoughTokens && (
            <div className="flex flex-col items-center justify-center gap-5">
              <div className="space-y-2 text-center">
                <h1 className="text-2xl font-semibold">
                  Start Your Health Journey
                </h1>
                <p className="mx-auto max-w-xl text-muted-foreground">
                  Take a moment to complete this form so we can customize your
                  meal planning experience and deliver the most personalized,
                  effective results for your health journey. Let’s start
                  building a healthier you!
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="grid w-full gap-6 grid-cols-2 md:grid-cols-3"
                >
                  <FormField
                    control={form.control}
                    name="meals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-muted-foreground">
                          <Utensils className="size-4" />
                          Number of meals
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Number of meals"
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value)
                              )
                            }
                          />
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
                        <FormLabel className="flex items-center gap-2 text-muted-foreground">
                          <Target className="size-4" />
                          Goal
                        </FormLabel>
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
                            {goals.map((goal) => (
                              <SelectItem key={goal} value={goal}>
                                {goal}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="diet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-muted-foreground">
                          <Activity className="size-4" />
                          Diet
                        </FormLabel>
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
                            {diets.map((diet) => (
                              <SelectItem key={diet} value={diet}>
                                {diet}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="activityLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-muted-foreground">
                          <Activity className="size-4" />
                          Activity Level
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Your Activity Level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {activityLevels.map((activityLevel) => (
                              <SelectItem
                                key={activityLevel}
                                value={activityLevel}
                              >
                                {activityLevel}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="col-span-full flex justify-center pt-4">
                    <Button type="submit" size="lg" disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="mr-2 size-5 animate-spin" />
                      ) : (
                        <Leaf className="mr-2 size-5" />
                      )}
                      Get your meal plan!
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
