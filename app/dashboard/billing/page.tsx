import DashboardWrapper from "@/components/dashboard/wrapper";
import { getBilling } from "@/server/billing";

export default async function BillingPage() {
  const allPurchases = await getBilling();

  return (
    <DashboardWrapper
      breadcrumb={[{ title: "Billing", href: "/dashboard/billing" }]}
    >
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Billing</h1>
        {allPurchases.length === 0 && (
          <p className="text-sm text-gray-500">
            You have not made any purchases yet.
          </p>
        )}
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
