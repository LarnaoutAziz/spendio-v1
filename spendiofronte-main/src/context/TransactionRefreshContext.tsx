import React, { createContext, useContext, useCallback, useState } from "react";

/**
 * TransactionRefreshContext
 * Notifie les hooks useStatistics et useTransactions quand les données changent
 */

interface TransactionRefreshContextType {
  refreshKey: number;
  triggerRefresh: () => void;
}

const TransactionRefreshContext = createContext<TransactionRefreshContextType | undefined>(undefined);

export const TransactionRefreshProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const triggerRefresh = useCallback(() => {
    console.log("🔄 Triggering statistics refresh...");
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <TransactionRefreshContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </TransactionRefreshContext.Provider>
  );
};

export const useTransactionRefresh = () => {
  const context = useContext(TransactionRefreshContext);
  if (!context) {
    throw new Error("useTransactionRefresh must be used within TransactionRefreshProvider");
  }
  return context;
};
