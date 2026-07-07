import React, { useState, useEffect } from "react";
import PageHeader from "../../components/layout/PageHeader";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase"; // Adjust path to your firebase.js
import "./Projects.css";
import { Helmet } from "react-helmet-async";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Assuming your Firestore collection is named 'projects'
        const querySnapshot = await getDocs(collection(db, "projects"));
        const projectsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // ADDED: Sort projects by the 'order' field to adjust priority
        projectsData.sort((a, b) => (a.order || 99) - (b.order || 99));

        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <div>Loading projects...</div>;

  return (
    <>
      <Helmet>
        <title>Projects | CCA Robocell | NIT Durgapur</title>

        <meta
          name="description"
          content="Discover innovative robotics, embedded systems, IoT, AI, and automation projects built by the members of CCA Robocell at NIT Durgapur."
        />

        <meta
          name="keywords"
          content="Robotics Projects, Arduino Projects, IoT, AI Projects, Embedded Systems, NIT Durgapur"
        />
      </Helmet>
      <div className="rc-projects-page">
        <PageHeader
          title={
            <>
              Robotics <span className="rc-text-gradient">Projects</span>
            </>
          }
          subtitle="From concept to competition — every project here represents months of engineering, testing, and iteration."
        />

        <div className="rc-projects-container">
          <div className="rc-projects-grid">
            {projects.map((project) => (
              <div key={project.id} className="rc-card rc-project-card-full">
                <div className="rc-project-cover">
                  {/* Embedded YouTube Player */}
                  <iframe
                    src={project.videoUrl} // We will format this URL below
                    title={project.name}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>

                  <div className="rc-project-badge-wrap">
                    <span className={`rc-status-${project.statusColor}`}>
                      {project.status}
                    </span>
                  </div>
                </div>

                <div className="rc-project-info">
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
