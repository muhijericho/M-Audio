"use client";
// app/components/Navbar.tsx
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const navLinks = [
    { label: "Home",     id: "home" },
    { label: "Services", id: "services" },
    { label: "Gallery",  id: "gallery" },
    { label: "About",    id: "about" },
    { label: "Contact",  id: "contact" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600&display=swap');

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

        /* Logo */
        .m-nav-logo {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          text-decoration: none;
        }

        .m-nav-logo img {
          height: 36px;
          width: auto;
          filter: drop-shadow(0 0 6px rgba(255,80,0,0.5));
        }

        .m-nav-logo-text {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.5rem;
          letter-spacing: 0.08em;
          color: #fff;
          line-height: 1;
        }

        .m-nav-logo-text span { color: #ff5000; }

        .m-nav-logo-dot {
          width: 6px;
          height: 6px;
          background: #ff5000;
          border-radius: 50%;
          display: inline-block;
          margin-left: 2px;
          animation: dot-pulse 1.8s ease infinite;
        }

        /* Desktop links */
        .m-nav-links {
          display: flex;
          align-items: center;
          gap: 2.25rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .m-nav-links li button {
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Barlow', sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.65);
          transition: color 0.2s;
          padding: 0;
        }

        .m-nav-links li button:hover { color: #ff5000; }

        /* Login button */
        .m-nav-login {
          font-family: 'Barlow', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #fff;
          background: linear-gradient(135deg, #ff5000, #ff2d55);
          border: none;
          border-radius: 6px;
          padding: 0.5rem 1.3rem;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(255,80,0,0.35);
        }

        .m-nav-login:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(255,80,0,0.5);
        }

        /* Hamburger */
        .m-nav-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }

        .m-nav-hamburger span {
          width: 24px;
          height: 2px;
          background: #fff;
          border-radius: 2px;
          display: block;
          transition: all 0.3s ease;
        }

        .m-nav-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .m-nav-hamburger.open span:nth-child(2) { opacity: 0; }
        .m-nav-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* Mobile menu clip wrapper — prevents the sliding menu from
           appearing above the navbar when it's in its hidden (off-screen) state */
        .m-nav-mobile-clip {
          position: fixed;
          top: 70px;
          left: 0;
          right: 0;
          overflow: hidden;        /* <-- this clips the translateY(-110%) bleed */
          z-index: 998;
          /* Expand height only when open so it doesn't block page clicks when closed */
          max-height: 0;
          transition: max-height 0.35s cubic-bezier(.4,0,.2,1);
        }

        .m-nav-mobile-clip.open {
          max-height: 400px; /* tall enough for any menu content */
        }

        /* Mobile menu */
        .m-nav-mobile {
          background: rgba(5, 5, 10, 0.97);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 1.5rem 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          border-bottom: 1px solid rgba(255,80,0,0.15);
          transform: translateY(-110%);
          transition: transform 0.35s cubic-bezier(.4,0,.2,1);
        }

        .m-nav-mobile-clip.open .m-nav-mobile {
          transform: translateY(0);
        }

        .m-nav-mobile button {
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Barlow', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
          text-align: left;
          padding: 0;
          transition: color 0.2s;
        }

        .m-nav-mobile button:hover { color: #ff5000; }

        @media (max-width: 768px) {
          .m-nav-links,
          .m-nav-login { display: none !important; }
          .m-nav-hamburger { display: flex; }
        }

        @keyframes dot-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.5); }
        }
      `}</style>

      {/* Main nav bar */}
      <header className={`m-nav${scrolled ? " scrolled" : ""}`}>
        {/* Logo */}
        <a className="m-nav-logo" href="#home" onClick={(e) => { e.preventDefault(); scrollTo("home"); }}>
          <img src="/favicon.ico" alt="M Audio Logo" />
          <span className="m-nav-logo-text">
            M <span>Audio</span>
            <span className="m-nav-logo-dot" />
          </span>
        </a>

        {/* Desktop links */}
        <ul className="m-nav-links">
          {navLinks.map((link) => (
            <li key={link.id}>
              <button onClick={() => scrollTo(link.id)}>{link.label}</button>
            </li>
          ))}
        </ul>

        {/* Login button */}
        <Link href="/login" className="m-nav-login">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          Login
        </Link>

        {/* Mobile hamburger */}
        <button
          className={`m-nav-hamburger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </header>

      {/* Mobile dropdown — wrapped in clip container to prevent above-nav bleed */}
      <div className={`m-nav-mobile-clip${menuOpen ? " open" : ""}`}>
        <nav className="m-nav-mobile">
          {navLinks.map((link) => (
            <button key={link.id} onClick={() => scrollTo(link.id)}>
              {link.label}
            </button>
          ))}
          <Link
            href="/login"
            className="m-nav-login"
            style={{ marginTop: "0.5rem", justifyContent: "center" }}
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>
        </nav>
      </div>
    </>
  );
}