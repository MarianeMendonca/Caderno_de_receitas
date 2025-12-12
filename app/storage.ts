// storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { RecipePayload } from "./types";

const RECIPES_KEY = "@myapp:recipes";

export type StoredRecipe = RecipePayload & { id: string };

export async function getAllRecipes(): Promise<StoredRecipe[]> {
  try {
    const raw = await AsyncStorage.getItem(RECIPES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as StoredRecipe[];
  } catch (err) {
    console.error("storage.getAllRecipes error:", err);
    return [];
  }
}

export async function saveAllRecipes(recipes: StoredRecipe[]): Promise<boolean> {
  try {
    await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
    return true;
  } catch (err) {
    console.error("storage.saveAllRecipes error:", err);
    return false;
  }
}

export async function addRecipe(payload: RecipePayload): Promise<StoredRecipe | undefined> {
  try {
    const list = await getAllRecipes();
    const newItem: StoredRecipe = {
      id: String(Date.now()),
      title: payload.title,
      time: payload.time,
      difficulty: payload.difficulty,
      ingredients: payload.ingredients,
      instructions: payload.instructions,
    };
    const updated = [newItem, ...list];
    await saveAllRecipes(updated);
    return newItem;
  } catch (err) {
    console.error("storage.addRecipe error:", err);
    return undefined;
  }
}

export async function clearAllRecipes(): Promise<void> {
  try {
    await AsyncStorage.removeItem(RECIPES_KEY);
  } catch (err) {
    console.error("storage.clearAllRecipes error:", err);
  }
}
