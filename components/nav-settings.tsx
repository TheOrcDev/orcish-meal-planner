"use client";

import { Coins, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

import { Badge } from "./ui/badge";

export function NavSettings({ tokens }: { tokens: number }) {
  const currentPath = usePathname();

  const settings = [
    {
      name: "Buy Tokens",
      url: "/dashboard/buy-tokens",
      icon: Coins,
      isActive: currentPath === "/dashboard/buy-tokens",
    },
  ];
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Settings</SidebarGroupLabel>
      <SidebarMenu>
        {settings.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link
                href={item.url}
                className={cn(
                  item.isActive && "bg-gray-100 dark:bg-gray-800",
                  "flex items-center justify-between"
                )}
              >
                <div className="flex items-center gap-2">
                  <item.icon className="size-5" />
                  <span>{item.name}</span>
                </div>
                <Badge>{tokens}</Badge>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        {/* <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem> */}
      </SidebarMenu>
    </SidebarGroup>
  );
}
