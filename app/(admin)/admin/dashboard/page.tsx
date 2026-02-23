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

export default function Dashboard() {
  const [bookings, setBookings]     = useState<Booking[]>([]);
  const [loading, setLoading]       = useState(true);
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
    if (!confirm("Delete this booking?")) return;
    setActionLoading(id);
    await fetch(`/api/booking/${id}`, { method: "DELETE" });
    fetchBookings();
    setActionLoading(null);
  };

  // Calendar logic
  const bookedDates = new Set(
    bookings
      .filter(b => b.status !== "cancelled")
      .map(b => b.eventDate)
  );

  const year  = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });

  const calendarCells = [];
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
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600&display=swap');

        .dash { font-family: 'Barlow', sans-serif; color: #fff; }

        .dash-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2rem;
          letter-spacing: 0.06em;
          margin-bottom: 2rem;
          color: #fff;
        }
        .dash-title span { color: #ff5000; }

        /* Stats row */
        .dash-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .dash-stat {
          background: #0f0f1a;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
        }
        .dash-stat-label {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin-bottom: 0.4rem;
        }
        .dash-stat-value {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2rem;
          letter-spacing: 0.04em;
          color: #fff;
        }
        .dash-stat-value.orange { color: #ff5000; }
        .dash-stat-value.green  { color: #00c864; }
        .dash-stat-value.red    { color: #ff2d55; }

        /* Two-col layout */
        .dash-grid {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 1.5rem;
          align-items: start;
        }

        /* Calendar */
        .dash-calendar {
          background: #0f0f1a;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 1.5rem;
        }
        .cal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }
        .cal-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.2rem;
          letter-spacing: 0.06em;
        }
        .cal-nav {
          background: none;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          font-size: 0.85rem;
        }
        .cal-nav:hover { border-color: #ff5000; color: #ff5000; }
        .cal-days-header {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          margin-bottom: 0.5rem;
        }
        .cal-day-name {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          text-align: center;
          padding: 0.25rem 0;
        }
        .cal-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 3px;
        }
        .cal-cell {
          aspect-ratio: 1;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.78rem;
          font-weight: 500;
          color: rgba(255,255,255,0.5);
          position: relative;
          cursor: default;
        }
        .cal-cell.booked {
          background: rgba(255,80,0,0.18);
          color: #ff5000;
          font-weight: 700;
          border: 1px solid rgba(255,80,0,0.3);
        }
        .cal-cell.today {
          background: rgba(255,255,255,0.08);
          color: #fff;
          font-weight: 700;
        }
        .cal-cell.booked.today {
          background: rgba(255,80,0,0.3);
        }
        .cal-legend {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .cal-legend-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.72rem;
          color: rgba(255,255,255,0.4);
        }
        .cal-legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 3px;
        }

        /* Bookings list */
        .dash-bookings-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.4rem;
          letter-spacing: 0.06em;
          margin-bottom: 1rem;
        }
        .dash-bookings-title span { color: #ff5000; }

        .booking-card {
          background: #0f0f1a;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
          margin-bottom: 0.85rem;
          transition: border-color 0.2s;
        }
        .booking-card:hover { border-color: rgba(255,80,0,0.2); }

        .booking-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 0.85rem;
        }
        .booking-name {
          font-weight: 700;
          font-size: 1rem;
          color: #fff;
          margin-bottom: 0.2rem;
        }
        .booking-date-badge {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.4);
        }
        .status-badge {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.25rem 0.7rem;
          border-radius: 20px;
          flex-shrink: 0;
        }

        .booking-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.35rem 1rem;
          margin-bottom: 1rem;
        }
        .booking-info-item {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.45);
        }
        .booking-info-item strong { color: rgba(255,255,255,0.7); }

        .booking-message {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.35);
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255,255,255,0.06);
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        /* Action buttons */
        .booking-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .btn {
          font-family: 'Barlow', sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.45rem 0.9rem;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          transition: all 0.18s;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-confirm {
          background: rgba(0,200,100,0.12);
          color: #00c864;
          border: 1px solid rgba(0,200,100,0.25);
        }
        .btn-confirm:hover:not(:disabled) {
          background: rgba(0,200,100,0.22);
        }
        .btn-cancel {
          background: rgba(255,180,0,0.1);
          color: #ffb400;
          border: 1px solid rgba(255,180,0,0.25);
        }
        .btn-cancel:hover:not(:disabled) {
          background: rgba(255,180,0,0.2);
        }
        .btn-delete {
          background: rgba(255,45,85,0.1);
          color: #ff2d55;
          border: 1px solid rgba(255,45,85,0.2);
          margin-left: auto;
        }
        .btn-delete:hover:not(:disabled) {
          background: rgba(255,45,85,0.2);
        }

        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          color: rgba(255,255,255,0.2);
          font-size: 0.9rem;
        }

        @media (max-width: 900px) {
          .dash-grid { grid-template-columns: 1fr; }
          .dash-stats { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="dash">
        <h1 className="dash-title">DASH <span>BOARD</span></h1>

        {/* Stats */}
        <div className="dash-stats">
          <div className="dash-stat">
            <div className="dash-stat-label">Total</div>
            <div className="dash-stat-value orange">{bookings.length}</div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-label">Confirmed</div>
            <div className="dash-stat-value green">
              {bookings.filter(b => b.status === "confirmed").length}
            </div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-label">Pending</div>
            <div className="dash-stat-value" style={{ color: "#ffb400" }}>
              {bookings.filter(b => b.status === "pending").length}
            </div>
          </div>
        </div>

        <div className="dash-grid">
          {/* Bookings list */}
          <div>
            <h2 className="dash-bookings-title">All <span>Bookings</span></h2>
            {loading && <p style={{ color: "rgba(255,255,255,0.3)" }}>Loading...</p>}
            {!loading && bookings.length === 0 && (
              <div className="empty-state">No bookings yet. They'll appear here when clients submit inquiries.</div>
            )}
            {bookings.map(b => {
              const sc = STATUS_COLORS[b.status] || STATUS_COLORS.pending;
              const isProcessing = actionLoading === b.id;
              return (
                <div className="booking-card" key={b.id}>
                  <div className="booking-card-top">
                    <div>
                      <div className="booking-name">{b.name}</div>
                      <div className="booking-date-badge">
                        📅 {b.eventDate} &nbsp;·&nbsp; {b.eventType}
                      </div>
                    </div>
                    <span
                      className="status-badge"
                      style={{ background: sc.bg, color: sc.color }}
                    >
                      {b.status}
                    </span>
                  </div>

                  <div className="booking-info">
                    <div className="booking-info-item">📧 <strong>{b.email}</strong></div>
                    <div className="booking-info-item">📱 <strong>{b.phone}</strong></div>
                    <div className="booking-info-item">
                      🕐 Submitted: <strong>{new Date(b.createdAt).toLocaleDateString()}</strong>
                    </div>
                  </div>

                  {b.message && (
                    <div className="booking-message">💬 {b.message}</div>
                  )}

                  <div className="booking-actions">
                    {b.status !== "confirmed" && (
                      <button
                        className="btn btn-confirm"
                        onClick={() => updateStatus(b.id, "confirmed")}
                        disabled={isProcessing}
                      >
                        ✓ Confirm
                      </button>
                    )}
                    {b.status !== "cancelled" && (
                      <button
                        className="btn btn-cancel"
                        onClick={() => updateStatus(b.id, "cancelled")}
                        disabled={isProcessing}
                      >
                        ✕ Cancel
                      </button>
                    )}
                    {b.status === "cancelled" && (
                      <button
                        className="btn btn-confirm"
                        onClick={() => updateStatus(b.id, "pending")}
                        disabled={isProcessing}
                      >
                        ↺ Restore
                      </button>
                    )}
                    <button
                      className="btn btn-delete"
                      onClick={() => deleteBooking(b.id)}
                      disabled={isProcessing}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Calendar */}
          <div className="dash-calendar">
            <div className="cal-header">
              <button
                className="cal-nav"
                onClick={() => setCurrentMonth(new Date(year, month - 1))}
              >‹</button>
              <span className="cal-title">{monthName}</span>
              <button
                className="cal-nav"
                onClick={() => setCurrentMonth(new Date(year, month + 1))}
              >›</button>
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