import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8787";
const DEFAULT_TIMEOUT = 5000; // 5 seconds is plenty for background stats

/**
 * Contact API client
 * Send a contact message to the backend
 */
export const sendMessage = async (data: {
  name: string;
  email: string;
  message: string;
}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/contact`, data,
      {
      timeout: DEFAULT_TIMEOUT, 
      headers: {
        'Content-Type': 'application/json',
      }}
    );
    return response.data;
  } catch (error) {
    // Extract error message from backend response
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

/**
 * Health check API client
 * Returns backend health status and environment info
 */
export const checkHealth = async () => {
  const response = await axios.get(`${API_BASE_URL}/health`, { 
    timeout: DEFAULT_TIMEOUT 
  });
  return response.data;
};

export interface VisitorStats {
  totalVisits: number;
  totalMessages: number;
  lastUpdated: string;
}

/**
 * Visitor tracking API client
 * POST: Record a new page visit
 * GET: Retrieve current visitor statistics
 */
export const recordVisit = async (): Promise<VisitorStats> => {
  const response = await axios.post(`${API_BASE_URL}/visit`, {}, { 
    timeout: DEFAULT_TIMEOUT 
  });
  return response.data.stats;
};

export const getVisitorStats = async (): Promise<VisitorStats> => {
  const response = await axios.get(`${API_BASE_URL}/visit`, {
    timeout: DEFAULT_TIMEOUT
  });
  return response.data;
};