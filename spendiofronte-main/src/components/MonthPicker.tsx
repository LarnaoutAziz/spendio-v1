// src/components/MonthPicker.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { THEME } from "../styles/theme";

interface MonthPickerProps {
  month: string; // format: YYYY-MM
  setMonth: (month: string) => void;
}

export const MonthPicker: React.FC<MonthPickerProps> = ({ month, setMonth }) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Generate last 12 months
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const year = d.getFullYear();
    const monthNum = String(d.getMonth() + 1).padStart(2, "0");
    return `${year}-${monthNum}`;
  });

  const monthNames: Record<string, string> = {
    "01": "Janvier",
    "02": "Février",
    "03": "Mars",
    "04": "Avril",
    "05": "Mai",
    "06": "Juin",
    "07": "Juillet",
    "08": "Août",
    "09": "Septembre",
    "10": "Octobre",
    "11": "Novembre",
    "12": "Décembre",
  };

  const displayMonth = () => {
    const [year, monthNum] = month.split("-");
    return `${monthNames[monthNum] || "N/A"} ${year}`;
  };

  const handleSelectMonth = (selectedMonth: string) => {
    setMonth(selectedMonth);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <MaterialCommunityIcons
          name="calendar"
          size={20}
          color={THEME.COLORS.pinkMedium}
        />
        <Text style={styles.buttonText}>{displayMonth()}</Text>
        <MaterialCommunityIcons
          name="chevron-down"
          size={20}
          color={THEME.COLORS.grayMedium}
        />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sélectionner un mois</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={THEME.COLORS.grayMedium}
                />
              </TouchableOpacity>
            </View>

            <FlatList
              data={months}
              keyExtractor={(item, index) => `month-picker-${item}-${index}`}
              renderItem={({ item }) => {
                const [year, monthNum] = item.split("-");
                const isSelected = item === month;
                return (
                  <TouchableOpacity
                    style={[
                      styles.monthItem,
                      isSelected && styles.monthItemActive,
                    ]}
                    onPress={() => handleSelectMonth(item)}
                  >
                    <Text
                      style={[
                        styles.monthItemText,
                        isSelected && styles.monthItemTextActive,
                      ]}
                    >
                      {monthNames[monthNum]} {year}
                    </Text>
                    {isSelected && (
                      <MaterialCommunityIcons
                        name="check"
                        size={20}
                        color={THEME.COLORS.pinkMedium}
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
              contentContainerStyle={styles.listContent}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  buttonText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: THEME.COLORS.grayDark,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: THEME.COLORS.grayDark,
  },
  listContent: { paddingHorizontal: 16, paddingVertical: 8 },
  monthItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginVertical: 4,
    borderRadius: 8,
  },
  monthItemActive: {
    backgroundColor: THEME.COLORS.pinkLight,
  },
  monthItemText: {
    fontSize: 14,
    color: THEME.COLORS.grayDark,
    fontWeight: "500",
  },
  monthItemTextActive: {
    color: THEME.COLORS.pinkMedium,
    fontWeight: "700",
  },
});
