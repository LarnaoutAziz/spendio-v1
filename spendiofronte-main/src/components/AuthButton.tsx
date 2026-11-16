import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { THEME } from "../styles/theme";

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export const AuthButton = ({ title, onPress, loading = false, disabled = false }: AuthButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.button, (loading || disabled) && styles.buttonDisabled]}
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: THEME.COLORS.pinkDark,
    paddingVertical: 15,
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: THEME.COLORS.grayMedium,
    opacity: 0.6,
  },
  buttonText: {
    color: THEME.COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});
