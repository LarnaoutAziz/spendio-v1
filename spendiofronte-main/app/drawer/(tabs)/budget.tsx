// app/(tabs)/budget.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import * as Progress from "react-native-progress";
import { SwipeListView } from "react-native-swipe-list-view";

import { useBudgetCategory } from "../../../src/hooks/useBudgetCategory";
import { THEME } from "../../../src/styles/theme";
import { api } from "../../../src/services/api";
import { useTransactionRefresh } from "../../../src/context/TransactionRefreshContext";
import { ColorPickerWrapper } from "../../../src/components/ColorPickerWrapper";

// Largeur de l'écran pour charts
const screenWidth = Dimensions.get("window").width;

// Icônes par défaut pour les catégories
const CATEGORY_ICONS: Record<string, string> = {
  Alimentation: "food-apple",
  Transport: "car",
  Santé: "medical-bag",
  Loisirs: "movie",
  Logement: "home",
  Autres: "briefcase",
};

export default function BudgetTab() {
  const router = useRouter();
  const { budgets, categories, loading, fetchAll, addCategory, deleteCategory } = useBudgetCategory();
  const { triggerRefresh } = useTransactionRefresh();

  const [activeTab, setActiveTab] = useState<"overview" | "categories">("overview");

  // Modal add category
  const [modalVisible, setModalVisible] = useState(false);
  const [catName, setCatName] = useState("");
  const [catColor, setCatColor] = useState("#F9C0D3");
  const [catBudget, setCatBudget] = useState<string>("");
  const [catIcon, setCatIcon] = useState<string>("briefcase");

  // Modal add budget
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [budgetMonth, setBudgetMonth] = useState("");
  const [budgetAmount, setBudgetAmount] = useState<string>("");

  // Filtre pour LineChart
  const [filter, setFilter] = useState<"month" | "week">("month");

  useEffect(() => {
    fetchAll();
  }, []);

  // Données pour PieChart - Filtrées et validées
  // Ne montrer que les catégories avec dépenses
  const pieData = categories
    .filter((c: any) => {
      const amount = Number(c.total) || 0;
      return amount > 0 && !isNaN(amount);
    })
    .map((c: any) => {
      const amount = Number(c.total) || 0;
      return {
        name: c.name || "Sans nom",
        amount: isNaN(amount) ? 0 : Math.max(0, amount),
        color: c.color || "#F9C0D3",
        legendFontColor: THEME.COLORS.grayDark,
        legendFontSize: 12,
      };
    });

  // Toutes les catégories pour le widget répartition
  const allCategoriesForChart = categories.map((c: any) => {
    const amount = Number(c.total) || 0;
    return {
      name: c.name || "Sans nom",
      amount: isNaN(amount) ? 0 : Math.max(0, amount),
      color: c.color || "#F9C0D3",
      legendFontColor: THEME.COLORS.grayDark,
      legendFontSize: 12,
    };
  });

  console.log("📊 PieChart Data:", { pieData, allCategoriesForChart, categories });

  // Données pour LineChart - Filtrées et validées
  const lineData = {
    labels: budgets
      .filter((b: any) => b.month && b.month.length > 0)
      .map((b: any) => b.month.substring(5)), // Afficher que le mois (MM)
    datasets: [
      {
        data: budgets
          .filter((b: any) => b.month && b.month.length > 0)
          .map((b: any) => {
            const spent = Number(b.spent) || 0;
            return isNaN(spent) ? 0 : Math.max(0, spent);
          }),
        strokeWidth: 2,
      },
    ],
  };

  console.log("📈 LineChart Data:", lineData);

  const handleAddCategory = async () => {
    if (!catName.trim()) {
      Alert.alert("Erreur", "Le nom de la catégorie est obligatoire");
      return;
    }

    if (catBudget && isNaN(Number(catBudget))) {
      Alert.alert("Erreur", "Le budget doit être un nombre");
      return;
    }

    // Valider l'icône - seulement alphanumériques et tirets
    if (catIcon && !/^[a-z0-9\-]+$/i.test(catIcon.trim())) {
      Alert.alert(
        "Icône invalide",
        "L'icône doit être un nom valide (ex: briefcase, food-apple, home)\n\nNe pas utiliser d'emojis ou caractères spéciaux"
      );
      return;
    }

    try {
      const payload = {
        name: catName.trim(),
        color: catColor,
        budget: catBudget ? Number(catBudget) : 0,
        icon: catIcon?.trim() || "briefcase", // Default icon
      };
      console.log("📤 Envoi de la catégorie:", payload);
      
      await addCategory(payload);
      
      console.log("✅ Catégorie ajoutée avec succès");
      
      // Reset form BEFORE closing modal
      setCatName("");
      setCatColor("#F9C0D3");
      setCatBudget("");
      setCatIcon("briefcase");
      
      // Close modal
      setModalVisible(false);
      
      // Notify statistics hook AFTER modal is closed
      triggerRefresh();
      
      // Show success alert AFTER modal is closed
      Alert.alert("✅ Succès", "Catégorie ajoutée avec succès");
    } catch (error: any) {
      console.error("❌ Erreur lors de l'ajout:", error);
      const errorMsg = error?.response?.data?.message || error?.message || "Impossible d'ajouter la catégorie";
      // Show error even if modal is open, but close it after
      Alert.alert("❌ Erreur", errorMsg);
      setModalVisible(false);
    }
  };

  const handleAddBudget = async () => {
    // 1. Validate month format (YYYY-MM)
    const monthRegex = /^\d{4}-\d{2}$/;
    if (!budgetMonth.trim()) {
      Alert.alert("Erreur", "Le mois est obligatoire (format: YYYY-MM)");
      return;
    }
    
    if (!monthRegex.test(budgetMonth.trim())) {
      Alert.alert(
        "❌ Format invalide",
        "Utilisez le format YYYY-MM\n\nExemples:\n• 2026-01 (janvier)\n• 2026-02 (février)\n• 2026-12 (décembre)"
      );
      return;
    }

    // 2. Validate amount
    if (!budgetAmount || isNaN(Number(budgetAmount))) {
      Alert.alert("Erreur", "Le montant doit être un nombre");
      return;
    }

    try {
      const payload = {
        month: budgetMonth.trim(),
        amount: Number(budgetAmount),
      };
      console.log("📤 Envoi du budget:", JSON.stringify(payload, null, 2));
      
      // Ajouter le budget via l'API
      const response = await api.post("/budgets", payload);
      
      console.log("✅ Budget ajouté avec succès", response);
      Alert.alert("✅ Succès", "Budget ajouté avec succès");

      setBudgetMonth("");
      setBudgetAmount("");
      setBudgetModalVisible(false);
      
      // Recharger les données
      await fetchAll();
    } catch (error: any) {
      console.error("❌ Erreur lors de l'ajout du budget:", error);
      const errorMsg = error?.response?.data?.message || error?.message || "Impossible d'ajouter le budget";
      Alert.alert("❌ Erreur", errorMsg);
    }
  };

  const renderCategoryItem = ({ item }: { item: any }) => {
    const iconName = (CATEGORY_ICONS[item.name] || "briefcase") as any;
    const totalAmount = Number(item.total || 0);
    const budgetAmount = Number(item.budget || 0);
    const progress = budgetAmount > 0 ? totalAmount / budgetAmount : 0;
    return (
      <View style={[styles.catCard, { backgroundColor: item.color || "#F9C0D3" }]}>
        <MaterialCommunityIcons name={iconName} size={28} color="#fff" />
        <Text style={styles.catName}>{item.name}</Text>
        {budgetAmount > 0 ? (
          <Progress.Bar
            progress={progress > 1 ? 1 : progress}
            width={null}
            height={10}
            color="#fff"
            unfilledColor="rgba(255,255,255,0.4)"
            borderWidth={0}
            style={{ marginTop: 6 }}
          />
        ) : (
          <Text style={styles.catBudgetText}>Pas de budget</Text>
        )}
        <Text style={styles.catSpentText}>{totalAmount.toFixed(2)} € / {budgetAmount > 0 ? budgetAmount.toFixed(2) : "-"} €</Text>
      </View>
    );
  };

  const renderHiddenItem = (data: any, rowMap: any) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backBtn, { backgroundColor: "#f44336" }]}
        onPress={() => deleteCategory(data.item.id)}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>Supprimer</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 🌸 Improved Header with Rose Bébé Theme */}
      <View style={styles.headerFixed}>
        <TouchableOpacity style={styles.headerIconBtn} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={THEME.COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Budget</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "overview" && styles.tabActive]}
          onPress={() => setActiveTab("overview")}
        >
          <Text style={[styles.tabText, activeTab === "overview" && styles.tabTextActive]}>Vue</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "categories" && styles.tabActive]}
          onPress={() => setActiveTab("categories")}
        >
          <Text style={[styles.tabText, activeTab === "categories" && styles.tabTextActive]}>Catégories</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={{ textAlign: "center", marginTop: 40 }}>Chargement...</Text>
      ) : activeTab === "overview" ? (
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Bouton Ajouter Budget */}
          <TouchableOpacity 
            style={styles.addBudgetBtn} 
            onPress={() => setBudgetModalVisible(true)}
          >
            <MaterialCommunityIcons name="plus" size={20} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "700", marginLeft: 8 }}>Ajouter un budget</Text>
          </TouchableOpacity>

          {/* PieChart */}
          <View style={styles.chartCard}>
            <Text style={styles.sectionTitle}>Répartition par catégorie</Text>
            {loading ? (
              <Text style={styles.emptyText}>Chargement...</Text>
            ) : pieData && pieData.length > 0 ? (
              <PieChart
                data={pieData}
                width={screenWidth - 40}
                height={200}
                chartConfig={{
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  color: (opacity = 1) => `rgba(247,140,160,${opacity})`,
                }}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            ) : (
              <View style={{ paddingVertical: 20 }}>
                <Text style={styles.emptyText}>
                  {categories.length === 0 
                    ? "Créez une catégorie pour commencer" 
                    : "Enregistrez des dépenses pour voir la répartition"}
                </Text>
              </View>
            )}
          </View>

          {/* LineChart */}
          <View style={styles.chartCard}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
              <Text style={styles.sectionTitle}>Évolution {filter}</Text>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity onPress={() => setFilter("month")}>
                  <Text style={[styles.filterText, filter === "month" && styles.filterActive]}>Mois</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFilter("week")}>
                  <Text style={[styles.filterText, filter === "week" && styles.filterActive, { marginLeft: 10 }]}>Semaine</Text>
                </TouchableOpacity>
              </View>
            </View>

            {lineData && lineData.datasets && lineData.datasets[0] && lineData.datasets[0].data && lineData.datasets[0].data.length > 0 ? (
              <LineChart
                data={lineData}
                width={screenWidth - 40}
                height={200}
                chartConfig={{
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  color: (opacity = 1) => `rgba(247,140,160,${opacity})`,
                  labelColor: () => THEME.COLORS.grayDark,
                }}
                bezier
                style={{ borderRadius: 12 }}
              />
            ) : (
              <Text style={styles.emptyText}>Pas encore de budgets</Text>
            )}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.categoriesContainer}>
          {/* Liste swipeable des catégories */}
          <View style={{ marginBottom: 12, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 8 }}>
            <Text style={[styles.sectionTitle, { textAlign: "left" }]}>Catégories</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
              <Text style={styles.addBtnText}>Ajouter catégorie</Text>
            </TouchableOpacity>
          </View>

          <SwipeListView
            data={categories}
            renderItem={renderCategoryItem}
            renderHiddenItem={renderHiddenItem}
            rightOpenValue={-80}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingHorizontal: 8 }}
          />
        </View>
      )}

      {/* Modal Budget */}
      <Modal visible={budgetModalVisible} transparent animationType="slide" onRequestClose={() => setBudgetModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Budget mensuel global</Text>

            <TextInput
              placeholder="Mois (format: YYYY-MM, ex: 2026-01)"
              value={budgetMonth}
              onChangeText={setBudgetMonth}
              style={styles.input}
            />

            <TextInput
              placeholder="Montant"
              value={budgetAmount}
              onChangeText={setBudgetAmount}
              keyboardType="numeric"
              style={styles.input}
            />

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
              <TouchableOpacity style={styles.modalBtn} onPress={() => {
                setBudgetModalVisible(false);
                setBudgetMonth("");
                setBudgetAmount("");
              }}>
                <Text>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: THEME.COLORS.primary }]} onPress={handleAddBudget}>
                <Text style={{ color: "#fff" }}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Category */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Ajouter une catégorie</Text>

            <TextInput placeholder="Nom" value={catName} onChangeText={setCatName} style={styles.input} />

            <Text style={{ marginBottom: 12, fontWeight: "600" }}>Couleur :</Text>
            <View style={styles.colorPickerContainer}>
              <ColorPickerWrapper 
                value={catColor} 
                onComplete={(color) => {
                  console.log("📌 Couleur sélectionnée:", color.hex);
                  setCatColor(color.hex);
                }}
              />
            </View>

            <TextInput
              placeholder="Budget (optionnel)"
              value={catBudget}
              onChangeText={setCatBudget}
              keyboardType="numeric"
              style={styles.input}
            />

            <TextInput
              placeholder="Icône (ex: briefcase, home, food-apple)"
              value={catIcon}
              onChangeText={setCatIcon}
              style={styles.input}
            />

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
              <TouchableOpacity style={styles.modalBtn} onPress={() => setModalVisible(false)}>
                <Text>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: THEME.COLORS.primary }]} onPress={handleAddCategory}>
                <Text style={{ color: "#fff" }}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.COLORS.primaryLight },
  headerFixed: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: THEME.COLORS.primary,
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0,
  },
  headerIconBtn: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: { fontSize: 28, fontWeight: "800", color: THEME.COLORS.white },

  tabRow: { flexDirection: "row", backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: THEME.COLORS.primaryLight },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: "center" },
  tabActive: { borderBottomWidth: 3, borderBottomColor: THEME.COLORS.primary },
  tabText: { color: "#999", fontWeight: "600" },
  tabTextActive: { color: THEME.COLORS.primary, fontWeight: "700" },

  scroll: { padding: 16, paddingBottom: 100 },
  categoriesContainer: { flex: 1, paddingTop: 16 },
  chartCard: { backgroundColor: "#fff", borderRadius: 12, padding: 12, marginBottom: 12 },
  sectionTitle: { fontWeight: "700", color: THEME.COLORS.grayDark, textAlign: "center", marginBottom: 6 },
  emptyText: { textAlign: "center", color: "#999", marginVertical: 30 },

  addBtn: { backgroundColor: THEME.COLORS.pinkDark, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10 },
  addBtnText: { color: "#fff", fontWeight: "700" },
  addBudgetBtn: { backgroundColor: THEME.COLORS.primary, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10, marginBottom: 12, flexDirection: "row", alignItems: "center", justifyContent: "center" },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "center", padding: 16 },
  modalBox: { backgroundColor: "#fff", borderRadius: 12, padding: 16 },
  modalTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12, color: THEME.COLORS.pinkDark },
  input: { borderWidth: 1, borderColor: "#eee", borderRadius: 10, padding: 10, marginBottom: 10 },
  modalBtn: { padding: 12, borderRadius: 8, alignItems: "center", minWidth: 120, backgroundColor: "#fff", borderWidth: 1, borderColor: "#eee" },
  
  // Category select

  filterText: { color: THEME.COLORS.grayDark, fontWeight: "600" },
  filterActive: { color: THEME.COLORS.primary },

  // Category card
  catCard: { borderRadius: 12, padding: 12, marginBottom: 12 },
  catName: { color: "#fff", fontWeight: "700", fontSize: 16, marginTop: 4 },
  catBudgetText: { color: "#fff", fontSize: 12, marginTop: 4 },
  catSpentText: { color: "#fff", fontSize: 12, marginTop: 2 },

  // Swipe
  rowBack: {
    alignItems: "center",
    backgroundColor: "#DDD",
    flex: 1,
    marginBottom: 12,
    borderRadius: 12,
    justifyContent: "flex-end",
    paddingRight: 10,
  },
  backBtn: {
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    borderRadius: 12,
  },
  colorPickerContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    minHeight: 250,
    pointerEvents: "auto",
  },
  colorGridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
    paddingHorizontal: 2,
    justifyContent: "space-between",
  },
  colorOption: {
    width: "18%",
    aspectRatio: 1,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  colorOptionSelected: {
    borderColor: "#000",
    borderWidth: 3,
  },
});
