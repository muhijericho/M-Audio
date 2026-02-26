"use client";
import React, { useState, useEffect } from "react";
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

interface ClientSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  isMobile?: boolean;
}

export default function ClientSidebar({ 
  mobileOpen = false, 
  onMobileClose,
  isMobile = false 
}: ClientSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  // Lock body scroll when mobile sidebar is open
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
          --sidebar-width: 240px;
          --sidebar-width-mobile: 260px;
          --sidebar-bg: #05050a;
          --accent-orange: #ff5000;
          --accent-pink: #ff2d55;
          --text-primary: #ffffff;
          --text-secondary: rgba(255,255,255,0.45);
          --border-color: rgba(255,255,255,0.06);
          --hover-bg: rgba(255,255,255,0.05);
          --active-bg: rgba(255, 80, 0, 0.12);
          --transition-speed: 0.3s;
        }

        .c-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: var(--sidebar-width);
          height: 100vh;
          background: var(--sidebar-bg);
          display: flex;
          flex-direction: column;
          z-index: 100;
          border-right: 1px solid rgba(255, 80, 0, 0.12);
          overflow: hidden;
          transition: transform var(--transition-speed) ease;
          will-change: transform;
        }

        /* Desktop: always visible */
        .c-sidebar.desktop {
          transform: translateX(0) !important;
        }

        /* Mobile: hidden by default */
        .c-sidebar.mobile {
          width: var(--sidebar-width-mobile);
          transform: translateX(-100%);
        }

        .c-sidebar.mobile.mobile-open {
          transform: translateX(0);
        }

        /* Subtle orange glow */
        .c-sidebar::before {
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
        .c-sidebar-header {
          padding: 1.75rem 1.5rem 1.5rem;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-shrink: 0;
        }

        .c-sidebar-logo-icon {
          width: 34px;
          height: 34px;
          background: linear-gradient(135deg, var(--accent-orange), var(--accent-pink));
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(255,80,0,0.4);
        }

        .c-sidebar-logo-text {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.35rem;
          letter-spacing: 0.08em;
          color: var(--text-primary);
          line-height: 1;
        }

        .c-sidebar-logo-text span { color: var(--accent-orange); }

        .c-sidebar-logo-sub {
          font-family: 'Barlow', sans-serif;
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          margin-top: 2px;
        }

        /* Close button - mobile only */
        .c-sidebar-close {
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
          padding: 0;
        }

        .c-sidebar-close:hover {
          background: rgba(255,45,85,0.2);
        }

        .c-sidebar-close svg { color: rgba(255,255,255,0.7); }

        /* Nav */
        .c-sidebar-nav {
          flex: 1;
          padding: 1.25rem 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }

        .c-sidebar-section {
          font-family: 'Barlow', sans-serif;
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
          padding: 0.5rem 0.75rem 0.4rem;
          margin-top: 0.5rem;
        }

        .c-sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.7rem 0.9rem;
          border-radius: 8px;
          color: var(--text-secondary);
          text-decoration: none;
          font-family: 'Barlow', sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          transition: all 0.2s ease;
          position: relative;
        }

        .c-sidebar-link:hover {
          color: rgba(255,255,255,0.85);
          background: var(--hover-bg);
        }

        .c-sidebar-link.active {
          color: var(--text-primary);
          background: var(--active-bg);
          border: 1px solid rgba(255, 80, 0, 0.2);
        }

        .c-sidebar-link.active .c-sidebar-icon { color: var(--accent-orange); }

        .c-sidebar-link.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 20%;
          bottom: 20%;
          width: 3px;
          background: var(--accent-orange);
          border-radius: 0 3px 3px 0;
          box-shadow: 0 0 8px rgba(255,80,0,0.6);
        }

        .c-sidebar-icon {
          flex-shrink: 0;
          transition: color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .c-sidebar-divider {
          height: 1px;
          background: var(--border-color);
          margin: 0.5rem 0.85rem;
        }

        /* Footer */
        .c-sidebar-footer {
          padding: 1rem 0.85rem 1.25rem;
          border-top: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .c-sidebar-user {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 0.75rem;
          border-radius: 8px;
        }

        .c-sidebar-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent-orange), var(--accent-pink));
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 0.85rem;
          color: var(--text-primary);
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(255,80,0,0.3);
        }

        .c-sidebar-username {
          font-family: 'Barlow', sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          color: rgba(255,255,255,0.8);
        }

        .c-sidebar-role {
          font-family: 'Barlow', sans-serif;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.05em;
        }

        .c-sidebar-logout {
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
          text-align: left;
        }

        .c-sidebar-logout:hover {
          background: rgba(255,45,85,0.15);
          color: var(--accent-pink);
        }

        .c-sidebar-logout:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Scrollbar */
        .c-sidebar-nav::-webkit-scrollbar { width: 4px; }
        .c-sidebar-nav::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        .c-sidebar-nav::-webkit-scrollbar-thumb { 
          background: rgba(255,80,0,0.3); 
          border-radius: 2px; 
        }
        .c-sidebar-nav::-webkit-scrollbar-thumb:hover { 
          background: rgba(255,80,0,0.5); 
        }

        /* ===== RESPONSIVE BREAKPOINTS ===== */
        
        /* Tablet & below: hide desktop sidebar, show mobile version */
        @media (max-width: 1024px) {
          .c-sidebar.desktop { display: none; }
          .c-sidebar.mobile { display: flex; }
          .c-sidebar-close { display: flex; }
        }

        /* Small Mobile */
        @media (max-width: 480px) {
          :root {
            --sidebar-width-mobile: 100%;
          }
          .c-sidebar.mobile {
            max-width: 300px;
          }
          .c-sidebar-header { padding: 1.5rem 1.25rem 1.25rem; }
          .c-sidebar-logo-icon { width: 32px; height: 32px; }
          .c-sidebar-logo-text { font-size: 1.25rem; }
          .c-sidebar-link { 
            padding: 0.9rem 1rem; 
            font-size: 0.9rem; 
            gap: 0.9rem; 
          }
          .c-sidebar-icon svg { width: 18px; height: 18px; }
          .c-sidebar-avatar { width: 36px; height: 36px; font-size: 0.9rem; }
          .c-sidebar-username { font-size: 0.85rem; }
          .c-sidebar-role { font-size: 0.72rem; }
          .c-sidebar-logout { padding: 0.8rem 1rem; font-size: 0.8rem; }
        }

        /* Hide toggle on desktop */
        @media (min-width: 1025px) {
          .c-sidebar-toggle { display: none !important; }
        }
      `}</style>

      {/* Mobile Close Button */}
      <button 
        className="c-sidebar-close"
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
      <aside className={`c-sidebar ${isMobile ? 'mobile' : 'desktop'} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Header / Logo */}
        <div className="c-sidebar-header">
          <div className="c-sidebar-logo-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
          <div>
            <div className="c-sidebar-logo-text">M <span>Audio</span></div>
            <div className="c-sidebar-logo-sub">Client Panel</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="c-sidebar-nav">
          <span className="c-sidebar-section">Main Menu</span>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`c-sidebar-link${isActive ? " active" : ""}`}
                onClick={handleNavClick}
              >
                <span className="c-sidebar-icon">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="c-sidebar-footer">
          <div className="c-sidebar-user">
            <div className="c-sidebar-avatar">CA</div>
            <div>
              <div className="c-sidebar-username">Client</div>
              <div className="c-sidebar-role">Client</div>
            </div>
          </div>
          <div className="c-sidebar-divider" />
          <button 
            className="c-sidebar-logout" 
            onClick={handleLogout} 
            disabled={loggingOut}
            type="button"
          >
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