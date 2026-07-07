import React, { useState, useRef, useEffect } from "react";
import PageHeader from "../../components/layout/PageHeader";
import legacyImg from "../../assets/image.png";
import DriveImage from "../../components/common/DriveImage";
import { ArrowUp, Trophy, Users, Cpu, Medal } from "lucide-react";
import { Helmet } from "react-helmet-async";

// Firebase imports
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

import "./Achievements.css";

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [fastScroll, setFastScroll] = useState(false);
  const [isTimelineHovered, setIsTimelineHovered] = useState(false);
  const touchStartY = useRef(0);

  // --- HIDE GLOBAL FOOTERS ---
  useEffect(() => {
    const globalFooters = document.querySelectorAll(
      "footer:not(.hof-local-footer)",
    );
    globalFooters.forEach((f) => (f.style.display = "none"));
    return () => {
      globalFooters.forEach((f) => (f.style.display = ""));
    };
  }, []);

  // --- FETCH DATA FROM FIREBASE (WITH AUTO-CLEANER) ---
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "hallOfFame"));

        const fetchedData = querySnapshot.docs.map((doc) => {
          const rawData = doc.data();
          const cleanData = {};

          // THE MAGIC FIX: This loops through your Firebase keys and removes invisible spaces
          Object.keys(rawData).forEach((key) => {
            cleanData[key.trim()] = rawData[key];
          });

          return {
            id: doc.id,
            ...cleanData,
          };
        });

        fetchedData.sort((a, b) => (a.order || 99) - (b.order || 99));

        const heroSlide = {
          id: "hero-intro",
          year: "Founding",
          isHero: true,
        };

        setAchievements([heroSlide, ...fetchedData]);
      } catch (error) {
        console.error("Error fetching Hall of Fame data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  const handleWheel = (e) => {
    if (isScrolling) return;
    if (Math.abs(e.deltaY) < 20) return;

    setFastScroll(false);

    if (e.deltaY > 0 && activeIndex < achievements.length - 1) {
      triggerScroll(activeIndex + 1);
    } else if (e.deltaY < 0 && activeIndex > 0) {
      triggerScroll(activeIndex - 1);
    }
  };

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (isScrolling) return;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;

    setFastScroll(false);

    if (deltaY > 50 && activeIndex < achievements.length - 1) {
      triggerScroll(activeIndex + 1);
    } else if (deltaY < -50 && activeIndex > 0) {
      triggerScroll(activeIndex - 1);
    }
  };

  const triggerScroll = (newIndex) => {
    setIsScrolling(true);
    setActiveIndex(newIndex);
    setTimeout(() => setIsScrolling(false), 1200);
  };

  const jumpToTop = () => {
    setFastScroll(true);
    setActiveIndex(0);
  };

  if (loading) {
    return (
      <div
        style={{
          color: "#A0A8B8",
          padding: "120px",
          textAlign: "center",
          minHeight: "100vh",
          backgroundColor: "#050b14",
        }}
      >
        Loading Legacy...
      </div>
    );
  }

  const progressPercentage =
    achievements.length > 1
      ? (activeIndex / (achievements.length - 1)) * 100
      : 0;

  return (
    <>
      <Helmet>
        <title>Achievements | CCA Robocell</title>

        <meta
          name="description"
          content="Explore the achievements, competition victories, hackathon wins, research contributions, and milestones of CCA Robocell."
        />

        <meta
          name="keywords"
          content="Robotics Achievements, Hackathon Winners, Robotics Competition, NIT Durgapur"
        />
      </Helmet>

      <div
        className="rc-hof-wrapper"
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          position: "fixed",
          top: "70px",
          left: 0,
          width: "100vw",
          height: "calc(100vh - 70px)",
          backgroundColor: "#050b14",
          zIndex: 40,
          overflow: "hidden",
        }}
      >
        {/* Sliding Timeline */}
        <div
          className="rc-hof-timeline"
          onMouseEnter={() => setIsTimelineHovered(true)}
          onMouseLeave={() => setIsTimelineHovered(false)}
          style={{
            opacity: activeIndex === 0 ? 0 : 1,
            pointerEvents: activeIndex === 0 ? "none" : "auto",
            transition: "opacity 0.6s ease",
          }}
        >
          <div
            className="timeline-track-container"
            style={{
              position: "relative",
              width: "30px",
              height: "80%",
              margin: "0 auto",
            }}
          >
            <div
              className="timeline-line-bg"
              style={{
                position: "absolute",
                left: "50%",
                top: 0,
                bottom: 0,
                width: "8px",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                borderRadius: "10px",
                transformOrigin: "center",
                transform: isTimelineHovered
                  ? "translateX(-50%) scaleX(1.3)"
                  : "translateX(-50%) scaleX(1)",
                transition: "transform 0.3s ease",
                zIndex: 1,
              }}
            ></div>

            <div
              className="timeline-line-fill"
              style={{
                position: "absolute",
                left: "50%",
                top: 0,
                width: "8px",
                backgroundColor: "#FFE100",
                borderRadius: "10px",
                transformOrigin: "center",
                height: `${progressPercentage}%`,
                transform: isTimelineHovered
                  ? "translateX(-50%) scaleX(1.3)"
                  : "translateX(-50%) scaleX(1)",
                transition:
                  "height 1s cubic-bezier(0.65, 0, 0.35, 1), transform 0.3s ease",
                zIndex: 2,
              }}
            ></div>

            {achievements.map((item, index) => {
              const topPosition = `${(index / (achievements.length - 1)) * 100}%`;

              return (
                <div
                  key={item.id || `${item.year}-${index}`}
                  className={`timeline-dot-wrapper ${activeIndex === index ? "active" : ""}`}
                  style={{
                    position: "absolute",
                    top: topPosition,
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    alignItems: "center",
                    zIndex: 3,
                    transition: "top 0.5s ease",
                  }}
                  onClick={() => {
                    setFastScroll(false);
                    triggerScroll(index);
                  }}
                >
                  <div className="timeline-dot"></div>
                  <span className="timeline-label">{item.year}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content Track */}
        <div
          className="rc-hof-track"
          style={{
            transform: `translateY(-${activeIndex * 100}%)`,
            transition: fastScroll
              ? "none"
              : "transform 1s cubic-bezier(0.65, 0, 0.35, 1)",
            width: "100%",
            height: "100%",
            willChange: "transform",
          }}
        >
          {achievements.map((achieve, index) => (
            <section
              key={achieve.id || `${achieve.year}-${index}`}
              className="rc-hof-section"
              style={{
                height: "100%",
                width: "100vw",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              {/* Slide 0: The Cyber-Legacy Intro */}
              {index === 0 ? (
                <div className="hof-hero-section">
                  <div className="hof-hero-container">
                    <div className="hof-cyber-card">
                      <div className="cyber-line line-top-left"></div>
                      <div className="cyber-line line-bottom-left"></div>
                      <div className="cyber-line line-bottom-right"></div>

                      <div className="hof-cyber-content">
                        <div className="hof-top-tag">
                          <span className="hof-dot"></span>
                          ACHIEVEMENTS
                        </div>

                        <h2 className="hof-cyber-heading">
                          Built on{" "}
                          <span className="rc-text-gradient">curiosity.</span>
                          <br />
                          Driven by{" "}
                          <span className="rc-text-gradient">impact.</span>
                        </h2>

                        <p className="hof-cyber-desc">
                          From late nights in the lab to podium finishes, our
                          journey is a testament to passion, teamwork and the
                          relentless pursuit of innovation.
                        </p>

                        <div className="hof-cyber-stats-container">
                          <div className="hof-cyber-stat-item">
                            <Trophy
                              size={20}
                              color="#FFE100"
                              strokeWidth={1.5}
                            />
                            <span className="stat-num">25+</span>
                            <span className="stat-label">Achievements</span>
                          </div>
                          <div className="hof-cyber-stat-item">
                            <Users
                              size={20}
                              color="#FFE100"
                              strokeWidth={1.5}
                            />
                            <span className="stat-num">150+</span>
                            <span className="stat-label">Visionaries</span>
                          </div>
                          <div className="hof-cyber-stat-item">
                            <Cpu size={20} color="#FFE100" strokeWidth={1.5} />
                            <span className="stat-num">30+</span>
                            <span className="stat-label">Projects Built</span>
                          </div>
                          <div className="hof-cyber-stat-item">
                            <Medal
                              size={20}
                              color="#FFE100"
                              strokeWidth={1.5}
                            />
                            <span className="stat-num">10+</span>
                            <span className="stat-label">National Wins</span>
                          </div>
                        </div>
                      </div>

                      <div className="hof-cyber-image-wrapper">
                        <img src={legacyImg} alt="Robocell Legacy" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Slides 1+: Standard Split Layout */
                <div className="rc-hof-content hof-shifted-left">
                  <div className="hof-split-layout">
                    <div className="hof-text-side">
                      <h3 className="hof-year">{achieve.year}</h3>
                      <h2 className="hof-title">{achieve.title}</h2>
                      <h4 className="hof-subtitle">{achieve.subtitle}</h4>

                      <p className="hof-description">
                        {achieve.description ||
                          achieve.shortDescription ||
                          achieve.desc ||
                          "Description not found in Firebase."}
                      </p>
                    </div>

                    <div className="hof-image-side">
                      <div className="hof-image-block">
                        {(() => {
                          const imgUrl =
                            achieve.image ||
                            achieve.imageUrl ||
                            achieve.coverImage;

                          if (!imgUrl)
                            return (
                              <DriveImage rawLink={null} alt={achieve.title} />
                            );

                          if (
                            imgUrl.includes("drive.google.com") ||
                            imgUrl.includes("id=")
                          ) {
                            return (
                              <DriveImage
                                rawLink={imgUrl}
                                alt={achieve.title}
                              />
                            );
                          }

                          return (
                            <img
                              src={imgUrl}
                              alt={achieve.title}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                              loading="lazy"
                            />
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Back to Top */}
              {index === achievements.length - 1 && (
                <button className="rc-hof-top-btn" onClick={jumpToTop}>
                  <ArrowUp size={20} color="#121820" />
                  Back to Top
                </button>
              )}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
