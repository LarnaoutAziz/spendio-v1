import React, { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  Text,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
// ✅ Chemins corrects vers src/
import { COLORS } from "../../src/styles/colors";
import { CustomAlert } from "../../src/components/CustomAlert";
import { AuthButton } from "../../src/components/AuthButton";
import { FormInput } from "../../src/components/FormInput";
import { FormLink } from "../../src/components/FormLink";
import { AnimatedLogo } from "../../src/components/AnimatedLogo";
import { AnimatedTagline } from "../../src/components/AnimatedTagline";
import { api } from "../../src/services/api";
import { useAuth } from "../../src/context/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [alert, setAlert] = useState({
    type: "" as "error" | "success" | "info",
    title: "",
    message: "",
    visible: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /** 🌟 Connexion + enregistrement token & user **/
  const handleLogin = async () => {
    try {
      if (!formData.email || !formData.password) {
        setAlert({
          type: "error",
          title: "Champs manquants",
          message: "Veuillez remplir tous les champs.",
          visible: true,
        });
        return;
      }

      setLoading(true);

      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = response.data as { token: string; user: any };

      // ✅ Sauvegarde des infos utilisateur
      await AsyncStorage.setItem("authToken", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      setAlert({
        type: "success",
        title: "Connexion réussie 🎉",
        message: `Bienvenue ${user.name}`,
        visible: true,
      });

      // 🧭 Redirection vers les onglets après une courte pause
      setTimeout(() => {
        router.replace("/drawer/(tabs)");
      }, 1000);
    } catch (error: any) {
      console.error("Erreur de connexion :", error);
      setAlert({
        type: "error",
        title: "Erreur",
        message:
          error.response?.data?.message ||
          "Email ou mot de passe incorrect.",
        visible: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* 🔔 Alerte personnalisée */}
      <CustomAlert
        type={alert.type}
        title={alert.title}
        message={alert.message}
        visible={alert.visible}
        onClose={() => setAlert({ ...alert, visible: false })}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* === LOGO SPENDIO === */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/spendio.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* === TAGLINE === */}
        <View style={styles.taglineContainer}>
          <Text style={styles.taglineText}>Spend smart, rise high 📈</Text>
        </View>

        {/* === FORMULAIRE === */}
        <View style={styles.formContainer}>
          <FormInput
            label="Email"
            value={formData.email}
            onChangeText={(value: string) => handleChange("email", value)}
            placeholder="Email"
            keyboardType="email-address"
          />
          <FormInput
            label="Mot de passe"
            value={formData.password}
            onChangeText={(value: string) => handleChange("password", value)}
            placeholder="Mot de passe"
            secureTextEntry
          />

          <AuthButton
            title="Se connecter"
            onPress={handleLogin}
            loading={loading}
          />

          <FormLink
            text="Pas encore de compte ?"
            linkText="Créer un compte"
            onPress={() => router.push("/(auth)/registre")}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.pinkLight,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  logoContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  logoImage: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#8B4455",
    letterSpacing: 0.5,
  },
  taglineContainer: {
    marginBottom: 40,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  taglineText: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "500",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  formContainer: {
    width: "100%",
    maxWidth: 350,
    paddingHorizontal: 20,
  },
});
