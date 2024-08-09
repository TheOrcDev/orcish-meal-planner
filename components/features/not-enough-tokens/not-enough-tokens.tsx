import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import Link from "next/link";

export default function NotEnoughTokens() {
  return (
    <Card className="min-w-96">
      <CardHeader>
        <CardTitle>Not enough tokens :(</CardTitle>
        <CardDescription>
          You need at least one token to make your meal plan.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <p>
          Ready to unlock more? Get tokens now and start crafting your awesome
          meal plans!
        </p>
        <Link href={"/buy-tokens"}>
          <Button>Buy Now!</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
