import { useTracker } from "@/contexts/TrackerContext";
import { Stack, router } from "expo-router";
import { Dumbbell, Plus, Trash2 } from "lucide-react-native";
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Modal, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { format } from "date-fns";
import { useState } from "react";
import { Workout, WorkoutExercise } from "@/types/tracker";

export default function WorkoutsScreen() {
  const insets = useSafeAreaInsets();
  const { selectedDate, getDayEntry, addWorkout, deleteWorkout, addWorkoutPlan, data } = useTracker();
  const dayEntry = getDayEntry(selectedDate);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [showPlanModal, setShowPlanModal] = useState<boolean>(false);
  const [workoutName, setWorkoutName] = useState<string>("");
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [editingExercise, setEditingExercise] = useState<Partial<WorkoutExercise>>({});
  const [saveAsPlan, setSaveAsPlan] = useState<boolean>(false);

  const addExercise = () => {
    if (editingExercise.name && editingExercise.sets && editingExercise.reps) {
      const newExercise: WorkoutExercise = {
        id: `ex-${Date.now()}`,
        name: editingExercise.name,
        sets: editingExercise.sets,
        reps: editingExercise.reps,
        weight: editingExercise.weight,
        weightUnit: data.weightUnit,
      };
      setExercises([...exercises, newExercise]);
      setEditingExercise({});
    }
  };

  const handleSaveWorkout = () => {
    if (workoutName.trim() && exercises.length > 0) {
      if (saveAsPlan) {
        addWorkoutPlan({
          name: workoutName,
          exercises,
        });
      }
      addWorkout(selectedDate, {
        name: workoutName,
        exercises,
      });
      setWorkoutName("");
      setExercises([]);
      setSaveAsPlan(false);
      setShowModal(false);
    }
  };

  const handleUsePlan = (plan: Workout) => {
    addWorkout(selectedDate, {
      name: plan.name,
      exercises: plan.exercises,
    });
    setShowPlanModal(false);
  };

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
            <Dumbbell color="#ffffff" size={28} />
            <Text style={styles.title}>Workouts</Text>
          </View>
          <Text style={styles.subtitle}>
            Track your gym sessions and workout plans
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.dateSection}>
            <Text style={styles.dateText}>{format(selectedDate, "MMMM d, yyyy")}</Text>
          </View>

          {dayEntry.workouts.length > 0 && (
            <View style={styles.workoutsContainer}>
              {dayEntry.workouts.map((workout) => (
                <View key={workout.id} style={styles.workoutCard}>
                  <View style={styles.workoutHeader}>
                    <Text style={styles.workoutName}>{workout.name}</Text>
                    <TouchableOpacity
                      onPress={() => deleteWorkout(selectedDate, workout.id)}
                      style={styles.deleteButton}
                    >
                      <Trash2 color="#666666" size={18} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.exercisesList}>
                    {workout.exercises.map((exercise, idx) => (
                      <View key={exercise.id} style={styles.exerciseItem}>
                        <Text style={styles.exerciseNumber}>{idx + 1}</Text>
                        <View style={styles.exerciseInfo}>
                          <Text style={styles.exerciseName}>{exercise.name}</Text>
                          <Text style={styles.exerciseDetails}>
                            {exercise.sets} sets × {exercise.reps} reps
                            {exercise.weight ? ` @ ${exercise.weight} ${exercise.weightUnit}` : ""}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}

          {dayEntry.workouts.length === 0 && (
            <View style={styles.emptyState}>
              <Dumbbell color="#666666" size={48} />
              <Text style={styles.emptyText}>No workouts logged today</Text>
              <Text style={styles.emptySubtext}>Add a workout to track your progress</Text>
            </View>
          )}

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.addButton} onPress={() => setShowModal(true)}>
              <Plus color="#ffffff" size={20} />
              <Text style={styles.addButtonText}>Log Workout</Text>
            </TouchableOpacity>

            {data.workoutPlans.length > 0 && (
              <TouchableOpacity style={styles.planButton} onPress={() => setShowPlanModal(true)}>
                <Text style={styles.planButtonText}>Use Saved Plan</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>

      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Log Workout</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Workout Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Push Day, Leg Day"
                placeholderTextColor="#666666"
                value={workoutName}
                onChangeText={setWorkoutName}
              />

              <Text style={styles.sectionTitle}>Exercises</Text>
              {exercises.map((ex, idx) => (
                <View key={ex.id} style={styles.addedExercise}>
                  <Text style={styles.addedExerciseName}>
                    {idx + 1}. {ex.name}
                  </Text>
                  <Text style={styles.addedExerciseDetails}>
                    {ex.sets} × {ex.reps} {ex.weight ? `@ ${ex.weight}${ex.weightUnit}` : ""}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setExercises(exercises.filter((_, i) => i !== idx))}
                    style={styles.removeButton}
                  >
                    <Trash2 color="#666666" size={16} />
                  </TouchableOpacity>
                </View>
              ))}

              <View style={styles.exerciseForm}>
                <TextInput
                  style={styles.input}
                  placeholder="Exercise name"
                  placeholderTextColor="#666666"
                  value={editingExercise.name || ""}
                  onChangeText={(text) => setEditingExercise({ ...editingExercise, name: text })}
                />
                <View style={styles.row}>
                  <TextInput
                    style={[styles.input, styles.inputSmall]}
                    placeholder="Sets"
                    placeholderTextColor="#666666"
                    keyboardType="number-pad"
                    value={editingExercise.sets?.toString() || ""}
                    onChangeText={(text) =>
                      setEditingExercise({ ...editingExercise, sets: parseInt(text) || 0 })
                    }
                  />
                  <TextInput
                    style={[styles.input, styles.inputSmall]}
                    placeholder="Reps"
                    placeholderTextColor="#666666"
                    keyboardType="number-pad"
                    value={editingExercise.reps?.toString() || ""}
                    onChangeText={(text) =>
                      setEditingExercise({ ...editingExercise, reps: parseInt(text) || 0 })
                    }
                  />
                  <TextInput
                    style={[styles.input, styles.inputSmall]}
                    placeholder={`Weight (${data.weightUnit})`}
                    placeholderTextColor="#666666"
                    keyboardType="decimal-pad"
                    value={editingExercise.weight?.toString() || ""}
                    onChangeText={(text) =>
                      setEditingExercise({ ...editingExercise, weight: parseFloat(text) || undefined })
                    }
                  />
                </View>
                <TouchableOpacity style={styles.addExerciseButton} onPress={addExercise}>
                  <Plus color="#000000" size={16} />
                  <Text style={styles.addExerciseButtonText}>Add Exercise</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.checkboxRow, saveAsPlan && styles.checkboxRowActive]}
                  onPress={() => setSaveAsPlan(!saveAsPlan)}
                >
                  <View style={[styles.checkbox, saveAsPlan && styles.checkboxActive]}>  
                    {saveAsPlan && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.checkboxLabel}>Save as workout plan</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={[styles.saveButton, (!workoutName.trim() || exercises.length === 0) && styles.saveButtonDisabled]}
              onPress={handleSaveWorkout}
              disabled={!workoutName.trim() || exercises.length === 0}
            >
              <Text style={styles.saveButtonText}>Save Workout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showPlanModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPlanModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPlanModal(false)}
        >
          <View style={styles.planModalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Saved Plans</Text>
            <ScrollView style={styles.plansList}>
              {data.workoutPlans.map((plan) => (
                <View key={plan.id} style={styles.planItemWrapper}>
                  <TouchableOpacity
                    style={styles.planItem}
                    onPress={() => handleUsePlan(plan)}
                  >
                    <View>
                      <Text style={styles.planName}>{plan.name}</Text>
                      <Text style={styles.planExercises}>{plan.exercises.length} exercises</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.viewPlanButton}
                    onPress={() => {
                      setShowPlanModal(false);
                      router.push({
                        pathname: "/workout-details",
                        params: { planId: plan.id },
                      });
                    }}
                  >
                    <Text style={styles.viewPlanButtonText}>View</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
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
  dateSection: {
    paddingBottom: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#ffffff",
  },
  workoutsContainer: {
    gap: 16,
  },
  workoutCard: {
    backgroundColor: "#0a0a0a",
    borderRadius: 16,
    padding: 20,
  },
  workoutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  workoutName: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#ffffff",
  },
  deleteButton: {
    padding: 8,
  },
  exercisesList: {
    gap: 12,
  },
  exerciseItem: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  exerciseNumber: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#666666",
    width: 20,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#ffffff",
    marginBottom: 2,
  },
  exerciseDetails: {
    fontSize: 14,
    color: "#666666",
  },
  emptyState: {
    backgroundColor: "#0a0a0a",
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#ffffff",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666666",
  },
  actionButtons: {
    gap: 12,
    marginTop: 8,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#ffffff",
  },
  addButtonText: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "600" as const,
  },
  planButton: {
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333333",
    alignItems: "center",
  },
  planButtonText: {
    fontSize: 15,
    color: "#ffffff",
    fontWeight: "600" as const,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#ffffff",
  },
  closeButton: {
    fontSize: 24,
    color: "#666666",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#999999",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#0a0a0a",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: "#ffffff",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#ffffff",
    marginBottom: 12,
    marginTop: 8,
  },
  addedExercise: {
    backgroundColor: "#0a0a0a",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addedExerciseName: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#ffffff",
    flex: 1,
  },
  addedExerciseDetails: {
    fontSize: 13,
    color: "#666666",
    marginRight: 12,
  },
  removeButton: {
    padding: 4,
  },
  exerciseForm: {
    marginTop: 8,
    padding: 16,
    backgroundColor: "#0a0a0a",
    borderRadius: 12,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  inputSmall: {
    flex: 1,
  },
  addExerciseButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    marginTop: 8,
  },
  addExerciseButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#000000",
  },
  saveButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  saveButtonDisabled: {
    backgroundColor: "#333333",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#000000",
  },
  planModalContent: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 24,
    margin: 20,
    maxHeight: "60%",
  },
  plansList: {
    marginTop: 16,
  },
  planItemWrapper: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  planItem: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    borderRadius: 12,
    padding: 16,
  },
  planName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#ffffff",
    marginBottom: 4,
  },
  planExercises: {
    fontSize: 14,
    color: "#666666",
  },
  viewPlanButton: {
    backgroundColor: "#0a0a0a",
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  viewPlanButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#ffffff",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#0a0a0a",
    marginTop: 8,
  },
  checkboxRowActive: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#666666",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: {
    backgroundColor: "#ffffff",
    borderColor: "#ffffff",
  },
  checkmark: {
    fontSize: 14,
    color: "#000000",
    fontWeight: "700" as const,
  },
  checkboxLabel: {
    fontSize: 15,
    color: "#ffffff",
    fontWeight: "600" as const,
  },
});
