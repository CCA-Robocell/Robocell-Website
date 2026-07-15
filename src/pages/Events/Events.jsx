import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, Calendar, MapPin, ArrowRight } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import DriveImage from "../../components/common/DriveImage"; // IMPORT ADDED
import { Helmet } from "react-helmet-async";

// Firebase imports
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

import "./Events.css";

export default function Events() {
  const categories = [
    "All",
    "Workshop",
    "Competition",
    "Hackathon",
    "Seminar",
    "Selection",
  ];

  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const eventsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        eventsData.sort((a, b) => (a.order || 99) - (b.order || 99));
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filtered =
    filter === "All" ? events : events.filter((e) => e.category === filter);

  const getStatusStyle = (status) => {
    if (status === "Registration Open") return "rc-status-green";
    if (status === "Coming Soon" || status === "Upcoming")
      return "rc-status-yellow";
    return "rc-status-blue";
  };

  if (loading) {
    return (
      <div
        style={{
          color: "#A0A8B8",
          padding: "120px",
          textAlign: "center",
          minHeight: "100vh",
        }}
      >
        Loading Events...
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Events & Workshops | CCA Robocell</title>

        <meta
          name="description"
          content="Explore upcoming robotics workshops, hackathons, competitions, seminars, and technical events organized by CCA Robocell, NIT Durgapur."
        />

        <meta
          name="keywords"
          content="Robotics Workshop, Hackathon, Technical Events, NIT Durgapur, Robotics Competition"
        />
      </Helmet>
      <div className="rc-events-page animate-fade-in">
        <PageHeader
          title={
            <>
              Events & <span className="rc-text-gradient">Workshops</span>
            </>
          }
          subtitle="Participate in our workshops, competitions, and seminars. Sharpen your skills."
        />

        <div className="rc-events-container">
          <div className="rc-events-filter-bar">
            <Filter size={15} color="#A0A8B8" />
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`rc-filter-btn ${filter === c ? "active" : ""}`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="rc-events-grid">
            {filtered.map((event) => {
              // Check if registration is explicitly closed
              const isClosed =
                !event.registrationOpen || event.status === "Closed";

              return (
                <div
                  key={event.id}
                  // Dynamically add the 'rc-event-closed' class if the event is closed
                  className={`rc-card rc-event-card ${isClosed ? "rc-event-closed" : ""}`}
                >
                  <div className="rc-event-cover">
                    <DriveImage rawLink={event.image} alt={event.title} />

                    <span
                      className={`rc-event-status ${getStatusStyle(event.status)}`}
                    >
                      {event.status}
                    </span>
                  </div>

                  <div className="rc-event-details">
                    <h3>{event.title}</h3>
                    <p className="description">{event.shortDescription}</p>

                    <div className="rc-event-meta">
                      <div className="meta-item">
                        <Calendar size={13} color="#FFE100" />
                        <span>{event.date}</span>
                      </div>
                      <div className="meta-item align-start">
                        <MapPin
                          size={13}
                          color="#FFE100"
                          className="meta-icon-top"
                        />
                        <span>{event.venue}</span>
                      </div>
                    </div>

                    {/* Updated Button Logic */}
                    {!isClosed ? (
                      <button
                        className="rc-btn-yellow rc-event-action-btn"
                        onClick={() => navigate(`/register/${event.id}`)}
                      >
                        Register Now <ArrowRight size={15} />
                      </button>
                    ) : (
                      <button className="rc-event-disabled-btn" disabled>
                        Registration Closed
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
