import AppLogo from "@/components/atoms/AppLogo";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col gap-4 h-screen w-screen bg-purple-700 items-center justify-center">
      <AppLogo />
      {children}
    </div>
  );
};

export default AuthLayout;
