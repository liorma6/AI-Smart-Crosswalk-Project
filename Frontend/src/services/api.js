// API Base URL - will use proxy in development
const API_BASE_URL = '/api';

/**
 * Helper function to get full image URL
 * Converts relative image paths to absolute URLs pointing to backend
 */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;

  // If already a full URL (http/https), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // If it's a data URI, return as is
  if (imageUrl.startsWith('data:')) {
    return imageUrl;
  }

  // Convert relative path to backend URL
  // Remove leading slash if present
  const cleanPath = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;
  return `http://localhost:3000/${cleanPath}`;
};

/**
 * Fetch dashboard data from backend
 * GET /api/dashboard
 */
export const fetchDashboardData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

/**
 * Fetch all crosswalks
 * GET /api/crosswalks
 */
export const fetchCrosswalks = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/crosswalks`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching crosswalks:', error);
    throw error;
  }
};

/**
 * Fetch alerts for a specific crosswalk
 * GET /api/crosswalks/:id/alerts
 */
export const fetchCrosswalkAlerts = async (crosswalkId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/crosswalks/${crosswalkId}/alerts`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching alerts for crosswalk ${crosswalkId}:`, error);
    throw error;
  }
};

/**
 * Fetch all recent alerts
 * GET /api/alerts
 */
export const fetchAlerts = async (limit = 10) => {
  try {
    const response = await fetch(`${API_BASE_URL}/alerts?limit=${limit}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching alerts:', error);
    throw error;
  }
};

/**
 * Create a new alert
 * POST /api/alerts
 */
export const createAlert = async (alertData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/alerts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(alertData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating alert:', error);
    throw error;
  }
};

/**
 * Activate LED for a crosswalk
 * POST /api/crosswalks/:id/led/activate
 */
export const activateLED = async (crosswalkId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/crosswalks/${crosswalkId}/led/activate`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error activating LED for crosswalk ${crosswalkId}:`, error);
    throw error;
  }
};
