import { ScrollView, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { EmptyState, InfoBanner, MetricTile, PageHeader, PrimaryButton, ResponsiveContainer, SectionTitle, Surface } from "@/components/ui/app-ui";
import { useAvailableCities, useTravelCalculator } from "@/hooks/use-app-data";

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
  const { data: availableCities = [] } = useAvailableCities();
  const calculateTravelMutation = useTravelCalculator();

  const handleCalculate = async () => {
    setError(null);
    setLoading(true);
    setSearched(true);

    try {
      const response = await calculateTravelMutation.calculate(departure, destination, travelType);
      setResult(response);
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
    <ScreenContainer className="px-4 pt-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <ResponsiveContainer className="gap-5 pb-28">
          <PageHeader
            eyebrow="Trip planner"
            title="Costi viaggio"
            description="Un calcolatore piu elegante e leggibile per confrontare spostamenti in auto, treno o aereo."
          />

          <Surface className="p-5">
            <SectionTitle title="Calcola costo" description="Inserisci tratta e mezzo di trasporto." />

            <Text className="mt-5 mb-2 text-sm font-semibold text-foreground">Partenza</Text>
            <View className="overflow-hidden rounded-2xl border border-border bg-background">
              <Picker
                selectedValue={departure}
                onValueChange={(itemValue: string) => setDeparture(itemValue)}
                style={{ color: "#0f172a" }}
              >
                <Picker.Item label="Seleziona citta..." value="" />
                {availableCities.map((city: string) => (
                  <Picker.Item key={city} label={city} value={city} />
                ))}
              </Picker>
            </View>

            <Text className="mt-4 mb-2 text-sm font-semibold text-foreground">Destinazione</Text>
            <View className="overflow-hidden rounded-2xl border border-border bg-background">
              <Picker
                selectedValue={destination}
                onValueChange={(itemValue: string) => setDestination(itemValue)}
                style={{ color: "#0f172a" }}
              >
                <Picker.Item label="Seleziona citta..." value="" />
                {availableCities.map((city: string) => (
                  <Picker.Item key={city} label={city} value={city} />
                ))}
              </Picker>
            </View>

            <Text className="mt-4 mb-2 text-sm font-semibold text-foreground">Tipo di viaggio</Text>
            <View className="overflow-hidden rounded-2xl border border-border bg-background">
              <Picker
                selectedValue={travelType}
                onValueChange={(itemValue: string) => setTravelType(itemValue as "auto" | "treno" | "aereo")}
                style={{ color: "#0f172a" }}
              >
                <Picker.Item label="Auto" value="auto" />
                <Picker.Item label="Treno" value="treno" />
                <Picker.Item label="Aereo" value="aereo" />
              </Picker>
            </View>

            <PrimaryButton
              label="Calcola"
              onPress={handleCalculate}
              disabled={!departure || !destination}
              loading={loading || calculateTravelMutation.isLoading}
              icon="timeline"
              className="mt-5"
            />
          </Surface>

          {error ? <InfoBanner tone="error" title="Errore nel calcolo" description={error} /> : null}

          {searched && result ? (
            <Surface className="p-5">
              <SectionTitle title="Risultati" description={`Modalita selezionata: ${getTravelTypeLabel(result.travelType)}`} />

              <View className="mt-5 flex-row flex-wrap gap-3">
                <MetricTile label="Distanza" value={`${result.distance} km`} accent />
                <MetricTile
                  label="Durata"
                  value={`${Math.floor(result.duration / 60)}h ${result.duration % 60}m`}
                />
              </View>

              <View className="mt-4 rounded-[24px] bg-background p-5">
                <Text className="text-xs uppercase tracking-[1.2px] text-muted">Costo totale</Text>
                <Text className="mt-2 text-4xl font-bold text-foreground">EUR {result.cost}</Text>
              </View>

              {result.travelType === "auto" && result.tollCost > 0 ? (
                <View className="mt-4">
                  <InfoBanner
                    tone="warning"
                    title={`Pedaggi stimati: EUR ${result.tollCost}`}
                    description="Include il costo stimato dei caselli autostradali lungo il percorso."
                  />
                </View>
              ) : null}
            </Surface>
          ) : searched && !result ? (
            <EmptyState
              icon="warning-amber"
              title="Nessun risultato disponibile"
              description="Riprova controllando i dati inseriti oppure scegli una combinazione diversa."
            />
          ) : (
            <EmptyState
              icon="route"
              title="Pronto per il calcolo"
              description={
                availableCities.length > 0
                  ? `${availableCities.length} citta disponibili per comporre la tratta.`
                  : "Sto caricando l'elenco delle citta disponibili."
              }
            />
          )}
        </ResponsiveContainer>
      </ScrollView>
    </ScreenContainer>
  );
}
