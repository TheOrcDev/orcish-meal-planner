import Image from "next/image";
import Link from "next/link";

import { ModeToggle } from "../mode-toggle/mode-toggle";
import UserInfo from "../user-info/user-info";

export default function Header() {
  return (
    <header className="absolute z-10 flex w-full items-center justify-between px-5 py-2">
      <Link href={"/"} className="flex items-center gap-3">
        <Image
          width={50}
          height={50}
          src={"/meal-planner.png"}
          alt="Meal Planner Logo"
          priority
        />
        <h1 className="hidden text-2xl font-bold md:block">Meal Planner</h1>
      </Link>

      <div className="flex gap-3">
        <ModeToggle />
        <UserInfo />
      </div>
    </header>
  );
}
