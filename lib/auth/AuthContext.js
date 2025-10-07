// lib/auth/AuthContext.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, API_PATHS } from "../api"; // <- ถ้า api อยู่ที่ lib/api.js ให้ปรับพาธเป็น "../api"

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const u = await AsyncStorage.getItem("cis_user");
      if (u) setUser(JSON.parse(u));
      setReady(true);
    })();
  }, []);

  const login = async (username, password) => {
    const body = username.includes("@")
      ? { email: username, password }
      : { username, password };

    const { data } = await api.post(API_PATHS.login, body); // POST /api/classroom/signin
    // รองรับ response รูปแบบ { data: {..., token}, token? }
    const token = data?.data?.token || data?.token;
    const profileRaw = data?.data || data;
    const { token: _omit, ...profile } = profileRaw || {};

    if (token) await AsyncStorage.setItem("cis_token", token);
    await AsyncStorage.setItem("cis_user", JSON.stringify(profile));
    setUser(profile);
    return profile;
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(["cis_token", "cis_user"]);
    setUser(null);
  };

  const value = useMemo(() => ({ user, ready, login, logout }), [user, ready]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth ต้องอยู่ใน AuthProvider");
  return ctx;
}
