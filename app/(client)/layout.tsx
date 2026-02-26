"use client";
import ClientSidebar from "@/app/components/ClientSidebar";
import { usePathname } from "next/navigation";
import React, { ReactNode, useState, useEffect } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/client/login";
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle Escape key to close mobile sidebar
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen && isMobile) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [sidebarOpen, isMobile]);

  // Skip layout for login page
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="client-layout" style={{ 
      display: "flex", 
      minHeight: "100vh", 
      background: "#05050a",
      position: "relative"
    }}>
      {/* Sidebar */}
      <ClientSidebar 
        mobileOpen={sidebarOpen} 
        onMobileClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
      />
      
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button 
          className="c-sidebar-toggle"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
          aria-expanded={sidebarOpen}
          type="button"
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
      
      {/* Main Content */}
      <main style={{ 
        flexGrow: 1,
        backgroundColor: "#4f555d",
        padding: "2rem",
        marginLeft: isMobile ? 0 : "240px",
        minHeight: "100vh",
        overflowY: "auto",
        transition: "margin-left 0.3s ease",
        width: "100%",
        boxSizing: "border-box"
      }}>
        {children}
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <div 
          className="c-sidebar-overlay"
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

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .c-sidebar-toggle:hover { transform: scale(1.05); }
        .c-sidebar-toggle:active { transform: scale(0.95); }
      `}</style>
    </div>
  );
}