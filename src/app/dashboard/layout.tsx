"use client";
import { useGetMe } from "@/hooks/services/auth/useGetMe";
import Link from "next/link";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading } = useGetMe();
  return (
    <div>
      <pre>{isLoading ? "Loading..." : data?.email}</pre>
      <nav className="flex gap-4 [&>a]:text-red-400">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/dashboard/restaurants">Restaurants</Link>
        <Link href="/login">Login</Link>
      </nav>
      {children}
    </div>
  );
};

export default Layout;
