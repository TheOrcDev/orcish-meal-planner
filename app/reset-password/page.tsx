import Image from "next/image";
import { Suspense } from "react";

import { ResetPasswordForm } from "@/components/reset-password-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function ResetPasswordPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <Image
              width={50}
              height={50}
              src={"/meal-planner.png"}
              alt="Meal Planner Logo"
              priority
            />
          </div>
          Meal Planner
        </a>
        <Suspense fallback={<Skeleton className="h-72 w-full" />}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
