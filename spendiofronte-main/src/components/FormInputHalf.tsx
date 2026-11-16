import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { COLORS } from "../styles/colors";

interface FormInputHalfProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  error?: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

export const FormInputHalf = ({
  label,
  value,
  onChangeText,
  placeholder,
  error = "",
  autoCapitalize = "none",
}: FormInputHalfProps) => {
  return (
    <View style={styles.inputHalfContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, styles.inputHalf, error && styles.inputError]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.grayMedium}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize={autoCapitalize}
      />
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  inputHalfContainer: {
    width: "48%",
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.pinkDark,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    width: "100%",
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.pinkMedium,
  },
  inputHalf: {
    marginBottom: 0,
  },
  inputError: {
    borderColor: "#FF6B6B",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFE5E5",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#FF6B6B",
  },
  errorIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  errorText: {
    color: "#C41C3B",
    fontSize: 13,
    fontWeight: "700",
    flex: 1,
  },
});
