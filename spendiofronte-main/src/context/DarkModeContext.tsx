import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface DarkModeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => Promise<void>;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export const DarkModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 🔄 Charger le mode sombre sauvegardé
  useEffect(() => {
    const loadDarkMode = async () => {
      try {
        const storedMode = await AsyncStorage.getItem("darkMode");
        if (storedMode !== null) {
          setIsDarkMode(JSON.parse(storedMode));
        }
      } catch (error) {
        console.error("❌ Erreur lors du chargement du mode sombre :", error);
      }
    };
    loadDarkMode();
  }, []);

  // 🌗 Bascule du mode sombre
  const toggleDarkMode = useCallback(async () => {
    try {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      await AsyncStorage.setItem("darkMode", JSON.stringify(newMode));
    } catch (error) {
      console.error("❌ Erreur lors du changement du mode sombre :", error);
    }
  }, [isDarkMode]);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

// 🧩 Hook d'utilisation
export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error("useDarkMode doit être utilisé à l'intérieur de DarkModeProvider");
  }
  return context;
};
