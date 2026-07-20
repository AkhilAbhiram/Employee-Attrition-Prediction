import React from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * Sticky Glassmorphic Navigation Header
 */
const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <nav
      className="glass-panel"
      style={{
        position: "sticky",
        top: "20px",
        zIndex: 100,
        marginBottom: "30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 32px",
        borderRadius: "12px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: "var(--accent-cyan)",
            boxShadow: "0 0 10px var(--accent-cyan)",
          }}
        ></div>
        <Link
          to="/"
          style={{
            fontSize: "1.25rem",
            fontWeight: "800",
            letterSpacing: "0.5px",
            background: "linear-gradient(90deg, var(--accent-cyan), var(--accent-blue))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          ATTRITION SHIELD
        </Link>
      </div>

      <div style={{ display: "flex", gap: "24px" }}>
        <Link to="/" className={`form-tab-btn ${isActive("/")}`}>
          Predictor
        </Link>
        <Link to="/dashboard" className={`form-tab-btn ${isActive("/dashboard")}`}>
          Dashboard
        </Link>
        <Link to="/history" className={`form-tab-btn ${isActive("/history")}`}>
          History
        </Link>
        <Link to="/about" className={`form-tab-btn ${isActive("/about")}`}>
          About Ensemble
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
