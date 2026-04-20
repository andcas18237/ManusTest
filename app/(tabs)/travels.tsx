import { ScrollView, Text, View, Pressable, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";

interface TravelResult {
  distance: number;
  duration: number;
  cost: number;
  tollCost: number;
}

export default function TravelsScreen() {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [travelType, setTravelType] = useState("auto");
  const [result, setResult] = useState<TravelResult | null>(null);
  const [searched, setSearched] = useState(false);

  // Dati di esempio per calcoli
  const cityDistances: Record<string, Record<string, number>> = {
    Milano: { Roma: 570, Firenze: 290, Napoli: 750, Torino: 140 },
    Roma: { Milano: 570, Firenze: 280, Napoli: 240, Torino: 700 },
    Firenze: { Milano: 290, Roma: 280, Napoli: 480, Torino: 380 },
    Napoli: { Milano: 750, Roma: 240, Firenze: 480, Torino: 900 },
    Torino: { Milano: 140, Roma: 700, Firenze: 380, Napoli: 900 },
  };

  const calculateTravel = () => {
    const dep = departure.trim();
    const dest = destination.trim();

    if (!dep || !dest) {
      alert("Inserisci partenza e destinazione");
      return;
    }

    const distance = cityDistances[dep]?.[dest];
    if (!distance) {
      alert("Rotta non trovata. Prova con: Milano, Roma, Firenze, Napoli, Torino");
      return;
    }

    let cost = 0;
    let tollCost = 0;
    let duration = 0;

    if (travelType === "auto") {
      // Costo carburante: ~0.15€/km
      cost = distance * 0.15;
      // Pedaggi: ~0.10€/km per autostrada
      tollCost = distance * 0.1;
      // Tempo: ~1 ora per 100km
      duration = Math.round((distance / 100) * 60);
    } else if (travelType === "treno") {
      // Costo treno: ~0.08€/km
      cost = distance * 0.08;
      tollCost = 0;
      duration = Math.round((distance / 120) * 60);
    } else if (travelType === "aereo") {
      // Costo aereo: base 50€ + 0.05€/km
      cost = 50 + distance * 0.05;
      tollCost = 0;
      // Tempo: 2 ore per volo + 2 ore per check-in
      duration = 120 + Math.round((distance / 800) * 60);
    }

    setResult({
      distance,
      duration,
      cost: Math.round(cost * 100) / 100,
      tollCost: Math.round(tollCost * 100) / 100,
    });
    setSearched(true);
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
          <TextInput
            placeholder="Es. Milano"
            value={departure}
            onChangeText={setDeparture}
            className="bg-background border border-border rounded-lg px-3 py-2 text-foreground mb-4"
            placeholderTextColor="#687076"
          />

          <Text className="text-xs text-muted mb-1">Destinazione</Text>
          <TextInput
            placeholder="Es. Roma"
            value={destination}
            onChangeText={setDestination}
            className="bg-background border border-border rounded-lg px-3 py-2 text-foreground mb-4"
            placeholderTextColor="#687076"
          />

          <Text className="text-xs text-muted mb-1">Tipo di viaggio</Text>
          <View className="bg-background border border-border rounded-lg mb-4 overflow-hidden">
          <Picker
            selectedValue={travelType}
            onValueChange={(itemValue: string) => setTravelType(itemValue)}
            style={{ color: "#11181C" }}
          >
              <Picker.Item label="Auto" value="auto" />
              <Picker.Item label="Treno" value="treno" />
              <Picker.Item label="Aereo" value="aereo" />
            </Picker>
          </View>

          <Pressable
            onPress={calculateTravel}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            className="bg-primary rounded-lg py-3 items-center"
          >
            <Text className="text-white font-semibold">Calcola</Text>
          </Pressable>
        </View>

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
                Tipo: {getTravelTypeLabel(travelType)}
              </Text>
            </View>

            {travelType === "auto" && result.tollCost > 0 && (
              <View className="bg-warning bg-opacity-10 rounded-lg p-3 border border-warning">
                <Text className="text-xs text-warning font-semibold mb-1">⚠️ Pedaggi</Text>
                <Text className="text-lg font-bold text-warning">€{result.tollCost}</Text>
                <Text className="text-xs text-muted mt-1">
                  Costo stimato per i caselli autostradali
                </Text>
              </View>
            )}
          </View>
        ) : searched ? (
          <View className="flex-1 justify-center items-center py-8">
            <Text className="text-muted text-center">Errore nel calcolo del viaggio</Text>
          </View>
        ) : (
          <View className="flex-1 justify-center items-center py-8">
            <Text className="text-muted text-center">
              Inserisci partenza e destinazione per calcolare i costi
            </Text>
            <Text className="text-xs text-muted text-center mt-2">
              Città disponibili: Milano, Roma, Firenze, Napoli, Torino
            </Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
