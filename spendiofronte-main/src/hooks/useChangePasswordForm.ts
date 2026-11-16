import { useState } from "react";
import { useChangePasswordMutation } from "./useChangePasswordMutation";
import { useRouter } from "expo-router";

export const useChangePasswordForm = () => {
  // États du formulaire
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const { mutate, isLoading, error: mutationError } = useChangePasswordMutation();
  const router = useRouter();

  // 🔐 Validation et soumission
  const handleSubmit = async () => {
    setError("");

    // Vérifications simples
    if (!password.trim() || !confirmPassword.trim()) {
      setError("Les deux champs sont obligatoires");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    // Envoi au serveur
    try {
      await mutate({ newPassword: password, confirmPassword });
      setPassword("");
      setConfirmPassword("");

      // ⏳ Retour au profil après 1.5 secondes
      setTimeout(() => router.back(), 1500);
    } catch (err: any) {
      setError(mutationError || err.response?.data?.message || "Une erreur s'est produite");
    }
  };

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    loading: isLoading,
    handleSubmit,
  };
};
