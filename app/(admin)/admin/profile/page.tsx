"use client";
// app/admin/profile/page.tsx
import React, { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: { name: string; catchPhrase: string; bs: string };
  address: { street: string; suite: string; city: string; zipcode: string };
}

const avatarColors = [
  "linear-gradient(135deg,#6366f1,#818cf8)",
  "linear-gradient(135deg,#06b6d4,#22d3ee)",
  "linear-gradient(135deg,#f59e0b,#fbbf24)",
  "linear-gradient(135deg,#10b981,#34d399)",
  "linear-gradient(135deg,#ec4899,#f472b6)",
  "linear-gradient(135deg,#8b5cf6,#a78bfa)",
  "linear-gradient(135deg,#ef4444,#f87171)",
  "linear-gradient(135deg,#0ea5e9,#38bdf8)",
  "linear-gradient(135deg,#f97316,#fb923c)",
  "linear-gradient(135deg,#14b8a6,#2dd4bf)",
];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function Profile() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((r) => r.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.company.name.toLowerCase().includes(search.toLowerCase()) ||
      u.address.city.toLowerCase().includes(search.toLowerCase())
  );

  const selected = users.find((u) => u.id === selectedId) ?? null;
  const selectedIndex = users.findIndex((u) => u.id === selectedId);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&display=swap');

        .profile-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #f0f2f7;
          padding: 2.5rem 2.5rem 3rem;
        }

        .profile-page-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .profile-page-title {
          font-family: 'Syne', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 0.25rem;
        }

        .profile-page-title span { color: #6366f1; }

        .profile-page-sub {
          margin: 0;
          color: #64748b;
          font-size: 0.88rem;
        }

        .profile-search-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 0.5rem 0.9rem;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .profile-search-bar:focus-within {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }

        .profile-search-bar input {
          border: none;
          background: transparent;
          outline: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          color: #334155;
          width: 200px;
        }

        .profile-search-bar input::placeholder { color: #94a3b8; }

        /* Master-detail layout */
        .profile-layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 1.5rem;
          align-items: start;
        }

        /* User list */
        .users-list-card {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          overflow: hidden;
          animation: fadeUp 0.4s ease both;
        }

        .users-list-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .users-list-title {
          font-family: 'Syne', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .count-badge {
          font-size: 0.72rem;
          background: #f1f5f9;
          color: #64748b;
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
          font-weight: 500;
        }

        .user-list-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.9rem 1.5rem;
          cursor: pointer;
          border-bottom: 1px solid #f8fafc;
          transition: background 0.15s ease;
          border-left: 3px solid transparent;
        }

        .user-list-item:last-child { border-bottom: none; }
        .user-list-item:hover { background: #f8fafc; }

        .user-list-item.active {
          background: rgba(99,102,241,0.04);
          border-left-color: #6366f1;
        }

        .user-list-item.active .ulist-name { color: #6366f1; }

        .ulist-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 0.8rem;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
        }

        .ulist-info { flex: 1; min-width: 0; }

        .ulist-name {
          font-weight: 500;
          font-size: 0.9rem;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color 0.15s;
        }

        .ulist-meta {
          font-size: 0.78rem;
          color: #94a3b8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ulist-city {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: #94a3b8;
          flex-shrink: 0;
        }

        /* Detail panel */
        .profile-detail-panel {
          position: sticky;
          top: 2rem;
          animation: fadeUp 0.45s 0.1s ease both;
        }

        .detail-empty {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          padding: 3rem 2rem;
          text-align: center;
          color: #94a3b8;
        }

        .detail-empty-icon {
          width: 56px;
          height: 56px;
          background: #f1f5f9;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }

        .detail-empty p { margin: 0; font-size: 0.88rem; }

        /* Profile detail card */
        .profile-card {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          overflow: hidden;
        }

        .profile-banner {
          height: 80px;
          position: relative;
        }

        .profile-banner-close {
          position: absolute;
          top: 0.65rem;
          right: 0.75rem;
          width: 28px;
          height: 28px;
          background: rgba(255,255,255,0.2);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          transition: background 0.15s;
        }

        .profile-banner-close:hover { background: rgba(255,255,255,0.35); }

        .profile-card-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          border: 3px solid #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: #fff;
          position: absolute;
          bottom: -32px;
          left: 1.5rem;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }

        .profile-card-body { padding: 2.5rem 1.5rem 1.5rem; }

        .profile-card-name {
          font-family: 'Syne', sans-serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 0.15rem;
        }

        .profile-card-username {
          font-size: 0.82rem;
          color: #94a3b8;
          margin: 0 0 1.25rem;
        }

        .detail-divider {
          border: none;
          border-top: 1px solid #f1f5f9;
          margin: 1rem 0;
        }

        .detail-section-label {
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #94a3b8;
          margin: 0 0 0.75rem;
        }

        .detail-row {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          margin-bottom: 0.75rem;
        }

        .detail-row-icon {
          width: 28px;
          height: 28px;
          background: #f8fafc;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .detail-row-content label {
          display: block;
          font-size: 0.68rem;
          color: #94a3b8;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 1px;
        }

        .detail-row-content p, .detail-row-content a {
          margin: 0;
          font-size: 0.85rem;
          color: #334155;
          font-weight: 500;
          word-break: break-word;
          line-height: 1.5;
        }

        .detail-row-content a {
          color: #6366f1;
          text-decoration: none;
        }

        .company-block {
          background: linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.04));
          border: 1px solid rgba(99,102,241,0.12);
          border-radius: 12px;
          padding: 1rem 1.1rem;
        }

        .company-block-name {
          font-family: 'Syne', sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 0.25rem;
        }

        .company-block-phrase {
          font-size: 0.78rem;
          color: #64748b;
          font-style: italic;
          margin: 0;
          line-height: 1.4;
        }

        /* Skeleton */
        .skeleton {
          height: 14px;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          border-radius: 6px;
          animation: shimmer 1.4s infinite;
        }

        .no-results-msg {
          padding: 2.5rem;
          text-align: center;
          color: #94a3b8;
          font-size: 0.88rem;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div className="profile-root">
        <div className="profile-page-header">
          <div>
            <h1 className="profile-page-title">User <span>Profiles</span></h1>
            <p className="profile-page-sub">Browse and inspect all registered user accounts.</p>
          </div>
          <div className="profile-search-bar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search profiles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="profile-layout">
          {/* LEFT: List */}
          <div className="users-list-card">
            <div className="users-list-header">
              <h2 className="users-list-title">All Users</h2>
              {!loading && (
                <span className="count-badge">{filtered.length} of {users.length}</span>
              )}
            </div>

            {loading ? (
              Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="user-list-item" style={{ cursor: "default" }}>
                  <div className="skeleton" style={{ width: 42, height: 42, borderRadius: "50%", flexShrink: 0 }} />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                    <div className="skeleton" style={{ width: "50%" }} />
                    <div className="skeleton" style={{ width: "70%" }} />
                  </div>
                  <div className="skeleton" style={{ width: 60 }} />
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div className="no-results-msg">No users match "{search}"</div>
            ) : (
              filtered.map((user, i) => (
                <div
                  key={user.id}
                  className={`user-list-item${selectedId === user.id ? " active" : ""}`}
                  onClick={() => setSelectedId(selectedId === user.id ? null : user.id)}
                >
                  <div className="ulist-avatar" style={{ background: avatarColors[i % avatarColors.length] }}>
                    {getInitials(user.name)}
                  </div>
                  <div className="ulist-info">
                    <div className="ulist-name">{user.name}</div>
                    <div className="ulist-meta">{user.email}</div>
                  </div>
                  <div className="ulist-city">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                    {user.address.city}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* RIGHT: Detail */}
          <div className="profile-detail-panel">
            {!selected ? (
              <div className="detail-empty">
                <div className="detail-empty-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <p>Select a user to view their full profile.</p>
              </div>
            ) : (
              <div className="profile-card" key={selected.id}>
                <div
                  className="profile-banner"
                  style={{ background: avatarColors[selectedIndex % avatarColors.length] }}
                >
                  <button className="profile-banner-close" onClick={() => setSelectedId(null)} aria-label="Close">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                  <div
                    className="profile-card-avatar"
                    style={{ background: avatarColors[selectedIndex % avatarColors.length] }}
                  >
                    {getInitials(selected.name)}
                  </div>
                </div>

                <div className="profile-card-body">
                  <div className="profile-card-name">{selected.name}</div>
                  <div className="profile-card-username">@{selected.username}</div>

                  <p className="detail-section-label">Contact</p>

                  <div className="detail-row">
                    <div className="detail-row-icon">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </div>
                    <div className="detail-row-content">
                      <label>Email</label>
                      <p>{selected.email}</p>
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-row-icon">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.71 3.18 2 2 0 0 1 3.68 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.64a16 16 0 0 0 6 6l1-1.02a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <div className="detail-row-content">
                      <label>Phone</label>
                      <p>{selected.phone}</p>
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-row-icon">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                    </div>
                    <div className="detail-row-content">
                      <label>Website</label>
                      <a href={`https://${selected.website}`} target="_blank" rel="noreferrer">{selected.website}</a>
                    </div>
                  </div>

                  <hr className="detail-divider" />
                  <p className="detail-section-label">Address</p>

                  <div className="detail-row">
                    <div className="detail-row-icon">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div className="detail-row-content">
                      <label>Full Address</label>
                      <p>{selected.address.street}, {selected.address.suite}</p>
                      <p>{selected.address.city}, {selected.address.zipcode}</p>
                    </div>
                  </div>

                  <hr className="detail-divider" />
                  <p className="detail-section-label">Company</p>

                  <div className="company-block">
                    <p className="company-block-name">{selected.company.name}</p>
                    <p className="company-block-phrase">"{selected.company.catchPhrase}"</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}