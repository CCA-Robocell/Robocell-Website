import React from "react";
import "./PageHeader.css";

export default function PageHeader({ title, subtitle }) {
  return (
    <div className="rc-page-header">
      <h1 className="rc-page-header-title">{title}</h1>
      {subtitle && <p className="rc-page-header-subtitle">{subtitle}</p>}
    </div>
  );
}