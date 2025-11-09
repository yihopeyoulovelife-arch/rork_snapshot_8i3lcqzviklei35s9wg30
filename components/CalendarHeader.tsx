import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";

interface CalendarHeaderProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function CalendarHeader({ selectedDate, onDateSelect }: CalendarHeaderProps) {
  const router = useRouter();
  const startDate = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  const goToPreviousWeek = () => {
    onDateSelect(addDays(selectedDate, -7));
  };

  const goToNextWeek = () => {
    onDateSelect(addDays(selectedDate, 7));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.monthText}>{format(selectedDate, "MMMM yyyy")}</Text>
        <View style={styles.navButtons}>
          <TouchableOpacity onPress={goToPreviousWeek} style={styles.navButton}>
            <ChevronLeft color="#ffffff" size={20} />
          </TouchableOpacity>
          <TouchableOpacity onPress={goToNextWeek} style={styles.navButton}>
            <ChevronRight color="#ffffff" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weekContainer}
      >
        {weekDays.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());

          return (
            <TouchableOpacity
              key={day.toISOString()}
              style={[
                styles.dayButton,
                isSelected && styles.dayButtonSelected,
                isToday && !isSelected && styles.dayButtonToday,
              ]}
              onPress={() => {
                onDateSelect(day);
                router.push('/daily-schedule');
              }}
              onLongPress={() => onDateSelect(day)}
            >
              <Text style={[styles.dayLabel, isSelected && styles.dayLabelSelected]}>
                {format(day, "EEE")}
              </Text>
              <Text style={[styles.dayNumber, isSelected && styles.dayNumberSelected]}>
                {format(day, "d")}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000000",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  monthText: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#ffffff",
  },
  navButtons: {
    flexDirection: "row",
    gap: 8,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
  },
  weekContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  dayButton: {
    width: 60,
    height: 70,
    borderRadius: 12,
    backgroundColor: "#0a0a0a",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  dayButtonSelected: {
    backgroundColor: "#ffffff",
  },
  dayButtonToday: {
    borderWidth: 1,
    borderColor: "#333333",
  },
  dayLabel: {
    fontSize: 12,
    color: "#666666",
    fontWeight: "500" as const,
  },
  dayLabelSelected: {
    color: "#000000",
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#ffffff",
  },
  dayNumberSelected: {
    color: "#000000",
  },
});
