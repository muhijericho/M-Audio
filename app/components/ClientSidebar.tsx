// app/components/AdminSidebar.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
    {
    href: "/client/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    href: "/client/booking",
    label: "Bookings",
    icon: (
         <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
           <path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" />
           <path d="M3 10h18" /><path d="m9 16 2 2 4-4" />
         </svg>
    ),
  },
  {
    href: "/client/profile",
    label: "Profile",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function ClientSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600&display=swap');

        .m-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: 240px;
          height: 100vh;
          background: #05050a;
          display: flex;
          flex-direction: column;
          z-index: 100;
          border-right: 1px solid rgba(255, 80, 0, 0.12);
          overflow: hidden;
        }

        /* Subtle orange glow top-left */
        .m-sidebar::before {
          content: '';
          position: absolute;
          top: -80px;
          left: -80px;
          width: 260px;
          height: 260px;
          background: radial-gradient(circle, rgba(255,80,0,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Header */
        .m-sidebar-header {
          padding: 1.75rem 1.5rem 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .m-sidebar-logo-icon {
          width: 34px;
          height: 34px;
          background: linear-gradient(135deg, #ff5000, #ff2d55);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(255,80,0,0.4);
        }

        .m-sidebar-logo-text {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.35rem;
          letter-spacing: 0.08em;
          color: #fff;
          line-height: 1;
        }

        .m-sidebar-logo-text span {
          color: #ff5000;
        }

        .m-sidebar-logo-sub {
          font-family: 'Barlow', sans-serif;
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          margin-top: 2px;
        }

        /* Nav */
        .m-sidebar-nav {
          flex: 1;
          padding: 1.25rem 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          overflow-y: auto;
        }

        .m-sidebar-section {
          font-family: 'Barlow', sans-serif;
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
          padding: 0.5rem 0.75rem 0.4rem;
          margin-top: 0.5rem;
        }

        .m-sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.7rem 0.9rem;
          border-radius: 8px;
          color: rgba(255,255,255,0.45);
          text-decoration: none;
          font-family: 'Barlow', sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          transition: all 0.2s ease;
          position: relative;
        }

        .m-sidebar-link:hover {
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.05);
        }

        .m-sidebar-link.active {
          color: #fff;
          background: rgba(255, 80, 0, 0.12);
          border: 1px solid rgba(255, 80, 0, 0.2);
        }

        .m-sidebar-link.active .m-sidebar-icon {
          color: #ff5000;
        }

        /* Active left bar */
        .m-sidebar-link.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 20%;
          bottom: 20%;
          width: 3px;
          background: #ff5000;
          border-radius: 0 3px 3px 0;
          box-shadow: 0 0 8px rgba(255,80,0,0.6);
        }

        .m-sidebar-icon {
          flex-shrink: 0;
          transition: color 0.2s;
        }

        /* Divider */
        .m-sidebar-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin: 0.5rem 0.85rem;
        }

        /* Footer */
        .m-sidebar-footer {
          padding: 1rem 0.85rem 1.25rem;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .m-sidebar-user {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 0.75rem;
          border-radius: 8px;
        }

        .m-sidebar-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff5000, #ff2d55);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 0.85rem;
          color: #fff;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(255,80,0,0.3);
        }

        .m-sidebar-username {
          font-family: 'Barlow', sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          color: rgba(255,255,255,0.8);
        }

        .m-sidebar-role {
          font-family: 'Barlow', sans-serif;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.05em;
        }

        .m-sidebar-logout {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.65rem 0.9rem;
          border-radius: 8px;
          border: none;
          background: rgba(255,45,85,0.08);
          color: rgba(255,80,80,0.7);
          font-family: 'Barlow', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          width: 100%;
          transition: all 0.2s;
        }

        .m-sidebar-logout:hover {
          background: rgba(255,45,85,0.15);
          color: #ff2d55;
        }
      `}</style>

      <aside className="m-sidebar">
        {/* Header / Logo */}
        <div className="m-sidebar-header">
          <div className="m-sidebar-logo-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
          <div>
            <div className="m-sidebar-logo-text">
              M <span>Audio</span>
            </div>
            <div className="m-sidebar-logo-sub">Client Panel</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="m-sidebar-nav">
          <span className="m-sidebar-section">Main Menu</span>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`m-sidebar-link${isActive ? " active" : ""}`}
              >
                <span className="m-sidebar-icon">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="m-sidebar-footer">
          <div className="m-sidebar-user">
            <div className="m-sidebar-avatar">CA</div>
            <div>
              <div className="m-sidebar-username">Client</div>
              <div className="m-sidebar-role">Client</div>
            </div>
          </div>
          <div className="m-sidebar-divider" />
          <button className="m-sidebar-logout" onClick={handleLogout} disabled={loggingOut}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}