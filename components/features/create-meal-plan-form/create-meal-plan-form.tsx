"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Leaf, Loader2 } from "lucide-react";
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
  RadioGroup,
  RadioGroupItem,
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

  const form = useForm<z.infer<typeof mealPlannerSchema>>({
    resolver: zodResolver(mealPlannerSchema),
    defaultValues: {
      age: 18,
      goal: Goal.HEALTHY,
      meals: 2,
      gender: "male",
      diet: Diet.ANY,
      weightUnit: "kg",
      heightUnit: "cm",
      allergies: "",
    },
  });

  async function onSubmit(values: z.infer<typeof mealPlannerSchema>) {
    try {
      setIsLoading(true);
      const completion = await getMealPlan(values, "daily");

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
    <div className="flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 p-24">
      <Card className="w-full max-w-2xl border-gray-800 bg-gray-900/50">
        <CardContent className="space-y-8 p-6">
          {notEnoughTokens && <NotEnoughTokens />}

          {!notEnoughTokens && (
            <div className="flex flex-col items-center justify-center gap-5">
              <div className="space-y-2 text-center">
                <h1 className="text-2xl font-semibold text-white">
                  Start Your Health Journey
                </h1>
                <p className="mx-auto max-w-xl text-sm text-gray-400">
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
                        <FormLabel className="text-gray-200">Age</FormLabel>
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
                        <FormLabel className="text-gray-200">
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
                        <FormLabel className="text-gray-200">Gender</FormLabel>
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
                        <FormLabel className="text-gray-200">Goal</FormLabel>
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
                        <FormLabel className="text-gray-200">Diet</FormLabel>
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
                          <FormLabel className="text-gray-200">
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
                    name="weightUnit"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-gray-200">
                          Weight Unit
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex gap-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem
                                  value="kg"
                                  className="border-purple-600"
                                />
                              </FormControl>
                              <FormLabel className="font-normal text-gray-300">
                                Kilograms (kg)
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem
                                  value="lb"
                                  className="border-purple-600"
                                />
                              </FormControl>
                              <FormLabel className="font-normal text-gray-300">
                                Pounds (lb)
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="heightUnit"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-gray-200">
                          Height Unit
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex gap-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem
                                  value="cm"
                                  className="border-purple-600"
                                />
                              </FormControl>
                              <FormLabel className="font-normal text-gray-300">
                                Centimeters (cm)
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem
                                  value="in"
                                  className="border-purple-600"
                                />
                              </FormControl>
                              <FormLabel className="font-normal text-gray-300">
                                Inches (in)
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Weight</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Weight"
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
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Height</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Height"
                            {...field}
                            className="border-gray-700 bg-gray-800/50 text-white placeholder:text-gray-500"
                          />
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
