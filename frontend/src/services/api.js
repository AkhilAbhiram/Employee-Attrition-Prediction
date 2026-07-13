const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function fetchHealth() {
  const response = await fetch(`${API_URL}/health`);
  return response.json();
}
