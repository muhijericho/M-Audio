"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false); // Close mobile sidebar on resize to desktop
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle escape key to close mobile sidebar
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen && isMobile) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [sidebarOpen, isMobile]);

  return (
    <div className="admin-layout" style={{ 
      display: "flex", 
      minHeight: "100vh", 
      background: "#05050a",
      position: "relative"
    }}>
      {/* Sidebar */}
      <AdminSidebar 
        mobileOpen={sidebarOpen} 
        onMobileClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
      />
      
      {/* Mobile Toggle Button - rendered outside sidebar */}
      {isMobile && (
        <button 
          className="m-sidebar-toggle"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
          aria-expanded={sidebarOpen}
          style={{
            position: "fixed",
            top: "1rem",
            left: "1rem",
            zIndex: 101,
            background: "linear-gradient(135deg, #ff5000, #ff2d55)",
            border: "none",
            borderRadius: "8px",
            width: "44px",
            height: "44px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 16px rgba(255,80,0,0.4)",
            transition: "transform 0.2s",
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      )}
      
      {/* Main Content - responsive margin */}
      <main style={{ 
        flex: 1, 
        marginLeft: isMobile ? 0 : "260px",
        padding: "2rem",
        transition: "margin-left 0.3s ease",
        width: "100%",
        boxSizing: "border-box"
      }}>
        {children}
      </main>

      {/* Mobile Overlay - only when sidebar is open on mobile */}
      {sidebarOpen && isMobile && (
        <div 
          className="m-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          style={{ 
            position: "fixed", 
            inset: 0, 
            zIndex: 99,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(4px)",
            animation: "fadeIn 0.3s ease"
          }}
        />
      )}

      {/* Inline styles for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .m-sidebar-toggle:hover { transform: scale(1.05); }
        .m-sidebar-toggle:active { transform: scale(0.95); }
      `}</style>
    </div>
  );
}