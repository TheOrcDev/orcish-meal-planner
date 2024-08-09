"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { trpc } from "@/server/client";
import { Badge, Button } from "@/components/ui";
import Link from "next/link";

export default function UserInfo() {
  const tokens = trpc.tokens.getTokens.useQuery();

  return (
    <div className="flex items-center gap-2">
      <SignedOut>
        <Button variant={"outline"} asChild>
          <SignInButton />
        </Button>
      </SignedOut>

      <SignedIn>
        <Link href={"/buy-tokens"}>
          <Badge>{tokens?.data} tokens</Badge>
        </Link>

        <UserButton />
      </SignedIn>
    </div>
  );
}
