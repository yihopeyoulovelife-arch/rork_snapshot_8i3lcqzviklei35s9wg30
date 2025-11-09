import { Stack, router } from "expo-router";
import { Settings as SettingsIcon, Palette, Bell, Moon, Sun, Flame, Waves, Plus } from "lucide-react-native";
import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeType } from "@/types/theme";
import { useTracker } from "@/contexts/TrackerContext";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { theme, themeType, setTheme } = useTheme();
  const { data } = useTracker();

  const themeOptions: { type: ThemeType; label: string; icon: any; color: string }[] = [
    { type: 'dark', label: 'Dark', icon: Moon, color: '#ffffff' },
    { type: 'light', label: 'Light', icon: Sun, color: '#000000' },
    { type: 'red', label: 'Red', icon: Flame, color: '#ef4444' },
    { type: 'blue', label: 'Blue', icon: Waves, color: '#3b82f6' },
    { type: 'custom', label: data.customTheme?.name || 'Custom', icon: Palette, color: data.customTheme?.colors.primary || '#ffffff' },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <View style={styles.titleRow}>
            <SettingsIcon color={theme.colors.text} size={28} />
            <Text style={[styles.title, { color: theme.colors.text }]}>Settings</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Palette color={theme.colors.text} size={20} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Theme</Text>
            </View>

            <View style={styles.themeGrid}>
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = themeType === option.type;
                return (
                  <TouchableOpacity
                    key={option.type}
                    style={[
                      styles.themeOption,
                      { backgroundColor: theme.colors.surface },
                      isSelected && { 
                        backgroundColor: theme.colors.primary,
                        borderWidth: 2,
                        borderColor: theme.colors.primary,
                      }
                    ]}
                    onPress={() => setTheme(option.type)}
                  >
                    <Icon 
                      color={isSelected ? theme.colors.primaryText : option.color} 
                      size={24} 
                    />
                    <Text style={[
                      styles.themeLabel,
                      { color: isSelected ? theme.colors.primaryText : theme.colors.text }
                    ]}>
                      {option.label}
                    </Text>
                    {isSelected && (
                      <View style={[styles.selectedBadge, { backgroundColor: theme.colors.primaryText }]}>
                        <Text style={[styles.selectedBadgeText, { color: theme.colors.primary }]}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={[styles.buildThemeButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
              onPress={() => router.push('/theme-builder' as any)}
            >
              <Plus color={theme.colors.text} size={20} />
              <Text style={[styles.buildThemeButtonText, { color: theme.colors.text }]}>Build Custom Theme</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Bell color={theme.colors.text} size={20} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Notifications</Text>
            </View>

            <View style={[styles.settingItem, { backgroundColor: theme.colors.surface }]}>
              <View>
                <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Daily Reminders</Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                  Get reminded to track your progress
                </Text>
              </View>
            </View>

            <View style={[styles.settingItem, { backgroundColor: theme.colors.surface }]}>
              <View>
                <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Focus Mode Alerts</Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                  Notifications when focus session ends
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.aboutText, { color: theme.colors.textSecondary }]}>
              Fitness Tracker v1.0.0
            </Text>
            <Text style={[styles.aboutText, { color: theme.colors.textSecondary }]}>
              Track your fitness journey with ease
            </Text>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 24,
    paddingBottom: 40,
  },
  section: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
  },
  themeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  themeOption: {
    width: "48%",
    aspectRatio: 1.5,
    borderRadius: 16,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    position: "relative",
  },
  themeLabel: {
    fontSize: 15,
    fontWeight: "600" as const,
  },
  selectedBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedBadgeText: {
    fontSize: 14,
    fontWeight: "700" as const,
  },
  settingItem: {
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
  settingDescription: {
    fontSize: 13,
    marginTop: 2,
  },
  aboutText: {
    fontSize: 13,
    textAlign: "center",
  },
  buildThemeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  buildThemeButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
  },
});
