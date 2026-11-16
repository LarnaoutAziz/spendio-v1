import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { THEME } from "../styles/theme";

interface FormLinkProps {
  text: string;
  linkText: string;
  onPress: () => void;
}

export const FormLink = ({ text, linkText, onPress }: FormLinkProps) => {
  return (
    <Text style={styles.linkText}>
      {text}{" "}
      <Text style={styles.link} onPress={onPress}>
        {linkText}
      </Text>
    </Text>
  );
};

const styles = StyleSheet.create({
  linkText: {
    marginTop: 30,
    color: THEME.COLORS.grayDark,
    textAlign: "center",
    fontSize: 14,
  },
  link: {
    color: THEME.COLORS.pinkDark,
    fontWeight: "bold",
  },
});
