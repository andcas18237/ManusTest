import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useLocation } from '@/hooks/use-location';
import { EmptyState, FilterChip, InfoBanner, LoadingState, PageHeader, PrimaryButton, ResponsiveContainer, SectionTitle, Surface } from '@/components/ui/app-ui';
import { useRestaurants } from '@/hooks/use-app-data';
import { useRouter } from 'expo-router';

interface Restaurant {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distance: number;
  tags?: Record<string, string>;
}

export default function RestaurantsScreen() {
  const router = useRouter();
  const { location, loading: locationLoading, error: locationError, requestPermission } = useLocation();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();

  const { data: restaurants = [], isLoading: loading, error: queryError } = useRestaurants(location, maxPrice);

  const error = queryError?.message || queryError?.toString() || null;

  const renderRestaurant = ({ item }: { item: Restaurant }) => (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/restaurant-detail",
          params: { id: item.id },
        })
      }
      style={({ pressed }) => [{ opacity: pressed ? 0.82 : 1 }]}
    >
      <Surface className="mb-3 p-5">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text className="text-lg font-semibold text-foreground">{item.name}</Text>
            <Text className="mt-1 text-sm text-muted">{item.distance.toFixed(1)} km di distanza</Text>
          </View>
          <View className="rounded-full bg-primary/10 px-3 py-1.5">
            <Text className="text-xs font-semibold text-primary">Vicino a te</Text>
          </View>
        </View>
        {item.tags?.cuisine && (
          <Text className="mt-4 text-sm text-foreground">Cucina: {item.tags.cuisine}</Text>
        )}
        {item.tags?.['price_range'] && (
          <Text className="mt-1 text-sm text-muted">Budget: {item.tags['price_range']}</Text>
        )}
      </Surface>
    </Pressable>
  );

  return (
    <ScreenContainer className="p-4">
      <ResponsiveContainer className="flex-1 gap-5 pb-28">
        <PageHeader
          eyebrow="Nearby"
          title="Ristoranti"
          description="Suggerimenti locali con un look piu ordinato, chiaro e leggibile su ogni formato."
        />

        {!location && (
          <Surface className="p-5">
            <SectionTitle
              title="Attiva la posizione"
              description="Serve per mostrare ristoranti pertinenti entro 20 km dalla tua area."
            />
            <PrimaryButton
              label={locationLoading ? 'Caricamento...' : 'Abilita geolocalizzazione'}
              onPress={requestPermission}
              disabled={locationLoading}
              icon="my-location"
              className="mt-4"
            />
          </Surface>
        )}

        {locationError && (
          <InfoBanner tone="error" title="Permesso posizione non disponibile" description={locationError} />
        )}

        {error && (
          <InfoBanner tone="error" title="Ricerca non riuscita" description={error} />
        )}

        {location && (
          <Surface className="gap-4 p-5">
            <SectionTitle title="Filtri prezzo" description="Affina rapidamente il budget medio desiderato." />
            <View className="flex-row gap-2">
              <FilterChip label="€€" selected={maxPrice === 2} onPress={() => setMaxPrice(maxPrice === 2 ? undefined : 2)} />
              <FilterChip label="€€€" selected={maxPrice === 3} onPress={() => setMaxPrice(maxPrice === 3 ? undefined : 3)} />
            </View>
          </Surface>
        )}

        {loading && (
          <LoadingState label="Ricerca ristoranti..." />
        )}

        {!loading && location && (
          <>
            {restaurants.length > 0 ? (
              <FlatList
                data={restaurants}
                renderItem={renderRestaurant}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 8 }}
                ListHeaderComponent={
                  <View className="mb-4">
                    <Text className="text-xs font-semibold uppercase tracking-[1.4px] text-primary">Entro 20 km</Text>
                    <Text className="mt-2 text-sm text-muted">{restaurants.length} risultati disponibili</Text>
                  </View>
                }
              />
            ) : (
              <EmptyState
                icon="restaurant"
                title="Nessun ristorante trovato"
                description="Prova a cambiare area o ad allargare i criteri del filtro prezzo."
              />
            )}
          </>
        )}
      </ResponsiveContainer>
    </ScreenContainer>
  );
}
