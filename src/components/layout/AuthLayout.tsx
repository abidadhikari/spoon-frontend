import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-screen bg-red-400 items-center justify-center">
      {children}
    </div>
  );
};

export default AuthLayout;
