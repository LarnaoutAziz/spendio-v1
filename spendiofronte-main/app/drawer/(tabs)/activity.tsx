import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useTransactions } from "../../../src/hooks/useTransactions";
import { THEME } from "../../../src/styles/theme";

export default function ActivityTab() {
  const [type, setType] = useState<"expense" | "income">("expense");
  const { transactions, loading, deleteTransaction } = useTransactions();

  /** 🔹 Filtrage selon type sélectionné **/
  const filteredData = (transactions || []).filter((t: any) => t.type === type);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[THEME.COLORS.primary, THEME.COLORS.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <Text style={styles.title}>Mes Activités</Text>
      </LinearGradient>

      <View style={styles.typeSwitch}>
        <TouchableOpacity
          style={[styles.typeButton, type === "expense" && styles.typeButtonActive]}
          onPress={() => setType("expense")}
        >
          <Text style={[styles.typeText, type === "expense" && styles.typeTextActive]}>Dépenses</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, type === "income" && styles.typeButtonActive]}
          onPress={() => setType("income")}
        >
          <Text style={[styles.typeText, type === "income" && styles.typeTextActive]}>Revenus</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }: { item: any }) => (
          <View style={styles.transactionRow}>
            <View style={styles.left}>
              <Text style={styles.icon}>{item.type === "expense" ? "💸" : "💰"}</Text>
              <View>
                <Text style={styles.itemTitle}>{item.category_name}</Text>
                <Text style={styles.itemDate}>{item.date}</Text>
              </View>
            </View>
            <View style={styles.right}>
              <Text style={[styles.amount, { color: item.type === "expense" ? THEME.COLORS.primary : "#4CAF50" }]}>
                {item.type === "expense" ? "-" : "+"} {item.amount} TND
              </Text>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteTransaction(item.id)}>
                <Ionicons name="trash-outline" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={60} color={THEME.COLORS.primary} />
            <Text style={styles.emptyText}>{loading ? "Chargement..." : "Aucune transaction"}</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.COLORS.primaryLight,
  },
  headerGradient: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: THEME.COLORS.white,
    textAlign: "center",
  },
  typeSwitch: {
    flexDirection: "row",
    marginBottom: 20,
    marginHorizontal: 20,
    marginTop: 16,
    gap: 10,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: THEME.COLORS.primary,
  },
  typeButtonActive: {
    backgroundColor: THEME.COLORS.primary,
  },
  typeText: {
    color: THEME.COLORS.primary,
    fontWeight: "bold",
  },
  typeTextActive: {
    color: "#fff",
  },
  transactionRow: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  icon: {
    fontSize: 24,
  },
  itemTitle: {
    fontWeight: "bold",
    fontSize: 14,
    color: THEME.COLORS.black,
  },
  itemDate: {
    fontSize: 12,
    color: THEME.COLORS.grayMedium,
    marginTop: 4,
  },
  amount: {
    fontWeight: "bold",
    fontSize: 14,
    minWidth: 80,
  },
  deleteBtn: {
    backgroundColor: "#FF6B6B",
    borderRadius: 8,
    padding: 8,
  },
  hiddenRow: {
    alignItems: "flex-end",
    justifyContent: "center",
    flex: 1,
    marginVertical: 8,
  },
  deleteButton: {
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "80%",
    marginRight: 10,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  emptyText: {
    marginTop: 10,
    color: THEME.COLORS.pinkMedium,
    fontWeight: "600",
  },
});
