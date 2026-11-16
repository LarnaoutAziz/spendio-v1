import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🌍 Types
export type Language = "fr" | "en";
export type Currency = "DT" | "$" | "€";

interface SettingsContextType {
  language: Language;
  currency: Currency;
  setLanguage: (lang: Language) => Promise<void>;
  setCurrency: (curr: Currency) => Promise<void>;
}

// 🔧 Création du contexte
const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

// 💾 Provider
export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>("fr");
  const [currency, setCurrencyState] = useState<Currency>("DT");

  // ⚙️ Charger les préférences sauvegardées au démarrage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedLang = await AsyncStorage.getItem("language");
        const storedCurr = await AsyncStorage.getItem("currency");

        if (storedLang) setLanguageState(JSON.parse(storedLang));
        if (storedCurr) setCurrencyState(JSON.parse(storedCurr));
      } catch (error) {
        console.error("❌ Erreur lors du chargement des paramètres :", error);
      }
    };
    loadSettings();
  }, []);

  // 🌐 Modifier la langue
  const setLanguage = useCallback(async (lang: Language) => {
    try {
      setLanguageState(lang);
      await AsyncStorage.setItem("language", JSON.stringify(lang));
    } catch (error) {
      console.error("❌ Erreur lors du changement de langue :", error);
    }
  }, []);

  // 💵 Modifier la devise
  const setCurrency = useCallback(async (curr: Currency) => {
    try {
      setCurrencyState(curr);
      await AsyncStorage.setItem("currency", JSON.stringify(curr));
    } catch (error) {
      console.error("❌ Erreur lors du changement de devise :", error);
    }
  }, []);

  return (
    <SettingsContext.Provider
      value={{ language, currency, setLanguage, setCurrency }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

// 🧩 Hook d'utilisation du contexte
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings doit être utilisé à l'intérieur de SettingsProvider");
  }
  return context;
};
