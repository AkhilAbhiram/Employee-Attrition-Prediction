import React, { useEffect } from "react";
import usePrediction from "../hooks/usePrediction";
import HistoryTable from "../components/HistoryTable";
import LoadingSpinner from "../components/LoadingSpinner";

const History = () => {
  const { history, loadHistory, loading } = usePrediction();

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <header>
        <h1 style={{ fontSize: "2rem", fontWeight: "800", letterSpacing: "-0.5px" }}>
          Prediction Registry
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: "4px" }}>
          Review historical predictions and click on any record to inspect the complete set of parameters.
        </p>
      </header>

      {loading && history.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <HistoryTable historyData={history} />
      )}
    </div>
  );
};

export default History;
