import Link from "next/link";
import { Suspense } from "react";

import DashboardWrapper from "@/components/dashboard/wrapper";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/loading/loading";
import { getPaymentIntent } from "@/server/tokens";

interface PageProps {
  params: Promise<{
    paymentIntentString: string;
    paymentIntentSecret: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { paymentIntentString, paymentIntentSecret } = await params;

  const paymentIntent = await getPaymentIntent(
    paymentIntentString,
    paymentIntentSecret
  );

  return (
    <DashboardWrapper
      breadcrumb={[
        { title: "Order Complete", href: "/dashboard/order-complete" },
      ]}
    >
      <main className="flex flex-col items-center justify-center gap-10 p-24">
        <h2>Congratulations!</h2>

        <Suspense fallback={<Loading />}>
          <div className="flex flex-col items-center justify-center gap-5">
            <h2>You have successfully bought {paymentIntent} tokens!</h2>
            <Link href={"/meal-planner"}>
              <Button>Go and use your tokens!</Button>
            </Link>
          </div>
        </Suspense>
      </main>
    </DashboardWrapper>
  );
}
