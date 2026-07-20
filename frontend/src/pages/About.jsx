import React from "react";

const About = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px", maxWidth: "800px", margin: "0 auto" }}>
      <header style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "800", background: "linear-gradient(90deg, var(--accent-cyan), var(--accent-blue))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Stacking Ensemble Architecture
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: "8px" }}>
          How Attrition Shield combines multiple machine learning models to maximize prediction stability.
        </p>
      </header>

      {/* Main explanation card */}
      <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--accent-cyan)" }}>Ensemble Overview</h3>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
          Single classifier models (like a lone Decision Tree or Neural Network) can be prone to overfitting or bias on imbalanced HR datasets. 
          To solve this, our system uses a **Stacking Ensemble** framework that trains three diverse base models and feeds their output probabilities into a meta-learner.
        </p>
      </div>

      {/* Grid of base learners */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
        {/* Model 1 */}
        <div className="glass-panel" style={{ borderTop: "3px solid var(--accent-blue)" }}>
          <h4 style={{ fontWeight: "700", marginBottom: "8px" }}>Random Forest</h4>
          <span style={{ fontSize: "0.8rem", color: "var(--accent-blue)", fontWeight: "600", textTransform: "uppercase" }}>Bagging Ensemble</span>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "10px", lineHeight: "1.5" }}>
            Trained on random subsets of columns and rows. It excels at finding non-linear patterns and interactions between features without overfitting.
          </p>
        </div>

        {/* Model 2 */}
        <div className="glass-panel" style={{ borderTop: "3px solid var(--accent-cyan)" }}>
          <h4 style={{ fontWeight: "700", marginBottom: "8px" }}>LightGBM</h4>
          <span style={{ fontSize: "0.8rem", color: "var(--accent-cyan)", fontWeight: "600", textTransform: "uppercase" }}>Gradient Boosting</span>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "10px", lineHeight: "1.5" }}>
            Builds trees sequentially, leaf-wise. Highly efficient, handles categorical variables natively, and has strong precision on imbalanced data.
          </p>
        </div>

        {/* Model 3 */}
        <div className="glass-panel" style={{ borderTop: "3px solid var(--accent-pink)" }}>
          <h4 style={{ fontWeight: "700", marginBottom: "8px" }}>Deep ANN</h4>
          <span style={{ fontSize: "0.8rem", color: "var(--accent-pink)", fontWeight: "600", textTransform: "uppercase" }}>Neural Network</span>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "10px", lineHeight: "1.5" }}>
            A Multi-Layer Perceptron (MLP) built with TensorFlow. Leverages Dropout and Batch Normalization layers to learn high-level numeric feature patterns.
          </p>
        </div>
      </div>

      {/* Meta learner explanation */}
      <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "12px", borderLeft: "4px solid var(--accent-cyan)" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>The Meta-Learner (Logistic Regression)</h3>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
          Instead of simple voting or averaging, we train a **Logistic Regression** model on the out-of-fold probability outputs from the three base models. 
          This meta-learner learns *which* base model to trust more for different types of predictions, leading to an overall accuracy increase and stable predictions.
        </p>
      </div>

    </div>
  );
};

export default About;
