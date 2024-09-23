"use client";

import Link from "next/link";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

import { trpc } from "@/server/client";
import { Badge, Button } from "@/components/ui";

export default function UserInfo() {
  const tokens = trpc.tokens.getTokens.useQuery();
  const { resolvedTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <SignedOut>
        <Button variant={"outline"} asChild>
          <SignInButton />
        </Button>
      </SignedOut>

      <SignedIn>
        <Link href={"/my-meal-plans"}>
          <Button variant={"outline"}>My Meal Plans</Button>
        </Link>
        <Link href={"/buy-tokens"}>
          <Badge className={`${tokens?.data === 0 && "bg-destructive"}`}>
            {tokens?.data} tokens
          </Badge>
        </Link>

        <UserButton
          appearance={{
            baseTheme: resolvedTheme === "dark" ? dark : undefined,
          }}
        />
      </SignedIn>
    </div>
  );
}
