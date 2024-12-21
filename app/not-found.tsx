import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "404 | Horde Web Solutions",
};

export default function NotFound() {
  return (
    <div className="grid h-screen w-full place-content-center gap-5 bg-background px-4 text-center">
      <Image
        src={"/meal-planner.png"}
        width={300}
        height={300}
        alt="Meal Planner 404"
      />

      <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">Uh-oh!</h1>

      <p className="text-gray-500">You are lost.</p>
      <Link href={"/"}>
        <Button variant={"outline"}>Return to Home Page</Button>
      </Link>
    </div>
  );
}
