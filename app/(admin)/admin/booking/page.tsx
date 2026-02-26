"use client";
import { useEffect, useState, useRef } from "react";

type Venue = {
  id: number; venueName: string; address: string; city: string;
  notes: string; lat: number; lng: number; createdAt: string;
  inquiryFullName?: string; inquiryEmail?: string; inquiryEventType?: string;
};

type Inquiry = {
  id: number; fullName: string; email: string; phone: string;
  eventType: string; preferredDate: string; message: string;
  status: string; createdAt: string;
  venue?: Venue | null;
};

type Booking = {
  id: number; name: string; email: string; phone: string;
  eventType: string; eventDate: string; message: string;
  status: string; createdAt: string;
};

const STATUS_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  pending:   { bg: "rgba(255,180,0,0.1)",  color: "#ffb400", border: "rgba(255,180,0,0.25)" },
  confirmed: { bg: "rgba(0,200,100,0.1)",  color: "#00c864", border: "rgba(0,200,100,0.25)" },
  cancelled: { bg: "rgba(255,45,85,0.1)",  color: "#ff2d55", border: "rgba(255,45,85,0.25)" },
};

export default function AdminBookingPage() {
  const [tab, setTab] = useState<"bookings" | "inquiries" | "venues">("bookings");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [expandedInquiry, setExpandedInquiry] = useState<number | null>(null);
  const mapRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [bRes, iRes] = await Promise.all([
        fetch("/api/booking"),
        fetch("/api/inquiry"),
      ]);
      const bData = await bRes.json();
      const iData = await iRes.json();
      setBookings(Array.isArray(bData) ? bData : []);
      setInquiries(Array.isArray(iData?.inquiries) ? iData.inquiries : []);
      setVenues(Array.isArray(iData?.venues) ? iData.venues : []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  useEffect(() => {
    if (!selectedVenue) return;
    const initMap = () => {
      if (!mapRef.current) return;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      const tryInit = () => {
        const L = (window as any).L;
        if (!L) return;
        const map = L.map(mapRef.current).setView([selectedVenue.lat, selectedVenue.lng], 15);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap" }).addTo(map);
        const icon = L.divIcon({
          html: `<div style="width:28px;height:28px;background:linear-gradient(135deg,#ff5000,#ff2d55);border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 4px 12px rgba(255,80,0,0.6);"></div>`,
          iconSize: [28, 28], iconAnchor: [14, 28], className: "",
        });
        L.marker([selectedVenue.lat, selectedVenue.lng], { icon }).addTo(map)
          .bindPopup(`<b>${selectedVenue.venueName}</b><br>${selectedVenue.city || ""}`).openPopup();
        mapInstanceRef.current = map;
      };
      if ((window as any).L) { tryInit(); return; }
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
    };
    const t = setTimeout(initMap, 150);
    return () => clearTimeout(t);
  }, [selectedVenue]);

  const updateBookingStatus = async (id: number, status: string) => {
    setActionLoading(id);
    await fetch(`/api/booking/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    fetchAll(); setActionLoading(null);
  };

  const deleteBooking = async (id: number) => {
    if (!confirm("Delete this booking permanently?")) return;
    setActionLoading(id);
    await fetch(`/api/booking/${id}`, { method: "DELETE" });
    fetchAll(); setActionLoading(null);
  };

  const updateInquiryStatus = async (id: number, status: string) => {
    setActionLoading(id);
    await fetch(`/api/inquiry/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    fetchAll(); setActionLoading(null);
  };

  const deleteInquiry = async (id: number) => {
    if (!confirm("Delete this inquiry permanently?")) return;
    setActionLoading(id);
    await fetch(`/api/inquiry/${id}`, { method: "DELETE" });
    if (selectedVenue != null && inquiries.find(i => i.id === id)?.venue?.id === selectedVenue.id) {
      setSelectedVenue(null);
    }
    fetchAll(); setActionLoading(null);
  };

  const deleteVenue = async (id: number) => {
    if (!confirm("Delete this venue permanently?")) return;
    setActionLoading(id);
    await fetch(`/api/venue/${id}`, { method: "DELETE" });
    if (selectedVenue?.id === id) setSelectedVenue(null);
    fetchAll(); setActionLoading(null);
  };

  // Calendar
  const bookedDates = new Set(bookings.filter(b => b.status !== "cancelled").map(b => b.eventDate));
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });
  const calCells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calCells.push(d);

  return (
    <div style={{ background: "#05050a", minHeight: "100vh", padding: "2rem", color: "#fff", fontFamily: "'Barlow', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&display=swap');
        .ab-layout { display: grid; grid-template-columns: 1fr 300px; gap: 2rem; align-items: start; }
        .ab-tabs { display: flex; gap: 0.4rem; margin-bottom: 1.75rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 5px; width: fit-content; }
        .ab-tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.65rem 1.25rem; border-radius: 7px; border: none; background: transparent; color: rgba(255,255,255,0.4); font-family: 'Barlow', sans-serif; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
        .ab-tab.active { background: linear-gradient(135deg, #ff5000, #ff2d55); color: #fff; box-shadow: 0 4px 14px rgba(255,80,0,0.35); }
        .ab-tab:not(.active):hover { color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.05); }
        .ab-tab-count { background: rgba(255,255,255,0.15); border-radius: 10px; padding: 1px 7px; font-size: 0.7rem; }
        .ab-tab.active .ab-tab-count { background: rgba(255,255,255,0.25); }
        .ab-card { background: #0f0f1a; border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 1.4rem; margin-bottom: 0.85rem; transition: border-color 0.2s; }
        .ab-card:hover { border-color: rgba(255,80,0,0.25); }
        .ab-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.85rem; gap: 1rem; }
        .ab-card-name { font-size: 1rem; font-weight: 700; color: #fff; margin: 0 0 3px; }
        .ab-card-meta { font-size: 0.78rem; color: rgba(255,255,255,0.35); }
        .ab-status { padding: 0.2rem 0.75rem; border-radius: 20px; font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; border: 1px solid; white-space: nowrap; }
        .ab-info-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem 1rem; margin-bottom: 0.85rem; }
        .ab-info-item { font-size: 0.82rem; color: rgba(255,255,255,0.5); display: flex; align-items: center; gap: 0.4rem; }
        .ab-info-icon { color: rgba(255,80,0,0.6); flex-shrink: 0; }
        .ab-message { font-size: 0.82rem; color: rgba(255,255,255,0.35); border-top: 1px solid rgba(255,255,255,0.05); padding-top: 0.75rem; margin-bottom: 0.85rem; line-height: 1.5; }
        .ab-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .ab-btn { padding: 0.45rem 0.9rem; border-radius: 6px; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; cursor: pointer; border: 1px solid transparent; transition: all 0.15s; display: inline-flex; align-items: center; gap: 0.4rem; font-family: 'Barlow', sans-serif; }
        .ab-btn:hover:not(:disabled) { opacity: 0.8; transform: translateY(-1px); }
        .ab-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .ab-btn-confirm { background: rgba(0,200,100,0.1); color: #00c864; border-color: rgba(0,200,100,0.2); }
        .ab-btn-cancel  { background: rgba(255,180,0,0.1); color: #ffb400; border-color: rgba(255,180,0,0.2); }
        .ab-btn-delete  { background: rgba(255,45,85,0.1); color: #ff2d55; border-color: rgba(255,45,85,0.2); margin-left: auto; }
        .ab-btn-map     { background: rgba(255,80,0,0.1); color: #ff5000; border-color: rgba(255,80,0,0.2); }
        .ab-venue-block { margin-top: 0.85rem; background: rgba(255,80,0,0.04); border: 1px solid rgba(255,80,0,0.15); border-radius: 8px; padding: 0.9rem 1rem; }
        .ab-venue-block-title { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,80,0,0.6); margin-bottom: 0.6rem; }
        .ab-venue-block-name { font-size: 0.9rem; font-weight: 700; color: #fff; margin-bottom: 3px; }
        .ab-venue-block-addr { font-size: 0.78rem; color: rgba(255,255,255,0.4); margin-bottom: 0.5rem; }
        .ab-venue-block-row { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; }
        .ab-venue-block-city { display: inline-flex; align-items: center; gap: 0.3rem; background: rgba(255,80,0,0.1); border: 1px solid rgba(255,80,0,0.2); border-radius: 20px; padding: 0.15rem 0.65rem; font-size: 0.68rem; font-weight: 600; color: #ff5000; text-transform: uppercase; letter-spacing: 0.08em; }
        .ab-venue-block-coords { font-size: 0.7rem; color: rgba(255,255,255,0.2); font-family: monospace; }
        .ab-map-panel { background: #0f0f1a; border: 1px solid rgba(255,80,0,0.2); border-radius: 12px; overflow: hidden; margin-top: 0.75rem; }
        .ab-map-panel-header { padding: 0.9rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .ab-map-panel-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.1rem; color: #fff; letter-spacing: 0.05em; }
        .ab-map-panel-sub { font-size: 0.75rem; color: rgba(255,255,255,0.35); margin-top: 2px; }
        #ab-map { width: 100%; height: 300px; }
        .ab-map-coords { padding: 0.5rem 1.25rem; font-size: 0.7rem; color: rgba(255,255,255,0.25); font-family: monospace; border-top: 1px solid rgba(255,255,255,0.05); }
        .ab-venue-card { background: #0f0f1a; border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 1.25rem; margin-bottom: 0.75rem; cursor: pointer; transition: all 0.2s; }
        .ab-venue-card:hover, .ab-venue-card.selected { border-color: rgba(255,80,0,0.4); background: rgba(255,80,0,0.04); }
        .ab-sidebar { position: sticky; top: 2rem; display: flex; flex-direction: column; gap: 1.25rem; }
        .ab-cal { background: #0f0f1a; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1.4rem; }
        .ab-cal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .ab-cal-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.1rem; letter-spacing: 0.04em; }
        .ab-cal-nav { display: flex; gap: 4px; }
        .ab-cal-nav button { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); width: 26px; height: 26px; border-radius: 5px; cursor: pointer; font-size: 0.9rem; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
        .ab-cal-nav button:hover { background: rgba(255,80,0,0.15); color: #ff5000; border-color: rgba(255,80,0,0.3); }
        .ab-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px; }
        .ab-cal-day-label { text-align: center; font-size: 0.58rem; font-weight: 700; letter-spacing: 0.08em; color: rgba(255,255,255,0.2); padding: 4px 0; text-transform: uppercase; }
        .ab-cal-cell { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; border-radius: 5px; color: rgba(255,255,255,0.3); }
        .ab-cal-cell.booked { background: rgba(255,80,0,0.2); color: #ff6633; font-weight: 700; border: 1px solid rgba(255,80,0,0.3); }
        .ab-cal-cell.today { background: rgba(255,255,255,0.07); color: #fff; font-weight: 700; }
        .ab-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; }
        .ab-stat { background: #0f0f1a; border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 1rem; text-align: center; }
        .ab-stat-num { font-family: 'Bebas Neue', sans-serif; font-size: 1.8rem; color: #ff5000; line-height: 1; }
        .ab-stat-label { font-size: 0.65rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-top: 3px; }
        .ab-empty { text-align: center; padding: 3rem; color: rgba(255,255,255,0.2); font-size: 0.9rem; }
        @media (max-width: 900px) { .ab-layout { grid-template-columns: 1fr; } .ab-sidebar { position: static; } }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.75rem" }}>
        <div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.4rem", letterSpacing: "0.04em", margin: 0 }}>
            Admin <span style={{ color: "#ff5000" }}>Dashboard</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.83rem", marginTop: "3px" }}>
            Manage bookings, inquiries and venue locations
          </p>
        </div>
        <button onClick={fetchAll} style={{ background: "rgba(255,80,0,0.1)", border: "1px solid rgba(255,80,0,0.25)", color: "#ff5000", borderRadius: "8px", padding: "0.6rem 1.1rem", cursor: "pointer", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Barlow', sans-serif" }}>
          ↻ Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="ab-tabs">
        {(["bookings", "inquiries", "venues"] as const).map((t) => (
          <button key={t} className={`ab-tab${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>
            {t === "bookings" && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
            {t === "inquiries" && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
            {t === "venues" && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>}
            {t.charAt(0).toUpperCase() + t.slice(1)}
            <span className="ab-tab-count">{t === "bookings" ? bookings.length : t === "inquiries" ? inquiries.length : venues.length}</span>
          </button>
        ))}
      </div>

      <div className="ab-layout">
        <div>
          {loading ? <div className="ab-empty">Loading...</div> : (

            /* ── BOOKINGS ── */
            tab === "bookings" ? (
              bookings.length === 0 ? <div className="ab-empty">No bookings yet.</div> :
              bookings.map(b => {
                const sc = STATUS_COLORS[b.status] || STATUS_COLORS.pending;
                return (
                  <div key={`booking-${b.id}`} className="ab-card">
                    <div className="ab-card-header">
                      <div>
                        <p className="ab-card-name">{b.name}</p>
                        <p className="ab-card-meta">📅 {b.eventDate} &nbsp;·&nbsp; {b.eventType}</p>
                      </div>
                      <span className="ab-status" style={{ background: sc.bg, color: sc.color, borderColor: sc.border }}>{b.status}</span>
                    </div>
                    <div className="ab-info-row">
                      <div className="ab-info-item"><span className="ab-info-icon">✉</span>{b.email}</div>
                      <div className="ab-info-item"><span className="ab-info-icon">📱</span>{b.phone}</div>
                    </div>
                    {b.message && <p className="ab-message">{b.message}</p>}
                    <div className="ab-actions">
                      {b.status !== "confirmed" && <button className="ab-btn ab-btn-confirm" disabled={actionLoading === b.id} onClick={() => updateBookingStatus(b.id, "confirmed")}>✓ Confirm</button>}
                      {b.status !== "cancelled" && <button className="ab-btn ab-btn-cancel" disabled={actionLoading === b.id} onClick={() => updateBookingStatus(b.id, "cancelled")}>✕ Cancel</button>}
                      {b.status === "cancelled" && <button className="ab-btn ab-btn-confirm" disabled={actionLoading === b.id} onClick={() => updateBookingStatus(b.id, "pending")}>↺ Restore</button>}
                      <button className="ab-btn ab-btn-delete" disabled={actionLoading === b.id} onClick={() => deleteBooking(b.id)}>🗑 Delete</button>
                    </div>
                  </div>
                );
              })

            /* ── INQUIRIES ── */
            ) : tab === "inquiries" ? (
              inquiries.length === 0 ? <div className="ab-empty">No inquiries yet.</div> :
              inquiries.map(q => {
                const sc = STATUS_COLORS[q.status] || STATUS_COLORS.pending;
                const isExpanded = expandedInquiry === q.id;
                const hasVenue = !!q.venue;
                return (
                  <div key={`inquiry-${q.id}`} className="ab-card">
                    <div className="ab-card-header">
                      <div>
                        <p className="ab-card-name">{q.fullName}</p>
                        <p className="ab-card-meta">🎯 {q.eventType} &nbsp;·&nbsp; {q.preferredDate || "No date set"}</p>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.4rem" }}>
                        <span className="ab-status" style={{ background: sc.bg, color: sc.color, borderColor: sc.border }}>{q.status}</span>
                        {hasVenue && (
                          <span style={{ fontSize: "0.65rem", background: "rgba(255,80,0,0.1)", border: "1px solid rgba(255,80,0,0.2)", color: "#ff5000", borderRadius: "20px", padding: "0.1rem 0.55rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                            📍 Has Venue
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="ab-info-row">
                      <div className="ab-info-item"><span className="ab-info-icon">✉</span>{q.email}</div>
                      <div className="ab-info-item"><span className="ab-info-icon">📱</span>{q.phone || "—"}</div>
                    </div>
                    {q.message && <p className="ab-message">{q.message}</p>}

                    {/* Venue block */}
                    {hasVenue && q.venue && (
                      <div className="ab-venue-block">
                        <div className="ab-venue-block-title">📍 Submitted Venue</div>
                        <div className="ab-venue-block-name">{q.venue.venueName}</div>
                        {q.venue.address && <div className="ab-venue-block-addr">{q.venue.address}</div>}
                        <div className="ab-venue-block-row">
                          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                            {q.venue.city && <span className="ab-venue-block-city">📍 {q.venue.city}</span>}
                            {q.venue.lat && q.venue.lng && (
                              <span className="ab-venue-block-coords">{q.venue.lat.toFixed(5)}, {q.venue.lng.toFixed(5)}</span>
                            )}
                          </div>
                          {q.venue.lat && q.venue.lng && (
                            <button
                              className="ab-btn ab-btn-map"
                              onClick={() => {
                                const isCurrentlyOpen = isExpanded && selectedVenue?.id === q.venue!.id;
                                setSelectedVenue(isCurrentlyOpen ? null : q.venue!);
                                setExpandedInquiry(isCurrentlyOpen ? null : q.id);
                              }}
                            >
                              {isExpanded && selectedVenue?.id === q.venue.id ? "▲ Hide Map" : "🗺 View Map"}
                            </button>
                          )}
                        </div>
                        {q.venue.notes && (
                          <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)", marginTop: "0.5rem" }}>{q.venue.notes}</p>
                        )}
                      </div>
                    )}

                    {/* Inline map */}
                    {isExpanded && selectedVenue != null && selectedVenue.id === q.venue?.id && (
                      <div className="ab-map-panel">
                        <div className="ab-map-panel-header">
                          <div className="ab-map-panel-title">{selectedVenue.venueName}</div>
                          <div className="ab-map-panel-sub">{selectedVenue.address}</div>
                        </div>
                        <div id="ab-map" ref={mapRef} />
                        <div className="ab-map-coords">
                          {selectedVenue.lat?.toFixed(6)}, {selectedVenue.lng?.toFixed(6)}
                        </div>
                      </div>
                    )}

                    <div className="ab-actions" style={{ marginTop: "0.85rem" }}>
                      {q.status !== "confirmed" && <button className="ab-btn ab-btn-confirm" disabled={actionLoading === q.id} onClick={() => updateInquiryStatus(q.id, "confirmed")}>✓ Respond</button>}
                      {q.status !== "cancelled" && <button className="ab-btn ab-btn-cancel" disabled={actionLoading === q.id} onClick={() => updateInquiryStatus(q.id, "cancelled")}>✕ Dismiss</button>}
                      <button className="ab-btn ab-btn-delete" disabled={actionLoading === q.id} onClick={() => deleteInquiry(q.id)}>🗑 Delete</button>
                    </div>
                  </div>
                );
              })

            /* ── VENUES ── */
            ) : (
              <div>
                {venues.length === 0 ? <div className="ab-empty">No venues submitted yet.</div> : (
                  <>
                    <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)", marginBottom: "1rem" }}>
                      Click a venue card to view its pinned location on the map.
                    </p>
                    {venues.map((v, vi) => (
                      <div key={v.id != null ? `venue-${v.id}` : `venue-idx-${vi}`}
                        className={`ab-venue-card${selectedVenue?.id === v.id ? " selected" : ""}`}
                        onClick={() => setSelectedVenue(selectedVenue?.id === v.id ? null : v)}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff", marginBottom: 3 }}>{v.venueName}</p>
                            <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", marginBottom: "0.5rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.address}</p>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                              {v.city && <span className="ab-venue-block-city">📍 {v.city}</span>}
                              {v.inquiryFullName && (
                                <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>
                                  by {v.inquiryFullName} · {v.inquiryEventType}
                                </span>
                              )}
                            </div>
                            {v.notes && <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.25)", marginTop: "0.4rem" }}>{v.notes}</p>}
                          </div>
                          <button className="ab-btn ab-btn-delete" style={{ marginLeft: "1rem", flexShrink: 0 }}
                            disabled={actionLoading === v.id}
                            onClick={(e) => { e.stopPropagation(); deleteVenue(v.id); }}>
                            🗑
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {selectedVenue != null && tab === "venues" && (
                  <div className="ab-map-panel">
                    <div className="ab-map-panel-header">
                      <div className="ab-map-panel-title">{selectedVenue.venueName}</div>
                      <div className="ab-map-panel-sub">{selectedVenue.address}</div>
                    </div>
                    <div id="ab-map" ref={mapRef} />
                    <div className="ab-map-coords">
                      {selectedVenue.lat?.toFixed(6)}, {selectedVenue.lng?.toFixed(6)}
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="ab-sidebar">
          <div className="ab-stats">
            <div className="ab-stat">
              <div className="ab-stat-num">{bookings.filter(b => b.status === "pending").length}</div>
              <div className="ab-stat-label">Pending</div>
            </div>
            <div className="ab-stat">
              <div className="ab-stat-num">{bookings.filter(b => b.status === "confirmed").length}</div>
              <div className="ab-stat-label">Confirmed</div>
            </div>
            <div className="ab-stat">
              <div className="ab-stat-num">{inquiries.filter(q => q.status === "pending").length}</div>
              <div className="ab-stat-label">Inquiries</div>
            </div>
            <div className="ab-stat">
              <div className="ab-stat-num">{venues.length}</div>
              <div className="ab-stat-label">Venues</div>
            </div>
          </div>

          <div className="ab-cal">
            <div className="ab-cal-header">
              <span className="ab-cal-title">{monthName}</span>
              <div className="ab-cal-nav">
                <button onClick={() => setCurrentMonth(new Date(year, month - 1))}>‹</button>
                <button onClick={() => setCurrentMonth(new Date(year, month + 1))}>›</button>
              </div>
            </div>
            <div className="ab-cal-grid">
              {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
                <div key={`label-${d}`} className="ab-cal-day-label">{d}</div>
              ))}
              {calCells.map((d, i) => {
                if (d === null) return <div key={`empty-${i}`} />;
                const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                const today = new Date();
                const isToday = today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;
                return (
                  <div key={`day-${dateStr}`} className={`ab-cal-cell${bookedDates.has(dateStr) ? " booked" : ""}${isToday ? " today" : ""}`}>
                    {d}
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: "0.85rem", display: "flex", flexDirection: "column", gap: "5px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.68rem", color: "rgba(255,255,255,0.3)" }}>
                <div style={{ width: 8, height: 8, background: "#ff5000", borderRadius: 2 }} /> Booked Date
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.68rem", color: "rgba(255,255,255,0.3)" }}>
                <div style={{ width: 8, height: 8, background: "rgba(255,255,255,0.15)", borderRadius: 2 }} /> Today
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}