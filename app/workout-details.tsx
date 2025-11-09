import { useLocalSearchParams, Stack, router } from "expo-router";
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Modal, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, Edit2, Trash2, Check } from "lucide-react-native";
import { useTracker } from "@/contexts/TrackerContext";
import { WorkoutExercise } from "@/types/tracker";
import { useState } from "react";

export default function WorkoutDetailsScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const planId = params.planId as string;
  const { data, updateWorkoutPlan, deleteWorkoutPlan } = useTracker();
  
  const plan = data.workoutPlans.find((p) => p.id === planId);
  
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editingExercise, setEditingExercise] = useState<WorkoutExercise | null>(null);
  const [showRepeatModal, setShowRepeatModal] = useState<boolean>(false);
  const [selectedDays, setSelectedDays] = useState<number[]>(plan?.repeatDays || []);

  const weekDays = [
    { label: "Mon", value: 1 },
    { label: "Tue", value: 2 },
    { label: "Wed", value: 3 },
    { label: "Thu", value: 4 },
    { label: "Fri", value: 5 },
    { label: "Sat", value: 6 },
    { label: "Sun", value: 0 },
  ];

  if (!plan) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Workout not found</Text>
      </View>
    );
  }

  const handleEditExercise = (exercise: WorkoutExercise) => {
    setEditingExercise({ ...exercise });
    setShowEditModal(true);
  };

  const handleSaveExercise = () => {
    if (editingExercise && plan) {
      const updatedExercises = plan.exercises.map((ex) =>
        ex.id === editingExercise.id ? editingExercise : ex
      );
      updateWorkoutPlan(planId, { exercises: updatedExercises });
      setShowEditModal(false);
      setEditingExercise(null);
    }
  };

  const handleDeleteExercise = (exerciseId: string) => {
    if (plan) {
      const updatedExercises = plan.exercises.filter((ex) => ex.id !== exerciseId);
      updateWorkoutPlan(planId, { exercises: updatedExercises });
    }
  };

  const handleDeletePlan = () => {
    deleteWorkoutPlan(planId);
    router.back();
  };

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSaveRepeat = () => {
    updateWorkoutPlan(planId, { repeatDays: selectedDays });
    setShowRepeatModal(false);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft color="#ffffff" size={24} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>{plan.name}</Text>
            <Text style={styles.subtitle}>{plan.exercises.length} exercises</Text>
          </View>
          <TouchableOpacity onPress={handleDeletePlan} style={styles.deleteButton}>
            <Trash2 color="#ef4444" size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.repeatButton}
            onPress={() => setShowRepeatModal(true)}
          >
            <Text style={styles.repeatButtonText}>
              {plan.repeatDays && plan.repeatDays.length > 0
                ? `Repeats on: ${plan.repeatDays.map((d) => weekDays.find((w) => w.value === d)?.label).join(", ")}`
                : "Set Repeat Days"}
            </Text>
          </TouchableOpacity>

          <View style={styles.exercisesContainer}>
            {plan.exercises.map((exercise, idx) => (
              <View key={exercise.id} style={styles.exerciseCard}>
                <View style={styles.exerciseHeader}>
                  <Text style={styles.exerciseNumber}>{idx + 1}</Text>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <Text style={styles.exerciseDetails}>
                      {exercise.sets} sets × {exercise.reps} reps
                      {exercise.weight ? ` @ ${exercise.weight} ${exercise.weightUnit}` : ""}
                    </Text>
                  </View>
                  <View style={styles.exerciseActions}>
                    <TouchableOpacity onPress={() => handleEditExercise(exercise)}>
                      <Edit2 color="#ffffff" size={18} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteExercise(exercise.id)}>
                      <Trash2 color="#ef4444" size={18} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <Modal
        visible={showEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Exercise</Text>
            
            {editingExercise && (
              <>
                <Text style={styles.inputLabel}>Exercise Name</Text>
                <TextInput
                  style={styles.input}
                  value={editingExercise.name}
                  onChangeText={(text) =>
                    setEditingExercise({ ...editingExercise, name: text })
                  }
                  placeholderTextColor="#666666"
                />

                <View style={styles.row}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Sets</Text>
                    <TextInput
                      style={styles.input}
                      value={editingExercise.sets.toString()}
                      onChangeText={(text) =>
                        setEditingExercise({
                          ...editingExercise,
                          sets: parseInt(text) || 0,
                        })
                      }
                      keyboardType="number-pad"
                      placeholderTextColor="#666666"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Reps</Text>
                    <TextInput
                      style={styles.input}
                      value={editingExercise.reps.toString()}
                      onChangeText={(text) =>
                        setEditingExercise({
                          ...editingExercise,
                          reps: parseInt(text) || 0,
                        })
                      }
                      keyboardType="number-pad"
                      placeholderTextColor="#666666"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Weight</Text>
                    <TextInput
                      style={styles.input}
                      value={editingExercise.weight?.toString() || ""}
                      onChangeText={(text) =>
                        setEditingExercise({
                          ...editingExercise,
                          weight: parseFloat(text) || undefined,
                        })
                      }
                      keyboardType="decimal-pad"
                      placeholder={data.weightUnit}
                      placeholderTextColor="#666666"
                    />
                  </View>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonCancel]}
                    onPress={() => setShowEditModal(false)}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonConfirm]}
                    onPress={handleSaveExercise}
                  >
                    <Text style={styles.modalButtonTextConfirm}>Save</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={showRepeatModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRepeatModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowRepeatModal(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Repeat Days</Text>
            <Text style={styles.modalDescription}>
              Select which days this workout should repeat
            </Text>

            <View style={styles.daysGrid}>
              {weekDays.map((day) => (
                <TouchableOpacity
                  key={day.value}
                  style={[
                    styles.dayButton,
                    selectedDays.includes(day.value) && styles.dayButtonSelected,
                  ]}
                  onPress={() => toggleDay(day.value)}
                >
                  {selectedDays.includes(day.value) && (
                    <Check color="#000000" size={16} style={styles.checkIcon} />
                  )}
                  <Text
                    style={[
                      styles.dayButtonText,
                      selectedDays.includes(day.value) && styles.dayButtonTextSelected,
                    ]}
                  >
                    {day.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowRepeatModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleSaveRepeat}
              >
                <Text style={styles.modalButtonTextConfirm}>Save</Text>
              </TouchableOpacity>
            </View>
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 14,
    color: "#666666",
    marginTop: 2,
  },
  deleteButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  repeatButton: {
    backgroundColor: "#0a0a0a",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#333333",
  },
  repeatButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#ffffff",
    textAlign: "center",
  },
  exercisesContainer: {
    gap: 12,
  },
  exerciseCard: {
    backgroundColor: "#0a0a0a",
    borderRadius: 12,
    padding: 16,
  },
  exerciseHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  exerciseNumber: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#666666",
    width: 24,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#ffffff",
    marginBottom: 4,
  },
  exerciseDetails: {
    fontSize: 14,
    color: "#666666",
  },
  exerciseActions: {
    flexDirection: "row",
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginTop: 40,
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
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#ffffff",
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 20,
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
  row: {
    flexDirection: "row",
    gap: 12,
  },
  inputGroup: {
    flex: 1,
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  dayButton: {
    width: "30%",
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#0a0a0a",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  dayButtonSelected: {
    backgroundColor: "#ffffff",
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#ffffff",
  },
  dayButtonTextSelected: {
    color: "#000000",
  },
  checkIcon: {
    position: "absolute",
    top: 4,
    right: 4,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  modalButtonCancel: {
    backgroundColor: "#0a0a0a",
  },
  modalButtonConfirm: {
    backgroundColor: "#ffffff",
  },
  modalButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#ffffff",
  },
  modalButtonTextConfirm: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#000000",
  },
});
