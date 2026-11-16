import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { THEME } from "../../../src/styles/theme";
import { useBudgetCategory } from "../../../src/hooks/useBudgetCategory";
import { useStatistics } from "../../../src/hooks/useStatistics";
import { useAuth } from "../../../src/context/AuthContext";

const screenWidth = Dimensions.get("window").width;

export default function DashboardScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const { categories, budgets, loading: budgetLoading } = useBudgetCategory();
  const [month, setMonth] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
  const { summary, loading: statsLoading } = useStatistics(month);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Calculate total wallet/budget
  const totalBudget = budgets.reduce((sum: number, b: any) => sum + (Number(b.budget) || 0), 0);
  const totalSpent = summary.expenses || 0;
  const walletBalance = totalBudget - totalSpent;

  if (budgetLoading || statsLoading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={THEME.COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bienvenue</Text>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString("fr-FR", { 
              weekday: "long", 
              year: "numeric", 
              month: "long", 
              day: "numeric" 
            })}
          </Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={24} color={THEME.COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push("/drawer/stats")}>
            <Ionicons name="calendar-outline" size={24} color={THEME.COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBtn, styles.logoutBtn]} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 3D BANNER */}
      <LinearGradient
        colors={[THEME.COLORS.primary, THEME.COLORS.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.banner}
      >
        <View style={styles.bannerContent}>
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>Créez vos budgets</Text>
            <Text style={styles.bannerSubtitle}>Maîtrisez vos dépenses facilement</Text>
          </View>
          <TouchableOpacity 
            style={styles.addBtn} 
            onPress={() => router.navigate("/drawer/add")}
          >
            <MaterialCommunityIcons name="plus" size={26} color={THEME.COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Decorative circles */}
        <View style={[styles.decorCircle, { bottom: -20, right: -30, width: 100, height: 100 }]} />
        <View style={[styles.decorCircle, { top: -10, left: -20, width: 60, height: 60 }]} />
      </LinearGradient>

      {/* QUICK ACTIONS */}
      <View style={styles.quickActionsSection}>
        <Text style={styles.sectionTitle}>Actions rapides</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.navigate("/drawer/activity")}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#FFE5E5" }]}>
              <MaterialCommunityIcons name="wallet-outline" size={24} color={THEME.COLORS.primary} />
            </View>
            <Text style={styles.actionLabel}>Dépenses</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.navigate("/drawer/budget")}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#E5F5F5" }]}>
              <FontAwesome5 name="chart-pie" size={20} color={THEME.COLORS.info} />
            </View>
            <Text style={styles.actionLabel}>Budget</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.navigate("/drawer/stats")}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#FFF5E5" }]}>
              <MaterialCommunityIcons name="chart-line" size={24} color={THEME.COLORS.warning} />
            </View>
            <Text style={styles.actionLabel}>Statistiques</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.navigate("/drawer/activity")}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#E8E5FF" }]}>
              <MaterialCommunityIcons name="history" size={24} color="#7C3AED" />
            </View>
            <Text style={styles.actionLabel}>Historique</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* WALLET CARD SECTION */}
      <View style={styles.walletSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mon Portefeuille</Text>
          <TouchableOpacity onPress={() => router.navigate("/drawer/budget")}>
            <Text style={styles.seeAllText}>Voir plus</Text>
          </TouchableOpacity>
        </View>

        {/* MAIN WALLET CARD */}
        <LinearGradient
          colors={[THEME.COLORS.primary, THEME.COLORS.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.walletCard}
        >
          {/* Card Background Pattern */}
          <View style={[styles.walletPattern, { opacity: 0.1 }]}>
            <View style={styles.patternDot} />
            <View style={styles.patternDot} />
            <View style={styles.patternDot} />
          </View>

          <View style={styles.walletCardContent}>
            <View>
              <Text style={styles.walletLabel}>Solde Disponible</Text>
              <Text style={styles.walletAmount}>
                {Math.max(0, walletBalance).toFixed(2)} DT
              </Text>
              <Text style={styles.walletDetails}>
                Budget: {totalBudget.toFixed(2)} DT • Dépensé: {totalSpent.toFixed(2)} DT
              </Text>
            </View>
            <MaterialCommunityIcons 
              name="wallet" 
              size={48} 
              color="rgba(255, 255, 255, 0.3)" 
            />
          </View>

          {/* Card Footer */}
          <View style={styles.cardFooter}>
            <View style={styles.chipNumber}>
              <Text style={styles.chipText}>•••• •••• •••• 2024</Text>
            </View>
          </View>
        </LinearGradient>

        {/* WALLET ACTIONS */}
        <View style={styles.walletActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() => router.navigate("/drawer/add")}
          >
            <MaterialCommunityIcons name="plus" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Ajouter Dépense</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => router.navigate("/drawer/budget")}
          >
            <MaterialCommunityIcons name="link" size={20} color={THEME.COLORS.primary} />
            <Text style={[styles.actionButtonText, { color: THEME.COLORS.primary }]}>
              Lier Compte
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* RECENT CATEGORIES */}
      <View style={styles.categoriesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Catégories</Text>
          <TouchableOpacity onPress={() => router.navigate("/drawer/budget")}>
            <Text style={styles.seeAllText}>Tout voir</Text>
          </TouchableOpacity>
        </View>

        {categories && categories.length > 0 ? (
          <View style={styles.categoriesList}>
            {categories.slice(0, 4).map((cat: any) => (
              <View key={cat.id} style={styles.categoryItem}>
                <View 
                  style={[
                    styles.categoryDot, 
                    { backgroundColor: cat.color || THEME.COLORS.primary }
                  ]} 
                />
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{cat.name}</Text>
                  <Text style={styles.categoryAmount}>
                    {Number(cat.total || 0).toFixed(2)} DT / {Number(cat.budget || 0).toFixed(2)} DT
                  </Text>
                </View>
                <View 
                  style={[
                    styles.categoryProgress,
                    { 
                      width: `${Math.min(100, (Number(cat.total || 0) / Number(cat.budget || 1)) * 100)}%`,
                      backgroundColor: cat.color || THEME.COLORS.primary,
                    }
                  ]} 
                />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons 
              name="inbox-outline" 
              size={48} 
              color={THEME.COLORS.grayLight}
            />
            <Text style={styles.emptyText}>Aucune catégorie créée</Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => router.navigate("/drawer/budget")}
            >
              <Text style={styles.emptyButtonText}>Créer une catégorie</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* INSIGHTS SECTION */}
      <View style={styles.insightsSection}>
        <Text style={styles.sectionTitle}>Aperçus</Text>
        
        <View style={styles.insightCard}>
          <View style={styles.insightIcon}>
            <MaterialCommunityIcons 
              name="trending-up" 
              size={24} 
              color={THEME.COLORS.success} 
            />
          </View>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Revenus ce mois</Text>
            <Text style={styles.insightValue}>{summary.revenues?.toFixed(2) || "0.00"} DT</Text>
          </View>
        </View>

        <View style={styles.insightCard}>
          <View style={styles.insightIcon}>
            <MaterialCommunityIcons 
              name="trending-down" 
              size={24} 
              color={THEME.COLORS.error} 
            />
          </View>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Dépenses ce mois</Text>
            <Text style={styles.insightValue}>{summary.expenses?.toFixed(2) || "0.00"} DT</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.COLORS.primaryLight,
  },

  // HEADER
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },

  greeting: {
    fontSize: 28,
    fontWeight: "800",
    color: THEME.COLORS.textDark,
    marginBottom: 4,
  },

  dateText: {
    fontSize: 14,
    color: THEME.COLORS.textMedium,
    fontWeight: "500",
  },

  headerIcons: {
    flexDirection: "row",
    gap: 12,
  },

  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },

  logoutBtn: {
    backgroundColor: "#E74C3C",
  },

  // BANNER
  banner: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 24,
    borderRadius: 20,
    padding: 24,
    overflow: "hidden",
    minHeight: 160,
  },

  decorCircle: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },

  bannerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 2,
  },

  bannerText: {
    flex: 1,
  },

  bannerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },

  bannerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.85)",
    fontWeight: "500",
  },

  addBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },

  // QUICK ACTIONS
  quickActionsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: THEME.COLORS.textDark,
    marginBottom: 12,
  },

  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },

  actionCard: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },

  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  actionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: THEME.COLORS.textDark,
    textAlign: "center",
  },

  // WALLET SECTION
  walletSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  seeAllText: {
    fontSize: 14,
    color: THEME.COLORS.primary,
    fontWeight: "600",
  },

  walletCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    overflow: "hidden",
    minHeight: 200,
    justifyContent: "space-between",
  },

  walletPattern: {
    position: "absolute",
    right: -30,
    top: -30,
    width: 200,
    height: 200,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },

  patternDot: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
  },

  walletCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    zIndex: 2,
  },

  walletLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.75)",
    fontWeight: "500",
    marginBottom: 8,
  },

  walletAmount: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
  },

  walletDetails: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.65)",
    fontWeight: "500",
  },

  cardFooter: {
    zIndex: 2,
    marginTop: 12,
  },

  chipNumber: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
  },

  chipText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
  },

  walletActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },

  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },

  primaryButton: {
    backgroundColor: THEME.COLORS.primary,
  },

  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: THEME.COLORS.primaryLight,
  },

  actionButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },

  // CATEGORIES SECTION
  categoriesSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },

  categoriesList: {
    gap: 10,
  },

  categoryItem: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },

  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  categoryInfo: {
    flex: 1,
  },

  categoryName: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME.COLORS.textDark,
    marginBottom: 2,
  },

  categoryAmount: {
    fontSize: 12,
    color: THEME.COLORS.textMedium,
    fontWeight: "500",
  },

  categoryProgress: {
    height: 4,
    borderRadius: 2,
    minWidth: 30,
  },

  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#fff",
    borderRadius: 14,
  },

  emptyText: {
    fontSize: 16,
    color: THEME.COLORS.textMedium,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 16,
  },

  emptyButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: THEME.COLORS.primary,
    borderRadius: 10,
  },

  emptyButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },

  // INSIGHTS SECTION
  insightsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },

  insightCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },

  insightIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: THEME.COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },

  insightContent: {
    flex: 1,
  },

  insightTitle: {
    fontSize: 13,
    color: THEME.COLORS.textMedium,
    fontWeight: "500",
    marginBottom: 2,
  },

  insightValue: {
    fontSize: 16,
    fontWeight: "700",
    color: THEME.COLORS.textDark,
  },
});
