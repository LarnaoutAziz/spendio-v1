import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { THEME } from "../../../src/styles/theme";

export default function ProfileLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        gestureEnabled: true,
        gestureDirection: "horizontal",
        headerStyle: {
          backgroundColor: "#fff",
        },
        headerTintColor: THEME.COLORS.pinkMedium,
        headerTitleStyle: {
          fontWeight: "600",
        },
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} style={{ paddingLeft: 16 }}>
            <Ionicons name="arrow-back" size={24} color={THEME.COLORS.pinkMedium} />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          title: "Profil",
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="editProfile" 
        options={{
          title: "Modifier le profil",
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="changePassword" 
        options={{
          title: "Changer le mot de passe",
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="about" 
        options={{
          title: "À propos",
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="help" 
        options={{
          title: "Aide",
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="exportData" 
        options={{
          title: "Exporter les données",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
