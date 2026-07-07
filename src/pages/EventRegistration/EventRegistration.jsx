import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Send,
  CheckCircle,
  Upload,
} from "lucide-react";
import DriveImage from "../../components/common/DriveImage";
import { Helmet } from "react-helmet-async";

// Firebase imports (Storage functions removed)
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";

import "./EventRegistration.css";

const BRANCHES = [
  "Computer Science and Engineering",
  "Mathematics & Computing",
  "Electronics and Communication Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Chemical Engineering",
  "Civil Engineering",
  "Metallurgical and Materials Engineering",
  "Biotechnology",
  "Others",
];

export default function EventRegistration() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Dynamic Form State
  const [teamSize, setTeamSize] = useState(1);
  const [teamName, setTeamName] = useState("");
  const [participants, setParticipants] = useState([]);

  // Payment State
  const [paymentFile, setPaymentFile] = useState(null);
  const [paymentPreview, setPaymentPreview] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventRef = doc(db, "events", eventId);
        const eventSnap = await getDoc(eventRef);

        if (eventSnap.exists()) {
          const data = eventSnap.data();
          setEvent({ id: eventSnap.id, ...data });

          const adminTeamSize = data.teamSize || 1;
          setTeamSize(adminTeamSize);

          const initialSlots = Array.from({ length: adminTeamSize }, () => ({
            name: "",
            email: "",
            whatsapp: "",
            branch: "",
          }));
          setParticipants(initialSlots);
        } else {
          setEvent(null);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleParticipantChange = (index, field, value) => {
    const updatedParticipants = [...participants];
    updatedParticipants[index][field] = value;
    setParticipants(updatedParticipants);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentFile(file);
      // Converts the image into a Base64 string
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (teamSize > 1 && !teamName.trim()) {
      alert("Please provide a team name.");
      return;
    }

    if (event?.paid && !paymentFile) {
      alert("Please upload the screenshot of your payment proof.");
      return;
    }

    setSubmitting(true);

    try {
      const registrationData = {
        eventId: eventId,
        eventTitle: event.title,
        registrationDate: new Date(),
        teamSize: teamSize,
        teamName: teamSize > 1 ? teamName.trim() : null,
        participants: participants,
        // We push the Base64 string directly to the database now
        paymentProofImage: paymentPreview || null,
      };

      // This creates a subcollection called "registrations" inside this specific event's document
      await addDoc(
        collection(db, "events", eventId, "registrations"),
        registrationData,
      );
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting registration:", error);
      alert(
        "There was an error processing your registration. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="rc-reg-not-found">
        <p style={{ color: "#A0A8B8" }}>Loading Registration Details...</p>
      </div>
    );
  }

  if (!event)
    return (
      <div className="rc-reg-not-found">
        <div className="icon">🔍</div>
        <h2>Event Not Found</h2>
        <Link to="/events" className="rc-btn-outline">
          <ArrowLeft size={16} /> Back to Events
        </Link>
      </div>
    );

  return (
    <>
      <Helmet>
        <title>
          {event
            ? `${event.title} | Registration | CCA Robocell`
            : "Event Registration | CCA Robocell"}
        </title>

        <meta
          name="description"
          content={
            event
              ? `Register for ${event.title}, organized by CCA Robocell, NIT Durgapur.`
              : "Register for robotics workshops, competitions, hackathons, and technical events organized by CCA Robocell at NIT Durgapur."
          }
        />

        <meta
          name="keywords"
          content="Robotics Registration, Workshop Registration, Hackathon Registration, NIT Durgapur, CCA Robocell"
        />
      </Helmet>
      <div className="rc-reg-page">
        <div className="rc-reg-container">
          <Link to="/events" className="rc-reg-back-link">
            <ArrowLeft size={16} /> Back to Events
          </Link>

          <div className="rc-card rc-reg-header-card">
            <div className="rc-reg-thumb">
              <DriveImage rawLink={event.image} alt={event.title} />
            </div>
            <div className="rc-reg-header-info">
              <h2>{event.title}</h2>

              <div className="rc-reg-meta-row">
                <span className="meta">
                  <Calendar size={13} color="#FFE100" /> {event.date}
                </span>
                <span className="meta">
                  <MapPin size={13} color="#FFE100" /> {event.venue}
                </span>
              </div>

              {event.longDescription && (
                <div
                  className="rc-reg-description"
                  dangerouslySetInnerHTML={{ __html: event.longDescription }}
                />
              )}

              {event.paid && event.paymentAmount && (
                <div
                  style={{
                    marginTop: "12px",
                    color: "#4ade80",
                    fontWeight: "bold",
                  }}
                >
                  Registration Fee: ₹{event.paymentAmount}
                </div>
              )}
            </div>
          </div>

          {submitted ? (
            <div className="rc-card rc-reg-success">
              <CheckCircle size={56} color="#4ade80" className="success-icon" />
              <h2>Registration Submitted!</h2>
              <p>
                Your details for <strong>{event.title}</strong> have been
                recorded successfully. We will verify your entry and contact you
                soon.
              </p>
              <Link to="/events" className="rc-btn-outline">
                All Events
              </Link>
            </div>
          ) : (
            <div className="rc-card rc-reg-form-card">
              <h2>Registration Form</h2>

              {teamSize > 1 && (
                <p
                  style={{
                    color: "#A0A8B8",
                    fontSize: "14px",
                    marginBottom: "24px",
                  }}
                >
                  Note: Only the Team Leader's details are strictly required to
                  submit this form.
                </p>
              )}

              <form onSubmit={handleSubmit} className="rc-reg-form">
                {teamSize > 1 && (
                  <div style={{ marginBottom: "32px" }}>
                    <label className="rc-label">TEAM NAME *</label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      required
                      className="rc-input"
                      placeholder="Enter a unique team name"
                    />
                  </div>
                )}

                {participants.map((p, index) => (
                  <div key={index} className="rc-reg-participant-block">
                    <h3 className="rc-reg-section-title">
                      {teamSize === 1
                        ? "Participant Details"
                        : index === 0
                          ? "Team Leader Details"
                          : `Member ${index + 1} Details (Optional)`}
                    </h3>

                    <div className="rc-reg-form-grid">
                      <div>
                        <label className="rc-label">
                          FULL NAME {index === 0 && "*"}
                        </label>
                        <input
                          type="text"
                          value={p.name}
                          onChange={(e) =>
                            handleParticipantChange(
                              index,
                              "name",
                              e.target.value,
                            )
                          }
                          required={index === 0}
                          className="rc-input"
                        />
                      </div>
                      <div>
                        <label className="rc-label">
                          EMAIL ADDRESS {index === 0 && "*"}
                        </label>
                        <input
                          type="email"
                          value={p.email}
                          onChange={(e) =>
                            handleParticipantChange(
                              index,
                              "email",
                              e.target.value,
                            )
                          }
                          required={index === 0}
                          className="rc-input"
                        />
                      </div>
                      <div>
                        <label className="rc-label">
                          WHATSAPP NUMBER {index === 0 && "*"}
                        </label>
                        <input
                          type="tel"
                          value={p.whatsapp}
                          onChange={(e) =>
                            handleParticipantChange(
                              index,
                              "whatsapp",
                              e.target.value,
                            )
                          }
                          required={index === 0}
                          className="rc-input"
                          placeholder="10-digit number"
                        />
                      </div>
                      <div>
                        <label className="rc-label">
                          BRANCH {index === 0 && "*"}
                        </label>
                        <select
                          value={p.branch}
                          onChange={(e) =>
                            handleParticipantChange(
                              index,
                              "branch",
                              e.target.value,
                            )
                          }
                          className="rc-input"
                          required={index === 0} // <-- Forces Team Leader to select a branch
                        >
                          {/* Add this default placeholder option */}
                          <option value="" disabled>
                            Select a branch
                          </option>

                          {BRANCHES.map((branch) => (
                            <option key={branch} value={branch}>
                              {branch}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}

                {event.paid && (
                  <div className="rc-reg-payment-section">
                    <h3 className="rc-reg-payment-title">Payment Details</h3>

                    {event.paymentImage && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          marginBottom: "24px",
                        }}
                      >
                        <p
                          style={{
                            color: "#A0A8B8",
                            marginBottom: "12px",
                            fontSize: "14px",
                            textAlign: "center",
                          }}
                        >
                          Scan the QR code below to pay the registration fee of
                          ₹{event.paymentAmount}.
                        </p>
                        <DriveImage
                          rawLink={event.paymentImage}
                          alt="Payment QR Code"
                          style={{ maxWidth: "200px", borderRadius: "8px" }}
                        />
                      </div>
                    )}

                    <div>
                      <label className="rc-label">
                        UPLOAD PAYMENT PROOF (Screenshot) *
                      </label>
                      <div className="rc-file-upload-wrapper">
                        <label className="rc-file-upload-btn">
                          <Upload size={16} />
                          Choose File
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                            required={event.paid}
                          />
                        </label>
                        <span className="rc-file-upload-name">
                          {paymentFile ? paymentFile.name : "No file selected"}
                        </span>
                      </div>

                      {paymentPreview && (
                        <img
                          src={paymentPreview}
                          alt="Payment Preview"
                          className="rc-payment-preview-img"
                        />
                      )}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="rc-btn-yellow rc-reg-submit-btn"
                  style={{ marginTop: "32px" }}
                >
                  {submitting ? "Processing..." : "Submit Registration"}{" "}
                  <Send size={16} />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
