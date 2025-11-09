import { generateObject } from "@rork/toolkit-sdk";
import { format } from "date-fns";
import { UtensilsCrossed, Plus, Trash2, Sparkles, Camera, Image as ImageIcon } from "lucide-react-native";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Platform,
  Image,
} from "react-native";
import { z } from "zod";
import { Meal } from "@/types/tracker";
import * as ImagePicker from "expo-image-picker";

interface MealsSectionProps {
  meals: Meal[];
  onAdd: (meal: Omit<Meal, "id">) => void;
  onDelete: (mealId: string) => void;
}

export function MealsSection({ meals, onAdd, onDelete }: MealsSectionProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setImageUri(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const takePhoto = async () => {
    if (Platform.OS === 'web') {
      pickImage();
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setImageUri(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleAddMeal = async () => {
    if (!description.trim() && !imageUri) return;

    setIsAnalyzing(true);

    try {
      let messageContent;
      if (imageUri) {
        messageContent = [
          { type: "text" as const, text: description.trim() ? `Analyze this meal and estimate the calories: "${description}"` : "Analyze this meal image and estimate the calories" },
          { type: "image" as const, image: imageUri },
        ];
      } else {
        messageContent = `Analyze this meal and estimate the calories: "${description}"`;
      }

      const result = await generateObject({
        messages: [
          {
            role: "user",
            content: messageContent,
          },
        ],
        schema: z.object({
          calories: z.number().describe("Estimated calories for this meal"),
          description: z.string().describe("Brief description of the food items"),
        }),
      });

      onAdd({
        time: format(new Date(), "HH:mm"),
        description: description.trim() || result.description,
        calories: result.calories,
        isEstimated: true,
        imageUri,
      });

      setDescription("");
      setImageUri(undefined);
      setShowModal(false);
    } catch (error) {
      console.error("Failed to analyze meal:", error);
      onAdd({
        time: format(new Date(), "HH:mm"),
        description: description.trim() || "Unknown meal",
        calories: 0,
        isEstimated: true,
        imageUri,
      });
      setDescription("");
      setImageUri(undefined);
      setShowModal(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <UtensilsCrossed color="#ffffff" size={20} />
          <Text style={styles.title}>Meals</Text>
        </View>
        {totalCalories > 0 && (
          <Text style={styles.caloriesTotal}>{totalCalories} cal</Text>
        )}
      </View>

      {meals.length > 0 && (
        <View style={styles.mealsList}>
          {meals.map((meal) => (
            <View key={meal.id} style={styles.mealItem}>
              {meal.imageUri && (
                <Image source={{ uri: meal.imageUri }} style={styles.mealImage} />
              )}
              <View style={styles.mealInfo}>
                <View style={styles.mealHeader}>
                  <Text style={styles.mealTime}>{meal.time}</Text>
                  <View style={styles.caloriesBadge}>
                    <Text style={styles.caloriesText}>{meal.calories} cal</Text>
                    {meal.isEstimated && <Sparkles color="#666666" size={12} />}
                  </View>
                </View>
                <Text style={styles.mealDescription}>{meal.description}</Text>
              </View>
              <TouchableOpacity onPress={() => onDelete(meal.id)} style={styles.deleteButton}>
                <Trash2 color="#666666" size={18} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.addButton} onPress={() => setShowModal(true)}>
        <Plus color="#ffffff" size={20} />
        <Text style={styles.addButtonText}>Log Meal</Text>
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
            <Text style={styles.modalTitle}>Log Meal</Text>
            <Text style={styles.modalSubtitle}>
              Take a photo or describe what you ate
            </Text>
            
            {imageUri ? (
              <View style={styles.imagePreview}>
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => setImageUri(undefined)}
                >
                  <Text style={styles.removeImageText}>✕</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.imageButtons}>
                <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
                  <Camera color="#ffffff" size={20} />
                  <Text style={styles.imageButtonText}>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                  <ImageIcon color="#ffffff" size={20} />
                  <Text style={styles.imageButtonText}>Gallery</Text>
                </TouchableOpacity>
              </View>
            )}
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Grilled chicken salad with olive oil"
              placeholderTextColor="#666666"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowModal(false)}
                disabled={isAnalyzing}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleAddMeal}
                disabled={isAnalyzing || (!description.trim() && !imageUri)}
              >
                {isAnalyzing ? (
                  <ActivityIndicator color="#000000" />
                ) : (
                  <>
                    <Sparkles color="#000000" size={16} />
                    <Text style={styles.modalButtonTextConfirm}>Analyze & Add</Text>
                  </>
                )}
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
  caloriesTotal: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#ffffff",
  },
  mealsList: {
    gap: 12,
    marginBottom: 12,
  },
  mealItem: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  mealImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  mealInfo: {
    flex: 1,
    gap: 4,
  },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mealTime: {
    fontSize: 13,
    color: "#666666",
    fontWeight: "600" as const,
  },
  caloriesBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  caloriesText: {
    fontSize: 13,
    color: "#ffffff",
    fontWeight: "600" as const,
  },
  mealDescription: {
    fontSize: 15,
    color: "#ffffff",
  },
  deleteButton: {
    padding: 8,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
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
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: "#0a0a0a",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: "#ffffff",
    marginBottom: 20,
    minHeight: 80,
    textAlignVertical: "top",
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
    flexDirection: "row",
    gap: 6,
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
  imageButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  imageButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#333333",
  },
  imageButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#ffffff",
  },
  imagePreview: {
    position: "relative",
    marginBottom: 16,
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  removeImageText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600" as const,
  },
});
