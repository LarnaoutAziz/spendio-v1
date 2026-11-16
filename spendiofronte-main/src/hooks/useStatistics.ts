// src/hooks/useStatistics.ts
import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTransactionRefresh } from "../context/TransactionRefreshContext";

/**
 * useStatistics - FIXED VERSION
 * - Utilise /statistics/month/:month pour obtenir les VRAIES dépenses/revenus
 * - Écoute les changements via TransactionRefreshContext
 * - Recalcule automatiquement quand une transaction change
 */

export const useStatistics = (monthIso: string) => {
  const { user } = useAuth();
  const { refreshKey } = useTransactionRefresh();
  const [loading, setLoading] = useState<boolean>(true);
  const [summary, setSummary] = useState<any>({
    budget: 0,
    expenses: 0,
    remaining: 0,
    percentage: 0,
    categories: [],
    revenues: 0,
  });
  const [history, setHistory] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    if (!user?.id) {
      console.log("⏳ Waiting for user...");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log("📊 Fetching statistics for user:", user.id, "month:", monthIso);

      // ✅ FIXED: Utilise /statistics/month/:month pour obtenir les VRAIES données
      let monthResp;
      let monthly: any = {};
      
      try {
        monthResp = await api.get<any>(`/statistics/month/${monthIso}`);
        monthly = monthResp.data || {};
        console.log("📦 Monthly summary (from /statistics):", monthly);
      } catch (err: any) {
        if (err?.response?.status === 404) {
          console.warn("⚠️ No statistics found for this month, using default values.");
          monthly = {
            month: monthIso,
            budget: 0,
            expenses: 0,
            revenues: 0,
            remaining: 0,
            percentage: 0,
            categories: [],
          };
        } else {
          throw err;
        }
      }

      // 2) Get budget history for bar chart (last 6 months)
      let hist: any[] = [];
      try {
        const histResp = await api.get<any>(`/statistics/history`);
        hist = histResp.data || [];
        console.log("📦 History:", hist);
      } catch (err: any) {
        console.warn("⚠️ Could not fetch history:", err.message);
        hist = [];
      }

      // 3) Get categories with their totals (backend returns aggregated data)
      const categoriesData = monthly.categories || [];
      console.log("💰 Categories:", categoriesData);

      // Normalize categories shape: ensure { id?, name, color, total, count, budget? }
      const normalizedCategories = (categoriesData || []).map((c: any) => ({
        id: c.id ?? c.category ?? null,
        name: c.name ?? c.category ?? "Autres",
        color: c.color ?? c.colour ?? "#F9C0D3",
        icon: c.icon ?? "tag",
        total: Number(c.total ?? 0),
        count: Number(c.count ?? 0),
        budget: Number(c.budget ?? 0),
      }));

      // ✅ FIXED: Use actual values from backend, not calculated ones
      setSummary({
        budget: Number(monthly.budget ?? 0),
        expenses: Number(monthly.expenses ?? 0),
        remaining: Number(monthly.remaining ?? 0),
        percentage: Number(monthly.percentage ?? 0),
        categories: normalizedCategories,
        revenues: Number(monthly.revenues ?? 0),
      });

      // Format history for BarChart: { month, budget, expenses, revenues }
      const histFormatted = (hist || []).map((h: any) => ({
        month: h.month || "N/A",
        budget: Number(h.budget ?? 0),
        expenses: Number(h.expenses ?? 0),
        revenues: Number(h.revenues ?? 0),
      }));

      setHistory(histFormatted);
      setCategories(normalizedCategories);

      console.log("✅ Statistics loaded successfully");
    } catch (err: any) {
      console.error("❌ useStatistics.fetchAll error:", err);
      setError(err?.response?.data?.message ?? err.message ?? "Erreur lors du chargement des statistiques");
    } finally {
      setLoading(false);
    }
  }, [user?.id, monthIso]);

  // ✅ FIXED: Re-fetch when transaction changes (refreshKey is updated)
  useEffect(() => {
    fetchAll();
  }, [fetchAll, refreshKey]);

  return {
    loading,
    summary,
    history,
    categories,
    error,
    refetch: fetchAll,
  };
};
