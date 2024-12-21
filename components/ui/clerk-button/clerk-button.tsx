"use client";

import { ClerkLoading } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

import { Skeleton } from "../skeleton";

export default function ClerkButton() {
  const { resolvedTheme } = useTheme();

  return (
    <>
      <ClerkLoading>
        <Skeleton className="size-8 rounded-full" />
      </ClerkLoading>
      <UserButton
        appearance={{
          baseTheme: resolvedTheme === "dark" ? dark : undefined,
        }}
      />
    </>
  );
}
