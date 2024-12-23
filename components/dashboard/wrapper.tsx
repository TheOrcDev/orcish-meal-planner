import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

import { SidebarTrigger } from "../ui/sidebar";

interface DashboardWrapperProps {
  children: React.ReactNode;
  breadcrumb: {
    title: string;
    href: string;
  }[];
}

export default function DashboardWrapper({
  children,
  breadcrumb,
}: DashboardWrapperProps) {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              {breadcrumb.map((item, index) => (
                <div key={item.href} className="flex items-center gap-2">
                  <BreadcrumbItem>
                    {breadcrumb.length > 1 &&
                      breadcrumb.length - 1 !== index && (
                        <BreadcrumbLink href={item.href}>
                          {item.title}
                        </BreadcrumbLink>
                      )}
                    {breadcrumb.length - 1 === index && (
                      <BreadcrumbPage>{item.title}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {breadcrumb.length - 1 !== index && (
                    <BreadcrumbSeparator className="hidden md:block" />
                  )}
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
    </>
  );
}
