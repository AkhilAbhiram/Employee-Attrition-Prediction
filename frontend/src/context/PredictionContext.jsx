import React, { createContext, useState, useEffect } from "react";
import predictionService from "../services/predictionService";

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
      // Step 1: Call ML backend for prediction result (backend also saves to DB)
      const result = await predictionService.makePrediction(employeeData);
      setCurrentPrediction(result);

      // Step 2: Refresh history and stats from backend
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

  // 2. Loads prediction history list from Backend API
  const loadHistory = async () => {
    try {
      const data = await predictionService.getHistory();
      
      // Map properties safely to handle both SQLite (PascalCase) and Postgres (lowercase) key formats
      const mappedData = data.map(record => {
        const getVal = (key) => record[key] !== undefined ? record[key] : record[key.toLowerCase()];
        return {
          ...record,
          JobRole: getVal('JobRole'),
          Department: getVal('Department'),
          OverTime: getVal('OverTime'),
          Age: getVal('Age'),
          Gender: getVal('Gender'),
          MaritalStatus: getVal('MaritalStatus'),
          JobLevel: getVal('JobLevel'),
          MonthlyIncome: getVal('MonthlyIncome'),
          DistanceFromHome: getVal('DistanceFromHome'),
          JobSatisfaction: getVal('JobSatisfaction'),
          EnvironmentSatisfaction: getVal('EnvironmentSatisfaction'),
          WorkLifeBalance: getVal('WorkLifeBalance'),
          YearsAtCompany: getVal('YearsAtCompany'),
          TotalWorkingYears: getVal('TotalWorkingYears'),
          NumCompaniesWorked: getVal('NumCompaniesWorked')
        };
      });
      
      setHistory(mappedData);
    } catch (err) {
      console.error("Failed to load history from backend:", err);
    }
  };

  // 3. Loads dashboard analytics from Backend API
  const loadDashboardStats = async () => {
    try {
      const data = await predictionService.getDashboardStats();
      setDashboardStats(data);
    } catch (err) {
      console.error("Failed to load dashboard stats from backend:", err);
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
