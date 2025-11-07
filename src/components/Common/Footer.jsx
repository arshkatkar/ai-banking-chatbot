import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./Footer.css";

const Footer = () => {
  const location = useLocation();
  const [status, setStatus] = useState("checking"); // online / offline / checking

  // Backend URL to ping
  const API_URL = "http://localhost:5000";

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        await axios.get(API_URL + "/branches"); // or /docs — any endpoint
        setStatus("online");
      } catch (error) {
        setStatus("offline");
      }
    };

    // Run initially
    checkServerStatus();

    // Check every 10 seconds
    const interval = setInterval(checkServerStatus, 10000);

    return () => clearInterval(interval);
  }, []);

  // Dynamic footer text
  let footerText = `© ${new Date().getFullYear()} AI Banking Chatbot | Team 318`;

  if (location.pathname.startsWith("/admin")) {
    footerText = `⚙️ Admin Panel — Manage Docs & Branches | Team 318`;
  } else if (location.pathname.startsWith("/user")) {
    footerText = `💬 User Chat Interface — Powered by Gen AI & NLP | Team 318`;
  } else if (location.pathname === "/") {
    footerText = `🌍 Welcome to AI Banking Chatbot — Smart, Secure & Multilingual | Team 318`;
  }

  return (
    <footer className="footer">
      <p>
        {footerText} &nbsp; | &nbsp;
        {status === "online" ? (
          <span className="status online">🟢 Online</span>
        ) : status === "offline" ? (
          <span className="status offline">🔴 Offline</span>
        ) : (
          <span className="status checking">🟡 Checking...</span>
        )}
      </p>
    </footer>
  );
};

export default Footer;
