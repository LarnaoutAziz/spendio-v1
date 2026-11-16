import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../src/context/AuthContext";

// Composant Header du Menu
function DrawerHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.avatar}><Text style={styles.avatarText}>I</Text></View>
    </View>
  );
}

export default function DrawerLayout() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <Drawer
      screenOptions={{
        headerShown: false, // Cache le header du drawer pour laisser celui des Tabs
        drawerStyle: { width: 280, backgroundColor: "#FFF0F5" }, // Adaptez la couleur si besoin
        drawerActiveTintColor: "#FF69B4",
      }}
      drawerContent={(props: any) => (
        <View style={{ flex: 1 }}>
          <DrawerHeader />
          <View style={{ padding: 16 }}>
            {/* Lien vers l'Accueil (Tabs) */}
            <TouchableOpacity style={styles.row} onPress={() => { props.navigation.navigate("(tabs)", { screen: "index" }); props.navigation.closeDrawer(); }}>
              <MaterialCommunityIcons name="home" size={24} color="#FF69B4" />
              <Text style={styles.itemText}>Accueil</Text>
            </TouchableOpacity>

            {/* Lien vers Profil */}
            <TouchableOpacity style={styles.row} onPress={() => { props.navigation.navigate("profile", { screen: "profile" }); props.navigation.closeDrawer(); }}>
              <MaterialCommunityIcons name="account" size={24} color="#FF69B4" />
              <Text style={styles.itemText}>Profil</Text>
            </TouchableOpacity>
            
            <View style={styles.divider} />

            {/* Lien Déconnexion */}
            <TouchableOpacity style={styles.row} onPress={handleLogout}>
              <MaterialCommunityIcons name="logout" size={24} color="#E74C3C" />
              <Text style={[styles.itemText, { color: "#E74C3C" }]}>Déconnexion</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    >
      {/* Définition des écrans accessibles via le Drawer */}
      <Drawer.Screen name="(tabs)" options={{ title: "Accueil" }} />
      <Drawer.Screen name="profile" options={{ title: "Profil" }} />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  header: { padding: 24, backgroundColor: "#D81B60", alignItems: "center", paddingTop: 48 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#FFF", justifyContent: "center", alignItems: "center", marginBottom: 10 },
  avatarText: { fontSize: 24, fontWeight: "bold", color: "#D81B60" },
  name: { color: "#FFF", fontWeight: "bold", fontSize: 18 },
  email: { color: "#FFC1E3", fontSize: 14 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 12, gap: 12 },
  itemText: { fontSize: 16, color: "#333", fontWeight: "500" },
  divider: { height: 1, backgroundColor: "#EEE", marginVertical: 12 }
});