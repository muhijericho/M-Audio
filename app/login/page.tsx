"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"ADMIN" | "CLIENT">("CLIENT");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

const handleLogin = async () => {
  setLoading(true);
  setError("");

  const endpoint =
    role === "ADMIN" ? "/api/auth/login" : "/api/auth/client-login";

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (res.ok) {
    router.push(role === "ADMIN" ? "/admin/dashboard" : "/client/dashboard");
  } else {
    // Show role-specific error message
    setError(
      role === "ADMIN"
        ? "Invalid admin credentials. Make sure you selected the correct role."
        : "Invalid client credentials. Make sure you selected the correct role."
    );
  }

  setLoading(false);
};

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #05050a;
          font-family: 'Barlow', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .login-root::before {
          content: '';
          position: absolute;
          top: -250px; left: -250px;
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(255,80,0,0.07) 0%, transparent 60%);
          pointer-events: none;
        }

        .login-root::after {
          content: '';
          position: absolute;
          bottom: -200px; right: -200px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(255,45,85,0.05) 0%, transparent 60%);
          pointer-events: none;
        }

        .login-card {
          width: 100%;
          max-width: 440px;
          background: #0f0f1a;
          border: 1px solid rgba(255,80,0,0.2);
          border-radius: 16px;
          padding: 2.75rem;
          position: relative;
          z-index: 1;
          box-shadow: 0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03);
        }

        /* Logo */
        .login-logo {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          margin-bottom: 2rem;
        }

        .login-logo-icon {
          width: 40px; height: 40px;
          background: linear-gradient(135deg, #ff5000, #ff2d55);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 18px rgba(255,80,0,0.45);
          flex-shrink: 0;
        }

        .login-logo-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.7rem;
          letter-spacing: 0.06em;
          color: #fff;
          line-height: 1;
        }

        .login-logo-name span { color: #ff5000; }

        .login-logo-sub {
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          margin-top: 3px;
        }

        /* Role Toggle */
        .role-toggle {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 4px;
          margin-bottom: 2rem;
          gap: 4px;
        }

        .role-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.7rem 1rem;
          border-radius: 7px;
          border: none;
          background: transparent;
          color: rgba(255,255,255,0.4);
          font-family: 'Barlow', sans-serif;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .role-btn.active {
          background: linear-gradient(135deg, #ff5000, #ff2d55);
          color: #fff;
          box-shadow: 0 4px 14px rgba(255,80,0,0.4);
        }

        .role-btn:not(.active):hover {
          color: rgba(255,255,255,0.7);
          background: rgba(255,255,255,0.05);
        }

        /* Heading */
        .login-heading {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.9rem;
          letter-spacing: 0.04em;
          color: #fff;
          line-height: 1;
        }

        .login-heading span { color: #ff5000; }

        .login-sub {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.3);
          margin-top: 0.4rem;
          margin-bottom: 1.75rem;
        }

        /* Error */
        .login-error {
          background: rgba(255,45,85,0.1);
          border: 1px solid rgba(255,45,85,0.3);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          margin-bottom: 1.25rem;
          color: #ff2d55;
          font-size: 0.83rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Fields */
        .login-field { margin-bottom: 1.1rem; }

        .login-label {
          display: block;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-bottom: 0.5rem;
        }

        .login-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 8px;
          padding: 0.8rem 1rem;
          color: #fff;
          font-family: 'Barlow', sans-serif;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }

        .login-input:focus {
          border-color: rgba(255,80,0,0.5);
          background: rgba(255,80,0,0.04);
        }

        .login-input::placeholder { color: rgba(255,255,255,0.15); }

        /* Button */
        .login-btn {
          width: 100%;
          background: linear-gradient(135deg, #ff5000, #ff2d55);
          border: none;
          border-radius: 8px;
          padding: 0.9rem;
          color: #fff;
          font-family: 'Barlow', sans-serif;
          font-size: 0.83rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          margin-top: 0.75rem;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(255,80,0,0.35);
        }

        .login-btn:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(255,80,0,0.5);
        }

        .login-btn:active:not(:disabled) { transform: translateY(0); }
        .login-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Footer note */
        .login-footer {
          margin-top: 1.5rem;
          text-align: center;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.2);
        }
      `}</style>

      <div className="login-root">
        <div className="login-card">

          {/* Logo */}
          <div className="login-logo">
            <div className="login-logo-icon">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </div>
            <div>
              <div className="login-logo-name">M <span>Audio</span></div>
              <div className="login-logo-sub">Studio Booking Platform</div>
            </div>
          </div>

          {/* Role Toggle */}
          <div className="role-toggle">
            <button
              className={`role-btn${role === "CLIENT" ? " active" : ""}`}
              onClick={() => { setRole("CLIENT"); setError(""); }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Client
            </button>
            <button
              className={`role-btn${role === "ADMIN" ? " active" : ""}`}
              onClick={() => { setRole("ADMIN"); setError(""); }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Admin
            </button>
          </div>

          {/* Heading */}
          <div className="login-heading">
            Sign in as <span>{role === "ADMIN" ? "Admin" : "Client"}</span>
          </div>
          <p className="login-sub">
            {role === "ADMIN"
              ? "Access the admin dashboard to manage bookings."
              : "Access your portal to view and manage your sessions."}
          </p>

          {/* Error */}
          {error && (
            <div className="login-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {/* Fields */}
          <div className="login-field">
            <label className="login-label">Username</label>
            <input
              className="login-input"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="login-field">
            <label className="login-label">Password</label>
            <input
              className="login-input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          <button className="login-btn" onClick={handleLogin} disabled={loading}>
            {loading
              ? "Signing in..."
              : `Sign In as ${role === "ADMIN" ? "Admin" : "Client"}`}
          </button>

          <div className="login-footer">
            {role === "CLIENT"
              ? "Need an account? Contact your studio admin."
              : "Admin access is restricted to authorized personnel."}
          </div>
        </div>
      </div>
    </>
  );
}