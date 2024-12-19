"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { NotEnoughTokens } from "@/components/features";
import { CompletionModel } from "@/components/shared/types";
import {
  Button,
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
  Skeleton,
  Textarea,
} from "@/components/ui";
import { trpc } from "@/server/client";
import { mealPlannerSchema } from "@/server/schemas";

import { Diet, Goal } from ".";

const goals = Object.values(Goal);
const diets = Object.values(Diet);

export default function CreateMealPlanForm() {
  const router = useRouter();
  const [notEnoughTokens, setNotEnoughTokens] = useState<boolean>(false);

  const getCompletion = trpc.ai.getMealPlan.useMutation();
  const utils = trpc.useUtils();

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
      const completion = await getCompletion.mutateAsync({
        ...values,
        model: CompletionModel.GPT_3_5_TURBO,
        mealPlannerType: "daily",
      });

      if (completion === "Not enough tokens") {
        setNotEnoughTokens(true);
        return;
      }

      utils.tokens.getTokens.refetch();

      router.push(`/meal-plan/${completion.id}`);
    } catch (e) {
      console.error("Error fetching AI completion:", e);
      throw e;
    }
  }

  return (
    <main className="flex flex-col items-center justify-center gap-5 p-24">
      {getCompletion.isPending && (
        <div className="grid gap-5 md:grid-cols-2">
          <Skeleton className="h-52 w-96 rounded-xl" />
          <Skeleton className="h-52 w-96 rounded-xl" />
          <Skeleton className="h-52 w-96 rounded-xl" />
          <Skeleton className="h-52 w-96 rounded-xl" />
        </div>
      )}

      {notEnoughTokens && <NotEnoughTokens />}

      {!getCompletion.isPending && !notEnoughTokens && (
        <div className="flex flex-col items-center justify-center gap-5">
          <p className="w-1/2 text-center">
            Please take a moment to fill out this form so we can tailor your
            experience and provide you with the most personalized and effective
            results possible. Let&apos;s get started on your journey to BE
            HEALTHY!
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid w-full gap-5 md:w-1/2 md:grid-cols-2"
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
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>gender</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Your gender" />
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
                          {goals.map((goal) => (
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
                          {diets.map((diet) => (
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

              <div className="col-span-full flex w-full justify-center">
                <FormField
                  control={form.control}
                  name="allergies"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Allergies</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Some allergies or food that you don't like"
                          {...field}
                          rows={5}
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
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-2"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="kg" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Kilograms (kg)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="lb" />
                          </FormControl>
                          <FormLabel className="font-normal">
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
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-2"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="cm" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Centimeters (cm)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="in" />
                          </FormControl>
                          <FormLabel className="font-normal">
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
                    <FormLabel>Weight</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Weight" {...field} />
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
                    <FormLabel>Height</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Height" {...field} />
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
        </div>
      )}
    </main>
  );
}
