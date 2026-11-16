import { useEffect, useState, useCallback, useContext } from "react";
import { Alert } from "react-native";
import { api } from "../services/api";
import { Transaction, TransactionPayload, ApiError } from "../types/api";
import { useTransactionRefresh } from "../context/TransactionRefreshContext";

/**
 * Hook personnalisé pour gérer les transactions
 * Endpoints:
 * GET  /api/transactions                -> list all transactions for user
 * GET  /api/transactions?category=:id   -> list transactions for a category
 * POST /api/transactions                -> create transaction
 * PUT  /api/transactions/:id            -> update transaction
 * DELETE /api/transactions/:id          -> delete transaction
 */

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Écouter les changements via le contexte
  const { refreshKey } = useTransactionRefresh();

  const handleError = (error: ApiError | any, action: string) => {
    const message = error?.response?.data?.message || error.message || "Erreur inconnue";
    console.error(`${action} error:`, message);
    setError(message);
    Alert.alert("Erreur", message);
  };

  const fetchTransactions = useCallback(async (categoryId?: number) => {
    try {
      setLoading(true);
      setError(null);
      const url = categoryId ? `/transactions?category=${categoryId}` : "/transactions";
      const response = await api.get<Transaction[]>(url);
      setTransactions(Array.isArray(response.data) ? response.data : []);
    } catch (error: any) {
      handleError(error, "fetchTransactions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions, refreshKey]);

  const addTransaction = async (payload: TransactionPayload) => {
    try {
      setError(null);
      await api.post<Transaction>("/transactions", payload);
      await fetchTransactions();
    } catch (error: any) {
      handleError(error, "addTransaction");
    }
  };

  const updateTransaction = async (id: number, payload: Partial<TransactionPayload>) => {
    try {
      setError(null);
      await api.put<Transaction>(`/transactions/${id}`, payload);
      await fetchTransactions();
    } catch (error: any) {
      handleError(error, "updateTransaction");
    }
  };

  const deleteTransaction = async (id: number) => {
    try {
      setError(null);
      await api.delete(`/transactions/${id}`);
      await fetchTransactions();
    } catch (error: any) {
      handleError(error, "deleteTransaction");
    }
  };

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
};
