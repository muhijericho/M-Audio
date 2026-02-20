// app/admin/layout.tsx
import AdminSidebar from "@/app/components/AdminSidebar";
import React, { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div style={layoutStyle}>
      <AdminSidebar />
      <main style={mainContentStyle}>{children}</main>
    </div>
  );
}

const layoutStyle: React.CSSProperties = {
  display: "flex",
  minHeight: "100vh",
};

const mainContentStyle: React.CSSProperties = {
  flexGrow: 1,
  backgroundColor: "#f4f6f9",
  padding: "2rem 3rem",
  marginLeft: "240px", // matches the fixed sidebar width
  minHeight: "100vh",
  overflowY: "auto",
};