import DashboardWrapper from "@/components/dashboard/wrapper";
import { getBilling } from "@/server/billing";

export default async function BillingPage() {
  const allPurchases = await getBilling();

  return (
    <DashboardWrapper
      breadcrumb={[{ title: "Billing", href: "/dashboard/billing" }]}
    >
      <div className="flex flex-col gap-4">
        {allPurchases.map((purchase) => (
          <div key={purchase.id}>
            You bought {purchase.amount} tokens on{" "}
            {purchase.createdAt.toLocaleDateString()}
          </div>
        ))}
      </div>
    </DashboardWrapper>
  );
}
