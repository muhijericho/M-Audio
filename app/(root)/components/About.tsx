"use client";
// (root)/components/About.tsx
import React, { useEffect, useRef } from "react";

const stats = [
  { value: "500+", label: "Events Powered" },
  { value: "8+", label: "Years Experience" },
  { value: "50+", label: "Equipment Units" },
  { value: "100%", label: "Client Satisfaction" },
];

export default function About() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in-view")),
      { threshold: 0.12 }
    );
    ref.current?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@600;700&family=Barlow:wght@400;500&display=swap');

        .about-section {
          background: #05050a;
          padding: 7rem 2.5rem;
          position: relative;
          overflow: hidden;
        }

        .about-section::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(255,80,0,0.4), transparent);
        }

        .about-section::after {
          content: '';
          position: absolute;
          bottom: -200px;
          left: -200px;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,80,0,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .about-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }

        @media (max-width: 768px) {
          .about-inner { grid-template-columns: 1fr; gap: 3rem; }
        }

        /* Image side */
        .about-image-wrap {
          position: relative;
        }

        .about-image-main {
          width: 100%;
          aspect-ratio: 4/5;
          object-fit: cover;
          border-radius: 12px;
          filter: brightness(0.8) saturate(0.9);
          display: block;
        }

        .about-image-accent {
          position: absolute;
          bottom: -1.5rem;
          right: -1.5rem;
          width: 55%;
          aspect-ratio: 1/1;
          object-fit: cover;
          border-radius: 10px;
          border: 4px solid #05050a;
          filter: brightness(0.85);
        }

        .about-badge {
          position: absolute;
          top: 1.5rem;
          left: -1.5rem;
          background: linear-gradient(135deg, #ff5000, #ff2d55);
          color: #fff;
          padding: 1rem 1.25rem;
          border-radius: 10px;
          font-family: 'Bebas Neue', sans-serif;
          line-height: 1;
          box-shadow: 0 8px 32px rgba(255,80,0,0.4);
        }

        .about-badge-num {
          font-size: 2.5rem;
          display: block;
        }

        .about-badge-label {
          font-family: 'Barlow', sans-serif;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          opacity: 0.9;
        }

        /* Text side */
        .section-label {
          font-family: 'Barlow', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #ff5000;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .section-label::before {
          content: '';
          width: 30px;
          height: 1px;
          background: #ff5000;
        }

        .about-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          color: #fff;
          line-height: 1;
          margin: 0 0 1.5rem;
        }

        .about-title .accent { color: #ff5000; }

        .about-desc {
          font-family: 'Barlow', sans-serif;
          font-size: 1rem;
          color: rgba(255,255,255,0.55);
          line-height: 1.75;
          margin-bottom: 1.25rem;
        }

        .about-highlight {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          margin-bottom: 1.25rem;
          padding: 1rem 1.25rem;
          background: rgba(255,80,0,0.06);
          border-left: 3px solid #ff5000;
          border-radius: 0 8px 8px 0;
        }

        .about-highlight-icon {
          color: #ff5000;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .about-highlight-text {
          font-family: 'Barlow', sans-serif;
          font-size: 0.9rem;
          color: rgba(255,255,255,0.7);
          line-height: 1.5;
        }

        /* Stats */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: rgba(255,255,255,0.07);
          border-radius: 12px;
          overflow: hidden;
          margin-top: 2.5rem;
        }

        .stat-box {
          background: rgba(255,255,255,0.03);
          padding: 1.5rem 1rem;
          text-align: center;
          transition: background 0.2s ease;
        }

        .stat-box:hover { background: rgba(255,80,0,0.08); }

        .stat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2.2rem;
          color: #ff5000;
          line-height: 1;
          display: block;
        }

        .stat-lbl {
          font-family: 'Barlow', sans-serif;
          font-size: 0.72rem;
          color: rgba(255,255,255,0.45);
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-top: 0.25rem;
          display: block;
        }

        .reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .reveal.in-view {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <section className="about-section" id="about" ref={ref}>
        <div className="about-inner">
          {/* Image column */}
          <div className="about-image-wrap reveal">
            <img
              className="about-image-main"
              src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80"
              alt="Sound mixing console"
            />
            <img
              className="about-image-accent"
              src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80"
              alt="Stage lighting"
            />
            <div className="about-badge">
              <span className="about-badge-num">8+</span>
              <span className="about-badge-label">Years in Business</span>
            </div>
          </div>

          {/* Text column */}
          <div>
            <p className="section-label reveal" style={{ transitionDelay: "0.1s" }}>Who We Are</p>
            <h2 className="about-title reveal" style={{ transitionDelay: "0.2s" }}>
              The Sound &amp; Light <span className="accent">Specialists</span>
            </h2>
            <p className="about-desc reveal" style={{ transitionDelay: "0.3s" }}>
              M Audio Lights and Sound is a professional event equipment rental company based in the Philippines. We specialize in delivering top-tier audio and lighting solutions for concerts, weddings, corporate events, festivals, and private parties.
            </p>
            <p className="about-desc reveal" style={{ transitionDelay: "0.35s" }}>
              Our team of experienced technicians ensures that every piece of equipment is professionally set up, tested, and operated for maximum impact. We don't just rent gear — we deliver an experience.
            </p>

            <div className="about-highlight reveal" style={{ transitionDelay: "0.4s" }}>
              <span className="about-highlight-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span className="about-highlight-text">
                <strong style={{ color: "#fff" }}>Free delivery &amp; setup</strong> within Metro Manila for rentals over ₱5,000.
              </span>
            </div>

            <div className="about-highlight reveal" style={{ transitionDelay: "0.45s" }}>
              <span className="about-highlight-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span className="about-highlight-text">
                <strong style={{ color: "#fff" }}>On-site technicians</strong> available for full event production management.
              </span>
            </div>

            {/* Stats */}
            <div className="stats-row reveal" style={{ transitionDelay: "0.5s" }}>
              {stats.map((s, i) => (
                <div key={i} className="stat-box">
                  <span className="stat-num">{s.value}</span>
                  <span className="stat-lbl">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}