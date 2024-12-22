import DashboardWrapper from "@/components/dashboard/wrapper";
import { BuyTokens } from "@/components/features";

export default async function BuyTokensPage() {
  return (
    <DashboardWrapper
      breadcrumb={[{ title: "Buy Tokens", href: "/dashboard/buy-tokens" }]}
    >
      <main className="flex flex-col items-center justify-center gap-10">
        <BuyTokens />
      </main>
    </DashboardWrapper>
  );
}
