import { ScrollView, Text, View, FlatList, Pressable, TextInput } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";

interface Restaurant {
  id: number;
  name: string;
  avgPrice: number;
  dishes: string[];
  distance: number;
}

export default function RestaurantsScreen() {
  const router = useRouter();
  const [maxPrice, setMaxPrice] = useState("");
  const [dishSearch, setDishSearch] = useState("");
  const [results, setResults] = useState<Restaurant[]>([]);
  const [searched, setSearched] = useState(false);

  // Dati di esempio
  const sampleRestaurants: Restaurant[] = [
    {
      id: 1,
      name: "Da Mario",
      avgPrice: 18,
      dishes: ["Lasagne", "Carbonara", "Amatriciana"],
      distance: 2.5,
    },
    {
      id: 2,
      name: "Trattoria Roma",
      avgPrice: 22,
      dishes: ["Osso Buco", "Risotto", "Vitello Tonnato"],
      distance: 3.2,
    },
    {
      id: 3,
      name: "Pizzeria Napoli",
      avgPrice: 12,
      dishes: ["Pizza Margherita", "Pizza Quattro Formaggi", "Calzone"],
      distance: 1.8,
    },
    {
      id: 4,
      name: "Ristorante Elegante",
      avgPrice: 35,
      dishes: ["Branzino al Forno", "Risotto ai Tartufi", "Costata"],
      distance: 4.5,
    },
    {
      id: 5,
      name: "Trattoria Toscana",
      avgPrice: 20,
      dishes: ["Bistecca Fiorentina", "Ribollita", "Pici al Ragù"],
      distance: 2.1,
    },
  ];

  const handleSearch = () => {
    const price = maxPrice ? parseInt(maxPrice) : Infinity;
    const filtered = sampleRestaurants.filter((restaurant) => {
      const priceMatch = restaurant.avgPrice <= price;
      const dishMatch =
        dishSearch === "" ||
        restaurant.dishes.some((dish) =>
          dish.toLowerCase().includes(dishSearch.toLowerCase())
        );
      return priceMatch && dishMatch;
    });
    setResults(filtered);
    setSearched(true);
  };

  const handleRestaurantPress = (restaurantId: number) => {
    router.push({
      pathname: "/restaurant-detail",
      params: { id: restaurantId.toString() },
    });
  };

  const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => (
    <Pressable
      onPress={() => handleRestaurantPress(restaurant.id)}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View className="bg-surface rounded-lg p-4 mb-3 border border-border">
        <View className="flex-row justify-between items-start mb-2">
          <Text className="text-lg font-semibold text-foreground flex-1">{restaurant.name}</Text>
          <Text className="text-primary font-bold">€{restaurant.avgPrice}</Text>
        </View>
        <Text className="text-sm text-muted mb-2">📍 {restaurant.distance}km</Text>
        <Text className="text-xs text-muted">
          Piatti: {restaurant.dishes.slice(0, 2).join(", ")}
          {restaurant.dishes.length > 2 ? "..." : ""}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer className="px-4 py-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="text-3xl font-bold text-foreground mb-4">Ristoranti</Text>

        {/* Filter Section */}
        <View className="bg-surface rounded-lg p-4 mb-6 border border-border">
          <Text className="text-sm font-semibold text-foreground mb-3">Filtri Ricerca</Text>

          <Text className="text-xs text-muted mb-1">Prezzo massimo (€/persona)</Text>
          <TextInput
            placeholder="Es. 20"
            value={maxPrice}
            onChangeText={setMaxPrice}
            keyboardType="numeric"
            className="bg-background border border-border rounded-lg px-3 py-2 text-foreground mb-4"
            placeholderTextColor="#687076"
          />

          <Text className="text-xs text-muted mb-1">Piatto desiderato</Text>
          <TextInput
            placeholder="Es. Lasagne"
            value={dishSearch}
            onChangeText={setDishSearch}
            className="bg-background border border-border rounded-lg px-3 py-2 text-foreground mb-4"
            placeholderTextColor="#687076"
          />

          <Pressable
            onPress={handleSearch}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            className="bg-primary rounded-lg py-3 items-center"
          >
            <Text className="text-white font-semibold">Cerca</Text>
          </Pressable>
        </View>

        {/* Results Section */}
        {searched ? (
          results.length === 0 ? (
            <View className="flex-1 justify-center items-center py-8">
              <Text className="text-muted text-center">
                Nessun ristorante trovato con questi criteri
              </Text>
            </View>
          ) : (
            <View>
              <Text className="text-sm font-semibold text-muted mb-3">
                Trovati {results.length} ristoranti
              </Text>
              <FlatList
                data={results}
                renderItem={({ item }) => <RestaurantCard restaurant={item} />}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
              />
            </View>
          )
        ) : (
          <View className="flex-1 justify-center items-center py-8">
            <Text className="text-muted text-center">
              Usa i filtri per cercare ristoranti
            </Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
