import axios from "axios";

import { VITE_DEFAULT_PORT } from "../constants/dev";

const relativeApiUrl = "./api";

// Pull this in from index.html so that we're getting the actual real URL before anyone does URL rewriting
const fullUrl = typeof window !== "undefined" && window.ORIGINAL_BASE_PATH ? window.ORIGINAL_BASE_PATH : "";

export const getApiUrl = () => {
  // Adjust API URL based on the environment
  let apiBaseURL: string = relativeApiUrl

  // If we're running in Codespaces, we need to manage the relative URL to the API
  if (fullUrl.includes("notebook-sessions") && fullUrl.includes(`ports/${VITE_DEFAULT_PORT}`)) {
    apiBaseURL = fullUrl.endsWith("/") ? fullUrl.slice(0, -1) : fullUrl;
    apiBaseURL += "/api";
  }
  return apiBaseURL;
}

const apiClient = axios.create({
  baseURL: `${getApiUrl()}`,
  headers: {
    Accept: "application/json",
    "Content-type": "application/json",
  },
  withCredentials: true,
});

export default apiClient;
