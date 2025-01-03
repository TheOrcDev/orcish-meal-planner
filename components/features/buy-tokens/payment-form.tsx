"use client";

import { ArrowLeftIcon } from "@radix-ui/react-icons";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

interface Props {
  back: () => void;
}

export default function PaymentForm({ back }: Props) {
  const router = useRouter();

  const stripe = useStripe();
  const elements = useElements();

  async function onSubmit(event: React.FormEvent) {
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
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <Button variant={"outline"} onClick={back}>
        <ArrowLeftIcon className="size-5" />
        Back
      </Button>
      <PaymentElement options={{ layout: "accordion" }} />
      <Button variant={"outline"} type="submit">
        Buy Tokens
      </Button>
    </form>
  );
}
