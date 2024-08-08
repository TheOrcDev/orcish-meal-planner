"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { trpc } from "@/server/client";
import { Badge } from "@/components/ui";
import Link from "next/link";

export default function UserInfo() {
  const tokens = trpc.tokens.getTokens.useQuery();

  return (
    <div className="flex items-center gap-2">
      <Link href={"/buy-tokens"}>
        <Badge>{tokens?.data} tokens</Badge>
      </Link>

      <SignedOut>
        <SignInButton />
      </SignedOut>

      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}
