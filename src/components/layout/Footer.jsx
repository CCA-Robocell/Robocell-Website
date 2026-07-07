import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { Github, Instagram, Linkedin, Youtube } from "../icons/SocialIcons";

// Import your custom logo
import logo from "../../assets/images.png";
import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="rc-footer-wrapper">
      <div className="rc-footer-container">
        
        {/* The Grid: Now exactly 3 columns */}
        <div className="rc-footer-grid">
          
          {/* Column 1: Brand Info & Socials */}
          <div className="rc-footer-brand">
            <div className="rc-footer-logo-header">
              {/* Custom Image Logo */}
              <img src={logo} alt="Robocell Logo" className="rc-footer-logo-img" />
              <div className="rc-footer-logo-text">
                <div className="title">CCA ROBOCELL</div>
                <div className="subtitle">NIT DURGAPUR</div>
              </div>
            </div>
            <p className="rc-footer-description">
              NIT Durgapur's premier technical robotics club, building the future of autonomous systems and intelligent machines since 2012.
            </p>
            <div className="rc-footer-social">
              {[ 
                { icon: <Github size={18} />, href: "https://github.com/CCA-Robocell", label: "GitHub" }, 
                { icon: <Instagram size={18} />, href: "https://www.instagram.com/robocell.cca.nitdgp/", label: "Instagram" }, 
                { icon: <Linkedin size={18} />, href: "#", label: "LinkedIn" }, 
                { icon: <Youtube size={18} />, href: "https://www.youtube.com/@robocellnitdgp4781", label: "YouTube" } 
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="rc-footer-social-link">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="rc-footer-links">
            <h4 className="rc-footer-heading">Quick Links</h4>
            <div className="rc-footer-link-list">
              {[ 
                { to: "/projects", label: "Projects" }, 
                { to: "/events", label: "Events" }, 
                { to: "/gallery", label: "Gallery" }, 
                { to: "/team", label: "Our Team" }, 
                { to: "/achievements", label: "Achievements" }, 
                { to: "/archives", label: "Archives" },
                { to: "/contact", label: "Contact Us" }
              ].map((link) => (
                <Link key={link.to} to={link.to} className="rc-footer-link-item">
                  → {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Contact */}
          <div className="rc-footer-contact">
            <h4 className="rc-footer-heading">Contact</h4>
            <div className="rc-footer-contact-list">
              {[ 
                { icon: <Mail size={16} />, text: "roboticsclub@nitdgp.ac.in" }, 
                { icon: <Phone size={16} />, text: "+91 94320 00001" }, 
                { icon: <MapPin size={16} />, text: "NIT Durgapur, West Bengal — 713209" } 
              ].map((item, i) => (
                <div key={i} className="rc-footer-contact-item">
                  <span className="icon">{item.icon}</span>
                  <span className="text">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="rc-footer-bottom">
          <p className="copyright">© {year} NIT Durgapur Robotics Club. All rights reserved.</p>
          <p className="credits">Built by <span>CCA Robocell</span> — Durgapur, WB</p>
        </div>
      </div>
    </footer>
  );
}