import React, { useState, useEffect } from "react";
import PageHeader from "../../components/layout/PageHeader";
import {
  Film,
  Loader2,
  ChevronDown,
  ChevronUp,
  Maximize2,
  X,
} from "lucide-react";
import "./Archives.css";
import { Helmet } from "react-helmet-async";

const API_KEY = import.meta.env.VITE_DRIVE_API_KEY;
const ARCHIVE_FOLDER_ID = import.meta.env.VITE_DRIVE_ARCHIVE_FOLDER_ID;

function FilmHoles({ count = 5 }) {
  return (
    <div className="rc-archive-film-holes">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rc-archive-film-hole" />
      ))}
    </div>
  );
}

export default function Archives() {
  const [archiveGroups, setArchiveGroups] = useState([]);
  const [expandedYears, setExpandedYears] = useState({});
  const [lightbox, setLightbox] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArchiveData = async () => {
      try {
        const folderResponse = await fetch(
          `https://www.googleapis.com/drive/v3/files?q='${ARCHIVE_FOLDER_ID}'+in+parents+and+mimeType='application/vnd.google-apps.folder'+and+trashed=false&key=${API_KEY}&fields=files(id,name)`,
        );
        const folderData = await folderResponse.json();

        if (folderData.files) {
          const sortedFolders = folderData.files.sort((a, b) =>
            b.name.localeCompare(a.name),
          );

          const groupsWithImages = await Promise.all(
            sortedFolders.map(async (folder) => {
              try {
                const imgResponse = await fetch(
                  `https://www.googleapis.com/drive/v3/files?q='${folder.id}'+in+parents+and+mimeType+contains+'image/'+and+trashed=false&key=${API_KEY}&fields=files(id,name,thumbnailLink)&pageSize=30`,
                );
                const imgData = await imgResponse.json();

                const images = imgData.files
                  ? imgData.files.map((file) => {
                      return `https://wsrv.nl/?url=drive.google.com/uc?id=${file.id}&w=1200&output=webp`;
                    })
                  : [];

                return { id: folder.id, year: folder.name, images };
              } catch (err) {
                console.error(`Error loading images for ${folder.name}:`, err);
                return { id: folder.id, year: folder.name, images: [] };
              }
            }),
          );

          setArchiveGroups(groupsWithImages);
        }
      } catch (error) {
        console.error("Failed to fetch archives from Google Drive:", error);
      } finally {
        setLoading(false);
      }
    };

    if (API_KEY && ARCHIVE_FOLDER_ID) {
      fetchArchiveData();
    } else {
      setLoading(false);
    }
  }, []);

  const toggleExpandYear = (year) => {
    setExpandedYears((prev) => ({ ...prev, [year]: !prev[year] }));
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <>
      <Helmet>
        <title>Archives | CCA Robocell</title>

        <meta
          name="description"
          content="Explore the history of CCA Robocell through past teams, previous events, legacy projects, and memorable moments."
        />

        <meta
          name="keywords"
          content="Robocell History, Past Teams, Robotics Club Archives, Legacy Projects"
        />
      </Helmet>
      <div className="rc-archive-page animate-fade-in">
        <PageHeader
          title={
            <>
              Our <span className="rc-text-gradient">Archives</span>
            </>
          }
          subtitle="A journey through time. Explore the memories, events, and legacy of past Robocell batches."
        />

        <div className="rc-archive-container">
          {loading ? (
            <div className="rc-archive-loading">
              <Loader2 className="spinner" size={40} color="#FFE100" />
              <p>Developing the reels…</p>
            </div>
          ) : (
            <div className="rc-archive-timeline">
              {archiveGroups.map((group) => {
                const isExpanded = !!expandedYears[group.year];
                const displayedImages = isExpanded
                  ? group.images
                  : group.images.slice(0, 3);
                const hasMoreImages = group.images.length > 3;

                return (
                  <div
                    key={group.id}
                    className="rc-archive-year-section"
                    data-year={group.year}
                  >
                    <div className="rc-archive-year-header">
                      <div className="rc-archive-year-tab">
                        <Film size={18} strokeWidth={2.5} />
                        <h2>{group.year}</h2>
                      </div>
                      <FilmHoles count={4} />
                      <div className="rc-archive-year-label-area">
                        <span className="rc-archive-badge">
                          {group.images.length}{" "}
                          {group.images.length === 1 ? "Frame" : "Frames"}
                        </span>
                      </div>
                      <div className="rc-archive-film-holes-right">
                        <FilmHoles count={4} />
                      </div>
                    </div>

                    {group.images.length === 0 ? (
                      <p className="rc-archive-empty">
                        No frames captured for this batch yet.
                      </p>
                    ) : (
                      <>
                        <div
                          className={`rc-archive-image-grid ${isExpanded ? "expanded" : "collapsed"}`}
                        >
                          {displayedImages.map((src, index) => (
                            <div
                              key={index}
                              className="rc-archive-img-card"
                              onClick={() =>
                                setLightbox({
                                  src,
                                  caption: `${group.year}  ·  FRAME ${String(index + 1).padStart(2, "0")}`,
                                })
                              }
                            >
                              <img
                                src={src}
                                alt={`${group.year} memory`}
                                loading="lazy"
                              />
                              <div className="rc-archive-hover-overlay">
                                <Maximize2
                                  size={18}
                                  className="rc-archive-overlay-icon"
                                />
                                <span className="rc-archive-overlay-index">
                                  {String(index + 1).padStart(2, "0")} /{" "}
                                  {String(group.images.length).padStart(2, "0")}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {hasMoreImages && (
                          <div className="rc-archive-action-row">
                            <button
                              className="rc-archive-toggle-btn"
                              onClick={() => toggleExpandYear(group.year)}
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp size={15} /> Collapse reel
                                </>
                              ) : (
                                <>
                                  <ChevronDown size={15} />{" "}
                                  {group.images.length - 3} more frames
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {lightbox && (
          <div
            className="rc-lightbox-overlay"
            onClick={() => setLightbox(null)}
          >
            <button
              className="rc-lightbox-close"
              onClick={() => setLightbox(null)}
            >
              <X size={18} />
            </button>
            <div
              className="rc-lightbox-content"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={lightbox.src} alt={lightbox.caption} />
              <p>{lightbox.caption}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
