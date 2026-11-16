// app/profile/about.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "../../../src/styles/theme";
import { getShadow } from "../../../src/styles/shadows";
import { useDarkMode } from "../../../src/context/DarkModeContext";
import { useRouter } from "expo-router";

export default function AboutScreen() {
  const { isDarkMode } = useDarkMode();
  const router = useRouter();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <LinearGradient
        colors={[THEME.COLORS.pinkLight, THEME.COLORS.pinkLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
      >
        {/* 🔙 Bouton retour */}
        <TouchableOpacity style={styles.backButton} onPress={() => {
          try {
            router.back();
          } catch (err) {
            console.error('Navigation error:', err);
          }
        }}>
          <Ionicons name="arrow-back" size={24} color={THEME.COLORS.pinkMedium} />
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>À propos</Text>

          <View style={styles.whiteCard}>
            {/* 🏷️ Nom de l'application */}
            <Text style={styles.appName}>Spendio</Text>

            {/* 🔢 Version */}
            <Text style={styles.version}>Version 1.0</Text>

            <View style={styles.divider} />

            {/* 📘 Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.sectionText}>
                Spendio est une application mobile de gestion de budget personnel
                conçue pour aider les utilisateurs à suivre leurs revenus et leurs
                dépenses de manière simple et efficace. Elle permet d'organiser
                les transactions, de gérer un budget mensuel et d'avoir une
                meilleure visibilité sur ses habitudes financières.
              </Text>
            </View>

            <View style={styles.divider} />

            {/* 👩‍💻 Développeurs */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Développé par</Text>
              <Text style={styles.sectionText}> Hamdi Israa</Text>
            </View>

            <View style={styles.divider} />

            {/* 📅 Année */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Année de création</Text>
              <Text style={styles.sectionText}>2026</Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 30,
    left: 20,
    padding: 8,
    zIndex: 10,
  },
  title: {
    fontFamily: THEME.FONT.bold,
    fontSize: 26,
    color: THEME.COLORS.pinkDark,
    textAlign: "center",
    marginBottom: 28,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  whiteCard: {
    backgroundColor: THEME.COLORS.white,
    borderRadius: 24,
    padding: 20,
    ...getShadow(6),
    width: "100%",
    maxWidth: 350,
  },
  appName: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    color: THEME.COLORS.pinkDark,
    marginBottom: 6,
  },
  version: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "500",
    color: THEME.COLORS.grayMedium,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },
  section: {
    marginVertical: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: THEME.COLORS.pinkDark,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "400",
    color: THEME.COLORS.grayMedium,
  },
});
