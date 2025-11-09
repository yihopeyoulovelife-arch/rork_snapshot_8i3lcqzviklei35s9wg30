import { Stack, router } from "expo-router";
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, Check } from "lucide-react-native";
import { useState } from "react";
import { useTracker } from "@/contexts/TrackerContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeBuilderScreen() {
  const insets = useSafeAreaInsets();
  const { data, setCustomTheme } = useTracker();
  const { setTheme } = useTheme();
  
  const [themeName, setThemeName] = useState<string>(data.customTheme?.name || "My Theme");
  const [colors, setColors] = useState({
    background: data.customTheme?.colors.background || "#000000",
    surface: data.customTheme?.colors.surface || "#0a0a0a",
    surfaceSecondary: data.customTheme?.colors.surfaceSecondary || "#1a1a1a",
    text: data.customTheme?.colors.text || "#ffffff",
    textSecondary: data.customTheme?.colors.textSecondary || "#666666",
    primary: data.customTheme?.colors.primary || "#ffffff",
    primaryText: data.customTheme?.colors.primaryText || "#000000",
    border: data.customTheme?.colors.border || "#1a1a1a",
    success: data.customTheme?.colors.success || "#4ade80",
    error: data.customTheme?.colors.error || "#f87171",
    warning: data.customTheme?.colors.warning || "#fbbf24",
  });

  const colorFields = [
    { key: "background", label: "Background", description: "Main background color" },
    { key: "surface", label: "Surface", description: "Card and surface background" },
    { key: "surfaceSecondary", label: "Surface Secondary", description: "Secondary surface elements" },
    { key: "text", label: "Text", description: "Primary text color" },
    { key: "textSecondary", label: "Text Secondary", description: "Secondary text color" },
    { key: "primary", label: "Primary", description: "Primary accent color" },
    { key: "primaryText", label: "Primary Text", description: "Text on primary color" },
    { key: "border", label: "Border", description: "Border and divider color" },
    { key: "success", label: "Success", description: "Success state color" },
    { key: "error", label: "Error", description: "Error state color" },
    { key: "warning", label: "Warning", description: "Warning state color" },
  ];

  const handleSave = () => {
    setCustomTheme({
      name: themeName,
      colors,
    });
    setTheme('custom');
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft color="#ffffff" size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>Theme Builder</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Check color="#4ade80" size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Theme Name</Text>
            <TextInput
              style={styles.input}
              value={themeName}
              onChangeText={setThemeName}
              placeholder="Enter theme name"
              placeholderTextColor="#666666"
            />
          </View>

          <View style={[styles.preview, { backgroundColor: colors.background }]}>
            <View style={[styles.previewCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.previewTitle, { color: colors.text }]}>Preview</Text>
              <Text style={[styles.previewSubtitle, { color: colors.textSecondary }]}>
                This is how your theme will look
              </Text>
              <View style={[styles.previewButton, { backgroundColor: colors.primary }]}>
                <Text style={[styles.previewButtonText, { color: colors.primaryText }]}>
                  Primary Button
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Colors</Text>
            {colorFields.map((field) => (
              <View key={field.key} style={styles.colorField}>
                <View style={styles.colorFieldHeader}>
                  <View style={styles.colorFieldInfo}>
                    <Text style={styles.colorFieldLabel}>{field.label}</Text>
                    <Text style={styles.colorFieldDescription}>{field.description}</Text>
                  </View>
                  <View
                    style={[styles.colorPreview, { backgroundColor: colors[field.key as keyof typeof colors] }]}
                  />
                </View>
                <TextInput
                  style={styles.colorInput}
                  value={colors[field.key as keyof typeof colors]}
                  onChangeText={(text) =>
                    setColors({ ...colors, [field.key]: text })
                  }
                  placeholder="#000000"
                  placeholderTextColor="#666666"
                  autoCapitalize="none"
                />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#ffffff",
    flex: 1,
    textAlign: "center",
  },
  saveButton: {
    padding: 4,
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
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#ffffff",
  },
  input: {
    backgroundColor: "#0a0a0a",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "#1a1a1a",
  },
  preview: {
    borderRadius: 16,
    padding: 20,
    minHeight: 200,
  },
  previewCard: {
    borderRadius: 12,
    padding: 20,
    gap: 12,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
  },
  previewSubtitle: {
    fontSize: 14,
  },
  previewButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  previewButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
  },
  colorField: {
    backgroundColor: "#0a0a0a",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  colorFieldHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  colorFieldInfo: {
    flex: 1,
  },
  colorFieldLabel: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#ffffff",
    marginBottom: 4,
  },
  colorFieldDescription: {
    fontSize: 13,
    color: "#666666",
  },
  colorPreview: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  colorInput: {
    backgroundColor: "#000000",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#ffffff",
    fontFamily: "monospace" as const,
  },
});
