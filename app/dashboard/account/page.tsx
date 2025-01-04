"use client";

import { useTheme } from "next-themes";

import DashboardWrapper from "@/components/dashboard/wrapper";

export default function AccountPage() {
  const { resolvedTheme } = useTheme();
  return (
    <DashboardWrapper
      breadcrumb={[{ title: "Account", href: "/dashboard/account" }]}
    >
      <div className="flex items-center justify-center">
        {/* <UserProfile
          appearance={{
            baseTheme: resolvedTheme === "dark" ? dark : undefined,
          }}
          routing={"hash"}
        /> */}
        <h1>Account</h1>
      </div>
    </DashboardWrapper>
  );
}
