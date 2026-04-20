import { ScrollView, Text, View, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";

interface RestaurantDetail {
  id: number;
  name: string;
  avgPrice: number;
  address: string;
  phone: string;
  hours: string;
  rating: number;
  dishes: string[];
  distance: number;
}

const restaurantDatabase: Record<number, RestaurantDetail> = {
  1: {
    id: 1,
    name: "Da Mario",
    avgPrice: 18,
    address: "Via Roma 123, Milano",
    phone: "02 1234567",
    hours: "12:00 - 14:30, 19:00 - 23:00",
    rating: 4.5,
    dishes: ["Lasagne", "Carbonara", "Amatriciana", "Cacio e Pepe"],
    distance: 2.5,
  },
  2: {
    id: 2,
    name: "Trattoria Roma",
    avgPrice: 22,
    address: "Via Garibaldi 45, Milano",
    phone: "02 2345678",
    hours: "12:00 - 15:00, 19:00 - 23:30",
    rating: 4.7,
    dishes: ["Osso Buco", "Risotto", "Vitello Tonnato", "Pappardelle al Cinghiale"],
    distance: 3.2,
  },
  3: {
    id: 3,
    name: "Pizzeria Napoli",
    avgPrice: 12,
    address: "Via Toledo 78, Milano",
    phone: "02 3456789",
    hours: "11:30 - 14:00, 18:00 - 23:00",
    rating: 4.3,
    dishes: ["Pizza Margherita", "Pizza Quattro Formaggi", "Calzone", "Frittatina"],
    distance: 1.8,
  },
  4: {
    id: 4,
    name: "Ristorante Elegante",
    avgPrice: 35,
    address: "Via Montenapoleone 12, Milano",
    phone: "02 4567890",
    hours: "12:30 - 14:30, 19:30 - 23:00",
    rating: 4.9,
    dishes: ["Branzino al Forno", "Risotto ai Tartufi", "Costata", "Orata"],
    distance: 4.5,
  },
  5: {
    id: 5,
    name: "Trattoria Toscana",
    avgPrice: 20,
    address: "Via Dante 56, Milano",
    phone: "02 5678901",
    hours: "12:00 - 14:30, 19:00 - 23:00",
    rating: 4.6,
    dishes: ["Bistecca Fiorentina", "Ribollita", "Pici al Ragù", "Trippa alla Fiorentina"],
    distance: 2.1,
  },
};

export default function RestaurantDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const restaurantId = typeof id === "string" ? parseInt(id) : 1;
  const restaurant = restaurantDatabase[restaurantId];

  if (!restaurant) {
    return (
      <ScreenContainer className="justify-center items-center">
        <Text className="text-foreground">Ristorante non trovato</Text>
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
        <Text className="text-3xl font-bold text-foreground mb-2">{restaurant.name}</Text>

        {/* Rating and Price */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg text-primary font-semibold">⭐ {restaurant.rating}</Text>
          <Text className="text-lg font-semibold text-foreground">
            €{restaurant.avgPrice}/persona
          </Text>
        </View>

        {/* Contact Info */}
        <View className="bg-surface rounded-lg p-4 mb-6 border border-border">
          <Text className="text-sm font-semibold text-foreground mb-3">Informazioni</Text>

          <View className="mb-3">
            <Text className="text-xs text-muted mb-1">📍 Indirizzo</Text>
            <Text className="text-foreground">{restaurant.address}</Text>
          </View>

          <View className="mb-3">
            <Text className="text-xs text-muted mb-1">📞 Telefono</Text>
            <Text className="text-foreground">{restaurant.phone}</Text>
          </View>

          <View className="mb-3">
            <Text className="text-xs text-muted mb-1">🕐 Orari</Text>
            <Text className="text-foreground">{restaurant.hours}</Text>
          </View>

          <View>
            <Text className="text-xs text-muted mb-1">📍 Distanza</Text>
            <Text className="text-foreground">{restaurant.distance}km</Text>
          </View>
        </View>

        {/* Menu */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-foreground mb-3">Menu Disponibile</Text>
          {restaurant.dishes.map((dish, index) => (
            <View key={index} className="flex-row items-center py-2 border-b border-border">
              <Text className="text-primary font-bold mr-3">•</Text>
              <Text className="text-foreground">{dish}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
