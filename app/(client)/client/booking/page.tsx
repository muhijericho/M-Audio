"use client";
import { useState, useEffect, useRef } from "react";

export default function InquiryPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    // Inquiry fields
    fullName: "",
    email: "",
    phone: "",
    eventType: "",
    preferredDate: "",
    message: "",
    // Venue fields
    venueName: "",
    city: "",
    notes: "",
    address: "",
    lat: 14.5995,
    lng: 120.9842,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [pinned, setPinned] = useState(false);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);

  const setF = (f: string, v: string | number) => setForm((p) => ({ ...p, [f]: v }));

  // Initialize Leaflet map
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapInstanceRef.current || !mapRef.current) return;

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);

      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => {
        const L = (window as any).L;
        const map = L.map(mapRef.current).setView([form.lat, form.lng], 13);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(map);

        const customIcon = L.divIcon({
          html: `<div style="
            width:32px;height:32px;
            background:linear-gradient(135deg,#ff5000,#ff2d55);
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            border:3px solid #fff;
            box-shadow:0 4px 14px rgba(255,80,0,0.6);
          "></div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          className: "",
        });

        const marker = L.marker([form.lat, form.lng], {
          icon: customIcon,
          draggable: true,
        }).addTo(map);

        markerRef.current = marker;
        mapInstanceRef.current = map;

        marker.on("dragend", (e: any) => {
          const pos = e.target.getLatLng();
          setF("lat", pos.lat);
          setF("lng", pos.lng);
          setPinned(true);
          reverseGeocode(pos.lat, pos.lng);
        });

        map.on("click", (e: any) => {
          const { lat, lng } = e.latlng;
          marker.setLatLng([lat, lng]);
          setF("lat", lat);
          setF("lng", lng);
          setPinned(true);
          reverseGeocode(lat, lng);
        });
      };
      document.head.appendChild(script);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      if (data.display_name) setF("address", data.display_name);
    } catch {}
  };

  const searchAddress = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=5`
      );
      const data = await res.json();
      setSearchResults(data);
    } catch {}
  };

  const selectSearchResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setF("lat", lat);
    setF("lng", lng);
    setF("address", result.display_name);
    setPinned(true);
    setSearchResults([]);
    setSearchQuery(result.display_name.split(",")[0]);
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([lat, lng], 15);
      markerRef.current.setLatLng([lat, lng]);
    }
  };

  const handleSubmit = async () => {
    if (!form.fullName || !form.email || !form.eventType) {
      setError("Please fill in all required inquiry fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Submit inquiry
      const inquiryRes = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          eventType: form.eventType,
          preferredDate: form.preferredDate,
          message: form.message,
        }),
      });
      if (!inquiryRes.ok) throw new Error("Inquiry failed");
      const inquiryData = await inquiryRes.json();

      // Submit venue if provided
      if (form.venueName || pinned) {
        const venueRes = await fetch("/api/venue", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            inquiryId: inquiryData.id,
            venueName: form.venueName,
            address: form.address,
            city: form.city,
            notes: form.notes,
            lat: form.lat,
            lng: form.lng,
          }),
        });
        if (!venueRes.ok) throw new Error("Venue failed");
      }

      setSuccess(true);
      setForm({
        fullName: "", email: "", phone: "", eventType: "",
        preferredDate: "", message: "",
        venueName: "", city: "", notes: "", address: "",
        lat: 14.5995, lng: 120.9842,
      });
      setPinned(false);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const EVENT_TYPES = [
    "Recording Session", "Music Production", "Podcast Recording",
    "Voice Over", "Mixing & Mastering", "Live Performance",
    "Corporate Event", "Wedding", "Other",
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .iq-root {
          min-height: 100vh;
          background: #05050a;
          padding: 2.5rem;
          font-family: 'Barlow', sans-serif;
        }

        .iq-header { margin-bottom: 2rem; }

        .iq-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2.2rem;
          color: #fff;
          letter-spacing: 0.05em;
        }

        .iq-title span { color: #ff5000; }

        .iq-sub {
          color: rgba(255,255,255,0.35);
          font-size: 0.85rem;
          margin-top: 0.3rem;
        }

        /* Card */
        .iq-card {
          background: #0f0f1a;
          border: 1px solid rgba(255,80,0,0.15);
          border-radius: 14px;
          padding: 2.5rem;
          max-width: 820px;
          position: relative;
          overflow: hidden;
        }

        .iq-card::before {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 280px; height: 280px;
          background: radial-gradient(circle, rgba(255,80,0,0.05) 0%, transparent 65%);
          pointer-events: none;
        }

        .iq-section-label {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,80,0,0.7);
          margin-bottom: 1.1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .iq-section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,80,0,0.15);
        }

        .iq-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.1rem;
        }

        .iq-full { grid-column: 1 / -1; }

        .iq-field { display: flex; flex-direction: column; gap: 0.4rem; }

        .iq-label {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.38);
        }

        .iq-req { color: #ff5000; margin-left: 2px; }

        .iq-input, .iq-select, .iq-textarea {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 0.78rem 1rem;
          color: #fff;
          font-family: 'Barlow', sans-serif;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }

        .iq-input:focus, .iq-select:focus, .iq-textarea:focus {
          border-color: rgba(255,80,0,0.45);
          background: rgba(255,80,0,0.04);
        }

        .iq-input::placeholder, .iq-textarea::placeholder {
          color: rgba(255,255,255,0.13);
        }

        .iq-select option { background: #0f0f1a; }
        .iq-textarea { resize: vertical; min-height: 100px; }

        .iq-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin: 1.75rem 0;
        }

        /* Optional venue badge */
        .iq-optional-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 0.25rem 0.75rem;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-left: 0.5rem;
          vertical-align: middle;
        }

        /* Map search */
        .iq-map-search {
          position: relative;
          margin-bottom: 1rem;
        }

        .iq-map-search-row {
          display: flex;
          gap: 0.5rem;
        }

        .iq-search-btn {
          background: linear-gradient(135deg, #ff5000, #ff2d55);
          border: none;
          border-radius: 8px;
          padding: 0 1.25rem;
          color: #fff;
          font-family: 'Barlow', sans-serif;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          white-space: nowrap;
          transition: opacity 0.2s;
        }

        .iq-search-btn:hover { opacity: 0.85; }

        .iq-search-results {
          position: absolute;
          top: calc(100% + 4px);
          left: 0; right: 0;
          background: #1a1a2e;
          border: 1px solid rgba(255,80,0,0.2);
          border-radius: 8px;
          z-index: 9999;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        }

        .iq-search-result {
          padding: 0.75rem 1rem;
          color: rgba(255,255,255,0.7);
          font-size: 0.83rem;
          cursor: pointer;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: background 0.15s;
        }

        .iq-search-result:last-child { border-bottom: none; }
        .iq-search-result:hover { background: rgba(255,80,0,0.1); color: #fff; }

        /* Map container */
        .iq-map-wrap {
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid rgba(255,80,0,0.2);
          height: 340px;
          position: relative;
        }

        #iq-map { width: 100%; height: 100%; }

        .iq-map-hint {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.75);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 0.4rem 1rem;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.6);
          pointer-events: none;
          z-index: 999;
          white-space: nowrap;
        }

        .iq-pin-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(0,200,100,0.1);
          border: 1px solid rgba(0,200,100,0.25);
          border-radius: 20px;
          padding: 0.3rem 0.85rem;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #00c864;
          margin-bottom: 0.75rem;
        }

        .iq-coords {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.25);
          margin-top: 0.5rem;
          font-family: monospace;
        }

        /* Footer */
        .iq-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .iq-note { font-size: 0.78rem; color: rgba(255,255,255,0.2); }

        .iq-btn {
          background: linear-gradient(135deg, #ff5000, #ff2d55);
          border: none;
          border-radius: 8px;
          padding: 0.85rem 2.5rem;
          color: #fff;
          font-family: 'Barlow', sans-serif;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          box-shadow: 0 4px 20px rgba(255,80,0,0.35);
        }

        .iq-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .iq-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Alerts */
        .iq-error {
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

        .iq-success {
          background: rgba(0,200,100,0.08);
          border: 1px solid rgba(0,200,100,0.2);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          margin-bottom: 1.25rem;
          color: #00c864;
          font-size: 0.83rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        @media (max-width: 600px) {
          .iq-grid { grid-template-columns: 1fr; }
          .iq-root { padding: 1.25rem; }
          .iq-card { padding: 1.5rem; }
        }
      `}</style>

      <div className="iq-root">
        <div className="iq-header">
          <h1 className="iq-title">Submit an <span>Inquiry</span></h1>
          <p className="iq-sub">Fill out your details and optionally pin your venue location — submit everything in one go.</p>
        </div>

        <div className="iq-card">

          {/* Alerts */}
          {error && (
            <div className="iq-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div className="iq-success">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Inquiry and venue submitted successfully!
            </div>
          )}

          {/* ── CONTACT INFORMATION ── */}
          <div className="iq-section-label">Contact Information</div>
          <div className="iq-grid">
            <div className="iq-field">
              <label className="iq-label">Full Name <span className="iq-req">*</span></label>
              <input className="iq-input" type="text" placeholder="Juan dela Cruz"
                value={form.fullName} onChange={(e) => setF("fullName", e.target.value)} />
            </div>
            <div className="iq-field">
              <label className="iq-label">Email Address <span className="iq-req">*</span></label>
              <input className="iq-input" type="email" placeholder="juan@email.com"
                value={form.email} onChange={(e) => setF("email", e.target.value)} />
            </div>
            <div className="iq-field iq-full">
              <label className="iq-label">Phone Number</label>
              <input className="iq-input" type="tel" placeholder="+63 912 345 6789"
                value={form.phone} onChange={(e) => setF("phone", e.target.value)} />
            </div>
          </div>

          <div className="iq-divider" />

          {/* ── EVENT DETAILS ── */}
          <div className="iq-section-label">Event Details</div>
          <div className="iq-grid">
            <div className="iq-field">
              <label className="iq-label">Event Type <span className="iq-req">*</span></label>
              <select className="iq-select" value={form.eventType}
                onChange={(e) => setF("eventType", e.target.value)}>
                <option value="">Select type...</option>
                {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="iq-field">
              <label className="iq-label">Preferred Date</label>
              <input className="iq-input" type="date"
                value={form.preferredDate} onChange={(e) => setF("preferredDate", e.target.value)} />
            </div>
            <div className="iq-field iq-full">
              <label className="iq-label">Message / Details</label>
              <textarea className="iq-textarea" placeholder="Tell us about your project, requirements, or any questions..."
                value={form.message} onChange={(e) => setF("message", e.target.value)} />
            </div>
          </div>

          <div className="iq-divider" />

          {/* ── VENUE INFORMATION ── */}
          <div className="iq-section-label">
            Venue Information
            <span className="iq-optional-badge">Optional</span>
          </div>
          <div className="iq-grid">
            <div className="iq-field">
              <label className="iq-label">Venue Name</label>
              <input className="iq-input" type="text" placeholder="e.g. SM Mall of Asia Arena"
                value={form.venueName} onChange={(e) => setF("venueName", e.target.value)} />
            </div>
            <div className="iq-field">
              <label className="iq-label">City / Municipality</label>
              <input className="iq-input" type="text" placeholder="e.g. Pasay City"
                value={form.city} onChange={(e) => setF("city", e.target.value)} />
            </div>
            <div className="iq-field iq-full">
              <label className="iq-label">Additional Notes</label>
              <textarea className="iq-textarea" placeholder="Parking info, landmarks, access instructions..."
                value={form.notes} onChange={(e) => setF("notes", e.target.value)} />
            </div>
          </div>

          <div className="iq-divider" />

          {/* ── MAP ── */}
          <div className="iq-section-label">
            Pin Location on Map
            <span className="iq-optional-badge">Optional</span>
          </div>

          {/* Search bar */}
          <div className="iq-map-search">
            <div className="iq-map-search-row">
              <input className="iq-input" type="text" placeholder="Search address or place name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchAddress()} />
              <button className="iq-search-btn" onClick={searchAddress}>Search</button>
            </div>
            {searchResults.length > 0 && (
              <div className="iq-search-results">
                {searchResults.map((r, i) => (
                  <div key={i} className="iq-search-result" onClick={() => selectSearchResult(r)}>
                    {r.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Map */}
          <div className="iq-map-wrap">
            <div id="iq-map" ref={mapRef} />
            <div className="iq-map-hint">
              🗺 Click anywhere on the map or drag the pin to set location
            </div>
          </div>

          {pinned && (
            <p className="iq-coords">
              📍 {form.lat.toFixed(6)}, {form.lng.toFixed(6)}
            </p>
          )}

          {form.address && (
            <div style={{ marginTop: "0.75rem" }}>
              {pinned && <div className="iq-pin-badge">✓ Location Pinned</div>}
              <div className="iq-field">
                <label className="iq-label">Detected Address</label>
                <input className="iq-input" type="text" value={form.address}
                  onChange={(e) => setF("address", e.target.value)} />
              </div>
            </div>
          )}

          <div className="iq-divider" />

          {/* ── FOOTER ── */}
          <div className="iq-footer">
            <span className="iq-note"><span className="iq-req">*</span> Required fields</span>
            <button className="iq-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit Inquiry"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}