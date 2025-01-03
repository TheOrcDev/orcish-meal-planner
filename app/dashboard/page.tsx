import Image from "next/image";

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-center gap-5 p-4 md:p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <h3>Awesome dashboard coming soon</h3>
      <Image src="/meal-planner.png" alt="Dashboard" width={500} height={500} />
    </main>
  );
}
