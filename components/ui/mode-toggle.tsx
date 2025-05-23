"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const itemVariants = {
  closed: { opacity: 0, y: 10 },
  open: { opacity: 1, y: 0 },
};

const menuItemVariants = {
  closed: { opacity: 0, x: -10 },
  open: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
    },
  }),
};

const menuTransition = {
  type: "spring",
  stiffness: 300,
  damping: 25,
};

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="w-10 h-10 relative overflow-hidden"
        >
          <motion.div
            key="sun"
            initial={{ rotate: 0, scale: 1, opacity: 1 }}
            animate={{
              rotate: theme === "dark" ? 90 : 0,
              scale: theme === "dark" ? 0 : 1,
              opacity: theme === "dark" ? 0 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute"
          >
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          </motion.div>
          <motion.div
            key="moon"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{
              rotate: theme === "dark" ? 0 : 90,
              scale: theme === "dark" ? 1 : 0,
              opacity: theme === "dark" ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute"
          >
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          </motion.div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent asChild align="end" className="w-32 p-1.5">
        <motion.div
          initial="closed"
          animate="open"
          exit="closed"
          variants={{
            open: {
              transition: {
                staggerChildren: 0.05,
              },
            },
          }}
        >
          <motion.div variants={itemVariants}>
            <DropdownMenuItem
              onClick={() => setTheme("light")}
              className="cursor-pointer rounded-md px-2 py-1.5"
            >
              <Sun className="mr-2 h-4 w-4" />
              <span>Light</span>
            </DropdownMenuItem>
          </motion.div>
          <motion.div variants={itemVariants}>
            <DropdownMenuItem
              onClick={() => setTheme("dark")}
              className="cursor-pointer rounded-md px-2 py-1.5"
            >
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark</span>
            </DropdownMenuItem>
          </motion.div>
          <motion.div variants={itemVariants}>
            <DropdownMenuItem
              onClick={() => setTheme("system")}
              className="cursor-pointer rounded-md px-2 py-1.5"
            >
              <Monitor className="mr-2 h-4 w-4" />
              <span>System</span>
            </DropdownMenuItem>
          </motion.div>
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

}
