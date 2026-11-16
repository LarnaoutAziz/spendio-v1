import React, { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
// ✅ Chemins corrects vers src/
import { COLORS } from "../../src/styles/colors";
import { CustomAlert } from "../../src/components/CustomAlert";
import { AuthButton } from "../../src/components/AuthButton";
import { FormInput } from "../../src/components/FormInput";
import { FormInputHalf } from "../../src/components/FormInputHalf";
import { FormLink } from "../../src/components/FormLink";
import { AnimatedLogo } from "../../src/components/AnimatedLogo";
import { AnimatedTagline } from "../../src/components/AnimatedTagline";
import { api } from "../../src/services/api";
import { useAuth } from "../../src/context/AuthContext";

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

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

  const handleRegister = async () => {
    try {
      const { firstName, lastName, email, password } = formData;

      if (!firstName || !lastName || !email || !password) {
        setAlert({
          type: "error",
          title: "Champs manquants",
          message: "Veuillez remplir tous les champs.",
          visible: true,
        });
        return;
      }

      setLoading(true);

      // Utilise la fonction register de AuthContext
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      await register(fullName, email, password);

      setAlert({
        type: "success",
        title: "Compte créé 🎉",
        message: "Votre compte a été créé avec succès !",
        visible: true,
      });

      setTimeout(() => {
        router.replace("/(auth)/login");
      }, 1000);
    } catch (error: any) {
      console.error("Erreur d'inscription :", error);
      setAlert({
        type: "error",
        title: "Erreur",
        message:
          error.message ||
          "Une erreur est survenue. Veuillez réessayer.",
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

        <View style={styles.formContainer}>
          <View style={styles.rowInputs}>
            <FormInputHalf
              label="Prénom"
              value={formData.firstName}
              onChangeText={(value: string) => handleChange("firstName", value)}
              placeholder="Prénom"
              autoCapitalize="words"
            />
            <FormInputHalf
              label="Nom"
              value={formData.lastName}
              onChangeText={(value: string) => handleChange("lastName", value)}
              placeholder="Nom"
              autoCapitalize="words"
            />
          </View>

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
            title="S'inscrire"
            onPress={handleRegister}
            loading={loading}
          />

          <FormLink
            text="Déjà un compte ?"
            linkText="Se connecter"
            onPress={() => router.push("/(auth)/login")}
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
  rowInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
});
