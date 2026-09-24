import { AppSidebar } from "@/components/organisms/AppSidebar";
import { DashboardBreadcrumb } from "@/components/molecules/DashboardBreadcrumb";
import { RestaurantSwitcher } from "@/components/molecules/RestaurantSwitcher";
import { NavUser } from "@/components/nav-user";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import React, { Suspense } from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <Suspense>
        <AppSidebar />
      </Suspense>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background px-4 lg:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Suspense>
              <DashboardBreadcrumb />
            </Suspense>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <RestaurantSwitcher />
            <NavUser />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-6 lg:p-6 lg:pt-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
