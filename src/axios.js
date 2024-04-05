import axios from 'axios';
import { BASE_URL,loadConfig } from './config.js';

const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// A function to update the base URL of the axios instance
export const updateApiBaseUrl = (newBaseUrl) => {
  api.defaults.baseURL = newBaseUrl;
};

// Use this function after your config has been loaded
loadConfig().then(() => {
  updateApiBaseUrl(BASE_URL);
});

export default api;
