"use client";
import AdminSidebar from "@/app/components/AdminSidebar";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <main style={{
        flexGrow: 1,
        backgroundColor: "#4f555d",
        padding: "2rem 3rem",
        marginLeft: "240px",
        minHeight: "100vh",
        overflowY: "auto",
      }}>
        {children}
      </main>
    </div>
  );
}