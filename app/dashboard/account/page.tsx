import { CalendarDays } from "lucide-react";
import { headers } from "next/headers";

import DashboardWrapper from "@/components/dashboard/wrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/lib/auth";

export default async function AccountPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <DashboardWrapper
      breadcrumb={[{ title: "Account", href: "/dashboard/account" }]}
    >
      <div className="flex flex-col gap-10">
        <h1 className="text-2xl font-bold">Account</h1>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={session?.user?.image || "/placeholder.svg"}
              alt={session?.user?.name}
            />
            <AvatarFallback>
              {session?.user?.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-2xl font-bold">{session?.user?.name}</h1>
            <p className="text-muted-foreground">{session?.user?.email}</p>
            <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-1">
              <CalendarDays className="h-4 w-4" />
              Member since {session?.user?.createdAt?.toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </DashboardWrapper>
  );
}
