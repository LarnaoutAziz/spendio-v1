import { StyleSheet, Text, View } from "react-native";
import * as Progress from "react-native-progress";
import { THEME } from "../../styles/theme";

interface Props {
  percentage: number;
  color?: string;
}

export const BudgetProgress = ({ percentage, color = THEME.COLORS.pinkMedium }: Props) => {
  const getProgressColor = () => {
    if (percentage < 50) return "#4CAF50"; // vert
    if (percentage < 80) return "#FFD166"; // jaune
    if (percentage < 100) return "#FF9800"; // orange
    return "#FF6B6B"; // rouge
  };

  return (
    <View style={styles.container}>
      <Progress.Bar
        progress={Math.min(percentage / 100, 1)}
        width={null}
        height={12}
        color={getProgressColor()}
        unfilledColor="#E0E0E0"
        borderWidth={0}
        borderRadius={6}
      />
      <Text style={styles.text}>{percentage.toFixed(1)}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    gap: 6,
  },
  text: {
    textAlign: "center",
    color: THEME.COLORS.grayDark,
    fontWeight: "600",
    fontSize: 12,
  },
});
