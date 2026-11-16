import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { COLORS } from "../styles/colors";

interface CustomAlertProps {
  type: "success" | "error" | "info";
  title: string;
  message: string;
  visible: boolean;
  onClose: () => void;
  duration?: number;
}

const { width } = Dimensions.get("window");

export const CustomAlert = ({
  type,
  title,
  message,
  visible,
  onClose,
  duration = 3000,
}: CustomAlertProps) => {
  const slideAnim = React.useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onClose());
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, slideAnim, onClose, duration]);

  if (!visible) return null;

  const getAlertStyle = () => {
    switch (type) {
      case "success":
        return { backgroundColor: "#4CAF50", icon: "✓" };
      case "error":
        return { backgroundColor: "#FF6B6B", icon: "✕" };
      case "info":
        return { backgroundColor: COLORS.pinkDark, icon: "ⓘ" };
      default:
        return { backgroundColor: COLORS.pinkDark, icon: "ⓘ" };
    }
  };

  const alertStyle = getAlertStyle();

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={[styles.alert, { backgroundColor: alertStyle.backgroundColor }]}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{alertStyle.icon}</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  alert: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  title: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 4,
  },
  message: {
    color: "#fff",
    fontSize: 13,
    opacity: 0.9,
    lineHeight: 18,
  },
});
