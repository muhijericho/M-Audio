"use client";
import { useEffect, useState } from "react";

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

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending:   { bg: "rgba(255,180,0,0.12)",  color: "#ffb400" },
  confirmed: { bg: "rgba(0,200,100,0.12)",  color: "#00c864" },
  cancelled: { bg: "rgba(255,45,85,0.12)",  color: "#ff2d55" },
};

export default function AdminBookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchBookings = () => {
    fetch("/api/booking")
      .then(r => r.ok ? r.json() : [])
      .then(data => { setBookings(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setBookings([]); setLoading(false); });
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id: number, status: string) => {
    setActionLoading(id);
    await fetch(`/api/booking/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchBookings();
    setActionLoading(null);
  };

  const deleteBooking = async (id: number) => {
    if (!confirm("Delete this record permanently?")) return;
    setActionLoading(id);
    await fetch(`/api/booking/${id}`, { method: "DELETE" });
    fetchBookings();
    setActionLoading(null);
  };

  // Calendar Logic
  const bookedDates = new Set(bookings.filter(b => b.status !== "cancelled").map(b => b.eventDate));
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });

  const calendarCells = [];
  for (let i = 0; i < firstDay; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);

  return (
    <div style={{ background: "#4f555d", minHeight: "100vh", padding: "2rem", color: "#fff", fontFamily: "'Barlow', sans-serif" }}>
      <style>{`
        .admin-grid { display: grid; grid-template-columns: 1fr 320px; gap: 2rem; align-items: start; }
        .booking-card { 
          background: #0f0f1a; border: 1px solid rgba(255,255,255,0.08); 
          border-radius: 12px; padding: 1.5rem; margin-bottom: 1rem; transition: 0.2s;
        }
        .booking-card:hover { border-color: #ff500044; }
        .btn-action {
          padding: 0.5rem 1rem; border-radius: 6px; font-size: 0.75rem; font-weight: 700;
          text-transform: uppercase; cursor: pointer; border: 1px solid transparent; transition: 0.2s;
          display: inline-flex; align-items: center; gap: 0.5rem;
        }
        .btn-confirm { background: rgba(0,200,100,0.1); color: #00c864; border-color: rgba(0,200,100,0.2); }
        .btn-cancel { background: rgba(255,180,0,0.1); color: #ffb400; border-color: rgba(255,180,0,0.2); }
        .btn-delete { background: rgba(255,45,85,0.1); color: #ff2d55; border-color: rgba(255,45,85,0.2); }
        .btn-action:hover { opacity: 0.8; transform: translateY(-1px); }
        
        .cal-box { background: #0f0f1a; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1.5rem; position: sticky; top: 2rem; }
        .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-top: 1rem; }
        .day-cell { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; border-radius: 4px; color: rgba(255,255,255,0.3); }
        .day-cell.booked { background: rgba(255,80,0,0.2); color: #ff5000; font-weight: bold; }
      `}</style>

      <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.5rem", marginBottom: "2rem" }}>
        Booking <span style={{ color: "#ff5000" }}>Management</span>
      </h1>

      <div className="admin-grid">
        {/* Main List */}
        <div>
          {loading ? <p>Loading bookings...</p> : bookings.map(b => {
            const sc = STATUS_COLORS[b.status] || STATUS_COLORS.pending;
            return (
              <div key={b.id} className="booking-card">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{b.name}</h3>
                    <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>📅 {b.eventDate} • {b.eventType}</span>
                  </div>
                  <span style={{ background: sc.bg, color: sc.color, padding: "0.2rem 0.8rem", borderRadius: "20px", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" }}>
                    {b.status}
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: "1rem" }}>
                  <span>📧 {b.email}</span>
                  <span>📱 {b.phone}</span>
                </div>

                {b.message && (
                  <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "0.8rem", marginBottom: "1rem" }}>
                    {b.message}
                  </p>
                )}

                <div style={{ display: "flex", gap: "0.75rem" }}>
                  {b.status !== "confirmed" && (
                    <button className="btn-action btn-confirm" onClick={() => updateStatus(b.id, "confirmed")}>✓ Confirm</button>
                  )}
                  {b.status !== "cancelled" && (
                    <button className="btn-action btn-cancel" onClick={() => updateStatus(b.id, "cancelled")}>✕ Cancel</button>
                  )}
                  <button className="btn-action btn-delete" style={{ marginLeft: "auto" }} onClick={() => deleteBooking(b.id)}>🗑 Delete</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar Calendar */}
        <div className="cal-box">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'Bebas Neue'", fontSize: "1.2rem" }}>{monthName}</span>
            <div style={{ display: "flex", gap: "4px" }}>
              <button onClick={() => setCurrentMonth(new Date(year, month - 1))} style={{ background: "none", border: "1px solid #333", color: "#fff", cursor: "pointer" }}>‹</button>
              <button onClick={() => setCurrentMonth(new Date(year, month + 1))} style={{ background: "none", border: "1px solid #333", color: "#fff", cursor: "pointer" }}>›</button>
            </div>
          </div>
          <div className="cal-grid">
            {["S","M","T","W","T","F","S"].map(d => <div key={d} style={{ textAlign: "center", fontSize: "0.6rem", color: "#666" }}>{d}</div>)}
            {calendarCells.map((d, i) => (
              d === null ? <div key={i} /> : (
                <div key={d} className={`day-cell ${bookedDates.has(`${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`) ? 'booked' : ''}`}>
                  {d}
                </div>
              )
            ))}
          </div>
          <div style={{ marginTop: "1rem", fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div style={{ width: 8, height: 8, background: "#ff5000", borderRadius: 2 }} />
              Occupied Date
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}