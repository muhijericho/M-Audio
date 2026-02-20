"use client";
// app/components/Footer.tsx
import React from "react";

const Footer = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500&display=swap');

        .m-footer {
          background: #05050a;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding: 2rem 2.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .m-footer-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.4rem;
          letter-spacing: 0.08em;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .m-footer-logo span { color: #ff5000; }

        .m-footer-links {
          display: flex;
          gap: 1.5rem;
          list-style: none;
          margin: 0;
          padding: 0;
          flex-wrap: wrap;
        }

        .m-footer-links li a {
          font-family: 'Barlow', sans-serif;
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          text-decoration: none;
          transition: color 0.2s;
        }

        .m-footer-links li a:hover { color: #ff5000; }

        .m-footer-copy {
          font-family: 'Barlow', sans-serif;
          font-size: 0.78rem;
          color: rgba(255,255,255,0.25);
          margin: 0;
        }

        @media (max-width: 640px) {
          .m-footer { flex-direction: column; align-items: flex-start; }
          .m-footer-links { display: none; }
        }
      `}</style>

      <footer className="m-footer">
        <div className="m-footer-logo">
          M <span>Audio</span> &nbsp;Lights &amp; Sound
        </div>

        <ul className="m-footer-links">
          {["home", "services", "gallery", "about", "contact"].map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            </li>
          ))}
        </ul>

        <p className="m-footer-copy">© {new Date().getFullYear()} M Audio Lights &amp; Sound. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Footer;