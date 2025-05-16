import axios from "axios";

import { VITE_DEFAULT_PORT } from "../constants/dev";

const relativeApiUrl = "./api";

export const getApiUrl = () => {
// Dev and Production
  let apiBaseURL: string = relativeApiUrl

  // If we're running in Codespaces, we need to manage the relative URL to the API
  const fullUrl = window.location.origin + window.location.pathname;
  if (fullUrl.includes("notebook-sessions") && fullUrl.includes(`ports/${VITE_DEFAULT_PORT}`)) {
    apiBaseURL = fullUrl.endsWith("/") ? fullUrl.slice(0, -1) : fullUrl;
  }
  return apiBaseURL;
}

const apiClient = axios.create({
  baseURL: `/api`,
  headers: {
    Accept: "application/json",
    "Content-type": "application/json",
  },
  withCredentials: true,
});

export default apiClient;
