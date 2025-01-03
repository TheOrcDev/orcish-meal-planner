"use client";

import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

import DashboardWrapper from "@/components/dashboard/wrapper";

export default function AccountPage() {
  const { resolvedTheme } = useTheme();
  return (
    <DashboardWrapper
      breadcrumb={[{ title: "Account", href: "/dashboard/account" }]}
    >
      <div className="flex items-center justify-center">
        <UserProfile
          appearance={{
            baseTheme: resolvedTheme === "dark" ? dark : undefined,
          }}
        />
      </div>
    </DashboardWrapper>
  );
}
