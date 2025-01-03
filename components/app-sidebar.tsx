"use client";

import { Coins, ForkKnife } from "lucide-react";
import { usePathname } from "next/navigation";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavSettings } from "@/components/nav-settings";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const currentPath = usePathname();

  const data = {
    navMain: [
      {
        title: "Meal Plans",
        url: "/dashboard/meal-planner",
        icon: ForkKnife,
        isActive: true,
        items: [
          {
            title: "New Meal Plan",
            url: "/dashboard/meal-planner",
            isActive: currentPath === "/dashboard/meal-planner",
          },
          {
            title: "All Plans",
            url: "/dashboard/my-meal-plans",
            isActive: currentPath === "/dashboard/my-meal-plans",
          },
        ],
      },
    ],
    settings: [
      {
        name: "Buy Tokens",
        url: "/dashboard/buy-tokens",
        icon: Coins,
        isActive: currentPath === "/dashboard/buy-tokens",
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSettings settings={data.settings} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
