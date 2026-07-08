import React, { useState, useRef, useEffect, useCallback } from "react";
import legacyImg from "../../assets/image.png";
import DriveImage from "../../components/common/DriveImage";
import { ArrowUp, ChevronDown, Trophy, Users, Cpu, Medal } from "lucide-react";
import { Helmet } from "react-helmet-async";

// Firebase imports
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

import "./Achievements.css";

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleSet, setVisibleSet] = useState(() => new Set([0]));

  const scrollRef = useRef(null);
  const sectionRefs = useRef([]);
  const segRefs = useRef([]);

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

  // --- SCROLLSPY: track which section is centered (drives the rail) ---
  // --- REVEAL: fade sections in as they enter the viewport ---
  useEffect(() => {
    if (!achievements.length) return;

    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.index);
            setActiveIndex(idx);
          }
        });
      },
      { root: scrollRef.current, rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    const reveal = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.index);
            setVisibleSet((prev) =>
              prev.has(idx) ? prev : new Set(prev).add(idx),
            );
          }
        });
      },
      { root: scrollRef.current, threshold: 0.25 },
    );

    sectionRefs.current.forEach((el) => {
      if (!el) return;
      spy.observe(el);
      reveal.observe(el);
    });

    return () => {
      spy.disconnect();
      reveal.disconnect();
    };
  }, [achievements]);

  const scrollToIndex = useCallback((index) => {
    sectionRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  // Keep the active pill scrolled into view inside the horizontal story bar
  useEffect(() => {
    segRefs.current[activeIndex]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeIndex]);

  const jumpToTop = () => scrollToIndex(0);

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

      <div className="rc-hof-wrapper">
        {/* Horizontal Story Bar — flows above the content, never a fixed side rail */}
        <nav
          className={`rc-hof-topbar ${activeIndex === 0 ? "is-collapsed" : ""}`}
        >
          <div className="topbar-track">
            <div className="topbar-line-bg" />
            <div
              className="topbar-line-fill"
              style={{ width: `${progressPercentage}%` }}
            />

            {achievements.map((item, index) => (
              <button
                key={item.id || `${item.year}-${index}`}
                type="button"
                ref={(el) => (segRefs.current[index] = el)}
                className={`topbar-seg ${activeIndex === index ? "active" : ""}`}
                onClick={() => scrollToIndex(index)}
              >
                <span className="topbar-seg-dot" />
                <span className="topbar-seg-year">{item.year}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Native scroll-snap story track */}
        <div className="rc-hof-scroll" ref={scrollRef}>
          {achievements.map((achieve, index) => (
            <section
              key={achieve.id || `${achieve.year}-${index}`}
              ref={(el) => (sectionRefs.current[index] = el)}
              data-index={index}
              className={`rc-hof-section ${visibleSet.has(index) ? "is-visible" : ""}`}
            >
              <div className="rc-hof-section-glow" aria-hidden="true" />

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

                        <div className="hof-scroll-cue">
                          <span>Scroll to explore the journey</span>
                          <ChevronDown size={16} />
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
                      <span className="hof-kicker">
                        Achievement {String(index).padStart(2, "0")} /{" "}
                        {String(achievements.length - 1).padStart(2, "0")}
                      </span>
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
            </section>
          ))}
        </div>

        {/* Back to Top */}
        <button
          className={`rc-hof-top-btn ${activeIndex > 0 ? "is-visible" : ""}`}
          onClick={jumpToTop}
        >
          <ArrowUp size={20} color="#121820" />
          Back to Top
        </button>
      </div>
    </>
  );
}
