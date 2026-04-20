import { ScrollView, Text, View, Pressable, TextInput, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

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

  const createRecipeMutation = trpc.recipes.create.useMutation();
  const { refetch: refetchRecipes } = trpc.recipes.list.useQuery();

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
    <ScreenContainer className="px-4 py-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Pressable onPress={() => router.back()} className="mb-4">
          <Text className="text-primary font-semibold">← Indietro</Text>
        </Pressable>

        <Text className="text-3xl font-bold text-foreground mb-6">Aggiungi Ricetta</Text>

        {/* Name Input */}
        <Text className="text-sm font-semibold text-foreground mb-2">Nome Ricetta *</Text>
        <TextInput
          placeholder="Es. Pasta Carbonara"
          value={name}
          onChangeText={setName}
          className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground mb-4"
          placeholderTextColor="#687076"
        />

        {/* Prep Time Input */}
        <Text className="text-sm font-semibold text-foreground mb-2">Tempo Preparazione (min) *</Text>
        <TextInput
          placeholder="Es. 20"
          value={prepTime}
          onChangeText={setPrepTime}
          keyboardType="numeric"
          className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground mb-4"
          placeholderTextColor="#687076"
        />

        {/* Difficulty */}
        <Text className="text-sm font-semibold text-foreground mb-2">Difficoltà *</Text>
        <View className="flex-row gap-2 mb-4">
          {(["facile", "media", "difficile"] as const).map((level) => (
            <Pressable
              key={level}
              onPress={() => setDifficulty(level)}
              className={`flex-1 py-2 rounded-lg border ${
                difficulty === level
                  ? "bg-primary border-primary"
                  : "bg-surface border-border"
              }`}
            >
              <Text
                className={`text-center font-semibold capitalize ${
                  difficulty === level ? "text-white" : "text-foreground"
                }`}
              >
                {level}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Ingredients */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-foreground">Ingredienti *</Text>
            <Pressable
              onPress={handleAddIngredient}
              className="bg-primary px-3 py-1 rounded"
            >
              <Text className="text-white font-semibold">+ Aggiungi</Text>
            </Pressable>
          </View>

          {ingredients.map((ingredient, index) => (
            <View key={index} className="mb-3 pb-3 border-b border-border">
              <View className="flex-row gap-2 mb-2">
                <TextInput
                  placeholder="Ingrediente"
                  value={ingredient.name}
                  onChangeText={(value) => handleUpdateIngredient(index, "name", value)}
                  className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-foreground"
                  placeholderTextColor="#687076"
                />
                <TextInput
                  placeholder="Quantità"
                  value={ingredient.quantity}
                  onChangeText={(value) => handleUpdateIngredient(index, "quantity", value)}
                  className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-foreground"
                  placeholderTextColor="#687076"
                />
              </View>
              {ingredients.length > 1 && (
                <Pressable
                  onPress={() => handleRemoveIngredient(index)}
                  className="bg-error px-3 py-1 rounded self-start"
                >
                  <Text className="text-white text-xs font-semibold">Rimuovi</Text>
                </Pressable>
              )}
            </View>
          ))}
        </View>

        {/* Instructions */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-foreground">Istruzioni *</Text>
            <Pressable
              onPress={handleAddInstruction}
              className="bg-primary px-3 py-1 rounded"
            >
              <Text className="text-white font-semibold">+ Aggiungi</Text>
            </Pressable>
          </View>

          {instructions.map((instruction, index) => (
            <View key={index} className="mb-3 pb-3 border-b border-border">
              <View className="flex-row gap-2 items-start mb-2">
                <Text className="text-primary font-bold mt-3">{index + 1}.</Text>
                <TextInput
                  placeholder="Descrivi il passaggio"
                  value={instruction}
                  onChangeText={(value) => handleUpdateInstruction(index, value)}
                  multiline
                  numberOfLines={2}
                  className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-foreground"
                  placeholderTextColor="#687076"
                />
              </View>
              {instructions.length > 1 && (
                <Pressable
                  onPress={() => handleRemoveInstruction(index)}
                  className="bg-error px-3 py-1 rounded self-start ml-6"
                >
                  <Text className="text-white text-xs font-semibold">Rimuovi</Text>
                </Pressable>
              )}
            </View>
          ))}
        </View>

        {/* Submit Button */}
        <Pressable
          onPress={handleSubmit}
          disabled={isSubmitting}
          style={({ pressed }) => [
            {
              opacity: pressed || isSubmitting ? 0.7 : 1,
            },
          ]}
          className="bg-primary rounded-lg py-4 items-center mb-6"
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Salva Ricetta</Text>
          )}
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}
