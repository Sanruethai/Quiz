// lib/api.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";

const extra =
  (Constants?.expoConfig && Constants.expoConfig.extra) ||
  (Constants?.manifest && Constants.manifest.extra) ||
  {};

const API_BASE     = extra.API_BASE || "https://cis.kku.ac.th";
const CIS_API_KEY  = extra.CIS_API_KEY || "";
const POSTS_CREATE = extra.POSTS_CREATE || "/api/social/posts"; // ← ค่าเริ่มต้น

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  config.headers = { ...(config.headers || {}) };
  const token = await AsyncStorage.getItem("cis_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (CIS_API_KEY) config.headers["x-api-key"] = CIS_API_KEY;
  if (!config.headers["Content-Type"]) config.headers["Content-Type"] = "application/json";
  return config;
});

export const API_PATHS = {
  login: "/api/classroom/signin",
   membersByYear: (y) => `/api/classroom/class/${y}`,
};

