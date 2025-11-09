import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { ThemeType, themes, Theme } from "@/types/theme";
import { useTracker } from "@/contexts/TrackerContext";

const THEME_STORAGE_KEY = "app_theme";

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const queryClient = useQueryClient();

  const themeQuery = useQuery({
    queryKey: ["theme"],
    queryFn: async (): Promise<ThemeType> => {
      const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      return (stored as ThemeType) || "dark";
    },
  });

  const themeMutation = useMutation({
    mutationFn: async (newTheme: ThemeType) => {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      return newTheme;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["theme"], data);
    },
  });

  const { data: trackerData } = useTracker();
  
  const currentThemeType = themeQuery.data ?? "dark";
  let currentTheme: Theme = themes[currentThemeType];
  
  if (currentThemeType === 'custom' && trackerData.customTheme) {
    currentTheme = {
      type: 'custom',
      colors: trackerData.customTheme.colors,
    };
  }

  const { mutate: mutateTheme } = themeMutation;

  const setTheme = useCallback((theme: ThemeType) => {
    mutateTheme(theme);
  }, [mutateTheme]);

  return useMemo(() => ({
    theme: currentTheme,
    themeType: currentThemeType,
    setTheme,
    isLoading: themeQuery.isLoading,
  }), [currentTheme, currentThemeType, setTheme, themeQuery.isLoading]);
});
