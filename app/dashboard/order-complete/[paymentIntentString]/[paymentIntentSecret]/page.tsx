import Link from "next/link";

import DashboardWrapper from "@/components/dashboard/wrapper";
import { Button } from "@/components/ui/button";
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

        <div className="flex flex-col items-center justify-center gap-5">
          <h2>You have successfully bought {paymentIntent} tokens!</h2>
          <Link href={"/dashboard/meal-planner"}>
            <Button>Go and use your tokens!</Button>
          </Link>
        </div>
      </main>
    </DashboardWrapper>
  );
}
