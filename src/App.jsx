import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

// 1. Import Layout Components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// 2. Import Page Components
import Home from "./pages/Home/Home";
import Projects from "./pages/Projects/Projects";
import Events from "./pages/Events/Events";
import EventRegistration from "./pages/EventRegistration/EventRegistration";
import Gallery from "./pages/Gallery/Gallery";
import Team from "./pages/Team/Team";
import Archives from "./pages/Archives/Archives";
import Achievements from "./pages/Achievements/Achievements";
import Contact from "./pages/Contact/Contact";
import ScrollToTop from "./components/layout/ScrollToTop";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      
      {/* Your New Sleek Navbar! */}
      <Navbar /> 
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/events" element={<Events />} />
        <Route path="/register/:eventId" element={<EventRegistration />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/team" element={<Team />} />
        <Route path="/archives" element={<Archives />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      
      <Footer />
    </BrowserRouter>
  );
}