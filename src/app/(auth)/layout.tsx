"use client";
import AuthLayout from "@/components/layout/AuthLayout";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <AuthLayout>{children}</AuthLayout>;
};

export default Layout;
