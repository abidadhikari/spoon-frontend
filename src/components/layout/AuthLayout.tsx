import AppLogo from "@/components/atoms/AppLogo";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-muted/50 px-4">
      <AppLogo />
      {children}
    </div>
  );
};

export default AuthLayout;
