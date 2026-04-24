import { ScrollView, Text, View, Pressable, TextInput, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { skipToken } from "@tanstack/react-query";

interface TravelResult {
  distance: number;
  duration: number;
  cost: number;
  tollCost: number;
  travelType: "auto" | "treno" | "aereo";
}

export default function TravelsScreen() {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [travelType, setTravelType] = useState<"auto" | "treno" | "aereo">("auto");
  const [result, setResult] = useState<TravelResult | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch available cities
  const { data: availableCities = [] } = trpc.travels.availableCities.useQuery();

  // Calculate travel using tRPC
  const calculateTravelMutation = trpc.travels.calculate.useQuery(
    departure && destination
      ? {
          departure,
          destination,
          travelType,
        }
      : skipToken,
    {
      enabled: false,
    }
  );

  const handleCalculate = async () => {
    setError(null);
    setLoading(true);
    setSearched(true);

    try {
      const response = await calculateTravelMutation.refetch();
      if (response.data) {
        setResult(response.data);
      } else if (response.error) {
        setError(response.error.message || "Errore nel calcolo del viaggio");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
    } finally {
      setLoading(false);
    }
  };

  const getTravelTypeLabel = (type: string) => {
    switch (type) {
      case "auto":
        return "Auto";
      case "treno":
        return "Treno";
      case "aereo":
        return "Aereo";
      default:
        return type;
    }
  };

  return (
    <ScreenContainer className="px-4 py-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="text-3xl font-bold text-foreground mb-4">Costi Viaggio</Text>

        {/* Input Section */}
        <View className="bg-surface rounded-lg p-4 mb-6 border border-border">
          <Text className="text-sm font-semibold text-foreground mb-3">Calcola Costo</Text>

          <Text className="text-xs text-muted mb-1">Partenza</Text>
          <View className="bg-background border border-border rounded-lg mb-4 overflow-hidden">
            <Picker
              selectedValue={departure}
              onValueChange={(itemValue: string) => setDeparture(itemValue)}
              style={{ color: "#11181C" }}
            >
              <Picker.Item label="Seleziona città..." value="" />
              {availableCities.map((city: string) => (
                <Picker.Item key={city} label={city} value={city} />
              ))}
            </Picker>
          </View>

          <Text className="text-xs text-muted mb-1">Destinazione</Text>
          <View className="bg-background border border-border rounded-lg mb-4 overflow-hidden">
            <Picker
              selectedValue={destination}
              onValueChange={(itemValue: string) => setDestination(itemValue)}
              style={{ color: "#11181C" }}
            >
              <Picker.Item label="Seleziona città..." value="" />
              {availableCities.map((city: string) => (
                <Picker.Item key={city} label={city} value={city} />
              ))}
            </Picker>
          </View>

          <Text className="text-xs text-muted mb-1">Tipo di viaggio</Text>
          <View className="bg-background border border-border rounded-lg mb-4 overflow-hidden">
            <Picker
              selectedValue={travelType}
              onValueChange={(itemValue: string) => setTravelType(itemValue as "auto" | "treno" | "aereo")}
              style={{ color: "#11181C" }}
            >
              <Picker.Item label="Auto" value="auto" />
              <Picker.Item label="Treno" value="treno" />
              <Picker.Item label="Aereo" value="aereo" />
            </Picker>
          </View>

          <Pressable
            onPress={handleCalculate}
            disabled={!departure || !destination || loading}
            style={({ pressed }) => [
              {
                opacity: pressed && departure && destination ? 0.8 : 1,
              },
            ]}
            className={cn(
              "rounded-lg py-3 items-center",
              departure && destination ? "bg-primary" : "bg-muted"
            )}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold">Calcola</Text>
            )}
          </Pressable>
        </View>

        {/* Error Message */}
        {error && (
          <View className="bg-error/10 border border-error rounded-lg p-3 mb-4">
            <Text className="text-error text-sm">{error}</Text>
          </View>
        )}

        {/* Results Section */}
        {searched && result ? (
          <View className="bg-surface rounded-lg p-4 border border-border">
            <Text className="text-lg font-bold text-foreground mb-4">Risultati</Text>

            <View className="mb-4">
              <Text className="text-xs text-muted mb-1">📏 Distanza</Text>
              <Text className="text-2xl font-bold text-primary">{result.distance} km</Text>
            </View>

            <View className="mb-4">
              <Text className="text-xs text-muted mb-1">🕐 Tempo stimato</Text>
              <Text className="text-2xl font-bold text-primary">
                {Math.floor(result.duration / 60)}h {result.duration % 60}m
              </Text>
            </View>

            <View className="mb-4 bg-background rounded-lg p-3">
              <Text className="text-xs text-muted mb-2">💰 Costo totale</Text>
              <Text className="text-3xl font-bold text-foreground">€{result.cost}</Text>
              <Text className="text-xs text-muted mt-2">
                Tipo: {getTravelTypeLabel(result.travelType)}
              </Text>
            </View>

            {result.travelType === "auto" && result.tollCost > 0 && (
              <View className="bg-warning bg-opacity-10 rounded-lg p-3 border border-warning">
                <Text className="text-xs text-warning font-semibold mb-1">⚠️ Pedaggi</Text>
                <Text className="text-lg font-bold text-warning">€{result.tollCost}</Text>
                <Text className="text-xs text-muted mt-1">
                  Costo stimato per i caselli autostradali
                </Text>
              </View>
            )}
          </View>
        ) : searched && !result ? (
          <View className="flex-1 justify-center items-center py-8">
            <Text className="text-muted text-center">Errore nel calcolo del viaggio</Text>
          </View>
        ) : (
          <View className="flex-1 justify-center items-center py-8">
            <Text className="text-muted text-center">
              Seleziona partenza e destinazione per calcolare i costi
            </Text>
            <Text className="text-xs text-muted text-center mt-2">
              {availableCities.length > 0
                ? `${availableCities.length} città disponibili`
                : "Caricamento città..."}
            </Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
