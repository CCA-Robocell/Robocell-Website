import React, { useState, useEffect } from "react";
import PageHeader from "../../components/layout/PageHeader";
import TeamCard from "../../components/ui/TeamCard";
import { Crown, Star, Users } from "lucide-react";
import { Helmet } from "react-helmet-async";

// Firebase imports
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase"; // Adjust path to your firebase.js

import "./Team.css";

export default function Team() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "team_members"));
        const teamData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMembers(teamData);
      } catch (error) {
        console.error("Error fetching team:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

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
        Loading Team Profiles...
      </div>
    );
  }

  // Filter the fetched data into their respective categories
  const advisor = members
    .filter((m) => m.role === "advisor")
    .sort((a, b) => (a.order || 99) - (b.order || 99));

  const executive = members
    .filter((m) => m.role === "executive")
    .sort((a, b) => (a.order || 99) - (b.order || 99));

  const senior = members
    .filter((m) => m.role === "senior")
    .sort((a, b) => (a.order || 99) - (b.order || 99));

  return (
    <>
      <Helmet>
        <title>Our Team | CCA Robocell</title>

        <meta
          name="description"
          content="Meet the dedicated team behind CCA Robocell, the official robotics club of NIT Durgapur, driving innovation through robotics and technology."
        />

        <meta
          name="keywords"
          content="Robocell Team, Robotics Club Members, NIT Durgapur Students, Robotics Leadership"
        />
      </Helmet>
      <div className="rc-team-page">
        <PageHeader
          title={
            <>
              Meet Our <span className="rc-text-gradient">Team</span>
            </>
          }
          subtitle="Passionate engineers, designers, and researchers united by a love for robotics."
        />

        <div className="rc-team-container">
          {/* Faculty Advisor */}
          {advisor.length > 0 && (
            <section className="rc-team-section">
              <div className="rc-team-header">
                <Crown size={22} color="#FFE100" />
                <h2>Faculty Advisor</h2>
              </div>
              <div className="rc-team-grid-featured">
                {advisor.map((member) => (
                  <TeamCard key={member.id} member={member} featured />
                ))}
              </div>
            </section>
          )}

          {/* Executive Members (All 4th Years) */}
          {executive.length > 0 && (
            <section className="rc-team-section">
              <div className="rc-team-header">
                <Star size={22} color="#FFE100" />
                <h2>Executive Members</h2>
              </div>
              <div className="rc-team-grid-core">
                {executive.map((member) => (
                  <TeamCard key={member.id} member={member} />
                ))}
              </div>
            </section>
          )}

          {/* Senior Members (All 3rd Years) */}
          {senior.length > 0 && (
            <section className="rc-team-section-last">
              <div className="rc-team-header">
                <Users size={22} color="#A0A8B8" />
                <h2>Senior Members</h2>
              </div>
              <div className="rc-team-grid-core">
                {senior.map((member) => (
                  <TeamCard key={member.id} member={member} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
