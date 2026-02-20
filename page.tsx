import React from "react";
// Import your sections from (root)/components
import Profile from "./app/(admin)/admin/profile/page";
import Dashboard from "./app/(admin)/admin/dashboard/page";

export default function AdminPage() {
  return (
    <div>
      <main>
        <section id="Dashboard"><Dashboard /></section>
        <section id="Profile"><Profile /></section>

      </main>
    </div>
  );
}
