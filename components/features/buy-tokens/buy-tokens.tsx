"use client";

import React, { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import getStripe from "@/lib/stripe";
import PaymentForm from "./payment-form";

import { trpc } from "@/server/client";

import { Tokens } from "@/components/shared/types";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Loading,
} from "@/components/ui";

import { CheckCircledIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

export default function BuyTokens() {
  const stripePromise = getStripe();
  const createClientSecret = trpc.tokens.getClientSecret.useMutation();

  const { resolvedTheme } = useTheme();

  const [paymentIntentSecret, setPaymentIntentSecret] = useState("");
  const [showPayment, setShowPayment] = useState<boolean>(false);

  const buyTokens = async (bundle: Tokens) => {
    const clientSecret = await createClientSecret.mutateAsync({
      tokens: bundle,
    });

    if (!clientSecret) {
      console.log("No client secret");
      return;
    }

    setPaymentIntentSecret(clientSecret);
    setShowPayment(true);
  };

  return (
    <>
      {!showPayment && !createClientSecret.isPending && (
        <>
          <div className="grid w-full gap-5 md:grid-cols-2 lg:px-20 xl:grid-cols-3">
            <Card className="cursor-pointer transition duration-300 ease-in-out hover:bg-primary/10">
              <CardHeader>
                <CardTitle>Cheapest</CardTitle>
                <CardDescription>1$</CardDescription>
              </CardHeader>
              <CardContent className="md:min-h-96">
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-1 text-xl">
                    <CheckCircledIcon className="size-5 text-primary" /> 10
                    tokens
                  </div>
                  <p>
                    Looking to try out our meal planner or just need a quick
                    boost? The Cheapest option is perfect for you! For just $1,
                    you’ll get 10 tokens to start crafting your personalized
                    meal plans.
                  </p>
                  <p>
                    It&apos;s an affordable way to explore our features and see
                    how much you can accomplish. Perfect for those who want to
                    dip their toes in without a big commitment.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => buyTokens(Tokens.TEN)}>
                  Get 10 Tokens
                </Button>
              </CardFooter>
            </Card>

            <Card className="cursor-pointer transition duration-300 ease-in-out hover:bg-primary/10">
              <CardHeader>
                <CardTitle>Efficent</CardTitle>
                <CardDescription>3.5$</CardDescription>
              </CardHeader>
              <CardContent className="md:min-h-96">
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-1 text-xl">
                    <CheckCircledIcon className="size-5 text-primary" /> 50
                    tokens
                  </div>
                  <p>
                    Get more bang for your buck with our Efficient package! For
                    only $3.50, you’ll receive 50 tokens, giving you the
                    flexibility to create a wide range of meal plans.
                  </p>
                  <p>
                    This option is ideal for regular users who want a
                    cost-effective way to maintain their healthy eating habits.
                    Maximize your meal planning without breaking the
                    bank—perfect for those who are serious about their
                    nutrition.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => buyTokens(Tokens.FIFTY)}>
                  Get 50 Tokens
                </Button>
              </CardFooter>
            </Card>

            <Card className="cursor-pointer transition duration-300 ease-in-out hover:bg-primary/10">
              <CardHeader>
                <CardTitle>Best Deal</CardTitle>
                <CardDescription>6$</CardDescription>
              </CardHeader>
              <CardContent className="md:min-h-96">
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-1 text-xl">
                    <CheckCircledIcon className="size-5 text-primary" /> 100
                    tokens
                  </div>
                  <p>
                    Ready to go all in? The Best Deal offers incredible value
                    with 100 tokens for just $6! This package is perfect for
                    meal planning enthusiasts who want the freedom to create as
                    many customized plans as they need.
                  </p>
                  <p>
                    Whether you&apos;re planning for a family, special diet, or
                    just love having options, this is the ultimate choice.
                    Invest in your health with the best deal we offer and unlock
                    endless possibilities!
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => buyTokens(Tokens.HUNDRED)}>
                  Get 100 Tokens
                </Button>
              </CardFooter>
            </Card>
          </div>
        </>
      )}

      {createClientSecret.isPending && <Loading />}

      {paymentIntentSecret && showPayment && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: paymentIntentSecret,
            appearance: {
              theme: resolvedTheme === "dark" ? "night" : "flat",
            },
          }}
        >
          <PaymentForm back={() => setShowPayment(false)} />
        </Elements>
      )}
    </>
  );
}
