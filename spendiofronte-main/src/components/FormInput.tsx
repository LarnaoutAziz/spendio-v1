import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { THEME } from "../styles/theme";

const COLORS = THEME.COLORS;

interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  onFocus?: () => void;
}

export const FormInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  error = "",
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  onFocus,
}: FormInputProps) => {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.grayMedium}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
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
  inputGroup: {
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
