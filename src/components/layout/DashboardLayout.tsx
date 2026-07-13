import AppSidebar from "@/components/organisms/AppSidebar";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex max-w-screen h-screen overflow-hidden">
      <AppSidebar />
      <main className="flex-1 p-6 bg-[#F5F5F5] overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
