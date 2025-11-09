import { useTracker } from "@/contexts/TrackerContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Stack } from "expo-router";
import { TrendingDown } from "lucide-react-native";
import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { format, parseISO } from "date-fns";
import { WeightSection } from "@/components/WeightSection";
import { HeightBMISection } from "@/components/HeightBMISection";

export default function WeightScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { getWeightHistory, data, selectedDate, updateWeight, updateHeight, setWeightUnit } = useTracker();

  const history = getWeightHistory();
  const latestWeight = history[history.length - 1];

  const minWeight = history.length > 0 ? Math.min(...history.map((w) => w.weight)) : 0;
  const maxWeight = history.length > 0 ? Math.max(...history.map((w) => w.weight)) : 100;
  const range = maxWeight - minWeight || 10;

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
            <TrendingDown color={theme.colors.text} size={28} />
            <Text style={[styles.title, { color: theme.colors.text }]}>Weight History</Text>
          </View>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Track your weight progress over time</Text>

          <View style={styles.unitToggle}>
            <TouchableOpacity
              style={[
                styles.unitButton,
                { backgroundColor: theme.colors.surface },
                data.weightUnit === 'kg' && { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => setWeightUnit('kg')}
            >
              <Text
                style={[
                  styles.unitButtonText,
                  { color: theme.colors.text },
                  data.weightUnit === 'kg' && { color: theme.colors.primaryText },
                ]}
              >
                KG
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.unitButton,
                { backgroundColor: theme.colors.surface },
                data.weightUnit === 'lbs' && { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => setWeightUnit('lbs')}
            >
              <Text
                style={[
                  styles.unitButtonText,
                  { color: theme.colors.text },
                  data.weightUnit === 'lbs' && { color: theme.colors.primaryText },
                ]}
              >
                LB
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <WeightSection
            weight={latestWeight?.weight}
            unit={data.weightUnit}
            onUpdate={(weight) => updateWeight(selectedDate, weight)}
          />

          <HeightBMISection
            height={data.height}
            heightUnit={data.heightUnit}
            weight={latestWeight?.weight}
            weightUnit={data.weightUnit}
            onUpdateHeight={updateHeight}
          />

          {history.length > 0 && (
            <View style={[styles.chartContainer, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.chartTitle, { color: theme.colors.text }]}>Trend</Text>
              <View style={styles.chart}>
                {history.map((entry, index) => {
                  const heightPercent = ((entry.weight - minWeight) / range) * 100;
                  const isLatest = index === history.length - 1;

                  return (
                    <View key={entry.date} style={styles.barContainer}>
                      <View style={styles.barWrapper}>
                        <View
                          style={[
                            styles.bar,
                            {
                              height: `${Math.max(heightPercent, 5)}%`,
                              backgroundColor: isLatest ? theme.colors.primary : theme.colors.surfaceSecondary,
                            },
                          ]}
                        />
                      </View>
                      <Text style={[styles.barLabel, { color: theme.colors.textSecondary }]}>{format(parseISO(entry.date), "MMM d")}</Text>
                      <Text style={[styles.barValue, { color: theme.colors.text }]}>{entry.weight}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {history.length > 0 && (
            <View style={styles.statsContainer}>
              <View style={[styles.statBox, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Current</Text>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {latestWeight.weight} {latestWeight.unit}
                </Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Lowest</Text>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {minWeight} {data.weightUnit}
                </Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Highest</Text>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {maxWeight} {data.weightUnit}
                </Text>
              </View>
            </View>
          )}

          {history.length === 0 && (
            <View style={[styles.emptyState, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.emptyText, { color: theme.colors.text }]}>No weight data yet</Text>
              <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>Start logging your weight to see trends</Text>
            </View>
          )}
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
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  unitToggle: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  unitButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  unitButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
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
  },
  subtitle: {
    fontSize: 15,
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
  chartContainer: {
    borderRadius: 16,
    padding: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    marginBottom: 20,
  },
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 200,
    gap: 4,
  },
  barContainer: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  barWrapper: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
  },
  bar: {
    width: "100%",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minHeight: 8,
  },
  barLabel: {
    fontSize: 10,
    textAlign: "center",
  },
  barValue: {
    fontSize: 11,
    fontWeight: "600" as const,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  statBox: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700" as const,
  },
  emptyState: {
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600" as const,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
  },
});
