import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import SideDrawer from "./SideDrawer";

// Import your custom logo here
import logo from "../../assets/images.png";
import "./Navbar.css";

export const navLinks = [
  { to: "/", label: "Home", icon: "Home" },
  { to: "/projects", label: "Projects", icon: "Folder" },
  { to: "/events", label: "Events", icon: "Calendar" },
  { to: "/gallery", label: "Gallery", icon: "Image" },
  { to: "/team", label: "Team", icon: "Users" },
  { to: "/achievements", label: "Achievements", icon: "Trophy" },
  { to: "/archives", label: "Archives", icon: "Archive" },
  { to: "/contact", label: "Contact Us", icon: "Mail" }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  // Close drawer when route changes
  useEffect(() => {
    setDrawerOpen(false);
  }, [location]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <nav className={`rc-navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="rc-navbar-container">
          
          {/* Brand / Logo with your custom image */}
          <Link to="/" className="rc-navbar-brand">
            <img src={logo} alt="Robocell Logo" className="rc-navbar-logo-img" />
            <div className="rc-navbar-logo-text">
              CCA <span>ROBOCELL</span>
            </div>
          </Link>

          <div className="rc-navbar-spacer" />

          {/* Desktop Links */}
          <div className="rc-navbar-desktop hidden-mobile">
            {navLinks.map((link) => (
              <NavLink
                key={link.to} 
                to={link.to} 
                end={link.to === "/"}
                className={({ isActive }) => `rc-nav-link ${isActive ? "active" : ""}`}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile Hamburger */}
          <button 
            className="rc-hamburger show-mobile" 
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile Side Drawer is rendered here! */}
      <SideDrawer 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
      />
    </>
  );
}