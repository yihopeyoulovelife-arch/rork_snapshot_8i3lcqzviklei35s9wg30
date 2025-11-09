import { Focus } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput } from "react-native";
import { Snowfall } from "./Snowfall";
import { router } from "expo-router";

interface FocusSectionProps {
  onStartFocus?: () => void;
}

export function FocusSection({ onStartFocus }: FocusSectionProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [duration, setDuration] = useState<string>("25");

  const handleStart = () => {
    const minutes = parseInt(duration);
    if (!isNaN(minutes) && minutes > 0) {
      setShowModal(false);
      onStartFocus?.();
      router.push({
        pathname: "/focus-mode",
        params: { duration: minutes.toString() },
      });
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={() => setShowModal(true)}>
        <View style={styles.snowfallContainer}>
          <Snowfall count={15} />
        </View>
        <Focus color="#ffffff" size={20} />
        <Text style={styles.buttonText}>Start Focus Mode</Text>
      </TouchableOpacity>

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
            <Text style={styles.modalTitle}>Focus Mode</Text>
            <Text style={styles.modalDescription}>
              Set how long you want to focus. Your phone will be locked during this time, except for Spotify.
            </Text>

            <Text style={styles.inputLabel}>Duration (minutes)</Text>
            <TextInput
              style={styles.input}
              placeholder="25"
              placeholderTextColor="#666666"
              value={duration}
              onChangeText={setDuration}
              keyboardType="number-pad"
              autoFocus
            />

            <View style={styles.presetButtons}>
              <TouchableOpacity style={styles.presetButton} onPress={() => setDuration("15")}>
                <Text style={styles.presetButtonText}>15 min</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.presetButton} onPress={() => setDuration("25")}>
                <Text style={styles.presetButtonText}>25 min</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.presetButton} onPress={() => setDuration("45")}>
                <Text style={styles.presetButtonText}>45 min</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleStart}
              >
                <Text style={styles.modalButtonTextConfirm}>Start</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#000000",
    overflow: "hidden",
    position: "relative",
  },
  snowfallContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "600" as const,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
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
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#ffffff",
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 20,
    lineHeight: 20,
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
    fontSize: 18,
    color: "#ffffff",
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "600" as const,
  },
  presetButtons: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  presetButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#0a0a0a",
    alignItems: "center",
  },
  presetButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
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
