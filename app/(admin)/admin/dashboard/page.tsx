"use client";
// app/admin/dashboard/page.tsx
import React, { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: { name: string };
  address: { city: string; street: string };
}

const StatCard = ({
  label,
  value,
  sub,
  icon,
  color,
  delay,
}: {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
  color: string;
  delay: string;
}) => (
  <div className="stat-card" style={{ animationDelay: delay }}>
    <div className="stat-icon" style={{ background: color }}>
      {icon}
    </div>
    <div className="stat-body">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
      <span className="stat-sub">{sub}</span>
    </div>
    <div className="stat-glow" style={{ background: color }} />
  </div>
);

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((r) => r.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load users.");
        setLoading(false);
      });
  }, []);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.company.name.toLowerCase().includes(search.toLowerCase())
  );

  const cities = [...new Set(users.map((u) => u.address.city))].length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,400;0,500;1,400&display=swap');

        .dash-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #f0f2f7;
          padding: 2.5rem 2.5rem 3rem;
          position: relative;
        }

        .dash-root::before {
          content: '';
          position: fixed;
          top: -200px;
          right: -100px;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .dash-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 2.25rem;
          position: relative;
          z-index: 1;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .dash-title {
          font-family: 'Syne', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1;
          margin: 0;
        }

        .dash-title span {
          color: #6366f1;
        }

        .dash-subtitle {
          margin: 0.35rem 0 0;
          color: #64748b;
          font-size: 0.88rem;
        }

        .dash-date {
          font-size: 0.8rem;
          color: #94a3b8;
          font-style: italic;
        }

        /* Stat cards */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.25rem;
          margin-bottom: 2.25rem;
          position: relative;
          z-index: 1;
        }

        .stat-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 1.4rem 1.5rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          position: relative;
          overflow: hidden;
          animation: fadeUp 0.5s ease both;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }

        .stat-glow {
          position: absolute;
          bottom: -30px;
          right: -30px;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          opacity: 0.08;
          filter: blur(20px);
        }

        .stat-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-body {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .stat-label {
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #94a3b8;
        }

        .stat-value {
          font-family: 'Syne', sans-serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.1;
        }

        .stat-sub {
          font-size: 0.75rem;
          color: #64748b;
        }

        /* Users table section */
        .users-section {
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          overflow: hidden;
          position: relative;
          z-index: 1;
          animation: fadeUp 0.5s 0.3s ease both;
        }

        .users-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 1.75rem 1.25rem;
          border-bottom: 1px solid #f1f5f9;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .users-section-title {
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .users-count-badge {
          font-size: 0.75rem;
          background: #f1f5f9;
          color: #64748b;
          padding: 0.25rem 0.65rem;
          border-radius: 20px;
          font-weight: 500;
        }

        .search-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 0.45rem 0.85rem;
          transition: border-color 0.2s;
        }

        .search-bar:focus-within {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }

        .search-bar input {
          border: none;
          background: transparent;
          outline: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          color: #334155;
          width: 200px;
        }

        .search-bar input::placeholder {
          color: #94a3b8;
        }

        /* Table */
        .users-table-wrap {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead tr {
          border-bottom: 1px solid #f1f5f9;
        }

        th {
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: #94a3b8;
          padding: 0.75rem 1.75rem;
          text-align: left;
          white-space: nowrap;
        }

        tbody tr {
          border-bottom: 1px solid #f8fafc;
          transition: background 0.15s ease;
        }

        tbody tr:last-child {
          border-bottom: none;
        }

        tbody tr:hover {
          background: #f8fafc;
        }

        td {
          padding: 0.95rem 1.75rem;
          font-size: 0.875rem;
          color: #334155;
          vertical-align: middle;
          white-space: nowrap;
        }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
        }

        .user-name {
          font-weight: 500;
          color: #0f172a;
        }

        .user-username {
          font-size: 0.78rem;
          color: #94a3b8;
        }

        .company-pill {
          display: inline-block;
          background: #f1f5f9;
          color: #475569;
          padding: 0.2rem 0.65rem;
          border-radius: 20px;
          font-size: 0.78rem;
          font-weight: 500;
        }

        .city-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          color: #64748b;
          font-size: 0.82rem;
        }

        /* Loading / Error */
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem;
          gap: 1rem;
        }

        .spinner {
          width: 36px;
          height: 36px;
          border: 3px solid #e2e8f0;
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        .loading-text {
          color: #94a3b8;
          font-size: 0.88rem;
        }

        .skeleton-row td {
          padding: 1.1rem 1.75rem;
        }

        .skeleton {
          height: 14px;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          border-radius: 6px;
          animation: shimmer 1.4s infinite;
        }

        .skeleton.short { width: 60px; }
        .skeleton.medium { width: 120px; }
        .skeleton.long { width: 180px; }
        .skeleton.circle { width: 36px; height: 36px; border-radius: 50%; }

        .no-results {
          text-align: center;
          padding: 3rem;
          color: #94a3b8;
          font-size: 0.9rem;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div className="dash-root">
        {/* Header */}
        <div className="dash-header">
          <div>
            <h1 className="dash-title">
              Admin <span>Dashboard</span>
            </h1>
            <p className="dash-subtitle">Welcome back — here's what's happening today.</p>
          </div>
          <span className="dash-date">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        {/* Stat Cards */}
        <div className="stats-grid">
          <StatCard
            label="Total Users"
            value={loading ? "—" : users.length}
            sub="From JSONPlaceholder API"
            delay="0s"
            color="linear-gradient(135deg, #6366f1, #818cf8)"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
          />
          <StatCard
            label="Cities"
            value={loading ? "—" : cities}
            sub="Unique locations"
            delay="0.08s"
            color="linear-gradient(135deg, #06b6d4, #22d3ee)"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            }
          />
          <StatCard
            label="Companies"
            value={loading ? "—" : [...new Set(users.map((u) => u.company.name))].length}
            sub="Distinct organizations"
            delay="0.16s"
            color="linear-gradient(135deg, #f59e0b, #fbbf24)"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            }
          />
          <StatCard
            label="Websites"
            value={loading ? "—" : users.filter((u) => u.website).length}
            sub="Users with websites"
            delay="0.24s"
            color="linear-gradient(135deg, #10b981, #34d399)"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            }
          />
        </div>

        {/* Users Table */}
        <div className="users-section">
          <div className="users-section-header">
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <h2 className="users-section-title">All Users</h2>
              {!loading && (
                <span className="users-count-badge">
                  {filtered.length} of {users.length}
                </span>
              )}
            </div>
            <div className="search-bar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="users-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Company</th>
                  <th>City</th>
                  <th>Website</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="skeleton-row">
                      <td>
                        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                          <div className="skeleton circle" />
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <div className="skeleton long" />
                            <div className="skeleton short" />
                          </div>
                        </div>
                      </td>
                      <td><div className="skeleton medium" /></td>
                      <td><div className="skeleton medium" /></td>
                      <td><div className="skeleton medium" /></td>
                      <td><div className="skeleton short" /></td>
                      <td><div className="skeleton medium" /></td>
                    </tr>
                  ))
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="no-results">{error}</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="no-results">No users found matching "{search}"</td>
                  </tr>
                ) : (
                  filtered.map((user, i) => {
                    const avatarColors = [
                      "linear-gradient(135deg,#6366f1,#818cf8)",
                      "linear-gradient(135deg,#06b6d4,#22d3ee)",
                      "linear-gradient(135deg,#f59e0b,#fbbf24)",
                      "linear-gradient(135deg,#10b981,#34d399)",
                      "linear-gradient(135deg,#ec4899,#f472b6)",
                      "linear-gradient(135deg,#8b5cf6,#a78bfa)",
                    ];
                    const initials = user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
                    return (
                      <tr key={user.id}>
                        <td>
                          <div className="user-cell">
                            <div
                              className="user-avatar"
                              style={{ background: avatarColors[i % avatarColors.length] }}
                            >
                              {initials}
                            </div>
                            <div>
                              <div className="user-name">{user.name}</div>
                              <div className="user-username">@{user.username}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ color: "#475569" }}>{user.email}</td>
                        <td style={{ color: "#64748b", fontVariantNumeric: "tabular-nums" }}>{user.phone}</td>
                        <td>
                          <span className="company-pill">{user.company.name}</span>
                        </td>
                        <td>
                          <span className="city-tag">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                            </svg>
                            {user.address.city}
                          </span>
                        </td>
                        <td>
                          <a
                            href={`https://${user.website}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: "#6366f1", textDecoration: "none", fontSize: "0.82rem" }}
                          >
                            {user.website}
                          </a>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}