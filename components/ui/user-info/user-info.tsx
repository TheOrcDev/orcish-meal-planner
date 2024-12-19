import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

import { Badge, Button, Skeleton } from "@/components/ui";
import { getTokens } from "@/server/tokens";

import ClerkButton from "../clerk-button/clerk-button";

export default async function UserInfo() {
  const tokens = await getTokens();

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
          <Badge className={`${tokens === 0 && "bg-destructive"} text-base`}>
            {tokens} tokens
          </Badge>
        </Link>

        <ClerkButton />
      </SignedIn>
    </div>
  );
}
