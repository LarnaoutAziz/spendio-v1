import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Progress from "react-native-progress";
import { COLORS } from "../../styles/colors";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

type Props = {
  name: string;
  icon?: string;
  color?: string;
  spent: number;
  limit?: number;
  count?: number;
  history?: number[]; // pour mini graphique
  onPress?: () => void;
};

export const CategoryCard = ({
  name,
  icon = "📦",
  color = "#FADBD8",
  spent = 0,
  limit = 0,
  count = 0,
  history = [],
  onPress,
}: Props) => {
  const spentSafe = Number(spent) || 0;
  const limitSafe = Number(limit) || 0;
  const percent = limitSafe > 0 ? (spentSafe / limitSafe) * 100 : 0;

  // Valider et nettoyer l'historique
  const safeHistory = (history || [])
    .map((h) => Number(h) || 0)
    .filter((h) => !isNaN(h) && h >= 0);

  const getColor = () => {
    if (percent < 50) return "#4CAF50"; // vert
    if (percent < 90) return "#FFD166"; // jaune
    return "#FF6B6B"; // rouge
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.subtitle}>{count} transaction(s)</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.amount}>{limitSafe ? `${limitSafe - spentSafe} TND left` : `${spentSafe} TND`}</Text>
          <Text style={[styles.percent, percent > 100 ? { color: "#FF6B6B" } : {}]}>{percent.toFixed(0)}%</Text>
        </View>
      </View>

      {/* Mini LineChart */}
      {safeHistory.length > 1 && (
        <LineChart
          data={{
            labels: safeHistory.map((_, i) => (i + 1).toString()),
            datasets: [{ data: safeHistory }],
          }}
          width={screenWidth - 60}
          height={50}
          withDots={false}
          withInnerLines={false}
          withOuterLines={false}
          withVerticalLabels={false}
          withHorizontalLabels={false}
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            color: () => color,
          }}
          style={{ marginVertical: 8, borderRadius: 8 }}
        />
      )}

      {/* Progress Bar */}
      <Progress.Bar
        progress={percent / 100}
        width={screenWidth - 60}
        height={10}
        color={getColor()}
        borderRadius={8}
        unfilledColor="#F3F3F5"
        animationType="spring"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 8, gap: 8 },
  icon: { fontSize: 22 },
  title: { fontSize: 16, fontWeight: "700", color: COLORS.pinkDark },
  subtitle: { fontSize: 12, color: COLORS.grayDark },
  amount: { fontWeight: "700", color: COLORS.pinkDark },
  percent: { fontSize: 12, color: COLORS.grayDark },
});
