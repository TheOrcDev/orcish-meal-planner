"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { AuroraBackground } from "@/components/ui/aurora-background/aurora-background";
import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header/header";

export default function Home() {
  return (
    <>
      <Header />
      <AuroraBackground>
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative flex flex-col items-center justify-center gap-4 px-4"
        >
          <Link href={"/dashboard/meal-planner"}>
            <Image
              src={"/images/healthy-food.png"}
              width={400}
              height={400}
              alt="Meal Planner Healthy Food"
              priority
              className="rounded-full transition-all duration-700 hover:scale-105"
            />
          </Link>
          <div className="text-center text-3xl font-bold dark:text-white md:text-7xl">
            Your personal chef & nutritionist
          </div>
          <div className="py-4 text-base font-extralight dark:text-neutral-200 md:text-4xl">
            Transform your eating habits.
          </div>
          <Link href={"/dashboard/meal-planner"}>
            <Button className="w-fit rounded-full bg-primary px-4 py-2">
              Get 5 Free Meal Plans Now
            </Button>
          </Link>
        </motion.div>
      </AuroraBackground>
    </>
  );
}
