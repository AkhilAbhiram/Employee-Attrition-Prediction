import api from "./api";

/**
 * Service to manage all backend HTTP requests for predictions and analytics.
 */
const predictionService = {
  // 1. Submit employee data for attrition prediction
  makePrediction: async (employeeData) => {
    const response = await api.post("/predict", employeeData);
    return response.data;
  },

  // 2. Fetch the history of predictions
  getHistory: async (limit = 100) => {
    const response = await api.get(`/history?limit=${limit}`);
    return response.data;
  },

  // 3. Fetch summary metrics and counts for the dashboard
  getDashboardStats: async () => {
    const response = await api.get("/dashboard");
    return response.data;
  },
};

export default predictionService;
