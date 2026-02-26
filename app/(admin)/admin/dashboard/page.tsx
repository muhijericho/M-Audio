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
  createdAt: string;
  inquiryFullName?: string;
  inquiryEmail?: string;
  inquiryEventType?: string;
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
  phone: string;
  eventType: string;
  eventDate: string;
  message: string;
  status: string;
  createdAt: string;
};

const STATUS_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  pending:   { bg: "rgba(255,180,0,0.12)",  color: "#ffb400", border: "rgba(255,180,0,0.25)" },
  confirmed: { bg: "rgba(0,200,100,0.12)",  color: "#00c864", border: "rgba(0,200,100,0.25)" },
  cancelled: { bg: "rgba(255,45,85,0.12)",  color: "#ff2d55", border: "rgba(255,45,85,0.25)" },
};

export default function Dashboard() {
  const [tab, setTab] = useState<"bookings" | "inquiries" | "venues">("bookings");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [expandedInquiry, setExpandedInquiry] = useState<number | null>(null);
  
  const mapRef = useRef<HTMLDivElement>(null);
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
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  // Leaflet map initialization for venue locations
  useEffect(() => {
    if (!selectedVenue) return;
    
    const initMap = () => {
      if (!mapRef.current) return;
      
      // Cleanup existing map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      
      const tryInit = () => {
        const L = (window as any).L;
        if (!L) return;
        
        const map = L.map(mapRef.current).setView([selectedVenue.lat, selectedVenue.lng], 15);
        
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors"
        }).addTo(map);
        
        // Custom marker style matching your theme
        const icon = L.divIcon({
          html: `<div style="width:28px;height:28px;background:linear-gradient(135deg,#ff5000,#ff2d55);border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 4px 12px rgba(255,80,0,0.6);"></div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 28],
          className: ""
        });
        
        L.marker([selectedVenue.lat, selectedVenue.lng], { icon })
          .addTo(map)
          .bindPopup(`<b>${selectedVenue.venueName}</b><br>${selectedVenue.city || ""}`)
          .openPopup();
          
        mapInstanceRef.current = map;
      };
      
      // Check if Leaflet is already loaded
      if ((window as any).L) {
        tryInit();
        return;
      }
      
      // Load Leaflet CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }
      
      // Load Leaflet JS
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

  // Booking actions
  const updateBookingStatus = async (id: number, status: string) => {
    setActionLoading(id);
    await fetch(`/api/booking/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchAll();
    setActionLoading(null);
  };

  const deleteBooking = async (id: number) => {
    if (!confirm("Delete this booking permanently?")) return;
    setActionLoading(id);
    await fetch(`/api/booking/${id}`, { method: "DELETE" });
    fetchAll();
    setActionLoading(null);
  };

  // Inquiry actions
  const updateInquiryStatus = async (id: number, status: string) => {
    setActionLoading(id);
    await fetch(`/api/inquiry/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchAll();
    setActionLoading(null);
  };

  const deleteInquiry = async (id: number) => {
    if (!confirm("Delete this inquiry permanently?")) return;
    setActionLoading(id);
    await fetch(`/api/inquiry/${id}`, { method: "DELETE" });
    
    // Clear selected venue if it belonged to deleted inquiry
    if (selectedVenue && inquiries.find(i => i.id === id)?.venue?.id === selectedVenue.id) {
      setSelectedVenue(null);
    }
    fetchAll();
    setActionLoading(null);
  };

  // Venue actions
  const deleteVenue = async (id: number) => {
    if (!confirm("Delete this venue permanently?")) return;
    setActionLoading(id);
    await fetch(`/api/venue/${id}`, { method: "DELETE" });
    if (selectedVenue?.id === id) setSelectedVenue(null);
    fetchAll();
    setActionLoading(null);
  };

  // Calendar logic (for bookings)
  const bookedDates = new Set(
    bookings
      .filter(b => b.status !== "cancelled")
      .map(b => b.eventDate)
  );
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });
  
  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);
  
  const pad = (n: number) => String(n).padStart(2, "0");
  const isBooked = (d: number) => {
    const str = `${year}-${pad(month + 1)}-${pad(d)}`;
    return bookedDates.has(str);
  };
  const isToday = (d: number) => {
    const t = new Date();
    return t.getFullYear() === year && t.getMonth() === month && t.getDate() === d;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&display=swap');

        .dash { font-family: 'Barlow', sans-serif; color: #fff; background: #05050a; min-height: 100vh; padding: 2rem; }

        .dash-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.75rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .dash-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2.2rem;
          letter-spacing: 0.05em;
          margin: 0;
          color: #fff;
        }
        .dash-title span { color: #ff5000; }
        .dash-subtitle {
          color: rgba(255,255,255,0.35);
          font-size: 0.85rem;
          margin-top: 4px;
        }
        .btn-refresh {
          background: rgba(255,80,0,0.1);
          border: 1px solid rgba(255,80,0,0.25);
          color: #ff5000;
          border-radius: 8px;
          padding: 0.55rem 1rem;
          cursor: pointer;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-family: 'Barlow', sans-serif;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          transition: all 0.15s;
        }
        .btn-refresh:hover { opacity: 0.85; }
        .btn-refresh:disabled { opacity: 0.4; cursor: not-allowed; }

        /* Tabs */
        .dash-tabs {
          display: flex;
          gap: 0.4rem;
          margin-bottom: 1.75rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 5px;
          width: fit-content;
          flex-wrap: wrap;
        }
        .dash-tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 1.25rem;
          border-radius: 7px;
          border: none;
          background: transparent;
          color: rgba(255,255,255,0.4);
          font-family: 'Barlow', sans-serif;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }
        .dash-tab.active {
          background: linear-gradient(135deg, #ff5000, #ff2d55);
          color: #fff;
          box-shadow: 0 4px 14px rgba(255,80,0,0.35);
        }
        .dash-tab:not(.active):hover {
          color: rgba(255,255,255,0.7);
          background: rgba(255,255,255,0.05);
        }
        .dash-tab-count {
          background: rgba(255,255,255,0.15);
          border-radius: 10px;
          padding: 1px 7px;
          font-size: 0.7rem;
        }
        .dash-tab.active .dash-tab-count {
          background: rgba(255,255,255,0.25);
        }

        /* Layout */
        .dash-grid {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 1.5rem;
          align-items: start;
        }

        /* Stats */
        .dash-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .dash-stat {
          background: #0f0f1a;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 1rem;
          text-align: center;
        }
        .dash-stat-label {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin-bottom: 0.3rem;
        }
        .dash-stat-value {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.8rem;
          color: #ff5000;
          line-height: 1;
        }

        /* Cards */
        .card {
          background: #0f0f1a;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 1.25rem;
          margin-bottom: 0.85rem;
          transition: border-color 0.2s;
        }
        .card:hover { border-color: rgba(255,80,0,0.25); }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.85rem;
          gap: 1rem;
        }
        .card-name {
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 3px;
        }
        .card-meta {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.35);
        }
        .status-badge {
          padding: 0.2rem 0.75rem;
          border-radius: 20px;
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          border: 1px solid;
          white-space: nowrap;
        }
        .card-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.4rem 1rem;
          margin-bottom: 0.85rem;
        }
        .card-info-item {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.5);
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .card-info-icon { color: rgba(255,80,0,0.6); flex-shrink: 0; }
        .card-message {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.35);
          border-top: 1px solid rgba(255,255,255,0.05);
          padding-top: 0.75rem;
          margin-bottom: 0.85rem;
          line-height: 1.5;
        }

        /* Actions */
        .card-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .btn {
          padding: 0.45rem 0.9rem;
          border-radius: 6px;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.15s;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-family: 'Barlow', sans-serif;
          background: transparent;
        }
        .btn:hover:not(:disabled) { opacity: 0.8; transform: translateY(-1px); }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-confirm { background: rgba(0,200,100,0.1); color: #00c864; border-color: rgba(0,200,100,0.2); }
        .btn-cancel  { background: rgba(255,180,0,0.1); color: #ffb400; border-color: rgba(255,180,0,0.2); }
        .btn-delete  { background: rgba(255,45,85,0.1); color: #ff2d55; border-color: rgba(255,45,85,0.2); margin-left: auto; }
        .btn-map     { background: rgba(255,80,0,0.1); color: #ff5000; border-color: rgba(255,80,0,0.2); }

        /* Venue block in inquiry */
        .venue-block {
          margin-top: 0.85rem;
          background: rgba(255,80,0,0.04);
          border: 1px solid rgba(255,80,0,0.15);
          border-radius: 8px;
          padding: 0.9rem 1rem;
        }
        .venue-block-title {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,80,0,0.6);
          margin-bottom: 0.6rem;
        }
        .venue-block-name {
          font-size: 0.9rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 3px;
        }
        .venue-block-addr {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.4);
          margin-bottom: 0.5rem;
        }
        .venue-block-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .venue-city-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: rgba(255,80,0,0.1);
          border: 1px solid rgba(255,80,0,0.2);
          border-radius: 20px;
          padding: 0.15rem 0.65rem;
          font-size: 0.68rem;
          font-weight: 600;
          color: #ff5000;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .venue-coords {
          font-size: 0.7rem;
          color: rgba(255,255,255,0.2);
          font-family: monospace;
        }

        /* Map panel */
        .map-panel {
          background: #0f0f1a;
          border: 1px solid rgba(255,80,0,0.2);
          border-radius: 12px;
          overflow: hidden;
          margin-top: 0.75rem;
        }
        .map-panel-header {
          padding: 0.9rem 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .map-panel-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.1rem;
          color: #fff;
          letter-spacing: 0.05em;
        }
        .map-panel-sub {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.35);
          margin-top: 2px;
        }
        #venue-map { width: 100%; height: 300px; }
        .map-coords {
          padding: 0.5rem 1.25rem;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.25);
          font-family: monospace;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        /* Venues list */
        .venue-card {
          background: #0f0f1a;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 1.25rem;
          margin-bottom: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .venue-card:hover, .venue-card.selected {
          border-color: rgba(255,80,0,0.4);
          background: rgba(255,80,0,0.04);
        }

        /* Calendar */
        .dash-calendar {
          background: #0f0f1a;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 1.4rem;
          position: sticky;
          top: 2rem;
        }
        .cal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .cal-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.1rem;
          letter-spacing: 0.04em;
        }
        .cal-nav {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 5px;
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
          font-size: 0.9rem;
        }
        .cal-nav:hover { background: rgba(255,80,0,0.15); color: #ff5000; border-color: rgba(255,80,0,0.3); }
        .cal-days-header {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          margin-bottom: 0.5rem;
        }
        .cal-day-name {
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.2);
          text-align: center;
          padding: 4px 0;
          text-transform: uppercase;
        }
        .cal-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 3px;
        }
        .cal-cell {
          aspect-ratio: 1;
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.3);
        }
        .cal-cell.booked {
          background: rgba(255,80,0,0.2);
          color: #ff6633;
          font-weight: 700;
          border: 1px solid rgba(255,80,0,0.3);
        }
        .cal-cell.today {
          background: rgba(255,255,255,0.07);
          color: #fff;
          font-weight: 700;
        }
        .cal-legend {
          display: flex;
          gap: 1rem;
          margin-top: 0.85rem;
          padding-top: 0.85rem;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .cal-legend-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.68rem;
          color: rgba(255,255,255,0.4);
        }
        .cal-legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 2px;
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
          color: rgba(255,255,255,0.25);
          font-size: 0.9rem;
        }

        @media (max-width: 900px) {
          .dash-grid { grid-template-columns: 1fr; }
          .dash-calendar { position: static; }
          .dash-stats { grid-template-columns: repeat(2, 1fr); }
          .dash-header { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="dash">
        {/* Header */}
        <div className="dash-header">
          <div>
            <h1 className="dash-title">DASH<span>BOARD</span></h1>
            <p className="dash-subtitle">Manage bookings, inquiries, and venue locations</p>
          </div>
          <button 
            className="btn-refresh" 
            onClick={fetchAll} 
            disabled={loading}
          >
            {loading ? "⏳" : "↻"} {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {/* Tabs */}
        <div className="dash-tabs">
          {(["bookings", "inquiries", "venues"] as const).map((t) => (
            <button
              key={t}
              className={`dash-tab${tab === t ? " active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t === "bookings" && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
              {t === "inquiries" && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
              {t === "venues" && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>}
              {t.charAt(0).toUpperCase() + t.slice(1)}
              <span className="dash-tab-count">
                {t === "bookings" ? bookings.length : t === "inquiries" ? inquiries.length : venues.length}
              </span>
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="dash-stats">
          <div className="dash-stat">
            <div className="dash-stat-label">Total Bookings</div>
            <div className="dash-stat-value">{bookings.length}</div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-label">Confirmed</div>
            <div className="dash-stat-value" style={{ color: "#00c864" }}>
              {bookings.filter(b => b.status === "confirmed").length}
            </div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-label">Pending Inquiries</div>
            <div className="dash-stat-value" style={{ color: "#ffb400" }}>
              {inquiries.filter(i => i.status === "pending").length}
            </div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-label">Venues</div>
            <div className="dash-stat-value">{venues.length}</div>
          </div>
        </div>

        <div className="dash-grid">
          {/* Main Content Area */}
          <div>
            {loading ? (
              <div className="empty-state">Loading data...</div>
            ) : tab === "bookings" ? (
              /* ── BOOKINGS TAB ── */
              bookings.length === 0 ? (
                <div className="empty-state">No bookings yet. They'll appear here when clients submit.</div>
              ) : (
                bookings.map(b => {
                  const sc = STATUS_COLORS[b.status] || STATUS_COLORS.pending;
                  const isProcessing = actionLoading === b.id;
                  return (
                    <div className="card" key={`booking-${b.id}`}>
                      <div className="card-header">
                        <div>
                          <p className="card-name">{b.name}</p>
                          <p className="card-meta">📅 {b.eventDate} &nbsp;·&nbsp; {b.eventType}</p>
                        </div>
                        <span className="status-badge" style={{ background: sc.bg, color: sc.color, borderColor: sc.border }}>
                          {b.status}
                        </span>
                      </div>
                      <div className="card-info">
                        <div className="card-info-item"><span className="card-info-icon">✉</span>{b.email}</div>
                        <div className="card-info-item"><span className="card-info-icon">📱</span>{b.phone}</div>
                        <div className="card-info-item"><span className="card-info-icon">🕐</span>{new Date(b.createdAt).toLocaleDateString()}</div>
                      </div>
                      {b.message && <p className="card-message">{b.message}</p>}
                      <div className="card-actions">
                        {b.status !== "confirmed" && (
                          <button className="btn btn-confirm" disabled={isProcessing} onClick={() => updateBookingStatus(b.id, "confirmed")}>✓ Confirm</button>
                        )}
                        {b.status !== "cancelled" && (
                          <button className="btn btn-cancel" disabled={isProcessing} onClick={() => updateBookingStatus(b.id, "cancelled")}>✕ Cancel</button>
                        )}
                        {b.status === "cancelled" && (
                          <button className="btn btn-confirm" disabled={isProcessing} onClick={() => updateBookingStatus(b.id, "pending")}>↺ Restore</button>
                        )}
                        <button className="btn btn-delete" disabled={isProcessing} onClick={() => deleteBooking(b.id)}>🗑 Delete</button>
                      </div>
                    </div>
                  );
                })
              )
            ) : tab === "inquiries" ? (
              /* ── INQUIRIES TAB ── */
              inquiries.length === 0 ? (
                <div className="empty-state">No inquiries yet.</div>
              ) : (
                inquiries.map(q => {
                  const sc = STATUS_COLORS[q.status] || STATUS_COLORS.pending;
                  const isExpanded = expandedInquiry === q.id;
                  const hasVenue = !!q.venue;
                  const isProcessing = actionLoading === q.id;
                  
                  return (
                    <div className="card" key={`inquiry-${q.id}`}>
                      <div className="card-header">
                        <div>
                          <p className="card-name">{q.fullName}</p>
                          <p className="card-meta">🎯 {q.eventType} &nbsp;·&nbsp; {q.preferredDate || "No date set"}</p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.4rem" }}>
                          <span className="status-badge" style={{ background: sc.bg, color: sc.color, borderColor: sc.border }}>
                            {q.status}
                          </span>
                          {hasVenue && (
                            <span style={{ 
                              fontSize: "0.65rem", 
                              background: "rgba(255,80,0,0.1)", 
                              border: "1px solid rgba(255,80,0,0.2)", 
                              color: "#ff5000", 
                              borderRadius: "20px", 
                              padding: "0.1rem 0.55rem", 
                              fontWeight: 700, 
                              letterSpacing: "0.08em", 
                              textTransform: "uppercase" 
                            }}>
                              📍 Has Venue
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="card-info">
                        <div className="card-info-item"><span className="card-info-icon">✉</span>{q.email}</div>
                        <div className="card-info-item"><span className="card-info-icon">📱</span>{q.phone || "—"}</div>
                        <div className="card-info-item"><span className="card-info-icon">🕐</span>{new Date(q.createdAt).toLocaleDateString()}</div>
                      </div>
                      {q.message && <p className="card-message">{q.message}</p>}

                      {/* Venue block */}
                      {hasVenue && q.venue && (
                        <div className="venue-block">
                          <div className="venue-block-title">📍 Submitted Venue</div>
                          <div className="venue-block-name">{q.venue.venueName}</div>
                          {q.venue.address && <div className="venue-block-addr">{q.venue.address}</div>}
                          <div className="venue-block-row">
                            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                              {q.venue.city && <span className="venue-city-badge">📍 {q.venue.city}</span>}
                              {q.venue.lat && q.venue.lng && (
                                <span className="venue-coords">{q.venue.lat.toFixed(5)}, {q.venue.lng.toFixed(5)}</span>
                              )}
                            </div>
                            {q.venue.lat && q.venue.lng && (
                              <button
                                className="btn btn-map"
                                onClick={() => {
                                  const isCurrentlyOpen = isExpanded && selectedVenue?.id === q.venue!.id;
                                  setSelectedVenue(isCurrentlyOpen ? null : q.venue!);
                                  setExpandedInquiry(isCurrentlyOpen ? null : q.id);
                                }}
                              >
                                {isExpanded && selectedVenue?.id === q.venue?.id ? "▲ Hide Map" : "🗺 View Map"}
                              </button>
                            )}
                          </div>
                          {q.venue.notes && (
                            <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)", marginTop: "0.5rem" }}>
                              {q.venue.notes}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Inline map */}
                      {isExpanded && selectedVenue != null && selectedVenue.id === q.venue?.id && (
                        <div className="map-panel">
                          <div className="map-panel-header">
                            <div className="map-panel-title">{selectedVenue.venueName}</div>
                            <div className="map-panel-sub">{selectedVenue.address}</div>
                          </div>
                          <div id="venue-map" ref={mapRef} />
                          <div className="map-coords">
                            {selectedVenue.lat?.toFixed(6)}, {selectedVenue.lng?.toFixed(6)}
                          </div>
                        </div>
                      )}

                      <div className="card-actions" style={{ marginTop: "0.85rem" }}>
                        {q.status !== "confirmed" && (
                          <button className="btn btn-confirm" disabled={isProcessing} onClick={() => updateInquiryStatus(q.id, "confirmed")}>✓ Respond</button>
                        )}
                        {q.status !== "cancelled" && (
                          <button className="btn btn-cancel" disabled={isProcessing} onClick={() => updateInquiryStatus(q.id, "cancelled")}>✕ Dismiss</button>
                        )}
                        <button className="btn btn-delete" disabled={isProcessing} onClick={() => deleteInquiry(q.id)}>🗑 Delete</button>
                      </div>
                    </div>
                  );
                })
              )
            ) : (
              /* ── VENUES TAB ── */
              <div>
                {venues.length === 0 ? (
                  <div className="empty-state">No venues submitted yet.</div>
                ) : (
                  <>
                    <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)", marginBottom: "1rem" }}>
                      Click a venue card to view its pinned location on the map.
                    </p>
                    {venues.map((v, vi) => (
                      <div 
                        key={v.id != null ? `venue-${v.id}` : `venue-idx-${vi}`}
                        className={`venue-card${selectedVenue?.id === v.id ? " selected" : ""}`}
                        onClick={() => setSelectedVenue(selectedVenue?.id === v.id ? null : v)}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff", marginBottom: 3 }}>
                              {v.venueName}
                            </p>
                            <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", marginBottom: "0.5rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {v.address}
                            </p>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                              {v.city && <span className="venue-city-badge">📍 {v.city}</span>}
                              {v.inquiryFullName && (
                                <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>
                                  by {v.inquiryFullName} · {v.inquiryEventType}
                                </span>
                              )}
                            </div>
                            {v.notes && (
                              <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.25)", marginTop: "0.4rem" }}>
                                {v.notes}
                              </p>
                            )}
                          </div>
                          <button 
                            className="btn btn-delete" 
                            style={{ marginLeft: "1rem", flexShrink: 0 }}
                            disabled={actionLoading === v.id}
                            onClick={(e) => { e.stopPropagation(); deleteVenue(v.id); }}
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {/* Map panel for selected venue */}
                {selectedVenue != null && tab === "venues" && (
                  <div className="map-panel">
                    <div className="map-panel-header">
                      <div className="map-panel-title">{selectedVenue.venueName}</div>
                      <div className="map-panel-sub">{selectedVenue.address}</div>
                    </div>
                    <div id="venue-map" ref={mapRef} />
                    <div className="map-coords">
                      {selectedVenue.lat?.toFixed(6)}, {selectedVenue.lng?.toFixed(6)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar: Calendar */}
          <div className="dash-calendar">
            <div className="cal-header">
              <button className="cal-nav" onClick={() => setCurrentMonth(new Date(year, month - 1))}>‹</button>
              <span className="cal-title">{monthName}</span>
              <button className="cal-nav" onClick={() => setCurrentMonth(new Date(year, month + 1))}>›</button>
            </div>
            <div className="cal-days-header">
              {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
                <div key={d} className="cal-day-name">{d}</div>
              ))}
            </div>
            <div className="cal-grid">
              {calendarCells.map((d, i) =>
                d === null ? (
                  <div key={`e-${i}`} />
                ) : (
                  <div
                    key={d}
                    className={`cal-cell${isBooked(d) ? " booked" : ""}${isToday(d) ? " today" : ""}`}
                    title={isBooked(d) ? "Booked" : "Available"}
                  >
                    {d}
                  </div>
                )
              )}
            </div>
            <div className="cal-legend">
              <div className="cal-legend-item">
                <div className="cal-legend-dot" style={{ background: "rgba(255,80,0,0.4)" }} />
                Booked
              </div>
              <div className="cal-legend-item">
                <div className="cal-legend-dot" style={{ background: "rgba(255,255,255,0.08)" }} />
                Available
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}