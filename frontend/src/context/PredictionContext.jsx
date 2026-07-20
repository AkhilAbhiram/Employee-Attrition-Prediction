import React, { createContext, useState, useEffect } from "react";
import predictionService from "../services/predictionService";
import supabaseService from "../services/supabaseService";

// Create context object
export const PredictionContext = createContext();

export const PredictionProvider = ({ children }) => {
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const [history, setHistory] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Triggered when user submits a new prediction form
  const predict = async (employeeData) => {
    setLoading(true);
    setError(null);
    try {
      // Step 1: Call ML backend for prediction result
      const result = await predictionService.makePrediction(employeeData);
      setCurrentPrediction(result);

      // Step 2: Persist result + employee data to Supabase
      try {
        await supabaseService.savePrediction(result, employeeData);
      } catch (saveErr) {
        // Non-blocking: log but don't fail the whole predict flow
        console.warn("Supabase save failed (prediction still shown):", saveErr);
      }

      // Step 3: Refresh history and stats from Supabase
      await loadHistory();
      await loadDashboardStats();
      return result;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to make prediction. Ensure backend is running.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 2. Loads prediction history list from Supabase
  const loadHistory = async () => {
    try {
      const data = await supabaseService.getHistory();
      setHistory(data);
    } catch (err) {
      console.error("Failed to load history from Supabase:", err);
    }
  };

  // 3. Loads dashboard analytics from Supabase
  const loadDashboardStats = async () => {
    try {
      const data = await supabaseService.getDashboardStats();
      setDashboardStats(data);
    } catch (err) {
      console.error("Failed to load dashboard stats from Supabase:", err);
    }
  };

  // Load history and stats on initial mount
  useEffect(() => {
    loadHistory();
    loadDashboardStats();
  }, []);

  return (
    <PredictionContext.Provider
      value={{
        currentPrediction,
        setCurrentPrediction,
        history,
        dashboardStats,
        loading,
        error,
        predict,
        loadHistory,
        loadDashboardStats,
      }}
    >
      {children}
    </PredictionContext.Provider>
  );
};
