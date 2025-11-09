import { GoalsSection } from "@/components/GoalsSection";
import { GoalNotesSection } from "@/components/GoalNotesSection";
import { useTracker } from "@/contexts/TrackerContext";
import { Stack } from "expo-router";
import { TrendingUp } from "lucide-react-native";
import { StyleSheet, ScrollView, View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function GoalsScreen() {
  const insets = useSafeAreaInsets();
  const { recurringGoals, addRecurringGoal, deleteRecurringGoal, selectedDate, getDayEntry, updateGoalNotes } = useTracker();
  const dayEntry = getDayEntry(selectedDate);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <TrendingUp color="#ffffff" size={28} />
            <Text style={styles.title}>Daily Goals</Text>
          </View>
          <Text style={styles.subtitle}>
            Manage your recurring daily goals that appear every day
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <GoalsSection
            goals={recurringGoals.map((g) => ({ ...g, completed: false }))}
            onToggle={() => {}}
            onAddGoal={addRecurringGoal}
            onDeleteGoal={deleteRecurringGoal}
          />

          <GoalNotesSection
            notes={dayEntry.goalNotes || ""}
            onUpdate={(notes) => updateGoalNotes(selectedDate, notes)}
          />

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              These goals will appear on every day&apos;s tracker. Check them off daily to track your
              progress.
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
    backgroundColor: "#000000",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 15,
    color: "#666666",
    lineHeight: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  infoBox: {
    backgroundColor: "#0a0a0a",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1a1a1a",
  },
  infoText: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
});
