"use client";
import { useEffect, useState } from "react";

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

// Aggregated client type for the clients page
type Client = {
  email: string;
  name: string;
  phone: string;
  firstContact: string;
  lastContact: string;
  totalInteractions: number;
  bookings: Array<{ id: number; eventDate: string; eventType: string; status: string; message?: string }>;
  inquiries: Array<{ id: number; preferredDate: string; eventType: string; status: string; message?: string; venueName?: string }>;
  overallStatus: "hot" | "warm" | "cold" | "converted";
};

const STATUS_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  pending:   { bg: "rgba(255,180,0,0.1)",  color: "#ffb400", border: "rgba(255,180,0,0.25)" },
  confirmed: { bg: "rgba(0,200,100,0.1)",  color: "#00c864", border: "rgba(0,200,100,0.25)" },
  cancelled: { bg: "rgba(255,45,85,0.1)",  color: "#ff2d55", border: "rgba(255,45,85,0.25)" },
};

const CLIENT_STATUS_COLORS: Record<Client["overallStatus"], { bg: string; color: string; border: string; label: string }> = {
  hot:       { bg: "rgba(255,80,0,0.15)",  color: "#ff5000", border: "rgba(255,80,0,0.3)", label: "🔥 Hot Lead" },
  warm:      { bg: "rgba(255,180,0,0.15)", color: "#ffb400", border: "rgba(255,180,0,0.3)", label: "⭐ Warm Lead" },
  cold:      { bg: "rgba(100,100,120,0.15)", color: "#888", border: "rgba(100,100,120,0.3)", label: "❄️ Cold" },
  converted: { bg: "rgba(0,200,100,0.15)",  color: "#00c864", border: "rgba(0,200,100,0.3)", label: "✅ Converted" },
};

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Client["overallStatus"]>("all");
  const [sortBy, setSortBy] = useState<"recent" | "name" | "interactions">("recent");
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [bRes, iRes] = await Promise.all([
        fetch("/api/booking"),
        fetch("/api/inquiry"),
      ]);
      const bData = await bRes.json();
      const iData = await iRes.json();
      
      const bookings: Booking[] = Array.isArray(bData) ? bData : [];
      const inquiries: Inquiry[] = Array.isArray(iData?.inquiries) ? iData.inquiries : [];
      
      // Aggregate clients by email
      const clientMap = new Map<string, Client>();
      
      // Process bookings
      bookings.forEach(b => {
        const key = b.email.toLowerCase();
        const existing = clientMap.get(key);
        const newClient: Client = {
          email: b.email,
          name: b.name,
          phone: b.phone,
          firstContact: existing?.firstContact || b.createdAt,
          lastContact: b.createdAt,
          totalInteractions: (existing?.totalInteractions || 0) + 1,
          bookings: [...(existing?.bookings || []), {
            id: b.id, eventDate: b.eventDate, eventType: b.eventType, 
            status: b.status, message: b.message
          }],
          inquiries: existing?.inquiries || [],
          overallStatus: "warm" // Will be recalculated below
        };
        clientMap.set(key, newClient);
      });
      
      // Process inquiries
      inquiries.forEach(q => {
        const key = q.email.toLowerCase();
        const existing = clientMap.get(key);
        const newClient: Client = {
          email: q.email,
          name: q.fullName,
          phone: q.phone,
          firstContact: existing?.firstContact || q.createdAt,
          lastContact: q.createdAt,
          totalInteractions: (existing?.totalInteractions || 0) + 1,
          bookings: existing?.bookings || [],
          inquiries: [...(existing?.inquiries || []), {
            id: q.id, preferredDate: q.preferredDate, eventType: q.eventType,
            status: q.status, message: q.message, venueName: q.venue?.venueName
          }],
          overallStatus: "warm"
        };
        clientMap.set(key, newClient);
      });
      
      // Calculate overall status for each client
      const enrichedClients = Array.from(clientMap.values()).map(client => {
        const hasConfirmedBooking = client.bookings.some(b => b.status === "confirmed");
        const hasPending = [...client.bookings, ...client.inquiries].some(i => i.status === "pending");
        const allCancelled = [...client.bookings, ...client.inquiries].every(i => i.status === "cancelled");
        const recentContact = new Date(client.lastContact) > new Date(Date.now() - 30*24*60*60*1000);
        
        let overallStatus: Client["overallStatus"] = "cold";
        if (hasConfirmedBooking) overallStatus = "converted";
        else if (hasPending && recentContact) overallStatus = "hot";
        else if (hasPending) overallStatus = "warm";
        else if (allCancelled) overallStatus = "cold";
        
        return { ...client, overallStatus };
      });
      
      setClients(enrichedClients);
    } catch (err) {
      console.error("Failed to fetch clients:", err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const updateBookingStatus = async (bookingId: number, status: string) => {
    setActionLoading(bookingId);
    await fetch(`/api/booking/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    fetchAll();
    setActionLoading(null);
  };

  const updateInquiryStatus = async (inquiryId: number, status: string) => {
    setActionLoading(inquiryId);
    await fetch(`/api/inquiry/${inquiryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    fetchAll();
    setActionLoading(null);
  };

  // Filter and sort clients
  const filteredClients = clients
    .filter(c => {
      const matchesSearch = 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm);
      const matchesStatus = statusFilter === "all" || c.overallStatus === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "recent") return new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime();
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "interactions") return b.totalInteractions - a.totalInteractions;
      return 0;
    });

  return (
    <div style={{ background: "#05050a", minHeight: "100vh", padding: "2rem", color: "#fff", fontFamily: "'Barlow', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&display=swap');
        .ac-layout { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
        .ac-filters { display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; margin-bottom: 1.25rem; padding: 1rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; }
        .ac-search { flex: 1; min-width: 200px; position: relative; }
        .ac-search input { width: 100%; padding: 0.6rem 1rem 0.6rem 2.2rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; font-size: 0.85rem; font-family: 'Barlow', sans-serif; }
        .ac-search input::placeholder { color: rgba(255,255,255,0.3); }
        .ac-search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.3); font-size: 0.9rem; }
        .ac-select { padding: 0.6rem 1rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; font-size: 0.8rem; font-family: 'Barlow', sans-serif; cursor: pointer; }
        .ac-select option { background: #0f0f1a; color: #fff; }
        .ac-client-card { background: #0f0f1a; border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 1.25rem; margin-bottom: 0.75rem; transition: all 0.2s; }
        .ac-client-card:hover { border-color: rgba(255,80,0,0.3); }
        .ac-client-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; cursor: pointer; }
        .ac-client-info { flex: 1; min-width: 0; }
        .ac-client-name { font-size: 1.05rem; font-weight: 700; color: #fff; margin: 0 0 4px; display: flex; align-items: center; gap: 0.5rem; }
        .ac-client-email { font-size: 0.82rem; color: rgba(255,255,255,0.4); margin-bottom: 4px; word-break: break-all; }
        .ac-client-meta { display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.75rem; color: rgba(255,255,255,0.3); }
        .ac-client-status { padding: 0.25rem 0.8rem; border-radius: 20px; font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; border: 1px solid; white-space: nowrap; }
        .ac-interactions-badge { background: rgba(255,80,0,0.15); color: #ff5000; border: 1px solid rgba(255,80,0,0.3); border-radius: 20px; padding: 0.15rem 0.6rem; font-size: 0.7rem; font-weight: 600; }
        .ac-expand-icon { color: rgba(255,255,255,0.4); font-size: 1.1rem; transition: transform 0.2s; }
        .ac-expand-icon.expanded { transform: rotate(180deg); }
        .ac-history { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.05); }
        .ac-history-title { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,80,0,0.7); margin-bottom: 0.75rem; }
        .ac-history-item { background: rgba(255,255,255,0.02); border-radius: 8px; padding: 0.75rem; margin-bottom: 0.5rem; border-left: 3px solid; }
        .ac-history-item.booking { border-left-color: #00c864; }
        .ac-history-item.inquiry { border-left-color: #ff5000; }
        .ac-history-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; }
        .ac-history-type { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
        .ac-history-type.booking { color: #00c864; }
        .ac-history-type.inquiry { color: #ff5000; }
        .ac-history-date { font-size: 0.7rem; color: rgba(255,255,255,0.3); }
        .ac-history-details { font-size: 0.8rem; color: rgba(255,255,255,0.5); margin-bottom: 0.4rem; }
        .ac-history-message { font-size: 0.78rem; color: rgba(255,255,255,0.35); font-style: italic; margin-top: 0.3rem; }
        .ac-history-actions { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-top: 0.5rem; }
        .ac-btn { padding: 0.35rem 0.75rem; border-radius: 5px; font-size: 0.68rem; font-weight: 600; cursor: pointer; border: 1px solid transparent; transition: all 0.15s; background: transparent; font-family: 'Barlow', sans-serif; }
        .ac-btn:hover:not(:disabled) { opacity: 0.85; }
        .ac-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .ac-btn-confirm { color: #00c864; border-color: rgba(0,200,100,0.3); }
        .ac-btn-cancel { color: #ffb400; border-color: rgba(255,180,0,0.3); }
        .ac-empty { text-align: center; padding: 3rem; color: rgba(255,255,255,0.25); font-size: 0.95rem; }
        .ac-stats-bar { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 0.75rem; margin-bottom: 1.5rem; }
        .ac-stat-card { background: #0f0f1a; border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 1rem; text-align: center; }
        .ac-stat-num { font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem; color: #ff5000; line-height: 1; }
        .ac-stat-label { font-size: 0.65rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.35); margin-top: 4px; }
        @media (max-width: 600px) {
          .ac-client-header { flex-direction: column; align-items: flex-start; }
          .ac-filters { flex-direction: column; align-items: stretch; }
          .ac-search { width: 100%; }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.2rem", letterSpacing: "0.04em", margin: 0 }}>
            Client <span style={{ color: "#ff5000" }}>Directory</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem", marginTop: "4px" }}>
            View all clients, their interaction history, and lead status
          </p>
        </div>
        <button 
          onClick={fetchAll} 
          disabled={loading}
          style={{ 
            background: loading ? "rgba(255,80,0,0.05)" : "rgba(255,80,0,0.1)", 
            border: "1px solid rgba(255,80,0,0.25)", 
            color: loading ? "rgba(255,80,0,0.4)" : "#ff5000", 
            borderRadius: "8px", 
            padding: "0.55rem 1rem", 
            cursor: loading ? "not-allowed" : "pointer", 
            fontSize: "0.75rem", 
            fontWeight: 700, 
            letterSpacing: "0.08em", 
            textTransform: "uppercase", 
            fontFamily: "'Barlow', sans-serif",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem"
          }}
        >
          {loading ? "⏳" : "↻"} {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* Stats Bar */}
      <div className="ac-stats-bar">
        <div className="ac-stat-card">
          <div className="ac-stat-num">{clients.filter(c => c.overallStatus === "hot").length}</div>
          <div className="ac-stat-label">🔥 Hot Leads</div>
        </div>
        <div className="ac-stat-card">
          <div className="ac-stat-num">{clients.filter(c => c.overallStatus === "converted").length}</div>
          <div className="ac-stat-label">✅ Converted</div>
        </div>
        <div className="ac-stat-card">
          <div className="ac-stat-num">{clients.filter(c => c.totalInteractions > 2).length}</div>
          <div className="ac-stat-label">🔄 Engaged</div>
        </div>
        <div className="ac-stat-card">
          <div className="ac-stat-num">{clients.length}</div>
          <div className="ac-stat-label">👥 Total Clients</div>
        </div>
      </div>

      {/* Filters */}
      <div className="ac-filters">
        <div className="ac-search">
          <span className="ac-search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Search by name, email, or phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="ac-select" 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value as any)}
        >
          <option value="all">All Statuses</option>
          <option value="hot">🔥 Hot Leads</option>
          <option value="warm">⭐ Warm Leads</option>
          <option value="cold">❄️ Cold</option>
          <option value="converted">✅ Converted</option>
        </select>
        <select 
          className="ac-select" 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value as any)}
        >
          <option value="recent">Sort: Most Recent</option>
          <option value="name">Sort: Name A-Z</option>
          <option value="interactions">Sort: Most Interactions</option>
        </select>
      </div>

      {/* Client List */}
      <div className="ac-layout">
        {loading ? (
          <div className="ac-empty">Loading clients...</div>
        ) : filteredClients.length === 0 ? (
          <div className="ac-empty">
            {searchTerm || statusFilter !== "all" 
              ? "No clients match your filters." 
              : "No clients found. They'll appear here once bookings or inquiries are submitted."}
          </div>
        ) : (
          filteredClients.map(client => {
            const statusConfig = CLIENT_STATUS_COLORS[client.overallStatus];
            const isExpanded = expandedClient === client.email;
            
            return (
              <div key={client.email} className="ac-client-card">
                <div 
                  className="ac-client-header"
                  onClick={() => setExpandedClient(isExpanded ? null : client.email)}
                >
                  <div className="ac-client-info">
                    <p className="ac-client-name">
                      {client.name}
                      <span className="ac-interactions-badge">{client.totalInteractions} interaction{client.totalInteractions !== 1 ? 's' : ''}</span>
                    </p>
                    <p className="ac-client-email">{client.email}</p>
                    <div className="ac-client-meta">
                      <span>📱 {client.phone || "No phone"}</span>
                      <span>🗓 First: {new Date(client.firstContact).toLocaleDateString()}</span>
                      <span>🕐 Last: {new Date(client.lastContact).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                    <span className="ac-client-status" style={{ 
                      background: statusConfig.bg, 
                      color: statusConfig.color, 
                      borderColor: statusConfig.border 
                    }}>
                      {statusConfig.label}
                    </span>
                    <span className={`ac-expand-icon${isExpanded ? " expanded" : ""}`}>▼</span>
                  </div>
                </div>

                {/* Expanded History */}
                {isExpanded && (
                  <div className="ac-history">
                    <div className="ac-history-title">Interaction History</div>
                    
                    {/* Bookings */}
                    {client.bookings.map(b => (
                      <div key={`booking-${b.id}`} className={`ac-history-item booking`}>
                        <div className="ac-history-header">
                          <span className="ac-history-type booking">📅 Booking</span>
                          <span className="ac-history-date">{new Date(b.eventDate).toLocaleDateString()}</span>
                        </div>
                        <div className="ac-history-details">
                          <strong>{b.eventType}</strong> • Status:{" "}
                          <span style={{ color: STATUS_COLORS[b.status]?.color || "#888" }}>{b.status}</span>
                        </div>
                        {b.message && <div className="ac-history-message">"{b.message}"</div>}
                        <div className="ac-history-actions">
                          {b.status !== "confirmed" && (
                            <button 
                              className="ac-btn ac-btn-confirm"
                              disabled={actionLoading === b.id}
                              onClick={(e) => { e.stopPropagation(); updateBookingStatus(b.id, "confirmed"); }}
                            >
                              ✓ Confirm
                            </button>
                          )}
                          {b.status !== "cancelled" && (
                            <button 
                              className="ac-btn ac-btn-cancel"
                              disabled={actionLoading === b.id}
                              onClick={(e) => { e.stopPropagation(); updateBookingStatus(b.id, "cancelled"); }}
                            >
                              ✕ Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {/* Inquiries */}
                    {client.inquiries.map(q => (
                      <div key={`inquiry-${q.id}`} className={`ac-history-item inquiry`}>
                        <div className="ac-history-header">
                          <span className="ac-history-type inquiry">💬 Inquiry</span>
                          <span className="ac-history-date">{q.preferredDate ? new Date(q.preferredDate).toLocaleDateString() : "No date"}</span>
                        </div>
                        <div className="ac-history-details">
                          <strong>{q.eventType}</strong> • Status:{" "}
                          <span style={{ color: STATUS_COLORS[q.status]?.color || "#888" }}>{q.status}</span>
                          {q.venueName && <span> • 📍 {q.venueName}</span>}
                        </div>
                        {q.message && <div className="ac-history-message">"{q.message}"</div>}
                        <div className="ac-history-actions">
                          {q.status !== "confirmed" && (
                            <button 
                              className="ac-btn ac-btn-confirm"
                              disabled={actionLoading === q.id}
                              onClick={(e) => { e.stopPropagation(); updateInquiryStatus(q.id, "confirmed"); }}
                            >
                              ✓ Respond
                            </button>
                          )}
                          {q.status !== "cancelled" && (
                            <button 
                              className="ac-btn ac-btn-cancel"
                              disabled={actionLoading === q.id}
                              onClick={(e) => { e.stopPropagation(); updateInquiryStatus(q.id, "cancelled"); }}
                            >
                              ✕ Dismiss
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}