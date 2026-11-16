export interface Transaction {
  id: number;
  category_name: string;
  amount: number | string;
  date: string;
  type: "expense" | "income";
  description?: string;
}

export interface TransactionPayload {
  category_name: string;
  amount: number | string;
  date: string;
  type: "expense" | "income";
  description?: string;
}

export interface Budget {
  id: string | number;
  month: string;
  spent: number;
  limit?: number;
  history?: { day: string; spent: number }[];
}

export interface BudgetPayload {
  month: string;
  amount: number;
}

export interface Category {
  id: string | number;
  name: string;
  color: string;
  budget?: number;
  icon?: string;
  total?: number;
}

export interface CategoryPayload {
  name: string;
  color: string;
  budget?: number;
  icon?: string;
}

// ✅ Types d'authentification ajoutés
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
}
