import axios from "axios";

// Create an Axios instance for API calls.
// It will connect to the backend URL defined in the environment variables,
// defaulting to localhost:5000/api if not specified.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
