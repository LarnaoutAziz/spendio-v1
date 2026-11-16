// app/profile/editProfile.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { THEME } from "../../../src/styles/theme";
import { useEditProfileForm } from "../../../src/hooks/useEditProfileForm";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function EditProfileScreen() {
  const router = useRouter();

  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    error,
    loading,
    handleSubmit,
  } = useEditProfileForm();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <LinearGradient
        colors={[THEME.COLORS.pinkLight, THEME.COLORS.pinkLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
      >
        {/* 🔙 Bouton retour */}
        <TouchableOpacity style={styles.backButton} onPress={() => {
          try {
            router.back();
          } catch (err) {
            console.error('Navigation error:', err);
          }
        }}>
          <Ionicons name="arrow-back" size={24} color={THEME.COLORS.pinkMedium} />
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Modifier le profil</Text>

          <View style={styles.whiteCard}>
            <View style={styles.formContainer}>
              {/* 🧍‍♀️ Prénom */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Prénom</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Votre prénom"
                  placeholderTextColor="#999"
                  value={firstName}
                  onChangeText={setFirstName}
                  editable={!loading}
                />
              </View>

              {/* 🧍‍♂️ Nom */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nom</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Votre nom"
                  placeholderTextColor="#999"
                  value={lastName}
                  onChangeText={setLastName}
                  editable={!loading}
                />
              </View>

              {/* ✉️ Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="votre@email.com"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  editable={!loading}
                  keyboardType="email-address"
                />
              </View>

              {/* ⚠️ Message d'erreur */}
              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              {/* 💾 Bouton Enregistrer */}
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Enregistrement..." : "Enregistrer"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 30,
    left: 20,
    padding: 8,
    zIndex: 10,
  },
  title: {
    fontFamily: THEME.FONT.bold,
    fontSize: 26,
    color: THEME.COLORS.pinkDark,
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "700",
    letterSpacing: 0.5,
    alignSelf: "center",
    width: "100%",
  },
  whiteCard: {
    backgroundColor: THEME.COLORS.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    width: "100%",
    maxWidth: 400,
  },
  formContainer: {
    gap: 12,
  },
  inputGroup: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME.COLORS.pinkDark,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: THEME.COLORS.white,
    borderRadius: 15,
    width: "100%",
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.COLORS.pinkMedium,
    color: "#000",
    fontSize: 16,
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 14,
    marginTop: 12,
    textAlign: "center",
    fontWeight: "500",
  },
  button: {
    backgroundColor: THEME.COLORS.pinkMedium,
    padding: 16,
    borderRadius: 16,
    marginTop: 10,
    shadowColor: "#F76D90",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    width: "100%",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: THEME.COLORS.white,
    textAlign: "center",
    fontFamily: THEME.FONT.bold,
    fontSize: 16,
  },
});
