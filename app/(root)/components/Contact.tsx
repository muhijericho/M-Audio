"use client";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Basic CSS override to make the calendar look dark and modern
const calendarStyles = `
  .react-datepicker {
    background-color: #0f0f1a !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    font-family: inherit !important;
    border-radius: 12px !important;
  }
  .react-datepicker__header {
    background-color: #1a1a2e !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  }
  .react-datepicker__current-month, .react-datepicker__day-name, .react-datepicker__day {
    color: #fff !important;
  }
  .react-datepicker__day:hover {
    background-color: #ff5000 !important;
    border-radius: 50% !important;
  }
  .react-datepicker__day--selected {
    background: linear-gradient(135deg, #ff5000, #ff2d55) !important;
    border-radius: 50% !important;
  }
  .react-datepicker__day--disabled {
    color: rgba(255, 255, 255, 0.1) !important;
  }
  .react-datepicker__navigation--next, .react-datepicker__navigation--previous {
    top: 15px !important;
  }
`;

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: null as Date | null,
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date: Date | null) => {
    setForm({ ...form, eventDate: date });
  };

  const handleSubmit = async () => {
    if (!form.eventDate) {
        alert("Please select a date");
        return;
    }
    
    setStatus("loading");
    const res = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        eventDate: form.eventDate.toISOString(), // Convert date to string for the API
      }),
    });

    if (res.ok) {
      setStatus("success");
      setForm({ name: "", email: "", phone: "", eventType: "", eventDate: null, message: "" });
    } else {
      setStatus("error");
    }
  };

  const inputBaseStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    padding: "0.75rem 1rem",
    color: "#fff",
    fontSize: "0.9rem",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    color: "rgba(255,255,255,0.5)",
    fontSize: "0.75rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    marginBottom: "0.5rem",
  };

  return (
    <section style={{ background: "#05050a", padding: "5rem 2.5rem", minHeight: "100vh" }}>
      <style>{calendarStyles}</style>
      
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.5rem", color: "#fff", marginBottom: "0.5rem" }}>
          Book an <span style={{ color: "#ff5000" }}>Event</span>
        </h2>
        <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: "2rem" }}>
          Fill in the form and we'll get back to you within 24 hours.
        </p>

        {status === "success" && (
          <div style={{ background: "rgba(0,200,100,0.1)", border: "1px solid rgba(0,200,100,0.3)", borderRadius: "8px", padding: "1rem", marginBottom: "1.5rem", color: "#00c864" }}>
            ✅ Booking submitted! We'll contact you soon.
          </div>
        )}

        {status === "error" && (
          <div style={{ background: "rgba(255,45,85,0.1)", border: "1px solid rgba(255,45,85,0.3)", borderRadius: "8px", padding: "1rem", marginBottom: "1.5rem", color: "#ff2d55" }}>
            ❌ Something went wrong. Please try again.
          </div>
        )}

        {/* Regular Inputs */}
        <div style={{ marginBottom: "1.25rem" }}>
          <label style={labelStyle}>Full Name *</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Juan dela Cruz" style={inputBaseStyle} />
        </div>

        <div style={{ marginBottom: "1.25rem" }}>
          <label style={labelStyle}>Email *</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="juan@email.com" style={inputBaseStyle} />
        </div>

        <div style={{ marginBottom: "1.25rem" }}>
          <label style={labelStyle}>Phone / Viber *</label>
          <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="+63 912 345 6789" style={inputBaseStyle} />
        </div>

        {/* Improved Date Picker */}
        <div style={{ marginBottom: "1.25rem" }}>
          <label style={labelStyle}>Event Date *</label>
          <DatePicker
            selected={form.eventDate}
            onChange={handleDateChange}
            minDate={new Date()}
            placeholderText="Choose a date..."
            className="datepicker-input"
            customInput={
              <input style={inputBaseStyle} />
            }
          />
        </div>

        <div style={{ marginBottom: "1.25rem" }}>
          <label style={labelStyle}>Event Type *</label>
          <select
            name="eventType"
            value={form.eventType}
            onChange={handleChange}
            style={{ ...inputBaseStyle, background: "#0f0f1a", color: form.eventType ? "#fff" : "rgba(255,255,255,0.3)" }}
          >
            <option value="" disabled>Select event type...</option>
            <option value="Wedding">Wedding</option>
            <option value="Birthday">Birthday</option>
            <option value="Corporate">Corporate Event</option>
            <option value="Concert">Concert / Show</option>
            <option value="Debut">Debut</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div style={{ marginBottom: "1.75rem" }}>
          <label style={labelStyle}>Message / Equipment Needed</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            placeholder="Tell us about your event..."
            style={{ ...inputBaseStyle, resize: "vertical", fontFamily: "inherit" }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={status === "loading"}
          style={{
            width: "100%",
            background: "linear-gradient(135deg, #ff5000, #ff2d55)",
            border: "none",
            borderRadius: "8px",
            padding: "1rem",
            color: "#fff",
            fontSize: "0.85rem",
            fontWeight: "600",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: status === "loading" ? "not-allowed" : "pointer",
            opacity: status === "loading" ? 0.7 : 1
          }}
        >
          {status === "loading" ? "Submitting..." : "📅 Send Inquiry"}
        </button>
      </div>
    </section>
  );
}