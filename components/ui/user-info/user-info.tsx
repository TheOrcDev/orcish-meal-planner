import Link from "next/link";

import { getTokens } from "@/server/tokens";

import { Badge } from "../badge";
import { Button } from "../button";

export default async function UserInfo() {
  const tokens = await getTokens();

  return (
    <div className="flex items-center gap-2">
      <Button variant={"outline"} asChild></Button>

      <Link href={"/dashboard/my-meal-plans"}>
        <Button variant={"outline"}>My Meal Plans</Button>
      </Link>
      <Link href={"/dashboard/buy-tokens"}>
        <Badge className={`${tokens === 0 && "bg-destructive"} text-base`}>
          {tokens} tokens
        </Badge>
      </Link>
    </div>
  );
}
