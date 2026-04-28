import { Text, View, FlatList } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { RecipeCard } from "@/components/recipe-card";
import { EmptyState, IconButton, LoadingState, PageHeader, ResponsiveContainer, Surface, TextField } from "@/components/ui/app-ui";
import { useRecipes } from "@/hooks/use-app-data";
import type { RecipeRecord } from "@/lib/app-data";

export default function RecipesScreen() {
  const router = useRouter();
  const [filteredRecipes, setFilteredRecipes] = useState<RecipeRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all recipes from API
  const { data: recipes, isLoading, error, refetch } = useRecipes();

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

  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch]),
  );

  return (
    <ScreenContainer className="px-4 pt-4" edges={["top", "left", "right", "bottom"]}>
      <ResponsiveContainer className="flex-1 gap-5 pb-28">
        <PageHeader
          eyebrow="Cookbook"
          title="Ricette"
          description="Una libreria pulita e veloce da consultare, con ricerca immediata e dettagli sempre leggibili."
          action={<IconButton icon="add" onPress={() => router.push("/add-recipe")} />}
        />

        <Surface className="p-4">
          <TextField
            label="Cerca"
            hint={`${filteredRecipes.length} risultati`}
            placeholder="Cerca per nome ricetta"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </Surface>

        {isLoading ? (
          <LoadingState label="Caricamento ricette..." />
        ) : error ? (
          <Surface className="p-5">
            <Text className="text-base font-semibold text-error">Errore nel caricamento delle ricette</Text>
            <Text className="mt-2 text-sm leading-6 text-muted">{error.message}</Text>
          </Surface>
        ) : filteredRecipes.length === 0 ? (
          <EmptyState
            icon={searchQuery ? "search-off" : "menu-book"}
            title={searchQuery ? "Nessuna ricetta trovata" : "Ancora nessuna ricetta"}
            description={
              searchQuery
                ? "Prova a cambiare termine di ricerca oppure aggiungi una nuova ricetta."
                : "Inizia creando la prima ricetta per riempire la tua raccolta."
            }
          />
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
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 8 }}
          />
        )}
      </ResponsiveContainer>
    </ScreenContainer>
  );
}
