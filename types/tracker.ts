export interface Goal {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface WeightEntry {
  date: string;
  weight: number;
  unit: 'kg' | 'lbs';
  height?: number;
  heightUnit?: 'cm' | 'ft';
}

export interface Meal {
  id: string;
  time: string;
  description: string;
  calories: number;
  isEstimated: boolean;
  imageUri?: string;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  weightUnit?: 'kg' | 'lbs';
}

export interface Workout {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
  duration?: number;
  notes?: string;
  repeatDays?: number[];
}

export interface ScheduledTask {
  id: string;
  title: string;
  time: string;
  completed: boolean;
  notificationEnabled: boolean;
}

export interface DayEntry {
  date: string;
  goals: Goal[];
  weight?: WeightEntry;
  meals: Meal[];
  notes: string;
  workouts: Workout[];
  scheduledTasks: ScheduledTask[];
  goalNotes?: string;
}

export interface TrackerData {
  entries: Record<string, DayEntry>;
  recurringGoals: Goal[];
  weightUnit: 'kg' | 'lbs';
  height?: number;
  heightUnit: 'cm' | 'ft';
  workoutPlans: Workout[];
  customTheme?: {
    name: string;
    colors: {
      background: string;
      surface: string;
      surfaceSecondary: string;
      text: string;
      textSecondary: string;
      primary: string;
      primaryText: string;
      border: string;
      success: string;
      error: string;
      warning: string;
    };
  };
}
