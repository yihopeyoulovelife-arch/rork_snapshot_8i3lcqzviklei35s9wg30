import { Scale } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal } from "react-native";

interface WeightSectionProps {
  weight?: number;
  unit: "kg" | "lbs";
  onUpdate: (weight: number) => void;
}

export function WeightSection({ weight, unit, onUpdate }: WeightSectionProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(weight?.toString() ?? "");

  const handleSave = () => {
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue) && numValue > 0) {
      onUpdate(numValue);
      setShowModal(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Scale color="#ffffff" size={20} />
          <Text style={styles.title}>Weight</Text>
        </View>
      </View>

      {weight ? (
        <TouchableOpacity style={styles.weightDisplay} onPress={() => setShowModal(true)}>
          <Text style={styles.weightValue}>
            {weight}
            <Text style={styles.weightUnit}> {unit}</Text>
          </Text>
          <Text style={styles.updateText}>Tap to update</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.addButton} onPress={() => setShowModal(true)}>
          <Text style={styles.addButtonText}>Log Weight</Text>
        </TouchableOpacity>
      )}

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
            <Text style={styles.modalTitle}>Log Weight</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.modalInput}
                placeholder="0.0"
                placeholderTextColor="#666666"
                value={inputValue}
                onChangeText={setInputValue}
                keyboardType="decimal-pad"
                autoFocus
              />
              <Text style={styles.unitText}>{unit}</Text>
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
                onPress={handleSave}
              >
                <Text style={styles.modalButtonTextConfirm}>Save</Text>
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
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#ffffff",
  },
  weightDisplay: {
    alignItems: "center",
    paddingVertical: 16,
  },
  weightValue: {
    fontSize: 36,
    fontWeight: "700" as const,
    color: "#ffffff",
  },
  weightUnit: {
    fontSize: 20,
    color: "#666666",
  },
  updateText: {
    fontSize: 13,
    color: "#666666",
    marginTop: 4,
  },
  addButton: {
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#ffffff",
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
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  modalInput: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    borderRadius: 8,
    padding: 12,
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "600" as const,
  },
  unitText: {
    fontSize: 18,
    color: "#666666",
    fontWeight: "600" as const,
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
