import Link from "next/link";
import React from "react";

const AppSidebar = () => {
  return (
    <aside className="w-64 h-screen bg-white  text-white shadow-2xl p-4">
      <nav className="flex flex-col gap-4 [&>a]:text-red-400">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/dashboard/restaurants">Restaurants</Link>
        <Link href="/login">Login</Link>
      </nav>
    </aside>
  );
};

export default AppSidebar;
