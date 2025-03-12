"use client";

import { ArrowLeftIcon } from "@radix-ui/react-icons";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

interface Props {
  back: () => void;
}

export default function PaymentForm({ back }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  async function onSubmit(event: React.FormEvent) {
    setIsLoading(true);

    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (result.error) {
      console.log(result.error.message);
    }

    if (result.paymentIntent?.status === "succeeded") {
      router.push(
        `/dashboard/order-complete/${result.paymentIntent.id}/${result.paymentIntent.client_secret}`
      );
    }

    setIsLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <Button variant={"outline"} onClick={back}>
        <ArrowLeftIcon className="size-5" />
        Back
      </Button>
      <PaymentElement options={{ layout: "accordion" }} />
      <Button variant={"outline"} type="submit" disabled={isLoading}>
        {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Buy Tokens"}
      </Button>
    </form>
  );
}
