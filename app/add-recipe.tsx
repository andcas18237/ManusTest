import { ScrollView, Text, View, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useState } from "react";
import { BackButton, FilterChip, PageHeader, PrimaryButton, ResponsiveContainer, SectionTitle, Surface, TextField } from "@/components/ui/app-ui";
import { useCreateRecipe, useRecipes } from "@/hooks/use-app-data";

interface Ingredient {
  name: string;
  quantity: string;
}

export default function AddRecipeScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [difficulty, setDifficulty] = useState<"facile" | "media" | "difficile">("facile");
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: "", quantity: "" }]);
  const [instructions, setInstructions] = useState<string[]>(["", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createRecipeMutation = useCreateRecipe();
  const { refetch: refetchRecipes } = useRecipes();

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "" }]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleUpdateIngredient = (index: number, field: "name" | "quantity", value: string) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const handleRemoveInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleUpdateInstruction = (index: number, value: string) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert("Errore", "Inserisci il nome della ricetta");
      return;
    }

    if (!prepTime.trim() || isNaN(parseInt(prepTime))) {
      Alert.alert("Errore", "Inserisci un tempo di preparazione valido");
      return;
    }

    const validIngredients = ingredients.filter((ing) => ing.name.trim() && ing.quantity.trim());
    if (validIngredients.length === 0) {
      Alert.alert("Errore", "Aggiungi almeno un ingrediente");
      return;
    }

    const validInstructions = instructions.filter((instr) => instr.trim());
    if (validInstructions.length === 0) {
      Alert.alert("Errore", "Aggiungi almeno un'istruzione");
      return;
    }

    setIsSubmitting(true);

    try {
      await createRecipeMutation.mutateAsync({
        name: name.trim(),
        prepTime: parseInt(prepTime),
        difficulty,
        ingredients: validIngredients,
        instructions: validInstructions,
      });

      // Refetch recipes
      await refetchRecipes();

      Alert.alert("Successo", "Ricetta creata con successo!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert("Errore", "Errore nel salvataggio della ricetta");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenContainer className="px-4 pt-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <ResponsiveContainer className="gap-5 pb-28">
          <BackButton onPress={() => router.back()} />
          <PageHeader
            eyebrow="New entry"
            title="Aggiungi ricetta"
            description="Un form piu pulito e modulare, pensato per inserire contenuti senza distrazioni."
          />

          <Surface className="gap-4 p-5">
            <TextField
              label="Nome ricetta *"
              placeholder="Es. Pasta Carbonara"
              value={name}
              onChangeText={setName}
            />
            <TextField
              label="Tempo preparazione (min) *"
              placeholder="Es. 20"
              value={prepTime}
              onChangeText={setPrepTime}
              keyboardType="numeric"
            />
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Difficolta *</Text>
              <View className="flex-row flex-wrap gap-2">
                {(["facile", "media", "difficile"] as const).map((level) => (
                  <FilterChip
                    key={level}
                    label={level}
                    selected={difficulty === level}
                    onPress={() => setDifficulty(level)}
                  />
                ))}
              </View>
            </View>
          </Surface>

          <Surface className="p-5">
            <SectionTitle
              title="Ingredienti *"
              action={
                <Pressable onPress={handleAddIngredient}>
                  <Text className="text-sm font-semibold text-primary">Aggiungi</Text>
                </Pressable>
              }
            />

          {ingredients.map((ingredient, index) => (
            <View key={index} className="mt-4 rounded-2xl bg-background p-4">
              <View className="flex-row gap-3">
                <TextField
                  label="Ingrediente"
                  value={ingredient.name}
                  onChangeText={(value) => handleUpdateIngredient(index, "name", value)}
                  containerClassName="flex-1"
                />
                <TextField
                  label="Quantita"
                  value={ingredient.quantity}
                  onChangeText={(value) => handleUpdateIngredient(index, "quantity", value)}
                  containerClassName="flex-1"
                />
              </View>
              {ingredients.length > 1 && (
                <Pressable
                  onPress={() => handleRemoveIngredient(index)}
                  className="mt-3 self-start rounded-full bg-error px-3 py-1.5"
                >
                  <Text className="text-white text-xs font-semibold">Rimuovi</Text>
                </Pressable>
              )}
            </View>
          ))}
          </Surface>

          <Surface className="p-5">
            <SectionTitle
              title="Istruzioni *"
              action={
                <Pressable onPress={handleAddInstruction}>
                  <Text className="text-sm font-semibold text-primary">Aggiungi</Text>
                </Pressable>
              }
            />

          {instructions.map((instruction, index) => (
            <View key={index} className="mt-4 rounded-2xl bg-background p-4">
              <View className="flex-row gap-3 items-start">
                <View className="mt-3 h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Text className="font-semibold text-primary">{index + 1}</Text>
                </View>
                <TextField
                  label="Passaggio"
                  placeholder="Descrivi il passaggio"
                  value={instruction}
                  onChangeText={(value) => handleUpdateInstruction(index, value)}
                  multiline
                  numberOfLines={3}
                  containerClassName="flex-1"
                  className="min-h-24"
                />
              </View>
              {instructions.length > 1 && (
                <Pressable
                  onPress={() => handleRemoveInstruction(index)}
                  className="ml-11 mt-3 self-start rounded-full bg-error px-3 py-1.5"
                >
                  <Text className="text-white text-xs font-semibold">Rimuovi</Text>
                </Pressable>
              )}
            </View>
          ))}
          </Surface>

          <PrimaryButton
            label="Salva ricetta"
            onPress={handleSubmit}
            loading={isSubmitting || createRecipeMutation.isPending}
            icon="save"
          />
        </ResponsiveContainer>
      </ScrollView>
    </ScreenContainer>
  );
}
