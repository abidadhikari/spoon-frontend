"use client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useGetMe } from "@/hooks/services/auth/useGetMe";
import Link from "next/link";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading } = useGetMe();
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default Layout;
