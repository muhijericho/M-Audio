"use client";
import ClientSidebar from "@/app/components/ClientSidebar";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/client/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <ClientSidebar />
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