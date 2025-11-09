import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TrackerProvider } from "@/contexts/TrackerContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import * as SystemUI from "expo-system-ui";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();
SystemUI.setBackgroundColorAsync("#000000");

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TrackerProvider>
          <GestureHandlerRootView>
            <StatusBar style="light" />
            <RootLayoutNav />
          </GestureHandlerRootView>
        </TrackerProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
