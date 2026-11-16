import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { api } from "../services/api";
import { ApiError, Budget, BudgetPayload, Category, CategoryPayload } from "../types/api";
import { useTransactionRefresh } from "../context/TransactionRefreshContext";

/**
 * Hook personnalisé pour gérer les budgets et catégories
 * Endpoints:
 * GET  /api/budgets         -> list budgets for user
 * POST /api/budgets         -> create/update budget
 * GET  /api/categories      -> list categories
 * POST /api/categories      -> create category
 * DELETE /api/categories/:id -> delete category
 */

export const useBudgetCategory = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Écouter les changements via le contexte
  const { refreshKey } = useTransactionRefresh();

  const handleError = (error: ApiError | any, action: string) => {
    const message = error?.response?.data?.message || error.message || "Erreur inconnue";
    console.error(`❌ ${action} error:`, message);
    console.error(`   Status: ${error?.response?.status}`);
    console.error(`   Data:`, error?.response?.data);
    console.error(`   Full error:`, error);
    setError(message);
    Alert.alert("Erreur", message);
  };

  const fetchAll = useCallback(async () => {
    console.log(`📊 [BUDGETS] Récupération des budgets et catégories...`);
    setLoading(true);
    setError(null);

    try {
      const [budgetResult, categoryResult] = await Promise.allSettled([
        api.get<Budget[]>("/budgets"),
        api.get<Category[]>("/categories"),
      ]);

      if (budgetResult.status === "fulfilled") {
        const budgetsData = Array.isArray(budgetResult.value.data)
          ? budgetResult.value.data.map((budget: any) => ({
              ...budget,
              spent: Number(budget.spent || 0),
              total: Number(budget.total || 0),
            }))
          : [];
        setBudgets(budgetsData);
      } else {
        setBudgets([]);
        handleError(budgetResult.reason, "useBudgetCategory.fetchBudgets");
      }

      if (categoryResult.status === "fulfilled") {
        const categoriesData = Array.isArray(categoryResult.value.data)
          ? categoryResult.value.data.map((category: any) => ({
              ...category,
              total: Number(category.total || 0),
              budget: Number(category.budget || 0),
              count: Number(category.count || 0),
            }))
          : [];
        setCategories(categoriesData);
      } else {
        setCategories([]);
        handleError(categoryResult.reason, "useBudgetCategory.fetchCategories");
      }

      console.log(`✅ [BUDGETS] Données disponibles mises à jour`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll, refreshKey]);

  const refresh = async () => {
    try {
      setRefreshing(true);
      setError(null);
      await fetchAll();
    } finally {
      setRefreshing(false);
    }
  };

  const addCategory = async (payload: CategoryPayload) => {
    try {
      setError(null);
      const response = await api.post<Category>("/categories", payload);
      console.log("✅ Catégorie créée:", response.data);
      
      // Re-fetch après la création, mais ne pas crash si ça fail
      try {
        await fetchAll();
      } catch (fetchError) {
        console.warn("⚠️ Erreur lors du refresh après création de catégorie:", fetchError);
        // Ne pas fail la création si le refresh échoue
      }
    } catch (error: any) {
      console.error("❌ Erreur addCategory complète:", error);
      handleError(error, "addCategory");
      throw error; // Re-throw pour le composant
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      setError(null);
      await api.delete(`/categories/${id}`);
      await fetchAll();
    } catch (error: any) {
      handleError(error, "deleteCategory");
    }
  };

  const saveBudget = async (payload: BudgetPayload) => {
    try {
      setError(null);
      await api.post<Budget>("/budgets", payload);
      await fetchAll();
    } catch (error: any) {
      handleError(error, "saveBudget");
    }
  };

  return {
    budgets,
    categories,
    loading,
    refreshing,
    error,
    fetchAll,
    refresh,
    addCategory,
    deleteCategory,
    saveBudget,
  };
};
