import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <Link href="/login" className="absolute top-5 left-5">
        <Button variant="ghost">
          <ChevronLeft />
          back
        </Button>
      </Link>

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
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
