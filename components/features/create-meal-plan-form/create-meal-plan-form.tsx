"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { trpc } from "@/server/client";
import { Goal, Diet } from ".";

import { CompletionModel } from "@/components/shared/types";
import { NotEnoughTokens } from "@/components/features";

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
import { useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();
  const router = useRouter();

  const type = searchParams.get("type");

  const [mealPlannerType, setMealPlannerType] = useState<"daily" | "weekly">(
    type === "daily" || type === "weekly" ? type : "daily"
  );
  const [notEnoughTokens, setNotEnoughTokens] = useState<boolean>(false);

  const getCompletion = trpc.ai.getMealPlan.useMutation();
  const utils = trpc.useUtils();

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const completion = await getCompletion.mutateAsync({
        ...values,
        model: CompletionModel.GPT_3_5_TURBO,
        mealPlannerType,
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
      <div className="flex gap-3">
        <Button
          disabled={mealPlannerType === "daily"}
          onClick={() => setMealPlannerType("daily")}
        >
          Daily
        </Button>
        <Button
          disabled={mealPlannerType === "weekly"}
          onClick={() => setMealPlannerType("weekly")}
        >
          Weekly
        </Button>
      </div>

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
        </div>
      )}
    </main>
  );
}
