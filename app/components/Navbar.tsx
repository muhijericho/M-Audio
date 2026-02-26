"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile && menuOpen) setMenuOpen(false);
  }, [isMobile, menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen, isMobile]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      const headerOffset = 70;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  const navLinks = [
    { label: "Home", id: "home" },
    { label: "Services", id: "services" },
    { label: "Gallery", id: "gallery" },
    { label: "About", id: "about" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&display=swap');

        .m-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 999;
          padding: 0 2.5rem;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: background 0.4s ease, box-shadow 0.4s ease;
        }

        .m-nav.scrolled {
          background: rgba(5, 5, 10, 0.93);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 2px 32px rgba(0,0,0,0.5);
          border-bottom: 1px solid rgba(255, 80, 0, 0.12);
        }

        .m-nav-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          z-index: 1000;
        }

        .m-nav-logo img {
          height: 34px;
          width: auto;
          filter: drop-shadow(0 0 6px rgba(255,80,0,0.5));
        }

        .m-nav-logo-text {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.4rem;
          letter-spacing: 0.05em;
          color: #fff;
          line-height: 1;
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 0 2px;
        }

        .m-nav-logo-text .brand-main { color: #fff; }
        .m-nav-logo-text .brand-accent { color: #ff5000; }
        
        .m-nav-logo-dot {
          width: 5px;
          height: 5px;
          background: #ff5000;
          border-radius: 50%;
          display: inline-block;
          margin-left: 3px;
          animation: dot-pulse 1.8s ease infinite;
        }

        .m-nav-links {
          display: flex;
          align-items: center;
          gap: 1.8rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .m-nav-links button {
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Barlow', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.65);
          transition: color 0.2s;
          padding: 0.4rem 0;
        }

        .m-nav-links button:hover { color: #ff5000; }

        .m-nav-login {
          font-family: 'Barlow', sans-serif;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #fff !important;
          background: linear-gradient(135deg, #ff5000, #ff2d55) !important;
          border: none !important;
          border-radius: 6px !important;
          padding: 0.55rem 1.4rem !important;
          cursor: pointer;
          text-decoration: none !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 0.45rem !important;
          transition: transform 0.2s, box-shadow 0.2s !important;
          box-shadow: 0 4px 16px rgba(255,80,0,0.35) !important;
          white-space: nowrap !important;
          width: auto !important;
        }

        .m-nav-login:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 6px 24px rgba(255,80,0,0.5) !important;
        }

        .m-nav-login svg { flex-shrink: 0; }

        .m-nav-hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          z-index: 1000;
        }

        .m-nav-hamburger span {
          width: 26px;
          height: 2px;
          background: #fff;
          border-radius: 2px;
          display: block;
          transition: all 0.3s ease;
        }

        .m-nav-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .m-nav-hamburger.open span:nth-child(2) { opacity: 0; }
        .m-nav-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* MOBILE MENU - COMPLETELY REWRITTEN */
        .m-nav-mobile {
          position: fixed;
          top: 70px;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 998;
          background: rgba(5, 5, 10, 0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          display: none;
          flex-direction: column;
          padding: 2rem 2rem 3rem;
          gap: 0.75rem;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }

        .m-nav-mobile.open {
          display: flex;
          animation: slideIn 0.35s ease;
        }

        .m-nav-mobile button.nav-item {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          cursor: pointer;
          font-family: 'Barlow', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.85);
          text-align: left;
          padding: 1rem 1.25rem;
          transition: all 0.2s ease;
          border-radius: 8px;
          width: 100%;
          margin-bottom: 0.5rem;
        }

        .m-nav-mobile button.nav-item:hover {
          color: #ff5000;
          background: rgba(255,80,0,0.1);
          border-color: rgba(255,80,0,0.3);
        }

        /* LOGIN BUTTON CONTAINER - GUARANTEED TO SHOW */
        .m-nav-mobile .login-container {
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          padding-top: 1.5rem;
          padding-bottom: 0.5rem;
          border-top: 2px solid rgba(255,80,0,0.3);
          width: 100%;
          display: block !important;
        }

        .m-nav-mobile .login-button {
          width: 100%;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          padding: 1.1rem 1.5rem !important;
          font-size: 0.95rem !important;
          font-weight: 700 !important;
          letter-spacing: 0.12em !important;
          text-transform: uppercase !important;
          background: linear-gradient(135deg, #ff5000, #ff2d55) !important;
          color: #fff !important;
          border: none !important;
          border-radius: 8px !important;
          cursor: pointer;
          text-decoration: none !important;
          box-shadow: 0 4px 20px rgba(255,80,0,0.4) !important;
          transition: all 0.2s ease !important;
        }

        .m-nav-mobile .login-button:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 24px rgba(255,80,0,0.6) !important;
        }

        .m-nav-mobile .login-button svg {
          margin-right: 0.5rem;
          width: 18px;
          height: 18px;
        }

        .m-nav-mobile-hint {
          margin-top: auto;
          padding-top: 1rem;
          text-align: center;
          font-family: 'Barlow', sans-serif;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.25);
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        @media (max-width: 900px) {
          .m-nav { padding: 0 1.5rem; }
          .m-nav-links { gap: 1.4rem; }
        }

        @media (max-width: 768px) {
          .m-nav-links,
          .m-nav-login { display: none !important; }
          .m-nav-hamburger { display: flex; }
          .m-nav-logo-text { font-size: 1.25rem; }
          .m-nav-logo img { height: 30px; }
          .m-nav-mobile { top: 70px; }
        }

        @media (max-width: 480px) {
          .m-nav { padding: 0 1rem; height: 64px; }
          .m-nav-logo-text { font-size: 1.15rem; }
          .m-nav-logo img { height: 28px; }
          .m-nav-hamburger span { width: 24px; }
          .m-nav-mobile { 
            top: 64px; 
            padding: 1.5rem 1.5rem 2.5rem;
          }
          .m-nav-mobile button.nav-item { 
            font-size: 0.95rem; 
            padding: 0.9rem 1.1rem; 
          }
        }

        @keyframes dot-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.4); }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <header className={`m-nav${scrolled ? " scrolled" : ""}`}>
        <a 
          className="m-nav-logo" 
          href="#home" 
          onClick={(e) => { e.preventDefault(); scrollTo("home"); }}
        >
          <img src="/favicon.ico" alt="" aria-hidden="true" />
          <span className="m-nav-logo-text">
            <span className="brand-main">M AUDIO</span>
            <span className="brand-accent">LIGHTS</span>
            <span className="brand-main">&</span>
            <span className="brand-accent">SOUNDS</span>
            <span className="m-nav-logo-dot" />
          </span>
        </a>

        <ul className="m-nav-links">
          {navLinks.map((link) => (
            <li key={link.id}>
              <button onClick={() => scrollTo(link.id)}>{link.label}</button>
            </li>
          ))}
        </ul>

        <Link href="/login" className="m-nav-login">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          Login
        </Link>

        <button
          className={`m-nav-hamburger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </header>

      {/* MOBILE MENU */}
      <nav className={`m-nav-mobile${menuOpen ? " open" : ""}`}>
        {/* Navigation Items */}
        {navLinks.map((link) => (
          <button 
            key={link.id} 
            className="nav-item"
            onClick={() => scrollTo(link.id)}
          >
            {link.label}
          </button>
        ))}
        
        {/* LOGIN BUTTON - SEPARATED WITH ORANGE LINE */}
        <div className="login-container">
          <Link
            href="/login"
            className="login-button"
            onClick={() => setMenuOpen(false)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Login
          </Link>
        </div>
        
        <p className="m-nav-mobile-hint">Tap anywhere to close</p>
      </nav>

      {menuOpen && isMobile && (
        <div 
          style={{ position: "fixed", inset: 0, zIndex: 997, background: "transparent" }}
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}