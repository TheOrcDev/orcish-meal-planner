"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button, Loading } from "@/components/ui";
import { trpc } from "@/server/client";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const [paymentIntentData, setPaymentIntentData] = useState<number | null>(
    null
  );

  const getPaymentIntent = trpc.tokens.getPaymentIntent.useMutation();
  const utils = trpc.useUtils();

  const paymentIntent = searchParams.get("payment_intent");
  const paymentIntentSecret = searchParams.get("payment_intent_client_secret");

  useEffect(() => {
    const getData = async () => {
      if (!paymentIntent || !paymentIntentSecret) {
        return;
      }
      const data = await getPaymentIntent.mutateAsync({
        paymentIntent,
        paymentIntentSecret,
      });

      utils.tokens.getTokens.refetch();
      setPaymentIntentData(data!);
    };

    getData();
    // Disabling ESLint warning - Hooks cannot go in here
  }, []);

  return (
    <main>
      {getPaymentIntent.isPending && <Loading />}

      {paymentIntentData && (
        <div className="flex flex-col items-center justify-center gap-5">
          <h2>You have successfully bought {paymentIntentData} tokens!</h2>
          <Link href={"/meal-planner"}>
            <Button>Go and use your tokens!</Button>
          </Link>
        </div>
      )}
    </main>
  );
}
