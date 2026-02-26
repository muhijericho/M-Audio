"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    href: "/admin/booking",
    label: "Bookings",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M3 10h18" /><path d="m9 16 2 2 4-4" />
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

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  isMobile?: boolean; // ← New prop to control desktop/mobile styles
}

export default function AdminSidebar({ 
  mobileOpen = false, 
  onMobileClose,
  isMobile = false 
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen, isMobile]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      setLoggingOut(false);
    }
  };

  const handleNavClick = () => {
    if (onMobileClose && isMobile) {
      onMobileClose();
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600&display=swap');

        :root {
          --sidebar-width: 260px;
          --sidebar-width-mobile: 280px;
          --sidebar-bg: #05050a;
          --accent-orange: #ff5000;
          --accent-pink: #ff2d55;
          --text-primary: #ffffff;
          --text-secondary: rgba(255,255,255,0.45);
          --border-color: rgba(255,255,255,0.06);
          --hover-bg: rgba(255,255,255,0.06);
          --active-bg: rgba(255, 80, 0, 0.15);
          --transition-speed: 0.3s;
        }

        .m-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: var(--sidebar-width);
          height: 100vh;
          background: var(--sidebar-bg);
          display: flex;
          flex-direction: column;
          z-index: 100;
          border-right: 1px solid var(--border-color);
          overflow: hidden;
          transition: transform var(--transition-speed) ease, width var(--transition-speed) ease;
          will-change: transform;
        }

        /* Desktop: always visible */
        .m-sidebar.desktop {
          transform: translateX(0) !important;
        }

        /* Mobile: hidden by default */
        .m-sidebar.mobile {
          width: var(--sidebar-width-mobile);
          transform: translateX(-100%);
        }

        .m-sidebar.mobile.mobile-open {
          transform: translateX(0);
        }

        /* Subtle orange glow */
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
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        .m-sidebar-logo-icon {
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, var(--accent-orange), var(--accent-pink));
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(255,80,0,0.4);
        }

        .m-sidebar-logo-text {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.4rem;
          letter-spacing: 0.08em;
          color: var(--text-primary);
          line-height: 1;
        }

        .m-sidebar-logo-text span { color: var(--accent-orange); }

        .m-sidebar-logo-sub {
          font-family: 'Barlow', sans-serif;
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          margin-top: 2px;
        }

        /* Close button - mobile only */
        .m-sidebar-close {
          display: none;
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          background: rgba(255,255,255,0.08);
          border: none;
          border-radius: 8px;
          width: 36px;
          height: 36px;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          z-index: 101;
        }

        .m-sidebar-close:hover {
          background: rgba(255,45,85,0.2);
        }

        .m-sidebar-close svg { color: rgba(255,255,255,0.7); }

        /* Nav */
        .m-sidebar-nav {
          flex: 1;
          padding: 1.25rem 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }

        .m-sidebar-section {
          font-family: 'Barlow', sans-serif;
          font-size: 0.65rem;
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
          gap: 0.85rem;
          padding: 0.85rem 1rem;
          border-radius: 10px;
          color: var(--text-secondary);
          text-decoration: none;
          font-family: 'Barlow', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          transition: all 0.2s ease;
          position: relative;
          margin-bottom: 0.15rem;
        }

        .m-sidebar-link:hover {
          color: rgba(255,255,255,0.9);
          background: var(--hover-bg);
        }

        .m-sidebar-link.active {
          color: var(--text-primary);
          background: var(--active-bg);
          border: 1px solid rgba(255, 80, 0, 0.25);
        }

        .m-sidebar-link.active .m-sidebar-icon { color: var(--accent-orange); }

        .m-sidebar-link.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 15%;
          bottom: 15%;
          width: 3px;
          background: var(--accent-orange);
          border-radius: 0 3px 3px 0;
          box-shadow: 0 0 10px rgba(255,80,0,0.6);
        }

        .m-sidebar-icon {
          flex-shrink: 0;
          transition: color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .m-sidebar-divider {
          height: 1px;
          background: var(--border-color);
          margin: 0.75rem 0.85rem;
        }

        /* Footer */
        .m-sidebar-footer {
          padding: 1rem 0.85rem 1.5rem;
          border-top: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          flex-shrink: 0;
        }

        .m-sidebar-user {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.75rem;
          border-radius: 10px;
          background: rgba(255,255,255,0.03);
        }

        .m-sidebar-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent-orange), var(--accent-pink));
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 0.9rem;
          color: var(--text-primary);
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(255,80,0,0.3);
        }

        .m-sidebar-username {
          font-family: 'Barlow', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(255,255,255,0.85);
        }

        .m-sidebar-role {
          font-family: 'Barlow', sans-serif;
          font-size: 0.72rem;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.05em;
        }

        .m-sidebar-logout {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 0.85rem 1rem;
          border-radius: 10px;
          border: none;
          background: rgba(255,45,85,0.1);
          color: rgba(255,80,80,0.75);
          font-family: 'Barlow', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          width: 100%;
          transition: all 0.2s;
        }

        .m-sidebar-logout:hover {
          background: rgba(255,45,85,0.2);
          color: var(--accent-pink);
        }

        .m-sidebar-logout:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Scrollbar */
        .m-sidebar-nav::-webkit-scrollbar { width: 4px; }
        .m-sidebar-nav::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        .m-sidebar-nav::-webkit-scrollbar-thumb { 
          background: rgba(255,80,0,0.3); 
          border-radius: 2px; 
        }
        .m-sidebar-nav::-webkit-scrollbar-thumb:hover { 
          background: rgba(255,80,0,0.5); 
        }

        /* ===== RESPONSIVE BREAKPOINTS ===== */
        
        /* Tablet & below: hide sidebar by default, show toggle */
        @media (max-width: 1024px) {
          .m-sidebar.desktop { display: none; }
          .m-sidebar.mobile { display: flex; }
          .m-sidebar-close { display: flex; }
        }

        /* Mobile: full-width sidebar */
        @media (max-width: 480px) {
          :root {
            --sidebar-width-mobile: 100%;
          }
          .m-sidebar.mobile {
            max-width: 320px;
          }
          .m-sidebar-header { padding: 2rem 1.25rem 1.5rem; }
          .m-sidebar-logo-icon { width: 36px; height: 36px; }
          .m-sidebar-logo-text { font-size: 1.3rem; }
          .m-sidebar-link { 
            padding: 1.1rem 1.25rem; 
            font-size: 0.95rem; 
            gap: 1rem; 
          }
          .m-sidebar-icon svg { width: 20px; height: 20px; }
          .m-sidebar-avatar { width: 40px; height: 40px; font-size: 1rem; }
          .m-sidebar-username { font-size: 0.9rem; }
          .m-sidebar-role { font-size: 0.75rem; }
          .m-sidebar-logout { padding: 1rem; font-size: 0.85rem; }
        }

        /* Hide toggle on desktop */
        @media (min-width: 1025px) {
          .m-sidebar-toggle { display: none !important; }
        }
      `}</style>

      {/* Mobile Close Button (inside sidebar) */}
      <button 
        className="m-sidebar-close"
        onClick={onMobileClose}
        aria-label="Close menu"
        type="button"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside className={`m-sidebar ${isMobile ? 'mobile' : 'desktop'} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Header / Logo */}
        <div className="m-sidebar-header">
          <div className="m-sidebar-logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div className="m-sidebar-logo-text">M <span>Audio</span></div>
            <div className="m-sidebar-logo-sub">Admin Panel</div>
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
                onClick={handleNavClick}
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
            <div className="m-sidebar-avatar">MA</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="m-sidebar-username">Admin User</div>
              <div className="m-sidebar-role">M Audio Manager</div>
            </div>
          </div>
          <div className="m-sidebar-divider" />
          <button 
            className="m-sidebar-logout" 
            onClick={handleLogout} 
            disabled={loggingOut}
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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