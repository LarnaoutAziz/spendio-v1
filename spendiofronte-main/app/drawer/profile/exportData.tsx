// app/profile/exportData.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "../../../src/styles/theme";
import { useDarkMode } from "../../../src/context/DarkModeContext";
import { useRouter } from "expo-router";

export default function ExportDataScreen() {
  const router = useRouter();
  const { isDarkMode } = useDarkMode();
  const [isExporting, setIsExporting] = useState(false);

  const exportOptions = [
    {
      id: "csv",
      icon: "📊",
      title: "Exporter en CSV",
      description:
        "Téléchargez vos transactions au format CSV, compatible avec Excel et Google Sheets.",
    },
    {
      id: "json",
      icon: "📋",
      title: "Exporter en JSON",
      description:
        "Récupérez vos données au format JSON pour une sauvegarde complète et structurée.",
    },
    {
      id: "pdf",
      icon: "📄",
      title: "Exporter en PDF",
      description:
        "Générez un rapport PDF de vos transactions avec un résumé financier détaillé.",
    },
  ];

  const handleExport = async (format: string) => {
    setIsExporting(true);
    try {
      // Simulation d'export - à remplacer par ta logique réelle
      setTimeout(() => {
        Alert.alert(
          "Export réussi",
          `Vos données ont été exportées en format ${format.toUpperCase()}.\n\nLe fichier a été téléchargé dans votre dossier de téléchargements.`,
          [{ text: "OK", onPress: () => setIsExporting(false) }]
        );
      }, 2000);
    } catch (error) {
      Alert.alert("Erreur", "Une erreur est survenue lors de l'export.");
      setIsExporting(false);
    }
  };

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
          <Text style={styles.title}>Exporter les données</Text>

          <View style={styles.whiteCard}>
            {/* 🧾 Info section */}
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>Téléchargez votre historique financier</Text>
              <Text style={styles.infoText}>
                Exportez l'historique complet de vos transactions (revenus et
                dépenses) pour les consulter, les analyser ou les conserver en
                toute sécurité. Vous contrôlez entièrement vos données.
              </Text>
            </View>

            <View style={styles.divider} />

            {/* ✅ Avantages */}
            <View style={styles.benefitsSection}>
              {[
                "Conservez une trace de vos finances",
                "Analysez vos données avec Excel ou d'autres outils",
                "Partagez vos rapports si nécessaire",
                "Vos données restent sécurisées et privées",
              ].map((text, i) => (
                <View key={i} style={styles.benefitItem}>
                  <Text style={styles.benefitIcon}>✓</Text>
                  <Text style={styles.benefitText}>{text}</Text>
                </View>
              ))}
            </View>

            <View style={styles.divider} />

            {/* 📦 Options d'export */}
            <View style={styles.optionsSection}>
              <Text style={styles.optionsTitle}>Choisir le format d'export</Text>

              {exportOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.optionCard}
                  onPress={() => handleExport(option.id)}
                  disabled={isExporting}
                  activeOpacity={0.8}
                >
                  <View style={styles.optionHeader}>
                    <Text style={styles.optionIcon}>{option.icon}</Text>
                    <View style={styles.optionInfo}>
                      <Text style={styles.optionTitle}>{option.title}</Text>
                      <Text style={styles.optionDescription}>{option.description}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* ⏳ Indicateur de chargement */}
            {isExporting && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={THEME.COLORS.pinkMedium} />
                <Text style={styles.loadingText}>Export en cours...</Text>
              </View>
            )}

            {/* 🧩 Footer */}
            <View style={styles.footerSection}>
              <Text style={styles.footerText}>
                📌 Les fichiers exportés contiennent toutes vos transactions depuis la création de votre compte.
                Vous pouvez exporter vos données autant de fois que vous le souhaitez.
              </Text>
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
    paddingBottom: 40,
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
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    width: "100%",
  },
  infoSection: { marginBottom: 12 },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: THEME.COLORS.pinkDark,
    marginBottom: 12,
    lineHeight: 26,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "400",
    color: THEME.COLORS.grayMedium,
  },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 16 },
  benefitsSection: { marginVertical: 8 },
  benefitItem: { flexDirection: "row", alignItems: "flex-start", marginBottom: 12 },
  benefitIcon: {
    fontSize: 18,
    color: THEME.COLORS.pinkMedium,
    marginRight: 12,
    fontWeight: "bold",
  },
  benefitText: {
    fontSize: 14,
    lineHeight: 20,
    color: THEME.COLORS.grayMedium,
    flex: 1,
  },
  optionsSection: { marginVertical: 8 },
  optionsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: THEME.COLORS.pinkDark,
    marginBottom: 14,
  },
  optionCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  optionHeader: { flexDirection: "row", alignItems: "flex-start" },
  optionIcon: { fontSize: 32, marginRight: 14, marginTop: -2 },
  optionInfo: { flex: 1 },
  optionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: THEME.COLORS.pinkDark,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: THEME.COLORS.grayMedium,
  },
  loadingContainer: { justifyContent: "center", alignItems: "center", paddingVertical: 30 },
  loadingText: { fontSize: 14, color: THEME.COLORS.grayMedium, marginTop: 12, fontWeight: "500" },
  footerSection: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: "#eee" },
  footerText: {
    fontSize: 12,
    lineHeight: 18,
    color: THEME.COLORS.grayMedium,
    fontStyle: "italic",
  },
});
