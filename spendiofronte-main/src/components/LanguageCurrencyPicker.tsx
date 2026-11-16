import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { THEME } from "../styles/theme";
import { Language, Currency } from "../context/SettingsContext";

interface LanguagePickerProps {
  visible: boolean;
  selectedLanguage: Language;
  onSelect: (language: Language) => void;
  onClose: () => void;
  isDarkMode: boolean;
}

export const LanguagePicker = ({
  visible,
  selectedLanguage,
  onSelect,
  onClose,
  isDarkMode,
}: LanguagePickerProps) => {
  const languages: { code: Language; label: string }[] = [
    { code: "fr", label: "Français" },
    { code: "en", label: "English" },
  ];

  const modalBg = isDarkMode ? "#2a2a2a" : THEME.COLORS.white;
  const textColor = isDarkMode ? "#ffffff" : THEME.COLORS.grayDark;
  const secondaryText = isDarkMode ? "#b0b0b0" : THEME.COLORS.grayMedium;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={[styles.overlay, { backgroundColor: "rgba(0,0,0,0.5)" }]}>
        <View style={[styles.modalContent, { backgroundColor: modalBg }]}>
          <Text style={[styles.title, { color: textColor }]}>Sélectionner la langue</Text>

          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.option,
                {
                  backgroundColor:
                    selectedLanguage === lang.code
                      ? THEME.COLORS.pinkMedium
                      : "transparent",
                },
              ]}
              onPress={() => {
                onSelect(lang.code);
                onClose();
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  {
                    color:
                      selectedLanguage === lang.code ? THEME.COLORS.white : textColor,
                    fontFamily:
                      selectedLanguage === lang.code
                        ? THEME.FONT.bold
                        : THEME.FONT.regular,
                  },
                ]}
              >
                {lang.label}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={[styles.closeText, { color: secondaryText }]}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

interface CurrencyPickerProps {
  visible: boolean;
  selectedCurrency: Currency;
  onSelect: (currency: Currency) => void;
  onClose: () => void;
  isDarkMode: boolean;
}

export const CurrencyPicker = ({
  visible,
  selectedCurrency,
  onSelect,
  onClose,
  isDarkMode,
}: CurrencyPickerProps) => {
  const currencies: { code: Currency; label: string; symbol: string }[] = [
    { code: "DT", label: "Dinar Tunisien", symbol: "DT" },
    { code: "$", label: "Dollar Américain", symbol: "$" },
    { code: "€", label: "Euro", symbol: "€" },
  ];

  const modalBg = isDarkMode ? "#2a2a2a" : THEME.COLORS.white;
  const textColor = isDarkMode ? "#ffffff" : THEME.COLORS.grayDark;
  const secondaryText = isDarkMode ? "#b0b0b0" : THEME.COLORS.grayMedium;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={[styles.overlay, { backgroundColor: "rgba(0,0,0,0.5)" }]}>
        <View style={[styles.modalContent, { backgroundColor: modalBg }]}>
          <Text style={[styles.title, { color: textColor }]}>Sélectionner la devise</Text>

          {currencies.map((curr) => (
            <TouchableOpacity
              key={curr.code}
              style={[
                styles.option,
                {
                  backgroundColor:
                    selectedCurrency === curr.code
                      ? THEME.COLORS.pinkMedium
                      : "transparent",
                },
              ]}
              onPress={() => {
                onSelect(curr.code);
                onClose();
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  {
                    color:
                      selectedCurrency === curr.code ? THEME.COLORS.white : textColor,
                    fontFamily:
                      selectedCurrency === curr.code
                        ? THEME.FONT.bold
                        : THEME.FONT.regular,
                  },
                ]}
              >
                {curr.label} ({curr.symbol})
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={[styles.closeText, { color: secondaryText }]}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalContent: {
    backgroundColor: THEME.COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },

  title: {
    fontSize: 18,
    fontFamily: THEME.FONT.bold,
    marginBottom: 20,
    textAlign: "center",
  },

  option: {
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  optionText: {
    fontSize: 16,
    fontFamily: THEME.FONT.regular,
  },

  closeButton: {
    paddingVertical: 14,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    alignItems: "center",
  },

  closeText: {
    fontSize: 14,
    fontFamily: THEME.FONT.regular,
    color: THEME.COLORS.grayMedium,
  },
});
