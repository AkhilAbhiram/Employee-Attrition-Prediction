import React from "react";
import PredictionForm from "../components/PredictionForm";
import ResultCard from "../components/ResultCard";

/**
 * Predictor Home Page layout
 */
const Home = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <header style={{ marginBottom: "20px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "800", letterSpacing: "-0.5px" }}>
          Attrition Predictor
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: "4px" }}>
          Analyze employee flight risk by submitting their workspace satisfaction and financial metrics.
        </p>
      </header>

      {/* Main Split Layout: Form on Left, Results on Right */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px",
          alignItems: "start",
        }}
      >
        <div style={{ display: "flex" }}>
          <PredictionForm />
        </div>
        <div style={{ display: "flex" }}>
          <ResultCard />
        </div>
      </div>
    </div>
  );
};

export default Home;
