import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { THEME } from "@/src/styles/theme";

type Props = {
  selected: "expense" | "income";
  onChange: (type: "expense" | "income") => void;
};

export default function TypeSwitch({ selected, onChange }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.switchItem}
        onPress={() => onChange("expense")}
      >
        {selected === "expense" ? (
          <LinearGradient
            colors={[THEME.COLORS.pinkMedium, THEME.COLORS.pinkLight]}
            style={styles.activeButton}
          >
            <Text style={styles.activeText}> Dépenses</Text>
          </LinearGradient>
        ) : (
          <Text style={styles.inactiveText}> Dépenses</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.switchItem}
        onPress={() => onChange("income")}
      >
        {selected === "income" ? (
          <LinearGradient
            colors={["#4CAF50", "#A5D6A7"]}
            style={styles.activeButton}
          >
            <Text style={styles.activeText}> Revenus</Text>
          </LinearGradient>
        ) : (
          <Text style={styles.inactiveText}> Revenus</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
    padding: 4,
    shadowColor: "#FADADD",
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  switchItem: {
    flex: 1,
    alignItems: "center",
  },
  activeButton: {
    borderRadius: 12,
    width: "100%",
    paddingVertical: 10,
  },
  activeText: {
    color: THEME.COLORS.white,
    textAlign: "center",
    fontFamily: THEME.FONT.bold,
  },
  inactiveText: {
    color: THEME.COLORS.grayMedium,
    fontFamily: THEME.FONT.bold,
    textAlign: "center",
    paddingVertical: 10,
  },
});
