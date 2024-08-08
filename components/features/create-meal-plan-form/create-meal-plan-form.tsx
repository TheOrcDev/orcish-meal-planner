"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { trpc } from "@/server/client";
import { Goal, Diet } from ".";
import { getPrompt } from "./prompt";

import { CompletionModel, Meal } from "@/components/shared/types";
import { MealPlan, NotEnoughTokens } from "@/components/features";

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
  Skeleton,
  Textarea,
} from "@/components/ui";

const goals = Object.values(Goal);
const diets = Object.values(Diet);

export const formSchema = z.object({
  age: z.coerce.number().min(1).max(100),
  goal: z.nativeEnum(Goal),
  meals: z.coerce.number().min(2).max(12),
  sex: z.enum(["male", "female"]),
  diet: z.nativeEnum(Diet),
  allergies: z.string(),
});

export default function CreateMealPlanForm() {
  const [aiResult, setAiResult] = useState<Meal[] | null>(null);
  const [notEnoughTokens, setNotEnoughTokens] = useState<boolean>(false);

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
    try {
      const prompt = getPrompt(values);

      const completion = await getCompletion.mutateAsync({
        prompt,
        model: CompletionModel.GPT_3_5_TURBO,
      });

      if (completion === "Not enough tokens") {
        setNotEnoughTokens(true);
        return;
      }

      setAiResult(JSON.parse(completion));
    } catch (e) {
      console.error("Error fetching AI completion:", e);
      throw e;
    }
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
        <MealPlan meals={aiResult} back={() => setAiResult(null)} />
      )}

      {notEnoughTokens && <NotEnoughTokens />}

      {!aiResult && !getCompletion.isPending && !notEnoughTokens && (
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
            <div className="col-span-full flex w-full justify-center">
              <Button type="submit">Get your meal plan!</Button>
            </div>
          </form>
        </Form>
      )}
    </main>
  );
}
