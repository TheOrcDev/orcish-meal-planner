"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Activity,
  AlertCircle,
  Cake,
  Leaf,
  Loader2,
  Ruler,
  Target,
  Users,
  Utensils,
  Weight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { NotEnoughTokens } from "@/components/features";
import {
  Button,
  Card,
  CardContent,
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
  Textarea,
} from "@/components/ui";
import { getMealPlan } from "@/server/ai";
import { mealPlannerSchema } from "@/server/schemas";

import { Diet, Goal } from ".";

const goals = Object.values(Goal);
const diets = Object.values(Diet);

export default function CreateMealPlanForm() {
  const router = useRouter();
  const [notEnoughTokens, setNotEnoughTokens] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");
  const [heightUnit, setHeightUnit] = useState<"cm" | "in">("cm");

  const form = useForm<z.infer<typeof mealPlannerSchema>>({
    resolver: zodResolver(mealPlannerSchema),
    defaultValues: {
      age: 18,
      goal: Goal.HEALTHY,
      meals: 2,
      gender: "male",
      diet: Diet.ANY,
      weight: 70,
      height: 170,
      allergies: "",
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
      const completion = await getMealPlan(completionValues, "daily");

      if (completion === "Not enough tokens") {
        setNotEnoughTokens(true);
        return;
      }

      router.push(`/meal-plan/${completion.id}`);
    } catch (e) {
      console.error("Error fetching AI completion:", e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 p-4">
      <Card className="w-full max-w-2xl border-gray-800 bg-gray-900/50">
        <CardContent className="space-y-8 p-6">
          {notEnoughTokens && <NotEnoughTokens />}

          {!notEnoughTokens && (
            <div className="flex flex-col items-center justify-center gap-5">
              <div className="space-y-2 text-center">
                <h1 className="text-2xl font-semibold text-white">
                  Start Your Health Journey
                </h1>
                <p className="mx-auto max-w-xl text-gray-400">
                  Please take a moment to fill out this form so we can tailor
                  your experience and provide you with the most personalized and
                  effective results possible. Let&apos;s get started on your
                  journey to BE HEALTHY!
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="grid w-full gap-6 md:grid-cols-2"
                >
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-200">
                          <Cake className="size-4" />
                          Age
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Age"
                            {...field}
                            className="border-gray-700 bg-gray-800/50 text-white placeholder:text-gray-500"
                          />
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
                        <FormLabel className="flex items-center gap-2 text-gray-200">
                          <Utensils className="size-4" />
                          Number of meals
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Number of meals"
                            {...field}
                            className="border-gray-700 bg-gray-800/50 text-white placeholder:text-gray-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-200">
                          <Users className="size-4" />
                          Gender
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-gray-700 bg-gray-800/50 text-white">
                              <SelectValue placeholder="Your gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="goal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-200">
                          <Target className="size-4" />
                          Goal
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-gray-700 bg-gray-800/50 text-white">
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
                        <FormLabel className="flex items-center gap-2 text-gray-200">
                          <Activity className="size-4" />
                          Diet
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-gray-700 bg-gray-800/50 text-white">
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

                  <div className="col-span-full">
                    <FormField
                      control={form.control}
                      name="allergies"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-gray-200">
                            <AlertCircle className="size-4" />
                            Allergies
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Some allergies or food that you don't like"
                              {...field}
                              rows={5}
                              className="border-gray-700 bg-gray-800/50 text-white placeholder:text-gray-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-200">
                          <Weight className="size-4" />
                          Weight
                        </FormLabel>
                        <FormControl>
                          <div className="flex">
                            <Input
                              type="number"
                              placeholder="Weight"
                              {...field}
                              className="rounded-r-none border-gray-700 bg-gray-800/50 text-white placeholder:text-gray-500"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              className="rounded-l-none bg-gray-900"
                              onClick={() =>
                                setWeightUnit(weightUnit === "kg" ? "lb" : "kg")
                              }
                            >
                              {weightUnit.toUpperCase()}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-200">
                          <Ruler className="size-4" />
                          Height
                        </FormLabel>
                        <FormControl>
                          <div className="flex">
                            <Input
                              type="number"
                              placeholder="Height"
                              {...field}
                              className="rounded-r-none border-gray-700 bg-gray-800/50 text-white placeholder:text-gray-500"
                            />
                            <Button
                              type="button"
                              variant={"outline"}
                              className="rounded-l-none bg-gray-900"
                              onClick={() =>
                                setHeightUnit(heightUnit === "cm" ? "in" : "cm")
                              }
                            >
                              {heightUnit.toUpperCase()}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="col-span-full flex justify-center pt-4">
                    <Button
                      type="submit"
                      size="lg"
                      className="rounded-full bg-purple-600 px-8 py-6 text-lg text-white transition-all duration-300 hover:scale-105 hover:bg-purple-700"
                      disabled={isLoading}
                    >
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
