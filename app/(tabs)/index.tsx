import { ScrollView, Text, View, FlatList, Pressable, TextInput, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { RecipeCard } from "@/components/recipe-card";

interface Recipe {
  id: number;
  name: string;
  prepTime: number;
  difficulty: "facile" | "media" | "difficile";
  ingredients: string; // JSON string
  instructions: string; // JSON string
  createdAt: Date;
  updatedAt: Date;
}

export default function RecipesScreen() {
  const router = useRouter();
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all recipes from API
  const { data: recipes, isLoading, error } = trpc.recipes.list.useQuery();

  // Update filtered recipes when recipes or search query changes
  useEffect(() => {
    if (recipes) {
      const filtered = recipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRecipes(filtered);
    }
  }, [recipes, searchQuery]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleRecipePress = (recipeId: number) => {
    router.push({
      pathname: "/recipe-detail",
      params: { id: recipeId.toString() },
    });
  };

  return (
    <ScreenContainer className="px-4 py-4" edges={["top", "left", "right", "bottom"]}>
      <View className="mb-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-3xl font-bold text-foreground">Ricette</Text>
          <Pressable
            onPress={() => router.push("/add-recipe")}
            className="bg-primary rounded-full w-12 h-12 justify-center items-center shadow-md"
          >
            <Text className="text-white text-2xl font-bold">+</Text>
          </Pressable>
        </View>
        <TextInput
          placeholder="Cerca ricetta..."
          value={searchQuery}
          onChangeText={handleSearch}
          className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
          placeholderTextColor="#687076"
        />
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0a7ea4" />
          <Text className="text-muted mt-2">Caricamento ricette...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-error text-center">Errore nel caricamento delle ricette</Text>
          <Text className="text-muted text-center mt-2 text-xs">{error.message}</Text>
        </View>
      ) : filteredRecipes.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-muted text-center">
            {searchQuery ? "Nessuna ricetta trovata" : "Nessuna ricetta disponibile"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredRecipes}
          renderItem={({ item }) => (
            <RecipeCard
              id={item.id}
              name={item.name}
              prepTime={item.prepTime}
              difficulty={item.difficulty}
              onPress={handleRecipePress}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={true}
          nestedScrollEnabled={true}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </ScreenContainer>
  );
}
