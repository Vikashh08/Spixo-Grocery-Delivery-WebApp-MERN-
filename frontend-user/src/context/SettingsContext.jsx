import { createContext, useContext, useState, useEffect } from "react";
import io from "socket.io-client";
import api from "../api/api";

const SettingsContext = createContext();

// Ensure the socket connects to the backend running on 5001
const socket = io("http://localhost:5001");

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    deliveryCharge: 35,
    freeDeliveryThreshold: 500,
    isStoreOpen: true,
  });

  useEffect(() => {
    // 1. Fetch initial settings (PUBLIC)
    api.get("/admin/settings/public")
      .then((res) => {
        if (res.data) setSettings(res.data);
      })
      .catch((err) => console.error("Failed to load settings:", err));

    // 2. Listen for real-time updates from admin
    socket.on("settings_updated", (newSettings) => {
      setSettings(newSettings);
      // Optional: We could trigger a toast here if we wanted to notify the user
      // that delivery prices just changed, but let's just make it update silently for now
      // or we can just rely on the UI update.
    });

    return () => {
      socket.off("settings_updated");
    };
  }, []);

  return (
    <SettingsContext.Provider value={{ settings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
