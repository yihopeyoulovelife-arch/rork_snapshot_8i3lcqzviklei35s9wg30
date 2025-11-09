import { CalendarHeader } from "@/components/CalendarHeader";
import { MonthCalendar } from "@/components/MonthCalendar";
import { GoalsSection } from "@/components/GoalsSection";
import { MealsSection } from "@/components/MealsSection";
import { NotesSection } from "@/components/NotesSection";
import { WeightSection } from "@/components/WeightSection";
import { FocusSection } from "@/components/FocusSection";
import { Snowfall } from "@/components/Snowfall";
import { useTracker } from "@/contexts/TrackerContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Stack } from "expo-router";
import { StyleSheet, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TrackerScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const {
    selectedDate,
    setSelectedDate,
    getDayEntry,
    toggleGoal,
    addMeal,
    deleteMeal,
    updateWeight,
    updateNotes,
    data,
  } = useTracker();

  const dayEntry = getDayEntry(selectedDate);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
        <Snowfall count={40} color={theme.colors.text} />
        <CalendarHeader selectedDate={selectedDate} onDateSelect={setSelectedDate} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <MonthCalendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />

          <FocusSection />

          <GoalsSection
            goals={dayEntry.goals}
            onToggle={(goalId) => toggleGoal(selectedDate, goalId)}
          />

          <WeightSection
            weight={dayEntry.weight?.weight}
            unit={data.weightUnit}
            onUpdate={(weight) => updateWeight(selectedDate, weight)}
          />

          <MealsSection
            meals={dayEntry.meals}
            onAdd={(meal) => addMeal(selectedDate, meal)}
            onDelete={(mealId) => deleteMeal(selectedDate, mealId)}
          />

          <NotesSection
            notes={dayEntry.notes}
            onUpdate={(notes) => updateNotes(selectedDate, notes)}
          />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
});
