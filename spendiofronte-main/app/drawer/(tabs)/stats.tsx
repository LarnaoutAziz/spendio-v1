import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";

import { THEME } from "../../../src/styles/theme";
import { getShadow } from "../../../src/styles/shadows";
import { MonthPicker } from "../../../src/components/MonthPicker";
import { useStatistics } from "../../../src/hooks/useStatistics";
import { StatCard } from "../../../src/components/StatCard";
import { useTransactionRefresh } from "../../../src/context/TransactionRefreshContext";

const screenWidth = Dimensions.get("window").width;

export default function StatsTab() {
  const router = useRouter();
  const [view, setView] = useState<"week" | "month" | "year">("month");
  const [month, setMonth] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const { loading, summary, history, categories, error, refetch } = useStatistics(month);
  const { triggerRefresh } = useTransactionRefresh();

  // ✅ FIXED: Use actual revenues from history, not budget - expenses
  const lineData = useMemo(() => {
    const labels: string[] = [];
    const expenses: number[] = [];
    const revenues: number[] = [];

    if (history && history.length > 0) {
      history
        .slice(0, 6)
        .reverse()
        .forEach((h) => {
          labels.push(h.month.substring(5) || "N/A"); // MM format
          const exp = Number(h.expenses || 0);
          const rev = Number(h.revenues || 0); // ✅ FIXED: Use actual revenues
          expenses.push(isNaN(exp) ? 0 : Math.max(0, exp));
          revenues.push(isNaN(rev) ? 0 : Math.max(0, rev));
        });
    }

    return {
      labels,
      datasets: [{ data: expenses }, { data: revenues }],
    };
  }, [history]);

  // Bar chart - monthly expenses
  const barData = useMemo(() => {
    const labels: string[] = [];
    const expenses: number[] = [];

    if (history && history.length > 0) {
      history
        .slice(0, 6)
        .reverse()
        .forEach((h) => {
          labels.push(h.month.substring(5) || "N/A");
          const exp = Number(h.expenses || 0);
          expenses.push(isNaN(exp) ? 0 : Math.max(0, exp));
        });
    }

    return { labels, datasets: [{ data: expenses }] };
  }, [history]);

  // Pie chart - categories with validation
  const pieData = useMemo(() => {
    const defaultColors = [
      "#E84A6A",
      "#F7A1B0",
      "#FFC3C3",
      "#FF9F9F",
      "#FFD1E3",
    ];

    return (categories || [])
      .filter((c: any) => {
        const total = Number(c.total || 0);
        return !isNaN(total) && total > 0;
      })
      .map((c: any, i: number) => ({
        name: c.name || "Sans nom",
        amount: Number(c.total || 0),
        color: c.color || defaultColors[i % defaultColors.length],
        legendFontColor: THEME.COLORS.grayDark,
        legendFontSize: 12,
      }));
  }, [categories]);

  const handleRefresh = async () => {
    await refetch();
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={THEME.COLORS.pinkMedium} />
        <Text style={{ marginTop: 12, color: THEME.COLORS.grayDark }}>Chargement des statistiques...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center", paddingHorizontal: 16 }]}>
        <MaterialCommunityIcons name="alert-circle" size={48} color={THEME.COLORS.pinkDark} />
        <Text style={{ marginTop: 12, color: THEME.COLORS.grayDark, textAlign: "center" }}>
          {error}
        </Text>
        <TouchableOpacity style={[styles.retryBtn]} onPress={handleRefresh}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🌸 Improved Header with Rose Bébé Theme */}
      <LinearGradient
        colors={[THEME.COLORS.primary, THEME.COLORS.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerIconBtn}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={THEME.COLORS.white}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Statistiques</Text>
          <TouchableOpacity onPress={handleRefresh} style={styles.headerIconBtn}>
            <MaterialCommunityIcons
              name="refresh"
              size={24}
              color={THEME.COLORS.white}
            />
          </TouchableOpacity>
        </View>

        {/* View filter buttons */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.viewBtn, view === "week" && styles.viewBtnActive]}
            onPress={() => setView("week")}
          >
            <Text style={[styles.viewText, view === "week" && styles.viewTextActive]}>
              Hebdo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewBtn, view === "month" && styles.viewBtnActive]}
            onPress={() => setView("month")}
          >
            <Text style={[styles.viewText, view === "month" && styles.viewTextActive]}>
              Mensuel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewBtn, view === "year" && styles.viewBtnActive]}
            onPress={() => setView("year")}
          >
            <Text style={[styles.viewText, view === "year" && styles.viewTextActive]}>
              Annuel
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Month Picker */}
        <MonthPicker month={month} setMonth={setMonth} />

        {/* Stat Cards - Row 1 */}
        <View style={styles.cardsRow}>
          <View style={{ flex: 1 }}>
            <StatCard
              icon="wallet"
              title="Dépenses"
              value={`${(summary.expenses || 0).toFixed(2)} DT`}
              color="#F78CA0"
            />
          </View>
          <View style={{ flex: 1 }}>
            <StatCard
              icon="cash"
              title="Revenus"
              value={`${(summary.revenues || 0).toFixed(2)} DT`}
              color="#4ECDC4"
            />
          </View>
        </View>

        {/* Stat Cards - Row 2 */}
        <View style={styles.cardsRow}>
          <View style={{ flex: 1 }}>
            <StatCard
              icon="scale-balance"
              title="Solde"
              value={`${((summary.revenues || 0) - (summary.expenses || 0)).toFixed(2)} DT`}
              color="#FFD166"
            />
          </View>
          <View style={{ flex: 1 }}>
            <StatCard
              icon="target"
              title="Réussite"
              value={`${Math.round(summary.percentage || 0)}%`}
              color="#FF6B6B"
            />
          </View>
        </View>

        {/* Line Chart - Expenses vs Revenues Trend */}
        <View style={styles.chartBlock}>
          <Text style={styles.chartTitle}>📈 Évolution (dépenses vs revenus)</Text>
          {lineData.labels && lineData.labels.length > 0 ? (
            <LineChart
              data={{
                labels: lineData.labels,
                datasets: [
                  {
                    data: lineData.datasets[0].data,
                    color: () => "rgba(247, 140, 160, 1)",
                    strokeWidth: 2,
                  },
                  {
                    data: lineData.datasets[1].data,
                    color: () => "rgba(76, 204, 164, 1)",
                    strokeWidth: 2,
                  },
                ],
              }}
              width={screenWidth - 32}
              height={220}
              chartConfig={{
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity * 0.3})`,
                labelColor: () => THEME.COLORS.grayDark,
                propsForDots: { r: "3", strokeWidth: "1" },
                strokeWidth: 2,
              }}
              bezier
              style={{ borderRadius: 12 }}
            />
          ) : (
            <Text style={styles.emptyText}>Données insuffisantes</Text>
          )}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={{ width: 12, height: 12, backgroundColor: "rgba(247, 140, 160, 1)", borderRadius: 2 }} />
              <Text style={styles.legendText}>Dépenses</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={{ width: 12, height: 12, backgroundColor: "rgba(76, 204, 164, 1)", borderRadius: 2 }} />
              <Text style={styles.legendText}>Revenus</Text>
            </View>
          </View>
        </View>

        {/* Bar Chart - Monthly Comparison */}
        <View style={styles.chartBlock}>
          <Text style={styles.chartTitle}>📊 Dépenses (6 derniers mois)</Text>
          {barData.labels && barData.labels.length > 0 ? (
            <BarChart
              data={{
                labels: barData.labels,
                datasets: [{ data: barData.datasets[0].data }],
              }}
              width={screenWidth - 32}
              height={180}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={{
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(247, 140, 160, ${opacity})`,
                labelColor: () => THEME.COLORS.grayDark,
              }}
              style={{ borderRadius: 12 }}
            />
          ) : (
            <Text style={styles.emptyText}>Pas d'historique</Text>
          )}
        </View>

        {/* Pie Chart - Categories Distribution */}
        <View style={styles.chartBlock}>
          <Text style={styles.chartTitle}>🎯 Répartition par catégorie</Text>
          {pieData && pieData.length > 0 ? (
            <PieChart
              data={pieData}
              width={screenWidth - 32}
              height={200}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: () => THEME.COLORS.grayDark,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="10"
              absolute
            />
          ) : (
            <Text style={styles.emptyText}>Aucune dépense par catégorie</Text>
          )}
        </View>

        {/* Categories List */}
        <View style={{ marginTop: 12 }}>
          <Text style={styles.sectionTitle}>💾 Détails par catégorie</Text>
          {categories && categories.length > 0 ? (
            <FlatList
              data={categories}
              scrollEnabled={false}
              keyExtractor={(item: any, index: number) => `category-${item.id ?? item.name}-${index}`}
              renderItem={({ item }: any) => (
                <View style={styles.categoryItemWrapper}>
                  <View
                    style={[
                      styles.categoryItemColor,
                      { backgroundColor: item.color || "#F9C0D3" },
                    ]}
                  />
                  <View style={styles.categoryItemContent}>
                    <View style={styles.categoryItemHeader}>
                      <Text style={styles.categoryItemName}>{item.name}</Text>
                      <Text style={styles.categoryItemBudget}>
                        {(Number(item.budget || 0)).toFixed(2)} DT
                      </Text>
                    </View>
                    <View style={styles.categoryItemFooter}>
                      <Text style={styles.categoryItemSpent}>
                        Dépensé: {(Number(item.total || 0)).toFixed(2)} DT
                      </Text>
                      <Text style={styles.categoryItemCount}>
                        {Number(item.count || 0)} transaction{Number(item.count || 0) > 1 ? "s" : ""}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 120 }}
            />
          ) : (
            <Text style={styles.emptyText}>Aucune catégorie</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.COLORS.primaryLight,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerIconBtn: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: THEME.COLORS.white,
    textAlign: "center",
    flex: 1,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  viewBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginHorizontal: 6,
  },
  viewBtnActive: {
    backgroundColor: THEME.COLORS.pinkMedium,
  },
  viewText: {
    color: THEME.COLORS.grayDark,
    fontWeight: "700",
    fontSize: 12,
  },
  viewTextActive: {
    color: "#fff",
  },

  scroll: {
    padding: 16,
    paddingBottom: 120,
  },
  cardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 8,
  },
  chartBlock: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  chartTitle: {
    fontWeight: "700",
    color: THEME.COLORS.grayDark,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    color: THEME.COLORS.grayDark,
    padding: 20,
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendText: {
    fontSize: 12,
    color: THEME.COLORS.grayDark,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: THEME.COLORS.grayDark,
    marginTop: 12,
    marginBottom: 8,
  },
  categoryItemWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 8,
    overflow: "hidden",
    ...getShadow(1),
  },
  categoryItemColor: {
    width: 4,
    height: "100%",
  },
  categoryItemContent: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  categoryItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  categoryItemName: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME.COLORS.grayDark,
  },
  categoryItemBudget: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.COLORS.pinkMedium,
  },
  categoryItemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  categoryItemSpent: {
    fontSize: 12,
    color: THEME.COLORS.grayDark,
    fontWeight: "500",
  },
  categoryItemCount: {
    fontSize: 11,
    color: "#999",
  },
  retryBtn: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: THEME.COLORS.pinkMedium,
    borderRadius: 8,
  },
});
