import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { THEME } from "../../styles/theme";
import { BudgetProgress } from "./BudgetProgressBar";

interface Props {
  budget: any;
  onDelete: () => void;
  onEdit?: () => void;
}

export const BudgetCard = ({ budget, onDelete, onEdit }: Props) => {
  const spentSafe = Number(budget.spent) || 0;
  const limitSafe = Number(budget.limit) || 0;
  const percentage = limitSafe > 0 ? (spentSafe / limitSafe) * 100 : 0;
  const remaining = limitSafe - spentSafe;

  // Données pour mini line chart - Validées
  const historyData = (budget.history || [])
    .map((h: any) => ({
      day: h.day || "",
      spent: Number(h.spent) || 0,
    }))
    .filter((h: any) => h.spent >= 0 && !isNaN(h.spent));

  const lineData = {
    labels: historyData.map((h: any) => h.day),
    datasets: [
      {
        data: historyData.map((h: any) => h.spent),
        color: () => budget.color || THEME.COLORS.pinkMedium,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View style={[styles.card, { borderLeftColor: budget.color || THEME.COLORS.pinkMedium }]}>
      {/* Header avec icône et actions */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text style={styles.icon}>{budget.icon || "💼"}</Text>
          <Text style={styles.title}>{budget.name || "Budget"}</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {onEdit && (
            <TouchableOpacity onPress={onEdit}>
              <Ionicons name="pencil-outline" size={20} color="#4ECDC4" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={onDelete}>
            <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Mini Line Chart */}
      {lineData.labels.length > 0 && lineData.datasets[0].data.length > 0 && (
        <LineChart
          data={lineData}
          width={150}
          height={60}
          withDots={false}
          withInnerLines={false}
          withOuterLines={false}
          withVerticalLabels={false}
          withHorizontalLabels={false}
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            color: () => budget.color || THEME.COLORS.pinkMedium,
          }}
          style={{ marginVertical: 8 }}
        />
      )}

      {/* Barre de progression */}
      <BudgetProgress percentage={percentage} />

      {/* Détails dépenses */}
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Dépensé</Text>
          <Text style={styles.amount}>{spentSafe.toFixed(2)} TND</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Limite</Text>
          <Text style={styles.amount}>{limitSafe.toFixed(2)} TND</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={[styles.label, remaining < 0 && { color: "#FF6B6B" }]}>Restant</Text>
          <Text style={[styles.amount, remaining < 0 && { color: "#FF6B6B" }]}>{remaining.toFixed(2)} TND</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(247, 141, 166, 0.1)",
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    borderLeftWidth: 4,
  },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  icon: { fontSize: 20 },
  title: { fontSize: 16, fontWeight: "600", color: THEME.COLORS.pinkDark },
  details: { flexDirection: "row", justifyContent: "space-around", marginTop: 8 },
  detailItem: { alignItems: "center" },
  label: { fontSize: 12, color: "#999", marginBottom: 4 },
  amount: { fontSize: 14, fontWeight: "600", color: THEME.COLORS.pinkDark },
});
