import axios from "axios";
import axiosRetry from 'axios-retry';

import { getApiUrl } from "@/lib/utils";

axiosRetry(axios, { retries: 5 });

const baseApiUrl = getApiUrl();

const apiClient = axios.create({
  baseURL: baseApiUrl,
  headers: {
    Accept: "application/json",
    "Content-type": "application/json",
  },
  withCredentials: true,
});

export default apiClient;
