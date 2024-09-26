"use client";

import { AuroraBackground, Button } from "@/components/ui";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
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
        <Image
          src={"/images/healthy-food.png"}
          width={400}
          height={400}
          alt="Meal Planner Healthy Food"
        />
        <div className="text-center text-3xl font-bold dark:text-white md:text-7xl">
          Your personal chef & nutritionist
        </div>
        <div className="py-4 text-base font-extralight dark:text-neutral-200 md:text-4xl">
          Transform your eating habits.
        </div>
        <Link href={"/meal-planner"}>
          <Button className="w-fit rounded-full bg-black px-4 py-2 text-white dark:bg-white dark:text-black">
            Create Your Meal Plan Now
          </Button>
        </Link>
      </motion.div>
    </AuroraBackground>
  );
}
