import { Square, CheckSquare, Trash2, Plus } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal } from "react-native";
import { Goal } from "@/types/tracker";

interface GoalsSectionProps {
  goals: Goal[];
  onToggle: (goalId: string) => void;
  onAddGoal?: (title: string) => void;
  onDeleteGoal?: (goalId: string) => void;
}

export function GoalsSection({ goals, onToggle, onAddGoal, onDeleteGoal }: GoalsSectionProps) {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newGoalTitle, setNewGoalTitle] = useState<string>("");

  const completed = goals.filter((g) => g.completed).length;
  const total = goals.length;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  const handleAddGoal = () => {
    if (newGoalTitle.trim() && onAddGoal) {
      onAddGoal(newGoalTitle.trim());
      setNewGoalTitle("");
      setShowAddModal(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Goals</Text>
        {total > 0 && (
          <Text style={styles.progress}>
            {completed}/{total}
          </Text>
        )}
      </View>

      {total > 0 && (
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      )}

      <View style={styles.goalsList}>
        {goals.map((goal) => (
          <View key={goal.id} style={styles.goalItem}>
            <TouchableOpacity
              style={styles.goalCheckbox}
              onPress={() => onToggle(goal.id)}
            >
              {goal.completed ? (
                <CheckSquare color="#ffffff" size={24} />
              ) : (
                <Square color="#666666" size={24} />
              )}
              <Text style={[styles.goalText, goal.completed && styles.goalTextCompleted]}>
                {goal.title}
              </Text>
            </TouchableOpacity>
            {onDeleteGoal && (
              <TouchableOpacity
                onPress={() => onDeleteGoal(goal.id)}
                style={styles.deleteButton}
              >
                <Trash2 color="#666666" size={18} />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      {onAddGoal && (
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
          <Plus color="#ffffff" size={20} />
          <Text style={styles.addButtonText}>Add Daily Goal</Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAddModal(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Add Daily Goal</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Exercise, Read for 30 mins"
              placeholderTextColor="#666666"
              value={newGoalTitle}
              onChangeText={setNewGoalTitle}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleAddGoal}
              >
                <Text style={styles.modalButtonTextConfirm}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0a0a0a",
    borderRadius: 16,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#ffffff",
  },
  progress: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "600" as const,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: "#1a1a1a",
    borderRadius: 2,
    marginBottom: 16,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#ffffff",
  },
  goalsList: {
    gap: 12,
  },
  goalItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  goalCheckbox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  goalText: {
    fontSize: 15,
    color: "#ffffff",
    flex: 1,
  },
  goalTextCompleted: {
    textDecorationLine: "line-through",
    color: "#666666",
  },
  deleteButton: {
    padding: 8,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1a1a1a",
    borderStyle: "dashed",
  },
  addButtonText: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "600" as const,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#ffffff",
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: "#0a0a0a",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: "#ffffff",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
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
