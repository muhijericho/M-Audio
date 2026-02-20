"use client";
// (root)/components/Services.tsx
import React, { useEffect, useRef } from "react";

const services = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
      </svg>
    ),
    title: "PA Sound Systems",
    desc: "Line arrays, subwoofers, and full PA setups for concerts, events, and corporate functions of any size.",
    tag: "From ₱3,500/day",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="2" /><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
    title: "Stage Lighting",
    desc: "Moving heads, LED wash lights, spotlights, lasers, and full DMX control rigs for stunning stage productions.",
    tag: "From ₱2,500/day",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="2.18" /><path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5" />
      </svg>
    ),
    title: "DJ & Mixer Setup",
    desc: "Pioneer CDJs, mixers, DJ controllers, booth monitors — everything a DJ needs for a flawless performance.",
    tag: "From ₱2,000/day",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
      </svg>
    ),
    title: "Wireless Microphones",
    desc: "Shure, Sennheiser, and AKG wireless systems — handheld, lapel, and headset mics for any event.",
    tag: "From ₱800/day",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" />
      </svg>
    ),
    title: "LED Video Walls",
    desc: "Indoor and outdoor LED panels, rear projection screens, and video splitters for immersive visual experiences.",
    tag: "From ₱5,000/day",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
    title: "Smoke & Effects",
    desc: "Fog machines, haze generators, CO2 cannons, confetti blasters, and pyrotechnic effects for maximum impact.",
    tag: "From ₱1,200/day",
  },
];

const galleryImages = [
  { url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80", label: "Concert Stage" },
  { url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80", label: "Live DJ Set" },
  { url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80", label: "Outdoor Festival" },
  { url: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=800&q=80", label: "Stage Lighting" },
  { url: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&q=80", label: "Event Setup" },
  { url: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80", label: "Night Festival" },
];

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.1 }
    );
    const cards = sectionRef.current?.querySelectorAll(".reveal");
    cards?.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@600;700&family=Barlow:wght@400;500&display=swap');

        /* ===== SERVICES ===== */
        .services-section {
          background: #05050a;
          padding: 7rem 2.5rem;
          position: relative;
          overflow: hidden;
        }

        .services-section::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(255,80,0,0.4), transparent);
        }

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

        .section-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          color: #fff;
          margin: 0 0 1rem;
          line-height: 1;
        }

        .section-title .accent { color: #ff5000; }

        .section-desc {
          font-family: 'Barlow', sans-serif;
          font-size: 1rem;
          color: rgba(255,255,255,0.5);
          max-width: 480px;
          line-height: 1.6;
          margin-bottom: 4rem;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .service-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 2rem;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
          cursor: default;
        }

        .service-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(to right, #ff5000, #ff2d55);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s ease;
        }

        .service-card:hover {
          transform: translateY(-6px);
          border-color: rgba(255,80,0,0.25);
          box-shadow: 0 20px 50px rgba(255,80,0,0.12);
        }

        .service-card:hover::before { transform: scaleX(1); }

        .service-icon {
          width: 56px;
          height: 56px;
          background: rgba(255,80,0,0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ff5000;
          margin-bottom: 1.25rem;
          transition: background 0.3s ease;
        }

        .service-card:hover .service-icon {
          background: rgba(255,80,0,0.2);
        }

        .service-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.2rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 0.6rem;
        }

        .service-desc {
          font-family: 'Barlow', sans-serif;
          font-size: 0.88rem;
          color: rgba(255,255,255,0.5);
          line-height: 1.6;
          margin-bottom: 1.25rem;
        }

        .service-tag {
          display: inline-block;
          background: rgba(255,80,0,0.12);
          border: 1px solid rgba(255,80,0,0.25);
          color: #ff7033;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
        }

        /* Reveal animation */
        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .reveal.in-view {
          opacity: 1;
          transform: translateY(0);
        }

        /* ===== GALLERY ===== */
        .gallery-section {
          background: #08080f;
          padding: 7rem 2.5rem;
          position: relative;
          overflow: hidden;
        }

        .gallery-section::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(255,80,0,0.4), transparent);
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: auto;
          gap: 1rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .gallery-item {
          position: relative;
          overflow: hidden;
          border-radius: 8px;
          aspect-ratio: 4/3;
          cursor: pointer;
        }

        .gallery-item:nth-child(1) { grid-column: span 2; aspect-ratio: 16/7; }
        .gallery-item:nth-child(5) { grid-column: span 2; aspect-ratio: 16/7; }

        .gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(.4,0,.2,1);
          filter: brightness(0.7) saturate(0.9);
        }

        .gallery-item:hover img {
          transform: scale(1.08);
          filter: brightness(0.9) saturate(1.2);
        }

        .gallery-item-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(255,80,0,0.5), transparent);
          opacity: 0;
          transition: opacity 0.35s ease;
          display: flex;
          align-items: flex-end;
          padding: 1rem 1.25rem;
        }

        .gallery-item:hover .gallery-item-overlay { opacity: 1; }

        .gallery-item-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #fff;
        }

        @media (max-width: 768px) {
          .gallery-grid { grid-template-columns: 1fr 1fr; }
          .gallery-item:nth-child(1),
          .gallery-item:nth-child(5) { grid-column: span 2; }
        }

        @media (max-width: 480px) {
          .gallery-grid { grid-template-columns: 1fr; }
          .gallery-item:nth-child(1),
          .gallery-item:nth-child(5) { grid-column: span 1; }
        }
      `}</style>

      {/* SERVICES */}
      <section className="services-section" id="services" ref={sectionRef}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p className="section-label reveal">What We Offer</p>
          <h2 className="section-title reveal" style={{ transitionDelay: "0.1s" }}>
            Rental <span className="accent">Equipment</span>
          </h2>
          <p className="section-desc reveal" style={{ transitionDelay: "0.2s" }}>
            From intimate gatherings to massive festivals — we have the gear to make your event unforgettable.
          </p>

          <div className="services-grid">
            {services.map((s, i) => (
              <div
                key={i}
                className="service-card reveal"
                style={{ transitionDelay: `${0.1 * (i % 3)}s` }}
              >
                <div className="service-icon">{s.icon}</div>
                <div className="service-title">{s.title}</div>
                <p className="service-desc">{s.desc}</p>
                <span className="service-tag">{s.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="gallery-section" id="gallery">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p className="section-label reveal">Our Work</p>
          <h2 className="section-title reveal" style={{ marginBottom: "2.5rem", transitionDelay: "0.1s" }}>
            Event <span className="accent">Gallery</span>
          </h2>

          <div className="gallery-grid">
            {galleryImages.map((img, i) => (
              <div key={i} className="gallery-item reveal" style={{ transitionDelay: `${0.08 * i}s` }}>
                <img src={img.url} alt={img.label} loading="lazy" />
                <div className="gallery-item-overlay">
                  <span className="gallery-item-label">{img.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}