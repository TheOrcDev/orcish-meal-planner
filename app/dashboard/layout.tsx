import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getTokens } from "@/server/tokens";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tokens = await getTokens();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
