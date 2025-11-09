import { FileText } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";

interface GoalNotesSectionProps {
  notes: string;
  onUpdate: (notes: string) => void;
}

export function GoalNotesSection({ notes, onUpdate }: GoalNotesSectionProps) {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FileText color="#ffffff" size={20} />
        <Text style={styles.title}>Goal Notes</Text>
      </View>

      <TextInput
        style={[styles.input, isFocused && styles.inputFocused]}
        placeholder="Write notes about your goals..."
        placeholderTextColor="#666666"
        value={notes}
        onChangeText={onUpdate}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
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
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#ffffff",
  },
  input: {
    backgroundColor: "#000000",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: "#ffffff",
    minHeight: 100,
    borderWidth: 1,
    borderColor: "#1a1a1a",
  },
  inputFocused: {
    borderColor: "#333333",
  },
});
