import { ScrollView, Text, View, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";

interface RecipeDetail {
  id: number;
  name: string;
  prepTime: number;
  difficulty: "facile" | "media" | "difficile";
  servings: number;
  ingredients: { name: string; quantity: string }[];
  instructions: string[];
}

const recipeDatabase: Record<number, RecipeDetail> = {
  1: {
    id: 1,
    name: "Pasta Carbonara",
    prepTime: 20,
    difficulty: "facile",
    servings: 4,
    ingredients: [
      { name: "Pasta", quantity: "400g" },
      { name: "Guanciale", quantity: "200g" },
      { name: "Uova", quantity: "4" },
      { name: "Pecorino Romano", quantity: "100g" },
      { name: "Pepe nero", quantity: "q.b." },
    ],
    instructions: [
      "Cuocere la pasta in acqua salata",
      "Rosolare il guanciale a cubetti",
      "Mescolare le uova con il pecorino",
      "Scolare la pasta e mescolare con il guanciale",
      "Aggiungere il composto di uova fuori dal fuoco",
      "Servire con pepe nero",
    ],
  },
  2: {
    id: 2,
    name: "Risotto ai Funghi",
    prepTime: 35,
    difficulty: "media",
    servings: 4,
    ingredients: [
      { name: "Riso Arborio", quantity: "300g" },
      { name: "Funghi", quantity: "300g" },
      { name: "Cipolla", quantity: "1" },
      { name: "Vino bianco", quantity: "150ml" },
      { name: "Brodo vegetale", quantity: "1L" },
      { name: "Burro", quantity: "50g" },
      { name: "Parmigiano", quantity: "50g" },
    ],
    instructions: [
      "Rosolare la cipolla tritata",
      "Aggiungere il riso e tostarlo",
      "Sfumare con il vino bianco",
      "Aggiungere il brodo poco alla volta",
      "Rosolare i funghi a parte",
      "Manteccare con burro e parmigiano",
      "Aggiungere i funghi e servire",
    ],
  },
  3: {
    id: 3,
    name: "Osso Buco",
    prepTime: 120,
    difficulty: "difficile",
    servings: 4,
    ingredients: [
      { name: "Osso buco", quantity: "4 pezzi" },
      { name: "Carota", quantity: "1" },
      { name: "Sedano", quantity: "1" },
      { name: "Cipolla", quantity: "1" },
      { name: "Vino rosso", quantity: "250ml" },
      { name: "Pomodori pelati", quantity: "400g" },
      { name: "Brodo", quantity: "500ml" },
    ],
    instructions: [
      "Rosolare l'osso buco in olio",
      "Aggiungere soffritto di verdure",
      "Sfumare con vino rosso",
      "Aggiungere pomodori e brodo",
      "Cuocere a fuoco lento per 2 ore",
      "Servire con risotto o polenta",
    ],
  },
  4: {
    id: 4,
    name: "Tiramisu",
    prepTime: 30,
    difficulty: "media",
    servings: 6,
    ingredients: [
      { name: "Mascarpone", quantity: "500g" },
      { name: "Uova", quantity: "4" },
      { name: "Zucchero", quantity: "100g" },
      { name: "Caffè", quantity: "300ml" },
      { name: "Cacao", quantity: "q.b." },
      { name: "Biscotti Savoiardi", quantity: "300g" },
    ],
    instructions: [
      "Montare i tuorli con lo zucchero",
      "Aggiungere il mascarpone",
      "Montare gli albumi a neve",
      "Incorporare gli albumi al composto",
      "Inzuppare i savoiardi nel caffè",
      "Stendere uno strato di crema",
      "Alternare strati di biscotti e crema",
      "Cospargere di cacao e riposare in frigo",
    ],
  },
  5: {
    id: 5,
    name: "Lasagne",
    prepTime: 90,
    difficulty: "difficile",
    servings: 6,
    ingredients: [
      { name: "Sfoglia lasagne", quantity: "500g" },
      { name: "Carne macinata", quantity: "500g" },
      { name: "Pomodori pelati", quantity: "800g" },
      { name: "Latte", quantity: "500ml" },
      { name: "Burro", quantity: "50g" },
      { name: "Farina", quantity: "50g" },
      { name: "Parmigiano", quantity: "100g" },
    ],
    instructions: [
      "Preparare il ragù con la carne",
      "Preparare la besciamella",
      "Stendere uno strato di ragù",
      "Aggiungere la sfoglia",
      "Alternare ragù, sfoglia e besciamella",
      "Terminare con besciamella e parmigiano",
      "Cuocere a 180°C per 30 minuti",
    ],
  },
  6: {
    id: 6,
    name: "Insalata Caprese",
    prepTime: 10,
    difficulty: "facile",
    servings: 2,
    ingredients: [
      { name: "Pomodori", quantity: "2 grandi" },
      { name: "Mozzarella", quantity: "200g" },
      { name: "Basilico", quantity: "q.b." },
      { name: "Olio extravergine", quantity: "q.b." },
      { name: "Sale", quantity: "q.b." },
      { name: "Pepe", quantity: "q.b." },
    ],
    instructions: [
      "Affettare i pomodori",
      "Affettare la mozzarella",
      "Alternare pomodori e mozzarella",
      "Aggiungere basilico fresco",
      "Condire con olio, sale e pepe",
      "Servire subito",
    ],
  },
};

export default function RecipeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const recipeId = typeof id === "string" ? parseInt(id) : 1;
  const recipe = recipeDatabase[recipeId];

  if (!recipe) {
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
            <Text className="text-muted">👥 Porzioni: {recipe.servings}</Text>
          </View>
          <Text className="text-muted">Difficoltà: {recipe.difficulty}</Text>
        </View>

        {/* Ingredients */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-foreground mb-3">Ingredienti</Text>
          {recipe.ingredients.map((ingredient, index) => (
            <View key={index} className="flex-row justify-between py-2 border-b border-border">
              <Text className="text-foreground">{ingredient.name}</Text>
              <Text className="text-muted">{ingredient.quantity}</Text>
            </View>
          ))}
        </View>

        {/* Instructions */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-foreground mb-3">Preparazione</Text>
          {recipe.instructions.map((instruction, index) => (
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
