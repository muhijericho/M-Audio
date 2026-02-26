"use client";
// (root)/components/Home.tsx
import React, { useEffect, useRef, useState } from "react";

interface Particle {
  left: string;
  animationDuration: string;
  animationDelay: string;
}

export default function Home() {
  const beamsRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Generate particles ONLY on the client to avoid SSR/hydration mismatch
  useEffect(() => {
    setParticles(
      Array.from({ length: 18 }).map(() => ({
        left: `${Math.random() * 100}%`,
        animationDuration: `${4 + Math.random() * 6}s`,
        animationDelay: `${Math.random() * 6}s`,
      }))
    );
  }, []);

  // Mouse parallax on light beams
  useEffect(() => {
    const el = beamsRef.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      el.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500&display=swap');

        .hero {
          position: relative;
          height: 100vh;
          min-height: 700px;
          background: #05050a;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          text-align: center;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 60%, rgba(255,80,0,0.13) 0%, transparent 70%),
                      radial-gradient(ellipse 50% 40% at 20% 80%, rgba(255,45,85,0.08) 0%, transparent 60%),
                      radial-gradient(ellipse 40% 30% at 80% 20%, rgba(255,180,0,0.06) 0%, transparent 60%);
        }

        .hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,80,0,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,80,0,0.07) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%);
          animation: grid-pulse 6s ease infinite;
        }

        .hero-beams {
          position: absolute;
          inset: -20%;
          transition: transform 0.3s ease;
          pointer-events: none;
        }

        .beam {
          position: absolute;
          top: 0;
          width: 2px;
          height: 80%;
          transform-origin: top center;
          animation: beam-sweep 8s ease-in-out infinite;
        }

        .beam::after {
          content: '';
          position: absolute;
          top: 0; left: -30px;
          width: 60px;
          height: 100%;
          background: inherit;
          filter: blur(20px);
          opacity: 0.4;
        }

        .beam-1 { left: 20%; background: linear-gradient(to bottom, rgba(255,80,0,0.8), transparent); animation-delay: 0s; }
        .beam-2 { left: 35%; background: linear-gradient(to bottom, rgba(255,180,0,0.6), transparent); animation-delay: 1.5s; transform: rotate(-8deg); }
        .beam-3 { left: 50%; background: linear-gradient(to bottom, rgba(255,45,85,0.7), transparent); animation-delay: 3s; }
        .beam-4 { left: 65%; background: linear-gradient(to bottom, rgba(255,180,0,0.6), transparent); animation-delay: 4.5s; transform: rotate(8deg); }
        .beam-5 { left: 80%; background: linear-gradient(to bottom, rgba(255,80,0,0.8), transparent); animation-delay: 6s; }

        .hero-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #ff5000;
          animation: float-particle linear infinite;
        }

        .particle:nth-child(2n) { background: #ffb400; width: 2px; height: 2px; }
        .particle:nth-child(3n) { background: #ff2d55; }

        .hero-content {
          position: relative;
          z-index: 10;
          padding: 0 1.5rem;
          max-width: 1000px;
        }

        .hero-eyebrow {
          font-family: 'Barlow', sans-serif;
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #ff5000;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          animation: fadeUp 0.8s 0.2s ease both;
        }

        .hero-eyebrow::before,
        .hero-eyebrow::after {
          content: '';
          height: 1px;
          width: 40px;
          background: linear-gradient(to right, transparent, #ff5000);
        }

        .hero-eyebrow::after {
          background: linear-gradient(to left, transparent, #ff5000);
        }

        .hero-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(3.2rem, 9vw, 7rem);
          line-height: 1;
          color: #fff;
          margin: 0 0 0.75rem;
          animation: fadeUp 0.8s 0.4s ease both;
          text-shadow: 0 0 80px rgba(255,80,0,0.3);
          letter-spacing: 0.02em;
        }

        .hero-title .line-1 {
          display: block;
          -webkit-text-stroke: 2px #ff5000;
          color: transparent;
        }

        .hero-title .line-2 {
          display: block;
          color: #ff5000;
          margin-top: -0.15em;
        }

        .hero-title .amp {
          color: #fff;
          -webkit-text-stroke: 0;
        }

        .hero-sub {
          font-family: 'Barlow', sans-serif;
          font-size: 1.1rem;
          color: rgba(255,255,255,0.6);
          max-width: 550px;
          margin: 1.75rem auto 2.5rem;
          line-height: 1.6;
          animation: fadeUp 0.8s 0.6s ease both;
        }

        .hero-cta-group {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          animation: fadeUp 0.8s 0.8s ease both;
        }

        .hero-btn-primary {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: linear-gradient(135deg, #ff5000, #ff2d55);
          color: #fff;
          border: none;
          padding: 0.85rem 2.5rem;
          border-radius: 4px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 6px 32px rgba(255,80,0,0.4);
        }

        .hero-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 40px rgba(255,80,0,0.55);
        }

        .hero-btn-outline {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: transparent;
          color: #fff;
          border: 1.5px solid rgba(255,255,255,0.3);
          padding: 0.85rem 2.5rem;
          border-radius: 4px;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
        }

        .hero-btn-outline:hover {
          border-color: #ff5000;
          color: #ff5000;
        }

        .hero-scroll {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          color: rgba(255,255,255,0.35);
          font-family: 'Barlow', sans-serif;
          font-size: 0.72rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          animation: fadeIn 1s 1.5s ease both;
        }

        .scroll-line {
          width: 1px;
          height: 50px;
          background: linear-gradient(to bottom, rgba(255,80,0,0.8), transparent);
          animation: scroll-line 1.8s ease-in-out infinite;
        }

        .hero-eq {
          position: absolute;
          bottom: 0;
          right: 3rem;
          display: flex;
          align-items: flex-end;
          gap: 4px;
          height: 80px;
          opacity: 0.2;
          animation: fadeIn 1s 1s ease both;
        }

        .eq-bar {
          width: 5px;
          background: linear-gradient(to top, #ff5000, #ffb400);
          border-radius: 2px 2px 0 0;
          animation: eq-bounce 0.8s ease-in-out infinite alternate;
        }

        .eq-bar:nth-child(1) { height: 30%; animation-delay: 0s; }
        .eq-bar:nth-child(2) { height: 70%; animation-delay: 0.1s; }
        .eq-bar:nth-child(3) { height: 100%; animation-delay: 0.2s; }
        .eq-bar:nth-child(4) { height: 55%; animation-delay: 0.3s; }
        .eq-bar:nth-child(5) { height: 80%; animation-delay: 0.4s; }
        .eq-bar:nth-child(6) { height: 40%; animation-delay: 0.5s; }
        .eq-bar:nth-child(7) { height: 65%; animation-delay: 0.6s; }
        .eq-bar:nth-child(8) { height: 90%; animation-delay: 0.7s; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes beam-sweep {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        @keyframes grid-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        @keyframes float-particle {
          0% { transform: translateY(100vh) scale(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-10vh) scale(1); opacity: 0; }
        }

        @keyframes scroll-line {
          0% { transform: scaleY(0); transform-origin: top; }
          50% { transform: scaleY(1); transform-origin: top; }
          51% { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }

        @keyframes eq-bounce {
          from { transform: scaleY(0.3); }
          to { transform: scaleY(1); }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: clamp(2.8rem, 11vw, 5.5rem);
            letter-spacing: 0.01em;
          }
          .hero-sub {
            font-size: 1rem;
            padding: 0 1rem;
          }
          .hero-eq {
            right: 1.5rem;
            height: 60px;
          }
          .eq-bar { width: 4px; }
        }
      `}</style>

      <section className="hero" id="home">
        <div className="hero-bg" />
        <div className="hero-grid" />

        <div className="hero-beams" ref={beamsRef}>
          <div className="beam beam-1" />
          <div className="beam beam-2" />
          <div className="beam beam-3" />
          <div className="beam beam-4" />
          <div className="beam beam-5" />
        </div>

        {/* Particles — client-side only */}
        <div className="hero-particles">
          {particles.map((p, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: p.left,
                animationDuration: p.animationDuration,
                animationDelay: p.animationDelay,
              }}
            />
          ))}
        </div>

        <div className="hero-content">
          <p className="hero-eyebrow">Premium Sound • Lighting • Event Production</p>
          
          <h1 className="hero-title">
            <span className="line-1">M AUDIO </span>
            <span className="line-2">LIGHTS <span className="amp">&</span> SOUNDS</span>
          </h1>
          
          <p className="hero-sub">
            Professional-grade audio systems, intelligent stage lighting, and full-scale event production equipment. 
            We power unforgettable moments with cutting-edge technology and expert support.
          </p>
          
          <div className="hero-cta-group">
            <button
              className="hero-btn-primary"
              onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
            >
              Explore Rentals
            </button>
            <button
              className="hero-btn-outline"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              Get a Quote
            </button>
          </div>
        </div>

        <div className="hero-eq">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="eq-bar" />)}
        </div>

        <div className="hero-scroll">
          <div className="scroll-line" />
          Scroll
        </div>
      </section>
    </>
  );
}