import React from "react";
import usePrediction from "../hooks/usePrediction";

const ResultCard = () => {
  const { currentPrediction, error } = usePrediction();

  if (error) {
    return (
      <div className="glass-panel" style={{ borderLeft: "4px solid var(--color-danger)", display: "flex", flexDirection: "column", gap: "10px" }}>
        <h3 style={{ color: "var(--color-danger)", fontWeight: "700" }}>System Error</h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{error}</p>
      </div>
    );
  }

  if (!currentPrediction) {
    return (
      <div className="glass-panel" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "350px", textAlign: "center", color: "var(--text-secondary)" }}>
        <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📊</div>
        <h3 style={{ color: "var(--text-primary)", fontWeight: "600", marginBottom: "8px" }}>Awaiting Metrics</h3>
        <p style={{ fontSize: "0.9rem", maxWidth: "250px" }}>Fill out the employee metrics form and click "Predict Attrition" to see the ensemble analysis results.</p>
      </div>
    );
  }

  const { prediction, probability, base_predictions } = currentPrediction;
  const isHighRisk = prediction === "Yes";
  const riskColor = isHighRisk ? "var(--color-danger)" : "var(--color-success)";
  const glowShadow = isHighRisk ? "0 0 20px rgba(239, 68, 68, 0.4)" : "0 0 20px rgba(16, 185, 129, 0.4)";

  // SVG circular progress calculation
  const radius = 60;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (probability) * circumference;

  return (
    <div className="glass-panel" style={{ width: "100%", display: "flex", flexDirection: "column", gap: "20px" }}>
      <h2 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "5px" }}>Prediction Analysis</h2>

      {/* Probability Gauge */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "10px 0" }}>
        <div style={{ position: "relative", width: "150px", height: "150px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <svg style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
            {/* Background Track */}
            <circle
              cx="75"
              cy="75"
              r={radius}
              fill="transparent"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth={strokeWidth}
            />
            {/* Glowing Accent Progress Fill */}
            <circle
              cx="75"
              cy="75"
              r={radius}
              fill="transparent"
              stroke={riskColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transition: "stroke-dashoffset 1s ease-out",
                filter: `drop-shadow(0px 0px 5px ${riskColor})`
              }}
            />
          </svg>
          {/* Centered Probability Text */}
          <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: "1.75rem", fontWeight: "800", color: "var(--text-primary)" }}>
              {(probability * 100).toFixed(1)}%
            </span>
            <span style={{ fontSize: "0.75rem", fontWeight: "500", color: "var(--text-secondary)", textTransform: "uppercase" }}>
              Attrition Risk
            </span>
          </div>
        </div>
      </div>

      {/* Main result badge */}
      <div
        style={{
          background: isHighRisk ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)",
          border: `1px solid ${isHighRisk ? "rgba(239, 68, 68, 0.2)" : "rgba(16, 185, 129, 0.2)"}`,
          borderRadius: "10px",
          padding: "16px",
          textAlign: "center",
          boxShadow: glowShadow
        }}
      >
        <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: "600" }}>
          Decision Outcome
        </span>
        <h3 style={{ fontSize: "2rem", fontWeight: "800", color: riskColor, marginTop: "4px" }}>
          {isHighRisk ? "LEAVE (YES)" : "STAY (NO)"}
        </h3>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "8px" }}>
          {isHighRisk 
            ? "This employee exhibits a high likelihood of leaving the company. Immediate retention strategy recommended."
            : "This employee is predicted to remain at the company under current parameters."}
        </p>
      </div>

      {/* Stacking Base Learners Probabilities */}
      <div style={{ marginTop: "10px" }}>
        <h4 style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "12px" }}>
          Ensemble Base Model Outputs:
        </h4>
        
        {/* Random Forest */}
        <div style={{ marginBottom: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
            <span>Random Forest Classifier</span>
            <span style={{ color: "var(--text-primary)", fontWeight: "600" }}>{(base_predictions.random_forest * 100).toFixed(1)}%</span>
          </div>
          <div className="chart-bar-bg" style={{ height: "6px" }}>
            <div className="chart-bar-fill" style={{ width: `${base_predictions.random_forest * 100}%`, background: "var(--accent-blue)" }}></div>
          </div>
        </div>

        {/* LightGBM */}
        <div style={{ marginBottom: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
            <span>LightGBM Gradient Booster</span>
            <span style={{ color: "var(--text-primary)", fontWeight: "600" }}>{(base_predictions.lightgbm * 100).toFixed(1)}%</span>
          </div>
          <div className="chart-bar-bg" style={{ height: "6px" }}>
            <div className="chart-bar-fill" style={{ width: `${base_predictions.lightgbm * 100}%`, background: "var(--accent-cyan)" }}></div>
          </div>
        </div>

        {/* Neural Network */}
        <div style={{ marginBottom: "5px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
            <span>Artificial Neural Network (ANN)</span>
            <span style={{ color: "var(--text-primary)", fontWeight: "600" }}>{(base_predictions.neural_network * 100).toFixed(1)}%</span>
          </div>
          <div className="chart-bar-bg" style={{ height: "6px" }}>
            <div className="chart-bar-fill" style={{ width: `${base_predictions.neural_network * 100}%`, background: "var(--accent-pink)" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
