import { Feather, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { THEME } from "../../../src/styles/theme"; // Import corrigé (3 niveaux)

const { width } = Dimensions.get("window");

function CustomTabBar({ state, descriptors, navigation }: any) {
  const order = ["index", "stats", "add", "activity", "budget"];

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {order.map((routeName) => {
          const route = state.routes.find((r: any) => r.name === routeName);
          if (!route) return <View key={routeName} style={{ width: 60 }} />;
          const isFocused = state.routes[state.index].name === routeName;

          const icon = (() => {
            switch (routeName) {
              case "index": return <Ionicons name="home-outline" size={22} color={isFocused ? THEME.COLORS.pinkMedium : "#9B9B9B"} />;
              case "stats": return <Feather name="bar-chart-2" size={22} color={isFocused ? THEME.COLORS.pinkMedium : "#9B9B9B"} />;
              case "activity": return <Ionicons name="list-outline" size={22} color={isFocused ? THEME.COLORS.pinkMedium : "#9B9B9B"} />;
              case "budget": return <Feather name="pie-chart" size={22} color={isFocused ? THEME.COLORS.pinkMedium : "#9B9B9B"} />;
              default: return null;
            }
          })();

          if (routeName === "add") {
            return (
              <View key="fab-placeholder" style={styles.fabWrapper}>
                <TouchableOpacity style={styles.fab} activeOpacity={0.9} onPress={() => navigation.navigate("add")}>
                  <Text style={styles.fabText}>＋</Text>
                </TouchableOpacity>
              </View>
            );
          }

          return (
            <TouchableOpacity key={routeName} onPress={() => navigation.navigate(route.name)} style={styles.tabItem}>
              {icon}
              <Text style={[styles.label, { color: isFocused ? THEME.COLORS.pinkMedium : "#9B9B9B" }]}>
                {routeName === "index" ? "Accueil" : routeName === "stats" ? "Stats" : routeName === "activity" ? "Activité" : "Budget"}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <CustomTabBar {...props} />} />;
}

const styles = StyleSheet.create({
  container: { position: "absolute", left: 12, right: 12, bottom: Platform.OS === "ios" ? 18 : 10, alignItems: "center", zIndex: 20 },
  tabBar: { width: width - 24, height: 72, borderRadius: 28, backgroundColor: THEME.COLORS.card || "#FFF", flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingHorizontal: 12, elevation: 8, borderWidth: 1, borderColor: "#F3E9EC" },
  tabItem: { alignItems: "center", justifyContent: "center", width: 56 },
  label: { fontSize: 11, marginTop: 4, fontWeight: "600" },
  fabWrapper: { width: 64, alignItems: "center", justifyContent: "center", marginTop: -22 },
  fab: { width: 64, height: 64, borderRadius: 32, backgroundColor: THEME.COLORS.pinkMedium, justifyContent: "center", alignItems: "center", elevation: 10 },
  fabText: { color: "#fff", fontSize: 32, fontWeight: "800" },
});