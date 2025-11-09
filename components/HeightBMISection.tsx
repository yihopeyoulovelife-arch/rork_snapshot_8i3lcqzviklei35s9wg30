import { Ruler } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal } from "react-native";

interface HeightBMISectionProps {
  height?: number;
  heightUnit: 'cm' | 'ft';
  weight?: number;
  weightUnit: 'kg' | 'lbs';
  onUpdateHeight: (height: number, unit: 'cm' | 'ft') => void;
}

export function HeightBMISection({ height, heightUnit, weight, weightUnit, onUpdateHeight }: HeightBMISectionProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [inputFeet, setInputFeet] = useState<string>("");
  const [inputInches, setInputInches] = useState<string>("");
  const [inputCm, setInputCm] = useState<string>(height?.toString() || "");
  const [selectedUnit, setSelectedUnit] = useState<'cm' | 'ft'>(heightUnit);

  const formatHeightDisplay = (): string => {
    if (!height) return "Tap to set";
    if (heightUnit === 'ft') {
      const totalInches = height * 12;
      const feet = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);
      return `${feet}'${inches}"`;
    }
    return `${height} cm`;
  };

  const calculateBMI = (): number | null => {
    if (!height || !weight) return null;

    let heightInMeters = height;
    let weightInKg = weight;

    if (heightUnit === 'ft') {
      heightInMeters = height * 30.48 / 100;
    } else {
      heightInMeters = height / 100;
    }

    if (weightUnit === 'lbs') {
      weightInKg = weight * 0.453592;
    }

    const bmi = weightInKg / (heightInMeters * heightInMeters);
    return Math.round(bmi * 10) / 10;
  };

  const getBMICategory = (bmi: number): { text: string; color: string } => {
    if (bmi < 18.5) return { text: "Underweight", color: "#60a5fa" };
    if (bmi < 25) return { text: "Normal", color: "#4ade80" };
    if (bmi < 30) return { text: "Overweight", color: "#fbbf24" };
    return { text: "Obese", color: "#f87171" };
  };

  const handleSave = () => {
    if (selectedUnit === 'ft') {
      const feet = parseInt(inputFeet);
      const inches = parseInt(inputInches || "0");
      if (!isNaN(feet) && feet > 0) {
        const totalFeet = feet + inches / 12;
        onUpdateHeight(totalFeet, 'ft');
        setShowModal(false);
        setInputFeet("");
        setInputInches("");
      }
    } else {
      const cm = parseFloat(inputCm);
      if (!isNaN(cm) && cm > 0) {
        onUpdateHeight(cm, 'cm');
        setShowModal(false);
        setInputCm("");
      }
    }
  };

  const bmi = calculateBMI();
  const bmiCategory = bmi ? getBMICategory(bmi) : null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ruler color="#ffffff" size={20} />
          <Text style={styles.title}>Height & BMI</Text>
        </View>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.heightDisplay} onPress={() => setShowModal(true)}>
          <Text style={styles.label}>Height</Text>
          <Text style={styles.value}>
            {formatHeightDisplay()}
          </Text>
        </TouchableOpacity>

        {bmi && (
          <View style={styles.bmiDisplay}>
            <Text style={styles.label}>BMI</Text>
            <View style={styles.bmiValue}>
              <Text style={styles.value}>{bmi}</Text>
              <View style={[styles.categoryBadge, { backgroundColor: bmiCategory!.color + "20" }]}>
                <Text style={[styles.categoryText, { color: bmiCategory!.color }]}>
                  {bmiCategory!.text}
                </Text>
              </View>
            </View>
          </View>
        )}
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
            <Text style={styles.modalTitle}>Set Height</Text>
            
            <View style={styles.unitSelector}>
              <TouchableOpacity
                style={[styles.unitButton, selectedUnit === 'cm' && styles.unitButtonActive]}
                onPress={() => {
                setSelectedUnit('cm');
                if (height && heightUnit === 'ft') {
                  const cm = Math.round(height * 30.48);
                  setInputCm(cm.toString());
                }
              }}
              >
                <Text style={[styles.unitButtonText, selectedUnit === 'cm' && styles.unitButtonTextActive]}>
                  cm
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.unitButton, selectedUnit === 'ft' && styles.unitButtonActive]}
                onPress={() => {
                setSelectedUnit('ft');
                if (height && heightUnit === 'cm') {
                  const totalInches = height / 2.54;
                  setInputFeet(Math.floor(totalInches / 12).toString());
                  setInputInches(Math.round(totalInches % 12).toString());
                }
              }}
              >
                <Text style={[styles.unitButtonText, selectedUnit === 'ft' && styles.unitButtonTextActive]}>
                  ft
                </Text>
              </TouchableOpacity>
            </View>

            {selectedUnit === 'ft' ? (
              <View style={styles.feetInputContainer}>
                <View style={styles.feetInputWrapper}>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="6"
                    placeholderTextColor="#666666"
                    value={inputFeet}
                    onChangeText={setInputFeet}
                    keyboardType="number-pad"
                    autoFocus
                  />
                  <Text style={styles.feetLabel}>ft</Text>
                </View>
                <View style={styles.feetInputWrapper}>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="1"
                    placeholderTextColor="#666666"
                    value={inputInches}
                    onChangeText={setInputInches}
                    keyboardType="number-pad"
                  />
                  <Text style={styles.feetLabel}>in</Text>
                </View>
              </View>
            ) : (
              <TextInput
                style={styles.modalInput}
                placeholder="Enter height in cm"
                placeholderTextColor="#666666"
                value={inputCm}
                onChangeText={setInputCm}
                keyboardType="number-pad"
                autoFocus
              />
            )}

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
    marginBottom: 16,
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
  content: {
    gap: 16,
  },
  heightDisplay: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  bmiDisplay: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#1a1a1a",
  },
  label: {
    fontSize: 15,
    color: "#666666",
  },
  value: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#ffffff",
  },
  bmiValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 13,
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
  unitSelector: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  unitButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#0a0a0a",
    alignItems: "center",
  },
  unitButtonActive: {
    backgroundColor: "#ffffff",
  },
  unitButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#666666",
  },
  unitButtonTextActive: {
    color: "#000000",
  },
  modalInput: {
    backgroundColor: "#0a0a0a",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: "#ffffff",
    marginBottom: 20,
  },
  feetInputContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  feetInputWrapper: {
    flex: 1,
    position: "relative",
  },
  feetLabel: {
    position: "absolute",
    right: 12,
    top: 12,
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#666666",
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
