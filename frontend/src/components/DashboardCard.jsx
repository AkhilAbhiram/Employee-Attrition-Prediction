import React from "react";

/**
 * Metric Card for Dashboard counts
 */
const DashboardCard = ({ title, value, icon, color = "var(--accent-cyan)", glow = false }) => {
  return (
    <div
      className="glass-panel"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderLeft: `4px solid ${color}`,
        boxShadow: glow ? `0 0 20px ${color}22` : ""
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: "500", textTransform: "uppercase" }}>
          {title}
        </span>
        <span style={{ fontSize: "2rem", fontWeight: "800", color: "var(--text-primary)" }}>
          {value}
        </span>
      </div>
      <div
        style={{
          fontSize: "2.5rem",
          color: color,
          opacity: 0.8,
          filter: glow ? `drop-shadow(0 0 8px ${color})` : ""
        }}
      >
        {icon}
      </div>
    </div>
  );
};

export default DashboardCard;
