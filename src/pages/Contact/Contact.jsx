import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase"; // Ensure this path correctly points to your firebase.js
import "./Contact.css";
import { Helmet } from "react-helmet-async";

// ── Feedback banner (success or error) ───────────────────────
function FeedbackBanner({ type }) {
  const isSuccess = type === "success";

  return (
    <div
      className={`animate-fade-in contact-feedback contact-feedback--${type}`}
    >
      <div className="contact-feedback-icon">
        {isSuccess ? (
          // Checkmark
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          // Warning circle
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        )}
      </div>
      <div>
        <div className="contact-feedback-title">
          {isSuccess ? "Message received!" : "Something went wrong"}
        </div>
        <div className="contact-feedback-sub">
          {isSuccess
            ? "Thanks for reaching out. Our team will get back to you within 24 hours — keep an eye on your inbox."
            : "We couldn't send your message. Please try again or email us directly at contact@robocellnitd.in."}
        </div>
      </div>
    </div>
  );
}

// ── Main form card ────────────────────────────────────────────
function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null); // null | 'success' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      await addDoc(collection(db, "messages"), {
        name,
        email,
        message,
        timestamp: serverTimestamp(),
        status: "UNREAD",
      });
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="card contact-form-card">
      <h3 style={{ fontSize: "1.4rem", color: "white", marginBottom: "22px" }}>
        Send a Message
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Message</label>
          <textarea
            rows="4"
            placeholder="How can we help you?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn-primary"
          style={{ marginTop: "10px" }}
        >
          Send Message
        </button>

        <p
          style={{
            textAlign: "center",
            fontSize: "0.78rem",
            color: "var(--text-muted)",
            marginTop: "14px",
          }}
        >
          🔒 Guaranteed response within 24 hours.
        </p>
      </form>

      {/* Inline success / error feedback */}
      {status && <FeedbackBanner type={status} />}
    </div>
  );
}

// ── Left column of the Contact page ───────────────────────────
const CHANNELS = [
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    title: "Email Us",
    sub: "Usually replies within 24h",
    value: "contact@robocellnitd.in",
    mono: true,
  },
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07
                 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67
                 A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72
                 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11
                 L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27
                 a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7
                 A2 2 0 0 1 22 16.92z"
        />
      </svg>
    ),
    title: "Call Us",
    sub: "Mon–Fri, 10am to 6pm",
    value: "+91 98765 43210",
    mono: true,
  },
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    title: "Visit Us",
    sub: "Student Activity Centre (SAC)",
    value: "NIT Durgapur, West Bengal",
    mono: false,
  },
];

function ContactInfo() {
  return (
    <div className="contact-info-wrapper">
      <div className="badge">GET IN TOUCH</div>

      <h1
        style={{
          fontSize: "clamp(2.2rem, 6vw, 3rem)",
          color: "#FFFFFF",
          marginBottom: "16px",
        }}
      >
        Contact <br />
        <span className="gradient-text">Us</span>
      </h1>

      <p
        className="text-muted"
        style={{ marginBottom: "40px", lineHeight: "1.6" }}
      >
        Have questions about a robotics project or your recent contribution?
        Reach out to the team.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {CHANNELS.map((item, i) => (
          <div key={i} className="contact-item">
            <div className="contact-icon">{item.icon}</div>
            <div>
              <h4
                style={{
                  color: "white",
                  fontSize: "1rem",
                  margin: "0 0 3px 0",
                }}
              >
                {item.title}
              </h4>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.82rem",
                  margin: "0 0 4px 0",
                }}
              >
                {item.sub}
              </p>
              <p
                style={{
                  color: "#FFFFFF",
                  fontFamily: item.mono ? "monospace" : "inherit",
                  fontSize: "0.88rem",
                  margin: 0,
                  wordBreak: "break-all",
                }}
              >
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Layout Component ───────────────────────────────────────
export default function Contact() {
  return (
    <>
      <Helmet>
        <title>Contact Us | CCA Robocell | NIT Durgapur</title>

        <meta
          name="description"
          content="Get in touch with CCA Robocell, the official robotics club of NIT Durgapur. Reach us for collaborations, workshops, events, sponsorships, or general inquiries."
        />

        <meta
          name="keywords"
          content="Contact CCA Robocell, NIT Durgapur Robotics Club, Robotics Club Contact, Collaborations, Workshops"
        />
      </Helmet>

      <div className="rc-contact-page animate-fade-in">
        <div className="contact-layout">
          {/* Left: contact channels */}
          <ContactInfo />
          {/* Right: message form */}
          <ContactForm />
        </div>
      </div>
    </>
  );
}
