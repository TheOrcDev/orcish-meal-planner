import Image from "next/image";
import { ModeToggle } from "../mode-toggle/mode-toggle";
import Link from "next/link";
import UserInfo from "../user-info/user-info";

export default function Header() {
  return (
    <header className="absolute z-10 flex w-full items-center justify-between p-5">
      <Link href={"/"}>
        <Image
          width={50}
          height={50}
          src={"/orcish-meal-planner.png"}
          alt="Orcish AI NextJS Framework"
          priority
        />
      </Link>

      <div className="flex gap-3">
        <ModeToggle />
        <UserInfo />
      </div>
    </header>
  );
}
