import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState, useCallback, useMemo } from "react";
import { TrackerData, DayEntry, Goal, Meal, WeightEntry, Workout, ScheduledTask } from "@/types/tracker";

const STORAGE_KEY = "tracker_data";

const defaultData: TrackerData = {
  entries: {},
  recurringGoals: [],
  weightUnit: "kg",
  heightUnit: "cm",
  workoutPlans: [],
};

export const [TrackerProvider, useTracker] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const dataQuery = useQuery({
    queryKey: ["tracker-data"],
    queryFn: async (): Promise<TrackerData> => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultData;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: TrackerData) => {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["tracker-data"], data);
    },
  });

  const { mutate: saveData } = saveMutation;

  const data = dataQuery.data ?? defaultData;

  const getDayEntry = useCallback((date: Date): DayEntry => {
    const dateKey = format(date, "yyyy-MM-dd");
    return (
      data.entries[dateKey] ?? {
        date: dateKey,
        goals: data.recurringGoals.map((g) => ({
          ...g,
          id: `${dateKey}-${g.id}`,
          completed: false,
        })),
        meals: [],
        notes: "",
        workouts: [],
        scheduledTasks: [],
        goalNotes: "",
      }
    );
  }, [data]);

  const updateDayEntry = useCallback((date: Date, updates: Partial<DayEntry>) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const currentEntry = getDayEntry(date);
    const newData = {
      ...data,
      entries: {
        ...data.entries,
        [dateKey]: { ...currentEntry, ...updates, date: dateKey },
      },
    };
    saveData(newData);
  }, [data, getDayEntry, saveData]);

  const toggleGoal = useCallback((date: Date, goalId: string) => {
    const entry = getDayEntry(date);
    const updatedGoals = entry.goals.map((g) =>
      g.id === goalId ? { ...g, completed: !g.completed } : g
    );
    updateDayEntry(date, { goals: updatedGoals });
  }, [getDayEntry, updateDayEntry]);

  const addMeal = useCallback((date: Date, meal: Omit<Meal, "id">) => {
    const entry = getDayEntry(date);
    const newMeal: Meal = {
      ...meal,
      id: `${Date.now()}-${Math.random()}`,
    };
    updateDayEntry(date, { meals: [...entry.meals, newMeal] });
  }, [getDayEntry, updateDayEntry]);

  const deleteMeal = useCallback((date: Date, mealId: string) => {
    const entry = getDayEntry(date);
    updateDayEntry(date, {
      meals: entry.meals.filter((m) => m.id !== mealId),
    });
  }, [getDayEntry, updateDayEntry]);

  const updateWeight = useCallback((date: Date, weight: number) => {
    const weightEntry: WeightEntry = {
      date: format(date, "yyyy-MM-dd"),
      weight,
      unit: data.weightUnit,
    };
    updateDayEntry(date, { weight: weightEntry });
  }, [data.weightUnit, updateDayEntry]);

  const updateNotes = useCallback((date: Date, notes: string) => {
    updateDayEntry(date, { notes });
  }, [updateDayEntry]);

  const addRecurringGoal = useCallback((title: string) => {
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    const newData = {
      ...data,
      recurringGoals: [...data.recurringGoals, newGoal],
    };
    saveData(newData);
  }, [data, saveData]);

  const deleteRecurringGoal = useCallback((goalId: string) => {
    const newData = {
      ...data,
      recurringGoals: data.recurringGoals.filter((g) => g.id !== goalId),
    };
    saveData(newData);
  }, [data, saveData]);

  const getWeightHistory = useCallback((): WeightEntry[] => {
    return Object.values(data.entries)
      .filter((e) => e.weight)
      .map((e) => e.weight!)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [data.entries]);

  const updateHeight = useCallback((height: number, unit: 'cm' | 'ft') => {
    const newData = { ...data, height, heightUnit: unit };
    saveData(newData);
  }, [data, saveData]);

  const setWeightUnit = useCallback((unit: 'kg' | 'lbs') => {
    const newData = { ...data, weightUnit: unit };
    saveData(newData);
  }, [data, saveData]);

  const addWorkout = useCallback((date: Date, workout: Omit<Workout, "id">) => {
    const entry = getDayEntry(date);
    const newWorkout: Workout = {
      ...workout,
      id: `workout-${Date.now()}-${Math.random()}`,
    };
    updateDayEntry(date, { workouts: [...entry.workouts, newWorkout] });
  }, [getDayEntry, updateDayEntry]);

  const deleteWorkout = useCallback((date: Date, workoutId: string) => {
    const entry = getDayEntry(date);
    updateDayEntry(date, {
      workouts: entry.workouts.filter((w) => w.id !== workoutId),
    });
  }, [getDayEntry, updateDayEntry]);

  const addScheduledTask = useCallback((date: Date, task: Omit<ScheduledTask, "id">) => {
    const entry = getDayEntry(date);
    const newTask: ScheduledTask = {
      ...task,
      id: `task-${Date.now()}-${Math.random()}`,
    };
    updateDayEntry(date, { scheduledTasks: [...entry.scheduledTasks, newTask] });
  }, [getDayEntry, updateDayEntry]);

  const toggleScheduledTask = useCallback((date: Date, taskId: string) => {
    const entry = getDayEntry(date);
    const updatedTasks = entry.scheduledTasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    updateDayEntry(date, { scheduledTasks: updatedTasks });
  }, [getDayEntry, updateDayEntry]);

  const deleteScheduledTask = useCallback((date: Date, taskId: string) => {
    const entry = getDayEntry(date);
    updateDayEntry(date, {
      scheduledTasks: entry.scheduledTasks.filter((t) => t.id !== taskId),
    });
  }, [getDayEntry, updateDayEntry]);

  const updateGoalNotes = useCallback((date: Date, goalNotes: string) => {
    updateDayEntry(date, { goalNotes });
  }, [updateDayEntry]);

  const addWorkoutPlan = useCallback((plan: Omit<Workout, "id">) => {
    const newPlan: Workout = {
      ...plan,
      id: `plan-${Date.now()}`,
    };
    const newData = {
      ...data,
      workoutPlans: [...data.workoutPlans, newPlan],
    };
    saveData(newData);
  }, [data, saveData]);

  const deleteWorkoutPlan = useCallback((planId: string) => {
    const newData = {
      ...data,
      workoutPlans: data.workoutPlans.filter((p) => p.id !== planId),
    };
    saveData(newData);
  }, [data, saveData]);

  const updateWorkoutPlan = useCallback((planId: string, updates: Partial<Workout>) => {
    const newData = {
      ...data,
      workoutPlans: data.workoutPlans.map((p) => p.id === planId ? { ...p, ...updates } : p),
    };
    saveData(newData);
  }, [data, saveData]);

  const setCustomTheme = useCallback((theme: TrackerData['customTheme']) => {
    const newData = { ...data, customTheme: theme };
    saveData(newData);
  }, [data, saveData]);

  return useMemo(() => ({
    selectedDate,
    setSelectedDate,
    data,
    isLoading: dataQuery.isLoading,
    getDayEntry,
    toggleGoal,
    addMeal,
    deleteMeal,
    updateWeight,
    updateHeight,
    setWeightUnit,
    updateNotes,
    updateGoalNotes,
    addRecurringGoal,
    deleteRecurringGoal,
    getWeightHistory,
    recurringGoals: data.recurringGoals,
    addWorkout,
    deleteWorkout,
    addScheduledTask,
    toggleScheduledTask,
    deleteScheduledTask,
    addWorkoutPlan,
    deleteWorkoutPlan,
    updateWorkoutPlan,
    setCustomTheme,
  }), [
    selectedDate,
    setSelectedDate,
    data,
    dataQuery.isLoading,
    getDayEntry,
    toggleGoal,
    addMeal,
    deleteMeal,
    updateWeight,
    updateHeight,
    setWeightUnit,
    updateNotes,
    updateGoalNotes,
    addRecurringGoal,
    deleteRecurringGoal,
    getWeightHistory,
    addWorkout,
    deleteWorkout,
    addScheduledTask,
    toggleScheduledTask,
    deleteScheduledTask,
    addWorkoutPlan,
    deleteWorkoutPlan,
    updateWorkoutPlan,
    setCustomTheme,
  ]);
});
