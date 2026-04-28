import { ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { BackButton, EmptyState, LoadingState, MetricTile, PageHeader, ResponsiveContainer, SectionTitle, Surface } from "@/components/ui/app-ui";
import { useRecipe } from "@/hooks/use-app-data";

interface Ingredient {
  name: string;
  quantity: string;
}

export default function RecipeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const recipeId = typeof id === "string" ? parseInt(id) : 1;

  // Fetch recipe from API
  const { data: recipe, isLoading, error } = useRecipe(recipeId);

  if (isLoading) {
    return (
      <ScreenContainer className="justify-center items-center px-4">
        <ResponsiveContainer>
          <LoadingState label="Caricamento ricetta..." />
        </ResponsiveContainer>
      </ScreenContainer>
    );
  }

  if (error || !recipe) {
    return (
      <ScreenContainer className="justify-center items-center px-4">
        <ResponsiveContainer>
          <EmptyState
            icon="menu-book"
            title="Ricetta non trovata"
            description="Il contenuto richiesto non e disponibile oppure non puo essere caricato."
          />
          <BackButton onPress={() => router.back()} />
        </ResponsiveContainer>
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
    <ScreenContainer className="px-4 pt-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <ResponsiveContainer className="gap-5 pb-16">
          <BackButton onPress={() => router.back()} />
          <PageHeader title={recipe.name} description="Dettagli organizzati con gerarchia visiva piu chiara e sezioni leggibili." />

          <View className="flex-row flex-wrap gap-3">
            <MetricTile label="Tempo" value={`${recipe.prepTime} min`} accent />
            <MetricTile label="Difficolta" value={recipe.difficulty} />
          </View>

          <Surface className="p-5">
            <SectionTitle title="Ingredienti" description={`${ingredients.length} elementi`} />
            <View className="mt-4 gap-3">
              {ingredients.map((ingredient, index) => (
                <View key={index} className="flex-row items-center justify-between rounded-2xl bg-background px-4 py-3">
                  <Text className="flex-1 text-base font-medium text-foreground">{ingredient.name}</Text>
                  <Text className="text-sm text-muted">{ingredient.quantity}</Text>
                </View>
              ))}
            </View>
          </Surface>

          <Surface className="p-5">
            <SectionTitle title="Preparazione" description={`${instructions.length} passaggi`} />
            <View className="mt-4 gap-4">
              {instructions.map((instruction, index) => (
                <View key={index} className="flex-row gap-3">
                  <View className="h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Text className="font-semibold text-primary">{index + 1}</Text>
                  </View>
                  <Text className="flex-1 pt-1 text-sm leading-6 text-foreground">{instruction}</Text>
                </View>
              ))}
            </View>
          </Surface>
        </ResponsiveContainer>
      </ScrollView>
    </ScreenContainer>
  );
}
