"use client";

import { Coins, ForkKnife } from "lucide-react";
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

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Meal Plans",
      url: "/dashboard/meal-planner",
      icon: ForkKnife,
      isActive: true,
      items: [
        {
          title: "All Plans",
          url: "/dashboard/my-meal-plans",
        },
        {
          title: "Favorites",
          url: "/dashboard/favorites",
        },
      ],
    },
  ],
  settings: [
    {
      name: "Buy Tokens",
      url: "/dashboard/buy-tokens",
      icon: Coins,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
