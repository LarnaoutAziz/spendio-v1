import { useState } from 'react';
import { api } from "../services/api";

interface ChangePasswordPayload {
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordResponse {
  message: string;
}

export const useChangePasswordMutation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const mutate = async (payload: ChangePasswordPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("📝 Données envoyées :", payload);

      const response = await api.post<ChangePasswordResponse>("/auth/change-password", payload);

      console.log("✅ Mot de passe modifié avec succès");
      return response.data;
    } catch (err: any) {
      console.error(
        "❌ Erreur du changement :",
        err?.response?.data?.message || err.message
      );
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error };
};
