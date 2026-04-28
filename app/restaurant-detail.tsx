import { ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { BackButton, EmptyState, MetricTile, PageHeader, ResponsiveContainer, SectionTitle, Surface } from "@/components/ui/app-ui";

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
      <ScreenContainer className="justify-center items-center px-4">
        <ResponsiveContainer>
          <EmptyState
            icon="restaurant"
            title="Ristorante non trovato"
            description="La scheda selezionata non e al momento disponibile."
          />
          <BackButton onPress={() => router.back()} />
        </ResponsiveContainer>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="px-4 pt-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <ResponsiveContainer className="gap-5 pb-16">
          <BackButton onPress={() => router.back()} />
          <PageHeader title={restaurant.name} description="Scheda informativa con metrica, contatti e menu in un layout piu raffinato." />

          <View className="flex-row flex-wrap gap-3">
            <MetricTile label="Rating" value={restaurant.rating.toFixed(1)} accent />
            <MetricTile label="Prezzo medio" value={`EUR ${restaurant.avgPrice}`} />
            <MetricTile label="Distanza" value={`${restaurant.distance} km`} />
          </View>

          <Surface className="p-5">
            <SectionTitle title="Informazioni" />
            <View className="mt-4 gap-4">
              <View>
                <Text className="text-xs uppercase tracking-[1.2px] text-muted">Indirizzo</Text>
                <Text className="mt-1 text-sm leading-6 text-foreground">{restaurant.address}</Text>
              </View>
              <View>
                <Text className="text-xs uppercase tracking-[1.2px] text-muted">Telefono</Text>
                <Text className="mt-1 text-sm leading-6 text-foreground">{restaurant.phone}</Text>
              </View>
              <View>
                <Text className="text-xs uppercase tracking-[1.2px] text-muted">Orari</Text>
                <Text className="mt-1 text-sm leading-6 text-foreground">{restaurant.hours}</Text>
              </View>
            </View>
          </Surface>

          <Surface className="p-5">
            <SectionTitle title="Menu disponibile" description={`${restaurant.dishes.length} piatti`} />
            <View className="mt-4 gap-3">
              {restaurant.dishes.map((dish, index) => (
                <View key={index} className="flex-row items-center gap-3 rounded-2xl bg-background px-4 py-3">
                  <View className="h-2.5 w-2.5 rounded-full bg-primary" />
                  <Text className="flex-1 text-sm text-foreground">{dish}</Text>
                </View>
              ))}
            </View>
          </Surface>
        </ResponsiveContainer>
      </ScrollView>
    </ScreenContainer>
  );
}
