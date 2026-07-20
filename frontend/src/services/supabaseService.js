import supabase from "./supabaseClient";

/**
 * Service to manage all Supabase database operations
 * for prediction history and dashboard analytics.
 */
const supabaseService = {
  /**
   * Saves a completed prediction result to the Supabase predictions table.
   * Called after a successful ML backend response.
   *
   * @param {Object} predictionResult - { prediction, probability, base_predictions }
   * @param {Object} employeeData - The 31-field employee form data
   */
  savePrediction: async (predictionResult, employeeData) => {
    const { prediction, probability, base_predictions } = predictionResult;

    const { data, error } = await supabase.from("predictions").insert([
      {
        prediction,
        probability,
        base_predictions,
        employee_data: employeeData,
      },
    ]);

    if (error) {
      console.error("Supabase savePrediction error:", error);
      throw new Error(error.message);
    }

    return data;
  },

  /**
   * Fetches the prediction history from Supabase, ordered by most recent first.
   *
   * @param {number} limit - Max number of records to fetch (default 100)
   * @returns {Array} Array of prediction records
   */
  getHistory: async (limit = 100) => {
    const { data, error } = await supabase
      .from("predictions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Supabase getHistory error:", error);
      throw new Error(error.message);
    }

    return data || [];
  },

  /**
   * Computes dashboard aggregate statistics from the predictions table.
   *
   * @returns {Object} Stats: { total, attritionCount, stayCount, attritionRate, avgProbability }
   */
  getDashboardStats: async () => {
    const { data, error } = await supabase
      .from("predictions")
      .select("prediction, probability");

    if (error) {
      console.error("Supabase getDashboardStats error:", error);
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return {
        total: 0,
        attritionCount: 0,
        stayCount: 0,
        attritionRate: 0,
        avgProbability: 0,
      };
    }

    const total = data.length;
    const attritionCount = data.filter((r) => r.prediction === "Yes").length;
    const stayCount = total - attritionCount;
    const attritionRate = parseFloat(
      ((attritionCount / total) * 100).toFixed(1)
    );
    const avgProbability = parseFloat(
      (
        data.reduce((sum, r) => sum + (r.probability || 0), 0) / total
      ).toFixed(3)
    );

    return { total, attritionCount, stayCount, attritionRate, avgProbability };
  },
};

export default supabaseService;
