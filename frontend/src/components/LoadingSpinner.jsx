import React from "react";

/**
 * A beautiful glowing loading spinner
 */
const LoadingSpinner = ({ size = "40px" }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px 0",
      }}
    >
      <div
        className="rotate-spinner"
        style={{
          width: size,
          height: size,
          border: "3px solid rgba(255, 255, 255, 0.05)",
          borderTopColor: "var(--accent-cyan)",
          borderRightColor: "var(--accent-blue)",
          borderRadius: "50%",
          boxShadow: "0 0 10px rgba(6, 182, 212, 0.2)",
        }}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
