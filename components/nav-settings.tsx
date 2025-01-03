"use client";

import { type LucideIcon } from "lucide-react";
import Link from "next/link";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function NavSettings({
  settings,
}: {
  settings: {
    name: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
  }[];
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Settings</SidebarGroupLabel>
      <SidebarMenu>
        {settings.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link
                href={item.url}
                className={cn(item.isActive && "bg-gray-100 dark:bg-gray-800")}
              >
                <item.icon />
                <span>{item.name}</span>
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
