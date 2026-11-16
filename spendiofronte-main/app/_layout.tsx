import { Stack } from "expo-router";
import React from "react";
import { AuthProvider } from "../src/context/AuthContext";
import { DarkModeProvider } from "../src/context/DarkModeContext";
import { SettingsProvider } from "../src/context/SettingsContext";
import { TransactionRefreshProvider } from "../src/context/TransactionRefreshContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <TransactionRefreshProvider>
        <DarkModeProvider>
          <SettingsProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="drawer" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
            </Stack>
          </SettingsProvider>
        </DarkModeProvider>
      </TransactionRefreshProvider>
    </AuthProvider>
  );
}