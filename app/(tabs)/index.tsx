import { ScrollView, Text, View, FlatList, Pressable, TextInput, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";

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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "facile":
        return "bg-success";
      case "media":
        return "bg-warning";
      case "difficile":
        return "bg-error";
      default:
        return "bg-muted";
    }
  };

  const handleRecipePress = (recipeId: number) => {
    router.push({
      pathname: "/recipe-detail",
      params: { id: recipeId.toString() },
    });
  };

  const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
    <Pressable
      onPress={() => handleRecipePress(recipe.id)}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View className="bg-surface rounded-lg p-4 mb-3 border border-border">
        <View className="flex-row justify-between items-start mb-2">
          <Text className="text-lg font-semibold text-foreground flex-1">{recipe.name}</Text>
          <View className={cn("px-2 py-1 rounded", getDifficultyColor(recipe.difficulty))}>
            <Text className="text-xs font-medium text-white capitalize">{recipe.difficulty}</Text>
          </View>
        </View>
        <Text className="text-sm text-muted">⏱️ {recipe.prepTime} min</Text>
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer className="px-4 py-4">
      <View className="mb-4">
        <Text className="text-3xl font-bold text-foreground mb-4">Ricette</Text>
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
          renderItem={({ item }) => <RecipeCard recipe={item} />}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          contentContainerStyle={{ flexGrow: 1 }}
        />
      )}
    </ScreenContainer>
  );
}
