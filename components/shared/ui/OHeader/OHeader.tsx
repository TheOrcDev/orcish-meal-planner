"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

export default function OHeader() {
  const { data: session, status } = useSession();

  return (
    <header className="p-5 flex items-center justify-between">
      <Image
        width={50}
        height={50}
        src={"/orcish-ai-nextjs-framework.png"}
        alt="Orcish AI NextJS Framework"
      />

      {status === "authenticated" ? (
        <div className="flex">
          <button onClick={() => signOut()}>Sign out</button>
          <div className="p-5 rounded-full">{session?.user?.name}</div>
        </div>
      ) : (
        <a href="/api/auth/signin">login</a>
      )}
    </header>
  );
}