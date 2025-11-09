import { useTracker } from "@/contexts/TrackerContext";
import { Stack } from "expo-router";
import { Clock, Plus, Trash2, Square, CheckSquare, Bell, BellOff, Calendar } from "lucide-react-native";
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Modal, TextInput, Platform } from "react-native";
import { format } from "date-fns";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DailyScheduleScreen() {
  const insets = useSafeAreaInsets();
  const { selectedDate, getDayEntry, addScheduledTask, toggleScheduledTask, deleteScheduledTask } = useTracker();
  const dayEntry = getDayEntry(selectedDate);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [taskTime, setTaskTime] = useState<string>("09:00");
  const [notificationEnabled, setNotificationEnabled] = useState<boolean>(true);

  const handleAddTask = () => {
    if (taskTitle.trim()) {
      addScheduledTask(selectedDate, {
        title: taskTitle.trim(),
        time: taskTime,
        completed: false,
        notificationEnabled,
      });
      setTaskTitle("");
      setTaskTime("09:00");
      setNotificationEnabled(true);
      setShowModal(false);
    }
  };

  const sortedTasks = [...dayEntry.scheduledTasks].sort((a, b) => a.time.localeCompare(b.time));
  const completedCount = sortedTasks.filter((t) => t.completed).length;

  return (
    <>
      <Stack.Screen
        options={{
          title: format(selectedDate, "MMM d, yyyy"),
          headerStyle: {
            backgroundColor: "#000000",
          },
          headerTintColor: "#ffffff",
          headerShadowVisible: false,
        }}
      />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Clock color="#ffffff" size={28} />
            <View>
              <Text style={styles.title}>Daily Schedule</Text>
              <Text style={styles.subtitle}>
                {sortedTasks.length > 0
                  ? `${completedCount} of ${sortedTasks.length} completed`
                  : "No tasks scheduled"}
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {sortedTasks.length > 0 && (
            <View style={styles.timelineContainer}>
              <View style={styles.timelineHeader}>
                <Calendar color="#ffffff" size={18} />
                <Text style={styles.timelineTitle}>Timeline View</Text>
              </View>
              <View style={styles.timeline}>
                {Array.from({ length: 24 }, (_, hour) => {
                  const tasksAtHour = sortedTasks.filter((task) => {
                    const taskHour = parseInt(task.time.split(":")[0]);
                    return taskHour === hour;
                  });

                  return (
                    <View key={hour} style={styles.timelineRow}>
                      <View style={styles.timelineHourContainer}>
                        <Text style={styles.timelineHour}>
                          {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
                        </Text>
                      </View>
                      <View style={styles.timelineBarContainer}>
                        <View style={styles.timelineLine} />
                        {tasksAtHour.length > 0 && (
                          <View style={styles.timelineTasksContainer}>
                            {tasksAtHour.map((task) => (
                              <View
                                key={task.id}
                                style={[
                                  styles.timelineTask,
                                  task.completed && styles.timelineTaskCompleted,
                                ]}
                              >
                                <View style={styles.timelineDot} />
                                <Text
                                  style={[
                                    styles.timelineTaskText,
                                    task.completed && styles.timelineTaskTextCompleted,
                                  ]}
                                  numberOfLines={1}
                                >
                                  {task.title}
                                </Text>
                              </View>
                            ))}
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {sortedTasks.length > 0 ? (
            <View style={styles.tasksList}>
              {sortedTasks.map((task) => (
                <View
                  key={task.id}
                  style={[styles.taskItem, task.completed && styles.taskItemCompleted]}
                >
                  <TouchableOpacity
                    style={styles.taskCheckbox}
                    onPress={() => toggleScheduledTask(selectedDate, task.id)}
                  >
                    {task.completed ? (
                      <CheckSquare color="#ffffff" size={24} />
                    ) : (
                      <Square color="#666666" size={24} />
                    )}
                  </TouchableOpacity>

                  <View style={styles.taskContent}>
                    <View style={styles.taskHeader}>
                      <Text style={styles.taskTime}>{task.time}</Text>
                      {task.notificationEnabled && (
                        <Bell color="#666666" size={14} />
                      )}
                    </View>
                    <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>
                      {task.title}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => deleteScheduledTask(selectedDate, task.id)}
                    style={styles.deleteButton}
                  >
                    <Trash2 color="#666666" size={18} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : null}

          {sortedTasks.length === 0 && (
            <View style={styles.emptyState}>
              <Clock color="#666666" size={48} />
              <Text style={styles.emptyText}>No tasks scheduled</Text>
              <Text style={styles.emptySubtext}>Add tasks to plan your day</Text>
            </View>
          )}

          <TouchableOpacity style={styles.addButton} onPress={() => setShowModal(true)}>
            <Plus color="#ffffff" size={20} />
            <Text style={styles.addButtonText}>Add Task</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowModal(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Add Scheduled Task</Text>

            <Text style={styles.inputLabel}>Task</Text>
            <TextInput
              style={styles.input}
              placeholder="What do you need to do?"
              placeholderTextColor="#666666"
              value={taskTitle}
              onChangeText={setTaskTitle}
              autoFocus
            />

            <Text style={styles.inputLabel}>Time</Text>
            <TextInput
              style={styles.input}
              placeholder="HH:MM"
              placeholderTextColor="#666666"
              value={taskTime}
              onChangeText={setTaskTime}
              keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
            />

            <TouchableOpacity
              style={styles.notificationToggle}
              onPress={() => setNotificationEnabled(!notificationEnabled)}
            >
              {notificationEnabled ? (
                <Bell color="#ffffff" size={20} />
              ) : (
                <BellOff color="#666666" size={20} />
              )}
              <Text style={styles.notificationText}>
                {notificationEnabled ? "Notification enabled" : "Notification disabled"}
              </Text>
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleAddTask}
                disabled={!taskTitle.trim()}
              >
                <Text style={styles.modalButtonTextConfirm}>Add</Text>
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
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  tasksList: {
    gap: 12,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: "#0a0a0a",
    borderRadius: 12,
    padding: 16,
  },
  taskItemCompleted: {
    opacity: 0.6,
  },
  taskCheckbox: {
    paddingTop: 2,
  },
  taskContent: {
    flex: 1,
    gap: 4,
  },
  taskHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  taskTime: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#666666",
  },
  taskTitle: {
    fontSize: 16,
    color: "#ffffff",
    lineHeight: 22,
  },
  taskTitleCompleted: {
    textDecorationLine: "line-through",
    color: "#666666",
  },
  deleteButton: {
    padding: 4,
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
  timelineContainer: {
    backgroundColor: "#0a0a0a",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  timelineHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#ffffff",
  },
  timeline: {
    gap: 0,
  },
  timelineRow: {
    flexDirection: "row",
    minHeight: 40,
    alignItems: "center",
  },
  timelineHourContainer: {
    width: 70,
    paddingRight: 12,
  },
  timelineHour: {
    fontSize: 11,
    color: "#666666",
    fontWeight: "600" as const,
    textAlign: "right",
  },
  timelineBarContainer: {
    flex: 1,
    position: "relative",
    paddingLeft: 12,
  },
  timelineLine: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: "#1a1a1a",
  },
  timelineTasksContainer: {
    gap: 6,
    paddingVertical: 4,
  },
  timelineTask: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#1a1a1a",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  timelineTaskCompleted: {
    opacity: 0.5,
  },
  timelineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ffffff",
  },
  timelineTaskText: {
    fontSize: 13,
    color: "#ffffff",
    flex: 1,
  },
  timelineTaskTextCompleted: {
    textDecorationLine: "line-through",
    color: "#666666",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 16,
    color: "#000000",
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
  notificationToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#0a0a0a",
    borderRadius: 8,
    marginBottom: 20,
  },
  notificationText: {
    fontSize: 15,
    color: "#ffffff",
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
