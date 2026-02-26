import React from "react";
// Import your sections from (root)/components
import ClientDashboard from "./dashboard/page";
import ClientProfile from "./profile/page";

export default function LandingPage() {
  return (
    <div>
      <main>
        <section id="dashboard"><ClientDashboard /></section>
        <section id="profile"><ClientProfile /></section>

      </main>
    </div>
  );
}
