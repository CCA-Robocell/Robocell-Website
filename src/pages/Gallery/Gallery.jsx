import React, { useState, useEffect } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { ArrowLeft, FolderOpen, Image as ImageIcon, X } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Helmet } from "react-helmet-async";

import "./Gallery.css";

const API_KEY = import.meta.env.VITE_DRIVE_API_KEY;
const ROOT_FOLDER_ID = import.meta.env.VITE_DRIVE_ROOT_FOLDER_ID;

export default function Gallery() {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [activeImages, setActiveImages] = useState([]);
  const [lightbox, setLightbox] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingImages, setLoadingImages] = useState(false);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        // ADDED: &orderBy=createdTime desc so the newest albums are always first
        const response = await fetch(
          `https://www.googleapis.com/drive/v3/files?q='${ROOT_FOLDER_ID}'+in+parents+and+mimeType='application/vnd.google-apps.folder'+and+trashed=false&key=${API_KEY}&fields=files(id,name)&orderBy=createdTime desc`,
        );
        const data = await response.json();

        if (data.files) {
          const albumsWithCovers = await Promise.all(
            data.files.map(async (folder) => {
              try {
                const coverRes = await fetch(
                  `https://www.googleapis.com/drive/v3/files?q='${folder.id}'+in+parents+and+mimeType+contains+'image/'+and+trashed=false&key=${API_KEY}&fields=files(id)&pageSize=1`,
                );
                const coverData = await coverRes.json();

                const coverUrl =
                  coverData.files && coverData.files.length > 0
                    ? `https://wsrv.nl/?url=drive.google.com/uc?id=${coverData.files[0].id}&w=600&output=webp`
                    : null;

                // ADDED: Clean the title so '[Home]' is completely hidden from the user
                const cleanTitle = folder.name.replace('[Home]', '').trim();

                return {
                  id: folder.id,
                  title: cleanTitle,
                  category: "Event",
                  cover: coverUrl,
                };
              } catch (err) {
                // ADDED: Clean title in the fallback/error state too
                return {
                  id: folder.id,
                  title: folder.name.replace('[Home]', '').trim(),
                  category: "Event",
                  cover: null,
                };
              }
            }),
          );
          setAlbums(albumsWithCovers);
        }
      } catch (error) {
        console.error("Error fetching Google Drive folders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  const handleOpenAlbum = async (album) => {
    setSelectedAlbum(album);
    setLoadingImages(true);
    setActiveImages([]);

    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${album.id}'+in+parents+and+mimeType+contains+'image/'+and+trashed=false&key=${API_KEY}&fields=files(id,name,thumbnailLink)`,
      );
      const data = await response.json();

      if (data.files) {
        // Upgrade all thumbnails to high-res, with a safe fallback
        // Generates high-res WebP images safely through the proxy
        const images = data.files.map((file) => {
          return `https://wsrv.nl/?url=drive.google.com/uc?id=${file.id}&w=1200&output=webp`;
        });

        setActiveImages(images);
      }
    } catch (error) {
      console.error("Error fetching album images:", error);
    } finally {
      setLoadingImages(false);
    }
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
        Loading Gallery Folders...
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Gallery | CCA Robocell</title>

        <meta
          name="description"
          content="Browse photos and memories from workshops, competitions, hackathons, robotics projects, and club activities at CCA Robocell."
        />

        <meta
          name="keywords"
          content="Robotics Gallery, Club Photos, NIT Durgapur Events, Robocell Gallery"
        />
      </Helmet>

      <div className="rc-gallery-page">
        <PageHeader
          title={
            <>
              Our <span className="rc-text-gradient">Gallery</span>
            </>
          }
          subtitle="Snapshots from our workshops, competitions, and team moments — organised by event."
        />

        <div className="rc-gallery-container">
          {!selectedAlbum ? (
            <>
              <div className="rc-album-count">{albums.length} ALBUMS</div>

              <div className="rc-album-grid">
                {albums.map((album) => (
                  <div
                    key={album.id}
                    className="rc-card rc-album-card"
                    onClick={() => handleOpenAlbum(album)}
                  >
                    <div
                      className="rc-album-cover-wrap"
                      style={{
                        background: "#111827",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {album.cover ? (
                        <img
                          src={album.cover}
                          alt={album.title}
                          className="rc-album-cover-img"
                        />
                      ) : (
                        <FolderOpen size={48} color="#2A3241" />
                      )}
                      <div className="rc-album-gradient" />
                      <div className="rc-album-info">
                        <div className="title">{album.title}</div>
                        <div className="meta-row">
                          <span className="rc-tag">{album.category}</span>
                          <span className="photo-count">
                            <ImageIcon size={11} /> Open to view
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <button
                className="rc-gallery-back-btn"
                onClick={() => setSelectedAlbum(null)}
              >
                <ArrowLeft size={16} /> Back to Albums
              </button>

              <div className="rc-gallery-active-header">
                <FolderOpen size={20} color="#FFE100" />
                <h2>{selectedAlbum.title}</h2>
                <span className="rc-tag">{selectedAlbum.category}</span>
              </div>

              <div className="rc-album-count rc-mb-32">
                {loadingImages
                  ? "LOADING PHOTOS..."
                  : `${activeImages.length} PHOTO${activeImages.length !== 1 ? "S" : ""}`}
              </div>

              {!loadingImages && (
                <ResponsiveMasonry
                  columnsCountBreakPoints={{ 100: 3, 600: 3, 900: 4 }}
                >
                  <Masonry gutter="16px">
                    {activeImages.map((src, i) => (
                      <div
                        key={i}
                        className="rc-gallery-img rc-masonry-item"
                        onClick={() =>
                          setLightbox({
                            src,
                            caption: `${selectedAlbum.title} — Photo ${i + 1}`,
                          })
                        }
                      >
                        <img
                          src={src}
                          alt={`${selectedAlbum.title} ${i + 1}`}
                          loading="lazy"
                        />
                        <div className="gallery-overlay">
                          <div className="title">{selectedAlbum.title}</div>
                          <div className="category">
                            {selectedAlbum.category}
                          </div>
                        </div>
                      </div>
                    ))}
                  </Masonry>
                </ResponsiveMasonry>
              )}
            </>
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
              <X size={20} />
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
