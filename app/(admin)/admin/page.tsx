import React from "react";
// Import your sections from (root)/components
import Dashboard from "./dashboard/page";
import Profile from "./profile/page";

export default function LandingPage() {
  return (
    <div>
      <main>
        <section id="dashboard"><Dashboard /></section>
        <section id="Profile"><Profile /></section>

      </main>
    </div>
  );
}
