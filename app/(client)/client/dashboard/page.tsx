"use client";
import { useEffect, useState, useRef } from "react";

type Venue = {
  id: number;
  venueName: string;
  address: string;
  city: string;
  notes: string;
  lat: number;
  lng: number;
};

type Inquiry = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  eventType: string;
  preferredDate: string;
  message: string;
  status: string;
  createdAt: string;
  venue?: Venue | null;
};

type Booking = {
  id: number;
  name: string;
  email: string;
  eventType: string;
  eventDate: string;
  status: string;
  createdAt: string;
};

const STATUS_META: Record<string, { label: string; color: string; bg: string; border: string; icon: string }> = {
  pending:   { label: "Pending",   color: "#f59e0b", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.2)",  icon: "⏳" },
  confirmed: { label: "Confirmed", color: "#10b981", bg: "rgba(16,185,129,0.08)",  border: "rgba(16,185,129,0.2)", icon: "✓" },
  cancelled: { label: "Cancelled", color: "#ef4444", bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.2)",  icon: "✕" },
};

// ── Venue Map Component ──────────────────────────────────────────────────────
function VenueMap({ venue }: { venue: Venue }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!expanded) return;

    const timer = setTimeout(() => {
      if (!mapRef.current || mapInstanceRef.current) return;

      const tryInit = () => {
        const L = (window as any).L;
        if (!L) return;

        const map = L.map(mapRef.current).setView([venue.lat, venue.lng], 15);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(map);

        const icon = L.divIcon({
          html: `<div style="
            width:32px;height:32px;
            background:linear-gradient(135deg,#ff5000,#ff2d55);
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            border:3px solid #fff;
            box-shadow:0 4px 14px rgba(255,80,0,0.7);
          "></div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          className: "",
        });

        L.marker([venue.lat, venue.lng], { icon })
          .addTo(map)
          .bindPopup(`<b>${venue.venueName}</b><br>${venue.city || ""}`)
          .openPopup();

        mapInstanceRef.current = map;
      };

      if ((window as any).L) {
        tryInit();
        return;
      }

      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      if (!document.querySelector('script[src*="leaflet"]')) {
        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = tryInit;
        document.head.appendChild(script);
      } else {
        setTimeout(tryInit, 300);
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      if (!expanded && mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [expanded, venue]);

  return (
    <div style={{ marginTop: "0.75rem" }}>
      <button
        onClick={() => setExpanded(p => !p)}
        style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          background: "rgba(255,80,0,0.08)", border: "1px solid rgba(255,80,0,0.2)",
          borderRadius: "8px", padding: "0.5rem 1rem",
          color: "#ff5000", fontFamily: "'Barlow', sans-serif",
          fontSize: "0.73rem", fontWeight: 700, letterSpacing: "0.1em",
          textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s",
          width: "100%", justifyContent: "center",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,80,0,0.14)")}
        onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,80,0,0.08)")}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
        {expanded ? "▲ Hide Map" : "🗺 View Pin on Map"}
      </button>

      {expanded && (
        <div style={{
          marginTop: "0.6rem",
          borderRadius: "10px",
          overflow: "hidden",
          border: "1px solid rgba(255,80,0,0.2)",
          position: "relative",
        }}>
          <div ref={mapRef} style={{ width: "100%", height: "280px" }} />
          <div style={{
            position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px",
            padding: "0.3rem 0.9rem", fontSize: "0.7rem", color: "rgba(255,255,255,0.55)",
            pointerEvents: "none", zIndex: 999, whiteSpace: "nowrap",
          }}>
            📍 {venue.lat.toFixed(5)}, {venue.lng.toFixed(5)}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────────────────
export default function ClientDashboard() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"inquiries" | "availability">("inquiries");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [iRes, bRes] = await Promise.all([
          fetch("/api/inquiry"),
          fetch("/api/booking"),
        ]);
        const iData = await iRes.json();
        const bData = await bRes.json();
        setInquiries(Array.isArray(iData?.inquiries) ? iData.inquiries : []);
        setBookings(Array.isArray(bData) ? bData : []);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  // Calendar
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });
  const bookedDates = new Set(bookings.filter(b => b.status !== "cancelled").map(b => b.eventDate));
  const calCells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calCells.push(d);
  const today = new Date();

  const pendingCount = inquiries.filter(i => i.status === "pending").length;
  const confirmedCount = inquiries.filter(i => i.status === "confirmed").length;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#05050a",
      fontFamily: "'Barlow', sans-serif",
      color: "#fff",
      padding: "2.5rem",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .cd-header { margin-bottom: 2.5rem; }
        .cd-title { font-family: 'Bebas Neue', sans-serif; font-size: 2.6rem; letter-spacing: 0.06em; line-height: 1; }
        .cd-title span { color: #ff5000; }
        .cd-subtitle { font-size: 0.83rem; color: rgba(255,255,255,0.3); margin-top: 0.4rem; font-weight: 400; }

        .cd-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem; }
        .cd-stat { background: #0f0f1a; border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 1.25rem 1.5rem; }
        .cd-stat-num { font-family: 'Bebas Neue', sans-serif; font-size: 2.2rem; color: #ff5000; line-height: 1; }
        .cd-stat-label { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.28); margin-top: 4px; }

        .cd-tabs { display: flex; gap: 0.4rem; margin-bottom: 1.75rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 5px; width: fit-content; }
        .cd-tab { padding: 0.6rem 1.4rem; border-radius: 7px; border: none; background: transparent; color: rgba(255,255,255,0.35); font-family: 'Barlow', sans-serif; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 0.5rem; }
        .cd-tab.active { background: linear-gradient(135deg, #ff5000, #ff2d55); color: #fff; box-shadow: 0 4px 14px rgba(255,80,0,0.35); }
        .cd-tab:not(.active):hover { color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.05); }

        .cd-card { background: #0f0f1a; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 1.5rem; margin-bottom: 1rem; position: relative; overflow: hidden; transition: border-color 0.2s, transform 0.2s; }
        .cd-card:hover { border-color: rgba(255,80,0,0.2); transform: translateY(-1px); }
        .cd-card::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: linear-gradient(180deg, #ff5000, #ff2d55); border-radius: 14px 0 0 14px; }

        .cd-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
        .cd-card-id { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,80,0,0.5); margin-bottom: 4px; }
        .cd-card-event { font-size: 1.05rem; font-weight: 700; color: #fff; }
        .cd-card-date { font-size: 0.78rem; color: rgba(255,255,255,0.35); margin-top: 3px; }

        .cd-badge { display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.25rem 0.85rem; border-radius: 20px; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; border: 1px solid; white-space: nowrap; }

        .cd-card-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem 1.5rem; margin-bottom: 1rem; }
        .cd-card-field { font-size: 0.8rem; }
        .cd-card-field-label { font-size: 0.62rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,80,0,0.45); margin-bottom: 2px; }
        .cd-card-field-val { color: rgba(255,255,255,0.65); }

        .cd-card-msg { font-size: 0.8rem; color: rgba(255,255,255,0.3); line-height: 1.55; padding-top: 0.85rem; border-top: 1px solid rgba(255,255,255,0.05); margin-bottom: 0.5rem; }

        .cd-venue { margin-top: 1rem; background: rgba(255,80,0,0.04); border: 1px solid rgba(255,80,0,0.13); border-radius: 10px; padding: 1rem 1.1rem; }
        .cd-venue-header { font-size: 0.62rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,80,0,0.5); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem; }
        .cd-venue-name { font-size: 0.92rem; font-weight: 700; color: #fff; margin-bottom: 3px; }
        .cd-venue-addr { font-size: 0.76rem; color: rgba(255,255,255,0.35); margin-bottom: 0.4rem; }
        .cd-venue-meta { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 0.4rem; }
        .cd-venue-chip { display: inline-flex; align-items: center; gap: 0.3rem; background: rgba(255,80,0,0.08); border: 1px solid rgba(255,80,0,0.15); border-radius: 20px; padding: 0.15rem 0.65rem; font-size: 0.67rem; font-weight: 600; color: rgba(255,120,50,0.8); text-transform: uppercase; letter-spacing: 0.08em; }

        .cd-cal-wrap { background: #0f0f1a; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 1.75rem; max-width: 640px; }
        .cd-cal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .cd-cal-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.5rem; letter-spacing: 0.06em; }
        .cd-cal-nav { display: flex; gap: 6px; }
        .cd-cal-nav button { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.5); width: 32px; height: 32px; border-radius: 7px; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
        .cd-cal-nav button:hover { background: rgba(255,80,0,0.15); color: #ff5000; border-color: rgba(255,80,0,0.3); }
        .cd-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; }
        .cd-cal-day-label { text-align: center; font-size: 0.62rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.18); padding: 0 0 8px; }
        .cd-cal-cell { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 0.82rem; border-radius: 8px; color: rgba(255,255,255,0.35); position: relative; transition: all 0.15s; }
        .cd-cal-cell.available { color: rgba(255,255,255,0.55); }
        .cd-cal-cell.available:hover { background: rgba(255,255,255,0.05); color: #fff; }
        .cd-cal-cell.booked { background: rgba(255,45,85,0.12); color: #ff2d55; font-weight: 700; border: 1px solid rgba(255,45,85,0.2); }
        .cd-cal-cell.today { background: rgba(255,255,255,0.07); color: #fff; font-weight: 700; }
        .cd-cal-cell.past { color: rgba(255,255,255,0.15); }

        .cd-legend { display: flex; gap: 1.5rem; margin-top: 1.25rem; flex-wrap: wrap; }
        .cd-legend-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.72rem; color: rgba(255,255,255,0.3); }
        .cd-legend-dot { width: 10px; height: 10px; border-radius: 3px; }

        .cd-avail-note { margin-top: 1.25rem; background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.15); border-radius: 10px; padding: 0.85rem 1.1rem; font-size: 0.78rem; color: rgba(16,185,129,0.7); line-height: 1.5; }

        .cd-empty { text-align: center; padding: 4rem 2rem; color: rgba(255,255,255,0.18); }
        .cd-empty-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
        .cd-empty-text { font-size: 0.88rem; }
        .cd-loading { display: flex; align-items: center; justify-content: center; padding: 4rem; gap: 0.75rem; color: rgba(255,255,255,0.2); font-size: 0.85rem; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 600px) {
          .cd-stats { grid-template-columns: 1fr 1fr; }
          .cd-card-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Header */}
      <div className="cd-header">
        <h1 className="cd-title">My <span>Dashboard</span></h1>
        <p className="cd-subtitle">Track your inquiries, venue pins, and check sound system availability.</p>
      </div>

      {/* Stats */}
      <div className="cd-stats">
        <div className="cd-stat">
          <div className="cd-stat-num">{inquiries.length}</div>
          <div className="cd-stat-label">Total Inquiries</div>
        </div>
        <div className="cd-stat">
          <div className="cd-stat-num" style={{ color: "#f59e0b" }}>{pendingCount}</div>
          <div className="cd-stat-label">Pending</div>
        </div>
        <div className="cd-stat">
          <div className="cd-stat-num" style={{ color: "#10b981" }}>{confirmedCount}</div>
          <div className="cd-stat-label">Confirmed</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="cd-tabs">
        <button className={`cd-tab${tab === "inquiries" ? " active" : ""}`} onClick={() => setTab("inquiries")}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          My Inquiries
        </button>
        <button className={`cd-tab${tab === "availability" ? " active" : ""}`} onClick={() => setTab("availability")}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          Sound System Availability
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="cd-loading">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
          Loading your data...
        </div>
      ) : tab === "inquiries" ? (

        inquiries.length === 0 ? (
          <div className="cd-empty">
            <div className="cd-empty-icon">📭</div>
            <div className="cd-empty-text">No inquiries submitted yet.</div>
          </div>
        ) : (
          inquiries.map((inq, idx) => {
            const sm = STATUS_META[inq.status] || STATUS_META.pending;
            return (
              <div key={`inq-${inq.id ?? idx}`} className="cd-card">
                <div className="cd-card-top">
                  <div>
                    <div className="cd-card-id">Inquiry #{inq.id}</div>
                    <div className="cd-card-event">{inq.eventType}</div>
                    <div className="cd-card-date">
                      {inq.preferredDate ? `📅 ${inq.preferredDate}` : "No preferred date"}
                    </div>
                  </div>
                  <span className="cd-badge" style={{ background: sm.bg, color: sm.color, borderColor: sm.border }}>
                    {sm.icon} {sm.label}
                  </span>
                </div>

                <div className="cd-card-grid">
                  <div className="cd-card-field">
                    <div className="cd-card-field-label">Name</div>
                    <div className="cd-card-field-val">{inq.fullName}</div>
                  </div>
                  <div className="cd-card-field">
                    <div className="cd-card-field-label">Email</div>
                    <div className="cd-card-field-val">{inq.email}</div>
                  </div>
                  {inq.phone && (
                    <div className="cd-card-field">
                      <div className="cd-card-field-label">Phone</div>
                      <div className="cd-card-field-val">{inq.phone}</div>
                    </div>
                  )}
                  <div className="cd-card-field">
                    <div className="cd-card-field-label">Submitted</div>
                    <div className="cd-card-field-val">{new Date(inq.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>

                {inq.message && (
                  <div className="cd-card-msg">"{inq.message}"</div>
                )}

                {/* Venue block with map */}
                {inq.venue && (
                  <div className="cd-venue">
                    <div className="cd-venue-header">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                      Pinned Venue
                    </div>
                    <div className="cd-venue-name">{inq.venue.venueName}</div>
                    {inq.venue.address && <div className="cd-venue-addr">{inq.venue.address}</div>}
                    <div className="cd-venue-meta">
                      {inq.venue.city && <span className="cd-venue-chip">📍 {inq.venue.city}</span>}
                      {inq.venue.lat && inq.venue.lng && (
                        <span className="cd-venue-chip" style={{ fontFamily: "monospace", textTransform: "none", letterSpacing: 0 }}>
                          {inq.venue.lat.toFixed(4)}, {inq.venue.lng.toFixed(4)}
                        </span>
                      )}
                    </div>
                    {inq.venue.notes && (
                      <div style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.28)", marginBottom: "0.5rem" }}>
                        {inq.venue.notes}
                      </div>
                    )}
                    {/* Inline expandable map */}
                    {inq.venue.lat && inq.venue.lng && (
                      <VenueMap venue={inq.venue} />
                    )}
                  </div>
                )}
              </div>
            );
          })
        )

      ) : (
        /* ── AVAILABILITY ── */
        <div>
          <div className="cd-cal-wrap">
            <div className="cd-cal-header">
              <span className="cd-cal-title">{monthName}</span>
              <div className="cd-cal-nav">
                <button onClick={() => setCurrentMonth(new Date(year, month - 1))}>‹</button>
                <button onClick={() => setCurrentMonth(new Date(year, month + 1))}>›</button>
              </div>
            </div>
            <div className="cd-cal-grid">
              {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
                <div key={`lbl-${d}`} className="cd-cal-day-label">{d}</div>
              ))}
              {calCells.map((d, i) => {
                if (d === null) return <div key={`empty-${i}`} />;
                const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                const isBooked = bookedDates.has(dateStr);
                const isToday = today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;
                const isPast = new Date(year, month, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                let cls = "cd-cal-cell";
                if (isPast) cls += " past";
                else if (isBooked) cls += " booked";
                else if (isToday) cls += " today";
                else cls += " available";
                return (
                  <div key={`day-${dateStr}`} className={cls}>
                    {d}
                    {isBooked && (
                      <span style={{ position: "absolute", bottom: 2, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: "#ff2d55" }} />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="cd-legend">
              <div className="cd-legend-item">
                <div className="cd-legend-dot" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)" }} /> Today
              </div>
              <div className="cd-legend-item">
                <div className="cd-legend-dot" style={{ background: "rgba(255,255,255,0.08)" }} /> Available
              </div>
              <div className="cd-legend-item">
                <div className="cd-legend-dot" style={{ background: "rgba(255,45,85,0.2)", border: "1px solid rgba(255,45,85,0.3)" }} /> Booked
              </div>
              <div className="cd-legend-item">
                <div className="cd-legend-dot" style={{ background: "rgba(255,255,255,0.03)" }} /> Past
              </div>
            </div>
          </div>
          <div className="cd-avail-note" style={{ maxWidth: 640 }}>
            ✓ Dates without a red marker are available for sound system rental. To reserve a date, submit a new inquiry.
          </div>
        </div>
      )}
    </div>
  );
}