import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  Cpu,
  X,
  Home,
  Folder,
  Calendar,
  Bell,
  Image as ImageIcon,
  Users,
  Target,
  Trophy,
  Mail,
  Archive,
  GraduationCap
} from "lucide-react";
import { navLinks } from "./Navbar";
import "./SideDrawer.css";
import logo from "../../assets/images.png";

// Helper to map string names to actual lucide-react components
const IconMap = {
  Home: Home,
  Folder: Folder,
  Calendar: Calendar,
  Bell: Bell,
  Image: ImageIcon,
  Users: Users,
  Target: Target,
  Mail: Mail,
  Trophy: Trophy,
  Archive: Archive,
  GraduationCap: GraduationCap
};

export default function SideDrawer({ isOpen, onClose }) {
  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Darkened backdrop */}
      <div
        className={`rc-drawer-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />

      {/* Slide-in panel */}
      <div className={`rc-drawer ${isOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="rc-drawer-header">
          <div className="rc-drawer-brand">
            <img
              src={logo}
              alt="Robocell Logo"
              className="rc-navbar-logo-img"
            />
            <div className="rc-drawer-logo-text">
              CCA <span>ROBOCELL</span>
            </div>
          </div>
          <button
            className="rc-drawer-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="rc-drawer-nav">
          {navLinks.map((link) => {
            const IconComponent = IconMap[link.icon];
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `rc-drawer-link ${isActive ? "active" : ""}`
                }
              >
                <IconComponent size={20} className="rc-drawer-link-icon" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </>
  );
}
