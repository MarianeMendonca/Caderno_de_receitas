// AddRecipe.tsx
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { addRecipe } from "./storage";
import type { RecipePayload } from "./types";

const ORANGE = "#ff7a00";
const WHITE = "#ffffff";
const LIGHT_GRAY = "#f6f6f8";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: WHITE },
  container: { padding: 20 },

  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
  cancelText: { color: "#777", fontWeight: "600" },
  headerTitle: { fontSize: 18, fontWeight: "800", color: ORANGE },
  saveText: { color: ORANGE, fontWeight: "800" },

  field: { marginBottom: 14 },
  label: { fontSize: 13, color: "#444", marginBottom: 6, fontWeight: "600" },
  input: { backgroundColor: LIGHT_GRAY, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  textArea: { height: 140 },

  previewBtn: { marginTop: 8, backgroundColor: ORANGE, paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  previewText: { color: WHITE, fontWeight: "800" },
});

const AddRecipe: React.FC = () => {
  const navigation = useNavigation<any>();
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [saving, setSaving] = useState(false);

  const handlePreview = () => {
    // preview com alerta — garante que funciona mesmo com teclado visível
    const message = `${title || "(sem título)"}\n\n${instructions || "(sem instruções)"}`;
    Alert.alert("Pré-visualizar", message);
    console.log("DEBUG: preview message:", message);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Atenção", "Preencha o título da receita.");
      return;
    }

    const payload: RecipePayload = {
      title: title.trim(),
      time: time.trim() || undefined,
      difficulty: difficulty.trim() || undefined,
      ingredients: ingredients.trim() || undefined,
      instructions: instructions.trim() || undefined,
    };

    setSaving(true);
    try {
      console.log("DEBUG: saving payload:", payload);
      const created = await addRecipe(payload);
      if (!created) throw new Error("storage.addRecipe retornou undefined");
      // sucesso: navega para Home (Index usa useFocusEffect para recarregar)
      if (typeof navigation?.navigate === "function") {
        navigation.navigate("Home", { newRecipe: created });
      }
      // volta para a lista; pequeno delay para o sistema processar
      setTimeout(() => {
        if (typeof navigation?.goBack === "function") navigation.goBack();
      }, 80);
    } catch (err) {
      console.error("AddRecipe.handleSave error:", err);
      Alert.alert("Erro", "Não foi possível salvar a receita. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.select({ ios: "padding" })} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => (typeof navigation?.goBack === "function" ? navigation.goBack() : null)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Nova Receita</Text>
            <TouchableOpacity onPress={handleSave} disabled={saving}>
              <Text style={styles.saveText}>{saving ? "Salvando..." : "Salvar"}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Título</Text>
            <TextInput style={styles.input} placeholder="Ex: Bolo de Chocolate" value={title} onChangeText={setTitle} returnKeyType="next" />
          </View>

          <View style={{ flexDirection: "row", marginBottom: 12 }}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.label}>Tempo</Text>
              <TextInput style={styles.input} placeholder="Ex: 45 min" value={time} onChangeText={setTime} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Dificuldade</Text>
              <TextInput style={styles.input} placeholder="Ex: Fácil" value={difficulty} onChangeText={setDifficulty} />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Ingredientes (um por linha)</Text>
            <TextInput style={[styles.input, styles.textArea]} placeholder={"2 ovos\n1 xícara de farinha\n..."} value={ingredients} onChangeText={setIngredients} multiline textAlignVertical="top" />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Instruções</Text>
            <TextInput style={[styles.input, styles.textArea]} placeholder="Descreva o passo a passo..." value={instructions} onChangeText={setInstructions} multiline textAlignVertical="top" />
          </View>

          <TouchableOpacity style={styles.previewBtn} onPress={handlePreview} disabled={saving}>
            <Text style={styles.previewText}>Pré-visualizar</Text>
          </TouchableOpacity>

          <View style={{ height: 14 }} />

          <TouchableOpacity style={[styles.previewBtn, { backgroundColor: "#333" }]} onPress={handleSave} disabled={saving}>
            {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.previewText}>Salvar e Voltar</Text>}
          </TouchableOpacity>

          <View style={{ height: 60 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddRecipe;
