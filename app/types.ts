// types.ts
export type RecipePayload = {
  title: string;
  time?: string;
  difficulty?: string;
  ingredients?: string;
  instructions?: string;
};

export type RootStackParamList = {
  Home: { newRecipe?: RecipePayload } | undefined;
  AddRecipe: undefined;
};
