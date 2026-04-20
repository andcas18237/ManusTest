import { ScrollView, Text, View, FlatList, Pressable, TextInput } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { cn } from "@/lib/utils";

interface Recipe {
  id: number;
  name: string;
  prepTime: number;
  difficulty: "facile" | "media" | "difficile";
  image?: string;
}

export default function RecipesScreen() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Dati di esempio
  const sampleRecipes: Recipe[] = [
    { id: 1, name: "Pasta Carbonara", prepTime: 20, difficulty: "facile" },
    { id: 2, name: "Risotto ai Funghi", prepTime: 35, difficulty: "media" },
    { id: 3, name: "Osso Buco", prepTime: 120, difficulty: "difficile" },
    { id: 4, name: "Tiramisu", prepTime: 30, difficulty: "media" },
    { id: 5, name: "Lasagne", prepTime: 90, difficulty: "difficile" },
    { id: 6, name: "Insalata Caprese", prepTime: 10, difficulty: "facile" },
  ];

  useEffect(() => {
    // Simulare caricamento da API
    setRecipes(sampleRecipes);
    setFilteredRecipes(sampleRecipes);
    setLoading(false);
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = recipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredRecipes(filtered);
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

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-muted">Caricamento...</Text>
        </View>
      ) : filteredRecipes.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-muted text-center">Nessuna ricetta trovata</Text>
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
