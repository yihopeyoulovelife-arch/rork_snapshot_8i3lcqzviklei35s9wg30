import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface MonthCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function MonthCalendar({ selectedDate, onDateSelect }: MonthCalendarProps) {
  const { theme } = useTheme();
  const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startDayOfWeek = monthStart.getDay();
  const emptyDays = Array(startDayOfWeek).fill(null);

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <ChevronLeft color={theme.colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.monthTitle, { color: theme.colors.text }]}>
          {format(currentMonth, "MMMM yyyy")}
        </Text>
        <TouchableOpacity onPress={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <ChevronRight color={theme.colors.text} size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.weekDaysRow}>
        {weekDays.map((day, idx) => (
          <View key={idx} style={styles.weekDayCell}>
            <Text style={[styles.weekDayText, { color: theme.colors.textSecondary }]}>{day}</Text>
          </View>
        ))}
      </View>

      <View style={styles.daysGrid}>
        {emptyDays.map((_, idx) => (
          <View key={`empty-${idx}`} style={styles.dayCell} />
        ))}
        {days.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());
          
          return (
            <TouchableOpacity
              key={day.toISOString()}
              style={[
                styles.dayCell,
                isSelected && { backgroundColor: theme.colors.primary },
                isToday && !isSelected && { borderWidth: 1, borderColor: theme.colors.primary },
              ]}
              onPress={() => onDateSelect(day)}
            >
              <Text
                style={[
                  styles.dayText,
                  { color: isSelected ? theme.colors.primaryText : theme.colors.text },
                  !isSameMonth(day, currentMonth) && { color: theme.colors.textSecondary, opacity: 0.4 },
                ]}
              >
                {format(day, "d")}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
  },
  weekDaysRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  weekDayCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: "600" as const,
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  dayText: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
});
