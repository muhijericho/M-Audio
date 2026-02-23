"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError(data.error || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "#05050a"
    }}>
      <div style={{
        background: "#0f0f1a", border: "1px solid rgba(255,80,0,0.2)",
        borderRadius: "12px", padding: "2.5rem", width: "100%", maxWidth: "400px"
      }}>
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem",
          color: "#fff", marginBottom: "0.25rem"
        }}>
          M <span style={{ color: "#ff5000" }}>Audio</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", marginBottom: "2rem" }}>
          Admin Login
        </p>

        {error && (
          <div style={{
            background: "rgba(255,45,85,0.1)", border: "1px solid rgba(255,45,85,0.3)",
            borderRadius: "6px", padding: "0.75rem", marginBottom: "1rem",
            color: "#ff2d55", fontSize: "0.85rem"
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem",
            letterSpacing: "0.1em", textTransform: "uppercase", display: "block",
            marginBottom: "0.5rem" }}>
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%", background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px",
              padding: "0.75rem 1rem", color: "#fff", fontSize: "0.9rem",
              outline: "none", boxSizing: "border-box"
            }}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem",
            letterSpacing: "0.1em", textTransform: "uppercase", display: "block",
            marginBottom: "0.5rem" }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{
              width: "100%", background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px",
              padding: "0.75rem 1rem", color: "#fff", fontSize: "0.9rem",
              outline: "none", boxSizing: "border-box"
            }}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%", background: "linear-gradient(135deg, #ff5000, #ff2d55)",
            border: "none", borderRadius: "6px", padding: "0.85rem",
            color: "#fff", fontSize: "0.85rem", fontWeight: "600",
            letterSpacing: "0.1em", textTransform: "uppercase",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}