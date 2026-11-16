import { useState } from "react";
import { Alert } from "react-native";
import { useEditProfileMutation } from "./useEditProfileMutation";
import { useRouter } from "expo-router";

export const useEditProfileForm = () => {
  // États du formulaire
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const { mutate, isLoading, error: mutationError } = useEditProfileMutation();
  const router = useRouter();

  // 🧩 Valider et soumettre
  const handleSubmit = async () => {
    setError("");

    // Vérifier qu'au moins un champ est rempli
    const hasFirstName = firstName.trim().length > 0;
    const hasLastName = lastName.trim().length > 0;
    const hasEmail = email.trim().length > 0;

    if (!hasFirstName && !hasLastName && !hasEmail) {
      setError("Veuillez remplir au moins un champ");
      return;
    }

    // Valider les champs
    if (hasFirstName && firstName.trim().length < 2) {
      setError("Le prénom doit contenir au moins 2 caractères");
      return;
    }

    if (hasLastName && lastName.trim().length < 2) {
      setError("Le nom doit contenir au moins 2 caractères");
      return;
    }

    if (hasEmail && !email.includes("@")) {
      setError("Email invalide");
      return;
    }

    // Construire le nom complet (en combinant prénom/nom si disponibles)
    let fullName = "";
    if (hasFirstName && hasLastName) fullName = `${firstName.trim()} ${lastName.trim()}`;
    else if (hasFirstName) fullName = firstName.trim();
    else if (hasLastName) fullName = lastName.trim();

    // Préparer les données à envoyer
    const payload: any = {};
    if (fullName) payload.name = fullName;
    if (hasEmail) payload.email = email.trim();

    // 📡 Envoyer au serveur
    try {
      await mutate(payload);
      Alert.alert("Succès", "Profil mis à jour avec succès", [
        {
          text: "OK",
          onPress: () => {
            setFirstName("");
            setLastName("");
            setEmail("");
            // ✅ Retour au profil
            router.back();
          },
        },
      ]);
    } catch (err: any) {
      setError(mutationError || err.response?.data?.message || "Une erreur s'est produite");
    }
  };

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    error,
    loading: isLoading,
    handleSubmit,
  };
};
