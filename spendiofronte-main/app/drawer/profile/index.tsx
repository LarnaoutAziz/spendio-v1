// app/profile/profile.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { THEME } from "../../../src/styles/theme";
import { getShadow } from "../../../src/styles/shadows";
import { useDarkMode } from "../../../src/context/DarkModeContext";
import { useAuth } from "../../../src/context/AuthContext";
import { useSettings } from "../../../src/context/SettingsContext";
import { LanguagePicker, CurrencyPicker } from "../../../src/components/LanguageCurrencyPicker";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { logout, user, token } = useAuth();
  const { language, currency, setLanguage, setCurrency } = useSettings();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  const router = useRouter(); // Expo Router pour navigation

  // Fonction pour déconnecter
  const handleLogout = async () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir quitter?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Quitter",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              router.replace("/(auth)/login");
            } catch (error) {
              console.error("Logout error:", error);
            }
          },
        },
      ]
    );
  };

  // Couleurs basées sur le mode sombre
  const containerBg = isDarkMode ? "#1a1a1a" : THEME.COLORS.pinkLight;
  const cardBg = isDarkMode ? "#2a2a2a" : THEME.COLORS.white;
  const textColor = isDarkMode ? "#ffffff" : THEME.COLORS.grayDark;
  const secondaryText = isDarkMode ? "#b0b0b0" : THEME.COLORS.grayMedium;

  return (
    <ScrollView style={[styles.container, { backgroundColor: containerBg }]} showsVerticalScrollIndicator={false}>
      {/* 👤 USER INFO CARD */}
      <View style={[styles.userCard, { backgroundColor: cardBg }]}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar} />
        </View>
        <Text style={[styles.name, { color: textColor }]}>
          {user?.name || "Utilisateur"}
        </Text>
        <Text style={[styles.email, { color: secondaryText }]}>
          {user?.email || "email@example.com"}
        </Text>
        {!token && (
          <Text style={[styles.email, { color: "#FF6B6B", marginTop: 10 }]}>
            ⚠️ Non connecté
          </Text>
        )}
      </View>

      {/* ⚙️ SETTINGS */}
      <Text style={[styles.sectionTitle, { color: textColor }]}>Paramètres</Text>

      <TouchableOpacity style={[styles.item, { backgroundColor: cardBg }]} activeOpacity={0.7} onPress={() => router.push("/drawer/profile/editProfile")}>
        <Text style={[styles.itemText, { color: textColor }]}>👤 Modifier le profil</Text>
        <Text style={[styles.arrow, { color: secondaryText }]}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.item, { backgroundColor: cardBg }]} activeOpacity={0.7} onPress={() => router.push("/drawer/profile/changePassword")}>
        <Text style={[styles.itemText, { color: textColor }]}>🔑 Changer le mot de passe</Text>
        <Text style={[styles.arrow, { color: secondaryText }]}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.item, { backgroundColor: cardBg }]} 
        activeOpacity={0.7}
        onPress={() => setShowLanguagePicker(true)}
      >
        <Text style={[styles.itemText, { color: textColor }]}>🌍 Langue</Text>
        <Text style={[styles.value, { color: secondaryText }]}>{language === "fr" ? "Français" : "English"}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.item, { backgroundColor: cardBg }]} 
        activeOpacity={0.7}
        onPress={() => setShowCurrencyPicker(true)}
      >
        <Text style={[styles.itemText, { color: textColor }]}>💵 Devise</Text>
        <Text style={[styles.value, { color: secondaryText }]}>
          {currency === "DT" ? "Dinar (DT)" : currency === "$" ? "Dollar ($)" : "Euro (€)"}
        </Text>
      </TouchableOpacity>

      <View style={[styles.item, { backgroundColor: cardBg }]}>
        <Text style={[styles.itemText, { color: textColor }]}>🌙 Mode sombre</Text>
        <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
      </View>

      <View style={[styles.item, { backgroundColor: cardBg }]}>
        <Text style={[styles.itemText, { color: textColor }]}>🔔 Notifications</Text>
        <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
      </View>

      {/* 📊 INFO */}
      <Text style={[styles.sectionTitle, { color: textColor }]}>Infos</Text>

      <TouchableOpacity style={[styles.item, { backgroundColor: cardBg }]} activeOpacity={0.7} onPress={() => router.push("/drawer/profile/exportData")}>
        <Text style={[styles.itemText, { color: textColor }]}>💾 Exporter les données</Text>
        <Text style={[styles.arrow, { color: secondaryText }]}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.item, { backgroundColor: cardBg }]} activeOpacity={0.7} onPress={() => router.push("/drawer/profile/help")}>
        <Text style={[styles.itemText, { color: textColor }]}>📖 Aide</Text>
        <Text style={[styles.arrow, { color: secondaryText }]}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.item, { backgroundColor: cardBg }]} activeOpacity={0.7} onPress={() => router.push("/drawer/profile/about")}>
        <Text style={[styles.itemText, { color: textColor }]}>ℹ️ À propos</Text>
        <Text style={[styles.arrow, { color: secondaryText }]}>›</Text>
      </TouchableOpacity>

      {/* 🚪 SESSION */}
      <Text style={[styles.sectionTitle, { color: textColor }]}>Session</Text>

      <TouchableOpacity 
        style={styles.logout} 
        activeOpacity={0.8}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() =>
          Alert.alert(
            "Supprimer le compte",
            "Cette action est irréversible",
            [{ text: "Annuler" }, { text: "Supprimer", style: "destructive" }]
          )
        }
        activeOpacity={0.7}
      >
        <Text style={[styles.delete, { color: isDarkMode ? "#ff8787" : "#FF6B6B" }]}>Supprimer le compte</Text>
      </TouchableOpacity>

      {/* 🎨 MODALS POUR LANGUE ET DEVISE */}
      <LanguagePicker
        visible={showLanguagePicker}
        selectedLanguage={language}
        onSelect={setLanguage}
        onClose={() => setShowLanguagePicker(false)}
        isDarkMode={isDarkMode}
      />

      <CurrencyPicker
        visible={showCurrencyPicker}
        selectedCurrency={currency}
        onSelect={setCurrency}
        onClose={() => setShowCurrencyPicker(false)}
        isDarkMode={isDarkMode}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 140,
  },
  userCard: {
    alignItems: "center",
    marginBottom: 30,
    borderRadius: 16,
    padding: 25,
    ...getShadow(4),
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: THEME.COLORS.pinkMedium,
    ...getShadow(6),
  },
  name: {
    fontFamily: THEME.FONT.bold,
    fontSize: 18,
    marginBottom: 5,
  },
  email: {
    fontSize: 13,
  },
  sectionTitle: {
    marginTop: 25,
    marginBottom: 12,
    fontFamily: THEME.FONT.bold,
    fontSize: 14,
    letterSpacing: 0.5,
  },
  item: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...getShadow(2),
  },
  itemText: {
    fontSize: 15,
    fontFamily: THEME.FONT.medium,
  },
  arrow: {
    fontSize: 20,
  },
  value: {
    fontSize: 14,
    fontFamily: THEME.FONT.medium,
  },
  logout: {
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutText: {
    textAlign: "center",
    fontFamily: THEME.FONT.bold,
    fontSize: 15,
    letterSpacing: 0.5,
  },
  deleteButton: {
    paddingVertical: 14,
    marginTop: 12,
  },
  delete: {
    textAlign: "center",
    fontFamily: THEME.FONT.medium,
    fontSize: 14,
  },
});
