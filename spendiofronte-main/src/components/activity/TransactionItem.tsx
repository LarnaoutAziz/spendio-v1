import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { THEME } from "../../styles/theme";

type Props = {
  title: string;
  amount: number;
  date: string;
  type: "expense" | "income";
};

export default function TransactionItem({ title, amount, date, type }: Props) {
  const scaleAnim = new Animated.Value(0.9);

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, []);

  const color = type === "expense" ? THEME.COLORS.pinkMedium : "#4CAF50";
  const sign = type === "expense" ? "-" : "+";
  const icon = type === "expense" ? "💸" : "💰";
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : (amount || 0);

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <View style={styles.left}>
        <Text style={styles.icon}>{icon}</Text>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
      </View>

      <Text style={[styles.amount, { color }]}>
        {sign} {numAmount.toFixed(2)} TND
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 16,
    borderRadius: 18,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#F78CA0",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  icon: {
    fontSize: 20,
  },
  title: {
    fontFamily: THEME.FONT.bold,
    color: THEME.COLORS.black,
  },
  date: {
    fontSize: 12,
    color: THEME.COLORS.grayMedium,
  },
  amount: {
    fontFamily: THEME.FONT.bold,
    fontSize: 15,
  },
});
