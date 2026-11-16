import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
} from "react-native";
import { Calendar } from "react-native-calendars";

import { FormInput } from "../../../src/components/FormInput";
import { THEME } from "../../../src/styles/theme";
import { useTransactions } from "../../../src/hooks/useTransactions";
import { useBudgetCategory } from "../../../src/hooks/useBudgetCategory";
import { useLocalNotifications } from "../../../src/hooks/pushToken";
import { useRouter } from "expo-router";
import { useTransactionRefresh } from "../../../src/context/TransactionRefreshContext";

export default function AddTransactionScreen() {
  const router = useRouter();
  const { addTransaction } = useTransactions();
  const { categories, loading: categoriesLoading, fetchAll } = useBudgetCategory();
  const { sendImmediateNotification } = useLocalNotifications();
  const { triggerRefresh } = useTransactionRefresh();

  const [formData, setFormData] = useState({
    amount: "",
    category_id: null as number | null,
    category_name: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    type: "expense" as "expense" | "income",
  });
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const handleChange = (field: string, value: string | number | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectCategory = (categoryId: number, categoryName: string) => {
    setFormData((prev) => ({ ...prev, category_id: categoryId, category_name: categoryName }));
    setShowCategoryPicker(false);
  };

  const handleSubmit = async () => {
    if (!formData.amount || !formData.category_id || !formData.date) {
      Alert.alert("Erreur", "Tous les champs sont obligatoires.");
      return;
    }

    setLoading(true);
    try {
      // ✅ Envoyer les données correctes au backend
      const payload = {
        category_id: formData.category_id,
        type: formData.type,
        amount: parseFloat(formData.amount),
        date: formData.date,
        description: formData.description,
      };

      console.log("📤 Payload envoyé:", payload);
      await addTransaction(payload as any);
      
      // 🔄 Refresh des catégories et budgets + STATISTIQUES
      await fetchAll();
      triggerRefresh(); // ✅ FIXED: Notify statistics hook to re-fetch

      // 📱 Envoyer une notification locale
      const typeLabel = formData.type === "expense" ? "dépense" : "revenu";
      const emoji = formData.type === "expense" ? "💸" : "💰";
      
      try {
        console.log(`📢 [SUBMIT] Envoi notification: ${emoji} ${formData.type}`);
        const notificationId = await sendImmediateNotification(
          `${emoji} ${formData.type === "expense" ? "Dépense" : "Revenu"} ajouté(e)`,
          `${formData.amount} DT dans ${formData.category_name}`
        );
        console.log(`✅ [SUBMIT] Notification envoyée avec ID: ${notificationId}`);
      } catch (notificationError) {
        console.warn(`⚠️ [SUBMIT] Notification échouée (non bloquant):`, notificationError);
        // La notification échoue ? Ce n'est pas grave, la transaction est déjà sauvegardée
      }

      Alert.alert("🎉 Succès", "Transaction ajoutée avec succès !");
      router.back();
    } catch (error: any) {
      console.error("Erreur :", error);
      Alert.alert("Erreur", error?.response?.data?.message || "Impossible d'ajouter la transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (selectedDate: string) => {
    handleChange("date", selectedDate);
    setShowDatePicker(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <LinearGradient
        colors={[THEME.COLORS.primary, THEME.COLORS.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={THEME.COLORS.white} />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>Ajouter une transaction</Text>

          <View style={styles.card}>
            <FormInput
              label="Montant"
              value={formData.amount}
              onChangeText={(v) => handleChange("amount", v)}
              placeholder="Ex: 100"
              keyboardType="numeric"
            />

            <Text style={styles.label}>Catégorie</Text>
            <TouchableOpacity
              style={styles.categoryButton}
              onPress={() => setShowCategoryPicker(true)}
            >
              <Text style={styles.categoryButtonText}>
                {formData.category_name || "Sélectionner une catégorie"}
              </Text>
              <Ionicons name="chevron-down" size={20} color={THEME.COLORS.pinkMedium} />
            </TouchableOpacity>

            {/* Modal Category Picker */}
            <Modal
              visible={showCategoryPicker}
              transparent
              animationType="slide"
              onRequestClose={() => setShowCategoryPicker(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Sélectionner une catégorie</Text>
                    <TouchableOpacity onPress={() => setShowCategoryPicker(false)}>
                      <Ionicons name="close" size={24} color={THEME.COLORS.pinkDark} />
                    </TouchableOpacity>
                  </View>
                  
                  {categoriesLoading ? (
                    <ActivityIndicator size="large" color={THEME.COLORS.pinkMedium} />
                  ) : (
                    <FlatList
                      data={categories}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.categoryOption}
                          onPress={() => handleSelectCategory(Number(item.id), item.name)}
                        >
                          <Text style={styles.categoryOptionText}>{item.name}</Text>
                          {formData.category_id === item.id && (
                            <Ionicons name="checkmark" size={20} color={THEME.COLORS.pinkMedium} />
                          )}
                        </TouchableOpacity>
                      )}
                    />
                  )}
                </View>
              </View>
            </Modal>

            <FormInput
              label="Description"
              value={formData.description}
              onChangeText={(v) => handleChange("description", v)}
              placeholder="Entrez une description"
            />

            <Text style={styles.label}>Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(!showDatePicker)}
            >
              <Text style={styles.dateButtonText}>
                {formData.date || "Sélectionner une date"}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <View style={styles.calendarContainer}>
                <Calendar
                  current={formData.date || new Date().toISOString().split("T")[0]}
                  minDate="2020-01-01"
                  maxDate={new Date().toISOString().split("T")[0]}
                  onDayPress={(day) => handleDateChange(day.dateString)}
                  markedDates={{
                    [formData.date]: { selected: true, selectedColor: THEME.COLORS.pinkMedium }
                  }}
                  theme={{
                    backgroundColor: '#fff',
                    calendarBackground: '#fff',
                    textSectionTitleColor: THEME.COLORS.pinkDark,
                    selectedDayBackgroundColor: THEME.COLORS.pinkMedium,
                    selectedDayTextColor: '#fff',
                    todayTextColor: THEME.COLORS.pinkMedium,
                    dayTextColor: '#333',
                    textDisabledColor: '#ddd',
                    dotColor: THEME.COLORS.pinkMedium,
                    selectedDotColor: '#fff',
                    monthTextColor: THEME.COLORS.pinkDark,
                    arrowColor: THEME.COLORS.pinkMedium,
                  }}
                />
              </View>
            )}

            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeBtn,
                  formData.type === "income" && styles.typeSelected,
                ]}
                onPress={() => handleChange("type", "income")}
              >
                <Text
                  style={[
                    styles.typeText,
                    formData.type === "income" && styles.typeTextActive,
                  ]}
                >
                  Revenu 💰
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeBtn,
                  formData.type === "expense" && styles.typeSelected,
                ]}
                onPress={() => handleChange("type", "expense")}
              >
                <Text
                  style={[
                    styles.typeText,
                    formData.type === "expense" && styles.typeTextActive,
                  ]}
                >
                  Dépense 💸
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.disabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Enregistrer</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  scroll: { paddingBottom: 60 },
  backButton: { position: "absolute", top: 30, left: 20, zIndex: 10, padding: 8, borderRadius: 10, backgroundColor: 'rgba(255, 255, 255, 0.2)' },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: THEME.COLORS.white,
    textAlign: "center",
    marginBottom: 25,
  },
  card: {
    backgroundColor: THEME.COLORS.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    color: THEME.COLORS.primaryDark,
    fontWeight: "600",
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },
  typeBtn: {
    borderWidth: 2,
    borderColor: THEME.COLORS.primary,
    borderRadius: 12,
    padding: 10,
    width: "40%",
    alignItems: "center",
  },
  typeSelected: { backgroundColor: THEME.COLORS.primary },
  typeText: { color: THEME.COLORS.primary, fontWeight: "600" },
  typeTextActive: { color: THEME.COLORS.white },
  button: {
    backgroundColor: THEME.COLORS.primary,
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
    alignItems: "center",
  },
  disabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  input: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: THEME.COLORS.pinkMedium,
    marginBottom: 16,
    color: THEME.COLORS.pinkDark,
  },
  dateButton: {
    backgroundColor: "#FFF",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: THEME.COLORS.pinkMedium,
    marginBottom: 16,
    alignItems: "center",
  },
  dateButtonText: {
    color: THEME.COLORS.pinkDark,
    fontSize: 16,
    fontWeight: "500",
  },
  calendarContainer: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: THEME.COLORS.pinkMedium,
    padding: 10,
  },
  categoryButton: {
    backgroundColor: "#FFF",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: THEME.COLORS.pinkMedium,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryButtonText: {
    color: THEME.COLORS.pinkDark,
    fontSize: 16,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: THEME.COLORS.pinkDark,
  },
  categoryOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  categoryOptionText: {
    fontSize: 16,
    color: THEME.COLORS.pinkDark,
    fontWeight: "500",
  },
});
