import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { COLORS } from "../../styles/colors";

interface Category {
  category: string;
  total: number;
}

interface Props {
  data: Category[];
}

export const CategoryList = ({ data }: Props) => {
  const colors = ["#E84A6A", "#F7A1B0", "#FFC3C3", "#FF9F9F", "#FFD1E3"];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dépenses par catégorie</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.category}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <View style={[styles.dot, { backgroundColor: colors[index % colors.length] }]} />
            <Text style={styles.text}>{item.category}</Text>
            <Text style={styles.amount}>{item.total} $</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 10 },
  title: { fontSize: 16, fontWeight: "bold", color: COLORS.pinkDark, marginBottom: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 12,
    marginVertical: 4,
    alignItems: "center",
  },
  dot: { width: 14, height: 14, borderRadius: 7 },
  text: { flex: 1, color: COLORS.grayDark, marginLeft: 10 },
  amount: { color: COLORS.pinkDark, fontWeight: "bold" },
});
