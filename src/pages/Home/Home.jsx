import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, Loader2, FolderOpen } from "lucide-react";
import { motion } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import "./Home.css";
import heroImg from "../../assets/image1.png";
import missionImg from "../../assets/image2.png";
import visionImg from "../../assets/image3.png";
import { Helmet } from "react-helmet-async";

const API_KEY = import.meta.env.VITE_DRIVE_API_KEY;
const ROOT_FOLDER_ID = import.meta.env.VITE_DRIVE_ROOT_FOLDER_ID;

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

export default function Home() {
  const [previewGallery, setPreviewGallery] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [loadingFirebase, setLoadingFirebase] = useState(true);

  useEffect(() => {
    const fetchFirebaseData = async () => {
      try {
        const projectsSnapshot = await getDocs(collection(db, "projects"));
        const projectsData = projectsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // FIX: Filter for 'black' (case-insensitive) FIRST, then slice the top 3
        const blackProjects = projectsData.filter(
          (project) =>
            project.statusColor &&
            project.statusColor.toLowerCase() === "black",
        );

        setFeaturedProjects(blackProjects.slice(0, 3));
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoadingFirebase(false);
      }
    };
    fetchFirebaseData();
  }, []);

  useEffect(() => {
    const fetchPreviewFolders = async () => {
      try {
        // 1. Fetch folders that contain '[Home]' in the name
        const folderResponse = await fetch(
          `https://www.googleapis.com/drive/v3/files?q='${ROOT_FOLDER_ID}'+in+parents+and+mimeType='application/vnd.google-apps.folder'+and+name+contains+'[Home]'+and+trashed=false&key=${API_KEY}&fields=files(id,name)&pageSize=3`
        );
        const folderData = await folderResponse.json();

        if (folderData.files) {
          const albums = await Promise.all(
            folderData.files.map(async (folder) => {
              try {
                // 2. Fetch cover image ID
                const coverRes = await fetch(
                  `https://www.googleapis.com/drive/v3/files?q='${folder.id}'+in+parents+and+mimeType+contains+'image/'+and+trashed=false&key=${API_KEY}&fields=files(id)&pageSize=1`
                );
                const coverData = await coverRes.json();

                // 3. Use Proxy CDN for the cover
                const coverUrl =
                  coverData.files && coverData.files.length > 0
                    ? `https://wsrv.nl/?url=drive.google.com/uc?id=${coverData.files[0].id}&w=600&output=webp`
                    : null;

                // 4. Clean the title before saving it to state
                // This removes the "[Home]" tag so it looks perfectly normal on the website
                const cleanTitle = folder.name.replace('[Home]', '').trim();

                return { id: folder.id, title: cleanTitle, src: coverUrl };
              } catch (err) {
                // Clean the title here as well just in case the image fetch fails
                return { id: folder.id, title: folder.name.replace('[Home]', '').trim(), src: null };
              }
            })
          );
          setPreviewGallery(albums);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoadingGallery(false);
      }
    };
    if (API_KEY && ROOT_FOLDER_ID) fetchPreviewFolders();
  }, []);

  const getEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("/embed/")) return url;
    if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
    if (url.includes("youtu.be/"))
      return url.replace("youtu.be/", "www.youtube.com/embed/");
    return url;
  };

  return (
    <>
      <Helmet>
        <title>CCA Robocell | Official Robotics Club of NIT Durgapur</title>

        <meta
          name="description"
          content="CCA Robocell is the official robotics club of NIT Durgapur. Explore robotics projects, workshops, competitions, events, achievements, and innovations in robotics, AI, and embedded systems."
        />

        <meta
          name="keywords"
          content="CCA Robocell, NIT Durgapur Robotics Club, Robotics, AI, Arduino, Electronics, Embedded Systems, Robotics Projects"
        />
      </Helmet>
      <div className="rc-home-container">
        {/* =========================================
          CINEMATIC SECTIONS (Hero, Mission, Vision)
          ========================================= */}
        <div className="rc-cinematic-flow">
          {/* 1. HERO SECTION (Top) */}
          <section className="rc-cinematic-section">
            <img
              src={heroImg}
              alt="Robotics Hero"
              className="rc-cinematic-hero-img"
            />
            <div className="rc-cinematic-overlay" />

            <div className="rc-container rc-cinematic-content">
              <motion.div
                className="rc-cinematic-text align-left"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div variants={fadeUp} className="rc-hero-badge">
                  <span className="dot" />
                  <span
                    className="rc-section-label"
                    style={{ fontSize: "11px", marginBottom: 0 }}
                  >
                    NIT DURGAPUR ROBOTICS CLUB
                  </span>
                </motion.div>
                <motion.h1 variants={fadeUp} className="rc-hero-title">
                  Building The Future Of{" "}
                  <span className="rc-text-gradient">Robotics</span>
                </motion.h1>
                <motion.p variants={fadeUp} className="rc-hero-subtitle">
                  We design, build, and compete with autonomous robots. From
                  sensor integration to AI logic — we push the boundaries of
                  what machines can do.
                </motion.p>
                <motion.div variants={fadeUp} className="rc-hero-actions">
                  <Link to="/projects" className="rc-btn-yellow">
                    Explore Projects <ArrowRight size={16} />
                  </Link>
                  <Link to="/events" className="rc-btn-outline">
                    Upcoming Events <ChevronRight size={16} />
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* 2. MISSION SECTION (Center) */}
          <section className="rc-cinematic-section">
            <img
              src={missionImg}
              alt="Engineering Mission"
              className="rc-cinematic-mission-img"
            />
            <div className="rc-cinematic-overlay" />

            <div className="rc-container rc-cinematic-content reverse">
              <motion.div
                className="rc-cinematic-text align-right"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.div variants={fadeUp} className="rc-hero-badge">
                  <span className="dot" />
                  <span
                    className="rc-section-label"
                    style={{ fontSize: "11px", marginBottom: 0 }}
                  >
                    OUR MISSION
                  </span>
                </motion.div>
                <motion.h2 variants={fadeUp} className="rc-mv-title">
                  Empowering The Next Generation Of{" "}
                  <span className="rc-text-gradient">Engineers</span>
                </motion.h2>
                <motion.p variants={fadeUp} className="rc-mv-subtitle">
                  To cultivate a thriving ecosystem of student engineers at NIT
                  Durgapur who design, build, and deploy intelligent robotic
                  systems, bridging the gap between theoretical knowledge and
                  practical engineering.
                </motion.p>
              </motion.div>
            </div>
          </section>

          {/* 3. VISION SECTION (Bottom) */}
          <section className="rc-cinematic-section">
            <img
              src={visionImg}
              alt="Drone Swarm Vision"
              className="rc-cinematic-vision-img"
            />
            <div className="rc-cinematic-overlay" />

            <div className="rc-container rc-cinematic-content">
              <motion.div
                className="rc-cinematic-text align-left"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.div variants={fadeUp} className="rc-hero-badge">
                  <span className="dot" />
                  <span
                    className="rc-section-label"
                    style={{ fontSize: "11px", marginBottom: 0 }}
                  >
                    THE PATH FORWARD
                  </span>
                </motion.div>
                <motion.h2 variants={fadeUp} className="rc-mv-title">
                  Leading India's Student{" "}
                  <span className="rc-text-gradient">Innovation</span>
                </motion.h2>
                <motion.p variants={fadeUp} className="rc-mv-subtitle">
                  To be India's leading student robotics club — recognized for
                  academic excellence, competition dominance, and the quality of
                  engineers we develop.
                </motion.p>
              </motion.div>
            </div>
          </section>
        </div>

        {/* 4. Featured Projects (Firebase) */}
        <section className="rc-home-section rc-projects-preview">
          <div className="rc-container">
            <motion.div
              className="rc-section-header"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <h2>
                Our <span className="rc-text-gradient">Projects</span>
              </h2>
              <p>
                Cutting-edge autonomous and software projects built by our
                members.
              </p>
            </motion.div>

            {loadingFirebase ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "40px 0",
                }}
              >
                <Loader2 className="spinner" color="#FFE100" size={32} />
              </div>
            ) : (
              <>
                <motion.div
                  className="rc-projects-grid"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                >
                  {featuredProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      variants={fadeUp}
                      className="rc-card rc-project-card"
                    >
                      <div className="rc-project-image">
                        {project.videoUrl ? (
                          <iframe
                            src={getEmbedUrl(project.videoUrl)}
                            title={project.name}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{ width: "100%", height: "100%" }}
                          ></iframe>
                        ) : (
                          /* Removed Unsplash Fallback */
                          project.cover && (
                            <img
                              src={project.cover}
                              alt={project.name}
                              loading="lazy"
                            />
                          )
                        )}
                      </div>
                      <div className="rc-project-info">
                        <h3>{project.name}</h3>
                        <p>{project.description || project.status}</p>
                        <Link to="/projects" className="rc-project-link">
                          Learn More <ArrowRight size={15} />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Styled Button matching the Gallery section */}
                <motion.div 
                  className="rc-center-action" 
                  style={{ marginTop: "40px" }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                >
                  <Link to="/projects" className="rc-btn-yellow">
                    View All Projects <ArrowRight size={16} />
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </section>

        {/* 5. Gallery Preview (Google Drive Folders) */}
        <section className="rc-home-section rc-gallery-preview">
          <div className="rc-container">
            <motion.div
              className="rc-section-header"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <h2>
                Moments That <span className="rc-text-gradient">Define Us</span>
              </h2>
              <p>Browse our latest event albums and workshops.</p>
            </motion.div>

            {loadingGallery ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "40px 0",
                }}
              >
                <Loader2 className="spinner" color="#FFE100" size={32} />
              </div>
            ) : (
              <motion.div
                className="rc-gallery-grid"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                {previewGallery.map((album) => (
                  <motion.div
                    key={album.id}
                    variants={fadeUp}
                    className="rc-gallery-img rc-gallery-item"
                  >
                    {album.src ? (
                      <img src={album.src} alt={album.title} loading="lazy" />
                    ) : (
                      <div className="rc-empty-cover">
                        <FolderOpen size={40} color="#2A3241" />
                      </div>
                    )}
                    <div className="caption">{album.title}</div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            <div className="rc-center-action" style={{ marginTop: "40px" }}>
              <Link to="/gallery" className="rc-btn-yellow">
                View All Albums <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
