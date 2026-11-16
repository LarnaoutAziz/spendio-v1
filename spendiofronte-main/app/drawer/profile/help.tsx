// app/profile/help.tsx
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

export default function HelpScreen() {
  const { isDarkMode } = useDarkMode();
  const router = useRouter();

  const tips = [
    {
      icon: "📝",
      title: "Enregistrez régulièrement",
      description:
        "Enregistrez vos dépenses et revenus régulièrement pour garder une vue claire sur votre budget.",
    },
    {
      icon: "📂",
      title: "Classez vos transactions",
      description:
        "Classez chaque transaction dans la bonne catégorie afin de mieux comprendre où va votre argent.",
    },
    {
      icon: "💰",
      title: "Fixez un budget",
      description:
        "Fixez un budget mensuel réaliste et consultez-le fréquemment pour éviter les dépassements.",
    },
    {
      icon: "📊",
      title: "Analysez vos statistiques",
      description:
        "Analysez vos statistiques pour identifier vos habitudes de consommation.",
    },
    {
      icon: "📅",
      title: "Vérifiez régulièrement",
      description:
        "Vérifiez votre activité chaque semaine pour rester organisé et mieux planifier vos dépenses.",
    },
  ];

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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            try {
              router.back();
            } catch (err) {
              console.error('Navigation error:', err);
            }
          }}
        >
          <Ionicons name="arrow-back" size={24} color={THEME.COLORS.pinkMedium} />
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Aide</Text>

          <View style={styles.whiteCard}>
            {/* Intro Text */}
            <View style={styles.introSection}>
              <Text style={styles.introTitle}>
                Conseils pour mieux gérer vos finances
              </Text>
              <Text style={styles.introText}>
                Spendio vous aide à suivre vos revenus et vos dépenses au
                quotidien. Pour profiter pleinement de l'application, voici
                quelques conseils simples :
              </Text>
            </View>

            <View style={styles.divider} />

            {/* Tips List */}
            <View style={styles.tipsContainer}>
              {tips.map((tip, index) => (
                <View key={index}>
                  <View style={styles.tipItem}>
                    <Text style={styles.tipIcon}>{tip.icon}</Text>
                    <View style={styles.tipContent}>
                      <Text style={styles.tipTitle}>{tip.title}</Text>
                      <Text style={styles.tipDescription}>{tip.description}</Text>
                    </View>
                  </View>
                  {index < tips.length - 1 && <View style={styles.tipDivider} />}
                </View>
              ))}
            </View>

            <View style={styles.divider} />

            {/* Conclusion */}
            <View style={styles.conclusionSection}>
              <Text style={styles.conclusionText}>
                Ces conseils vous permettront de mieux gérer votre argent, de
                prendre de bonnes habitudes financières et d'utiliser
                l'application Spendio de manière simple et efficace.
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
    ...getShadow(6),
    width: "100%",
  },
  introSection: { marginBottom: 12 },
  introTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: THEME.COLORS.pinkDark,
    marginBottom: 12,
    lineHeight: 26,
  },
  introText: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "400",
    color: THEME.COLORS.grayMedium,
  },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 16 },
  tipsContainer: { marginVertical: 8 },
  tipItem: { flexDirection: "row", alignItems: "flex-start", paddingVertical: 14 },
  tipIcon: { fontSize: 28, marginRight: 14, marginTop: 2 },
  tipContent: { flex: 1 },
  tipTitle: { fontSize: 15, fontWeight: "700", color: THEME.COLORS.pinkDark, marginBottom: 6 },
  tipDescription: { fontSize: 13, lineHeight: 20, fontWeight: "400", color: THEME.COLORS.grayMedium },
  tipDivider: { height: 0.5, backgroundColor: "#f0f0f0", marginVertical: 4 },
  conclusionSection: { marginVertical: 6 },
  conclusionText: { fontSize: 14, lineHeight: 22, fontWeight: "400", color: THEME.COLORS.grayMedium, fontStyle: "italic" },
});
