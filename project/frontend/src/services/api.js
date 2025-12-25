import axios from 'axios';

const API_BASE_URL = '/api';  // Relative URL - same server

export const askWilliams = async (question, latitude, longitude) => {
  const response = await axios.post(`${API_BASE_URL}/ask/`, {
    question,
    latitude,
    longitude
  });
  return response.data;
};
