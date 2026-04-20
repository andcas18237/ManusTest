import { ScrollView, Text, View, Pressable, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";

interface Ingredient {
  name: string;
  quantity: string;
}

export default function RecipeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const recipeId = typeof id === "string" ? parseInt(id) : 1;

  // Fetch recipe from API
  const { data: recipe, isLoading, error } = trpc.recipes.getById.useQuery({
    id: recipeId,
  });

  if (isLoading) {
    return (
      <ScreenContainer className="justify-center items-center">
        <ActivityIndicator size="large" color="#0a7ea4" />
        <Text className="text-muted mt-2">Caricamento ricetta...</Text>
      </ScreenContainer>
    );
  }

  if (error || !recipe) {
    return (
      <ScreenContainer className="justify-center items-center">
        <Text className="text-foreground">Ricetta non trovata</Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-4 bg-primary px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Indietro</Text>
        </Pressable>
      </ScreenContainer>
    );
  }

  let ingredients: Ingredient[] = [];
  let instructions: string[] = [];

  try {
    ingredients = JSON.parse(recipe.ingredients);
    instructions = JSON.parse(recipe.instructions);
  } catch (e) {
    console.error("Error parsing recipe data:", e);
  }

  return (
    <ScreenContainer className="px-4 py-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Pressable onPress={() => router.back()} className="mb-4">
          <Text className="text-primary font-semibold">← Indietro</Text>
        </Pressable>

        {/* Title */}
        <Text className="text-3xl font-bold text-foreground mb-4">{recipe.name}</Text>

        {/* Info */}
        <View className="bg-surface rounded-lg p-4 mb-6 border border-border">
          <View className="flex-row justify-between mb-2">
            <Text className="text-muted">⏱️ Tempo: {recipe.prepTime} min</Text>
            <Text className="text-muted capitalize">Difficoltà: {recipe.difficulty}</Text>
          </View>
        </View>

        {/* Ingredients */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-foreground mb-3">Ingredienti</Text>
          {ingredients.map((ingredient, index) => (
            <View key={index} className="flex-row justify-between py-2 border-b border-border">
              <Text className="text-foreground">{ingredient.name}</Text>
              <Text className="text-muted">{ingredient.quantity}</Text>
            </View>
          ))}
        </View>

        {/* Instructions */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-foreground mb-3">Preparazione</Text>
          {instructions.map((instruction, index) => (
            <View key={index} className="flex-row mb-3">
              <Text className="text-primary font-bold mr-3">{index + 1}.</Text>
              <Text className="text-foreground flex-1">{instruction}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
