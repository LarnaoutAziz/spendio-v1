import React, { useEffect, useRef } from "react";
import { Text, Animated, StyleSheet } from "react-native";
import { THEME } from "../styles/theme";

const COLORS = THEME.COLORS;

interface AnimatedTaglineProps {
  text: string;
  variant?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
}

export const AnimatedTagline = ({
  text,
  variant = "primary",
  size = "medium",
}: AnimatedTaglineProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const getStyleVariant = () => {
    if (variant === "secondary") {
      return styles.taglineSecondary;
    }
    return styles.taglinePrimary;
  };

  const getSizeStyle = () => {
    switch (size) {
      case "small":
        return styles.textSmall;
      case "large":
        return styles.textLarge;
      default:
        return styles.textMedium;
    }
  };

  return (
    <Animated.Text
      style={[
        styles.tagline,
        getStyleVariant(),
        getSizeStyle(),
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {text}
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  tagline: {
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 24,
  },
  taglinePrimary: {
    color: COLORS.pinkDark,
  },
  taglineSecondary: {
    color: COLORS.grayDark,
  },
  textSmall: {
    fontSize: 12,
  },
  textMedium: {
    fontSize: 14,
  },
  textLarge: {
    fontSize: 16,
  },
});
