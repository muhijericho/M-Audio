// app/components/AdminSidebar.tsx
"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    href: "/admin/profile",
    label: "Profile",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@400;500&display=swap');

        .admin-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: 240px;
          height: 100vh;
          background: linear-gradient(160deg, #0f0f1a 0%, #1a1a2e 100%);
          display: flex;
          flex-direction: column;
          padding: 0;
          z-index: 100;
          border-right: 1px solid rgba(255,255,255,0.06);
          overflow: hidden;
        }

        .admin-sidebar::before {
          content: '';
          position: absolute;
          top: -60px;
          left: -60px;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        .sidebar-header {
          padding: 2rem 1.75rem 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .sidebar-logo-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sidebar-logo-text {
          font-family: 'Syne', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.01em;
        }

        .sidebar-logo-text span {
          color: #818cf8;
        }

        .sidebar-nav {
          flex: 1;
          padding: 1.25rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          overflow-y: auto;
        }

        .nav-section-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          padding: 0.5rem 0.75rem 0.4rem;
          margin-top: 0.25rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.7rem 0.85rem;
          border-radius: 10px;
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.18s ease;
          position: relative;
          overflow: hidden;
        }

        .nav-link:hover {
          color: rgba(255,255,255,0.9);
          background: rgba(255,255,255,0.06);
        }

        .nav-link.active {
          color: #fff;
          background: linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.15));
          box-shadow: inset 0 0 0 1px rgba(99,102,241,0.3);
        }

        .nav-link.active .nav-icon {
          color: #818cf8;
        }

        .nav-icon {
          flex-shrink: 0;
          transition: color 0.18s ease;
        }

        .active-dot {
          width: 6px;
          height: 6px;
          background: #6366f1;
          border-radius: 50%;
          margin-left: auto;
          flex-shrink: 0;
          box-shadow: 0 0 8px rgba(99,102,241,0.7);
        }

        .sidebar-footer {
          padding: 1.25rem 1rem;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .sidebar-user {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 0.85rem;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.18s ease;
        }

        .sidebar-user:hover {
          background: rgba(255,255,255,0.05);
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #ec4899);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
        }

        .user-info {
          flex: 1;
          min-width: 0;
        }

        .user-name {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          color: rgba(255,255,255,0.85);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-role {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem;
          color: rgba(255,255,255,0.35);
        }
      `}</style>

      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <span className="sidebar-logo-text">Admin<span>HQ</span></span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-section-label">Main Menu</span>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href} className={`nav-link${isActive ? " active" : ""}`}>
                <span className="nav-icon">{item.icon}</span>
                {item.label}
                {isActive && <span className="active-dot" />}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">AD</div>
            <div className="user-info">
              <div className="user-name">Admin User</div>
              <div className="user-role">Super Admin</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}