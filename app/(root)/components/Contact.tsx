"use client";
// (root)/components/Contact.tsx
import React, { useEffect, useRef, useState } from "react";

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", event: "", message: "" });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in-view")),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@600;700&family=Barlow:wght@400;500&display=swap');

        .contact-section {
          background: #08080f;
          padding: 7rem 2.5rem;
          position: relative;
          overflow: hidden;
        }

        .contact-section::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(255,80,0,0.4), transparent);
        }

        .contact-section::after {
          content: '';
          position: absolute;
          top: -100px;
          right: -150px;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,80,0,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .contact-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 5rem;
          align-items: start;
        }

        @media (max-width: 768px) {
          .contact-inner { grid-template-columns: 1fr; gap: 3rem; }
        }

        /* Info */
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

        .contact-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          color: #fff;
          line-height: 1;
          margin: 0 0 1.25rem;
        }

        .contact-title .accent { color: #ff5000; }

        .contact-desc {
          font-family: 'Barlow', sans-serif;
          font-size: 0.95rem;
          color: rgba(255,255,255,0.5);
          line-height: 1.7;
          margin-bottom: 2.5rem;
        }

        .contact-info-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .contact-info-icon {
          width: 42px;
          height: 42px;
          background: rgba(255,80,0,0.1);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ff5000;
          flex-shrink: 0;
        }

        .contact-info-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin-bottom: 0.2rem;
        }

        .contact-info-value {
          font-family: 'Barlow', sans-serif;
          font-size: 0.92rem;
          color: rgba(255,255,255,0.75);
          font-weight: 500;
        }

        /* Form */
        .contact-form-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 2.5rem;
          position: relative;
          overflow: hidden;
        }

        .contact-form-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(to right, #ff5000, #ff2d55, #ffb400);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        @media (max-width: 480px) {
          .form-row { grid-template-columns: 1fr; }
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          margin-bottom: 1rem;
        }

        .form-group label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          font-family: 'Barlow', sans-serif;
          font-size: 0.9rem;
          color: #fff;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          width: 100%;
          box-sizing: border-box;
          appearance: none;
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: rgba(255,255,255,0.2);
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: rgba(255,80,0,0.5);
          background: rgba(255,80,0,0.05);
          box-shadow: 0 0 0 3px rgba(255,80,0,0.08);
        }

        .form-group select option {
          background: #15151f;
          color: #fff;
        }

        .form-group textarea {
          min-height: 120px;
          resize: vertical;
        }

        .form-submit {
          width: 100%;
          padding: 0.9rem;
          background: linear-gradient(135deg, #ff5000, #ff2d55);
          border: none;
          border-radius: 8px;
          color: #fff;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 6px 24px rgba(255,80,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .form-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(255,80,0,0.5);
        }

        /* Success */
        .form-success {
          text-align: center;
          padding: 3rem 1rem;
        }

        .form-success-icon {
          width: 64px;
          height: 64px;
          background: rgba(255,80,0,0.15);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem;
          color: #ff5000;
        }

        .form-success-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2rem;
          color: #fff;
          margin: 0 0 0.5rem;
        }

        .form-success-text {
          font-family: 'Barlow', sans-serif;
          font-size: 0.9rem;
          color: rgba(255,255,255,0.5);
        }

        /* Footer bar */
        .footer-bar {
          background: #05050a;
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 2rem 2.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .footer-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.4rem;
          letter-spacing: 0.08em;
          color: #fff;
        }

        .footer-logo span { color: #ff5000; }

        .footer-copy {
          font-family: 'Barlow', sans-serif;
          font-size: 0.78rem;
          color: rgba(255,255,255,0.3);
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

      <section className="contact-section" id="contact" ref={ref}>
        <div className="contact-inner">
          {/* Info */}
          <div>
            <p className="section-label reveal">Get In Touch</p>
            <h2 className="contact-title reveal" style={{ transitionDelay: "0.1s" }}>
              Book Your <span className="accent">Event</span>
            </h2>
            <p className="contact-desc reveal" style={{ transitionDelay: "0.2s" }}>
              Ready to make your event legendary? Send us the details and we'll get back to you within 24 hours with a custom quote.
            </p>

            <div className="contact-info-item reveal" style={{ transitionDelay: "0.3s" }}>
              <div className="contact-info-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.71 3.18 2 2 0 0 1 3.68 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.64a16 16 0 0 0 6 6l1-1.02a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div>
                <div className="contact-info-label">Phone / Viber</div>
                <div className="contact-info-value">+63 912 345 6789</div>
              </div>
            </div>

            <div className="contact-info-item reveal" style={{ transitionDelay: "0.35s" }}>
              <div className="contact-info-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <div className="contact-info-label">Email</div>
                <div className="contact-info-value">rentals@maudiolights.com</div>
              </div>
            </div>

            <div className="contact-info-item reveal" style={{ transitionDelay: "0.4s" }}>
              <div className="contact-info-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <div className="contact-info-label">Service Area</div>
                <div className="contact-info-value">Metro Manila &amp; nearby provinces</div>
              </div>
            </div>

            <div className="contact-info-item reveal" style={{ transitionDelay: "0.45s" }}>
              <div className="contact-info-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div>
                <div className="contact-info-label">Booking Lead Time</div>
                <div className="contact-info-value">At least 3 days in advance</div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="contact-form-card reveal" style={{ transitionDelay: "0.2s" }}>
            {sent ? (
              <div className="form-success">
                <div className="form-success-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="form-success-title">Message Sent!</p>
                <p className="form-success-text">We'll get back to you within 24 hours with your quote.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Your Name</label>
                    <input
                      type="text"
                      placeholder="Juan dela Cruz"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      placeholder="juan@email.com"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Event Type</label>
                  <select
                    value={form.event}
                    onChange={(e) => setForm({ ...form, event: e.target.value })}
                    required
                  >
                    <option value="" disabled>Select event type...</option>
                    <option>Concert / Live Performance</option>
                    <option>Wedding Reception</option>
                    <option>Corporate Event</option>
                    <option>Birthday / Private Party</option>
                    <option>Festival / Outdoor Event</option>
                    <option>School / Campus Event</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Message / Equipment Needed</label>
                  <textarea
                    placeholder="Tell us about your event, expected number of guests, venue, and what equipment you need..."
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>

                <button type="submit" className="form-submit">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-bar">
        <div className="footer-logo">M <span>Audio</span> Lights &amp; Sound</div>
        <p className="footer-copy">© {new Date().getFullYear()} M Audio Lights &amp; Sound. All rights reserved.</p>
      </footer>
    </>
  );
}