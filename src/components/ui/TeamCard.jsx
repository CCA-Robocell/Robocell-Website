import React from "react";
import "./TeamCard.css";
import { Linkedin } from "../icons/SocialIcons"; // <-- Fixed import path!
import DriveImage from "../common/DriveImage";

export default function TeamCard({ member, featured }) {
  return (
    <div className={`rc-roster-card ${featured ? "featured" : ""}`}>
      
      {/* --- Image Section --- */}
      <div className="rc-roster-img-wrap">
        
        {/* Uses your new DriveImage component. Mapped to member.image based on your Firebase DB */}
        <DriveImage 
          rawLink={member.image} 
          alt={member.name}
        />
        
        {/* Gradient overlay to blend into the text box */}
        <div className="rc-roster-overlay"></div>
      </div>

      {/* --- Info Section --- */}
      <div className="rc-roster-info">
        
        {/* The Yellow Post Badge overlapping the image */}
        <div className="rc-roster-role-badge">
          {member.position || member.role}
        </div>

        {/* Roster Name */}
        <h3 className="rc-roster-name">{member.name}</h3>

        {/* Department / Year (If it exists in your DB) */}
        {member.department && (
          <p className="rc-roster-dept">{member.department}</p>
        )}

        {/* LinkedIn Circular Button */}
        {member.linkedin && (
          <a 
            href={member.linkedin} 
            target="_blank" 
            rel="noreferrer" 
            className="rc-roster-social"
          >
            <Linkedin size={18} />
          </a>
        )}
        
      </div>
      
    </div>
  );
}