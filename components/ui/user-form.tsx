"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2, Ruler, Weight } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { userSchema } from "@/server/schemas";
import { updateProfile } from "@/server/users";

interface UserFormProps {
  defaultValues?: z.infer<typeof userSchema>;
}

export default function UserForm({ defaultValues }: UserFormProps) {
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");
  const [heightUnit, setHeightUnit] = useState<"cm" | "in">("cm");
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: defaultValues,
  });

  async function onSubmit(values: z.infer<typeof userSchema>) {
    try {
      setLoading(true);
      values.heightUnit = heightUnit;
      values.weightUnit = weightUnit;

      const { errors, values: updateProfileValues } = await updateProfile(
        values
      );

      if (errors) {
        toast.error(errors.message);
        return;
      }

      toast.success(updateProfileValues?.text);
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Fill in your personal information for best results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full Name" type="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Your date of birth is used to calculate your age.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      className="flex flex-col space-y-1 mt-1"
                      defaultValue={field.value}
                    >
                      {[
                        ["Male", "male"],
                        ["Female", "female"],
                        ["Other", "other"],
                      ].map((option, index) => (
                        <FormItem
                          className="flex items-center space-x-3 space-y-0"
                          key={index}
                        >
                          <FormControl>
                            <RadioGroupItem value={option[1]} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {option[0]}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
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
                    <Textarea
                      placeholder="Some allergies or food that you don't like"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-6">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-muted-foreground">
                      <Weight className="size-4" />
                      Weight
                    </FormLabel>
                    <FormControl>
                      <div className="flex">
                        <Input
                          type="number"
                          placeholder="Weight"
                          value={field.value || ""}
                          className="rounded-r-none"
                          onChange={(e) => {
                            field.onChange(Number(e.target.value));
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-l-none h-10"
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
                    <FormLabel className="flex items-center gap-2 text-muted-foreground">
                      <Ruler className="size-4" />
                      Height
                    </FormLabel>
                    <FormControl>
                      <div className="flex">
                        <Input
                          value={field.value || ""}
                          type="number"
                          placeholder="Height"
                          className="rounded-r-none"
                          onChange={(e) => {
                            field.onChange(Number(e.target.value));
                          }}
                        />
                        <Button
                          type="button"
                          variant={"outline"}
                          className="rounded-l-none h-10"
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
            </div>
            <Button disabled={loading} type="submit">
              {loading ? <Loader2 className="size-4 animate-spin" /> : "Update"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
