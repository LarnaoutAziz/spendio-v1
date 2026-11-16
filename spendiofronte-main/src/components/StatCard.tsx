// src/components/StatCard.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { THEME } from "../styles/theme";
import { getShadow } from "../styles/shadows";

interface StatCardProps {
  icon: string;
  title: string;
  value: string;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  color = THEME.COLORS.primary,
}) => {
  return (
    <View style={[styles.card, { borderLeftColor: color, borderTopColor: color + "40" }]}>
      <View style={styles.row}>
        <View style={[styles.iconBox, { backgroundColor: color + "20" }]}>
          <MaterialCommunityIcons name={icon as any} size={20} color={color} />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.value}>{value}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
    borderLeftWidth: 5,
    borderTopWidth: 1,
    ...getShadow(2),
  },
  row: { flexDirection: "row", alignItems: "center" },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 12, color: THEME.COLORS.grayMedium, fontWeight: "500" },
  value: { fontSize: 18, fontWeight: "700", color: THEME.COLORS.grayDark, marginTop: 2 },
});
