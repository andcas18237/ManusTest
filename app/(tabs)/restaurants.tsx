import { useState, useEffect } from 'react';
import { FlatList, Pressable, Text, View, ActivityIndicator } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useLocation } from '@/hooks/use-location';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';
import { skipToken } from '@tanstack/react-query';

interface Restaurant {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distance: number;
  tags?: Record<string, string>;
}

export default function RestaurantsScreen() {
  const { location, loading: locationLoading, error: locationError, requestPermission } = useLocation();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();

  const { data: restaurants = [], isLoading: loading, error: queryError } = trpc.restaurants.searchByLocation.useQuery(
    location
      ? {
          latitude: location.latitude,
          longitude: location.longitude,
          radiusKm: 20,
          maxPrice,
        }
      : skipToken
  );

  const error = queryError?.message || queryError?.toString() || null;

  const renderRestaurant = ({ item }: { item: Restaurant }) => (
    <Pressable
      onPress={() => {}}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View className="bg-surface rounded-lg p-4 mb-3 border border-border">
        <Text className="text-lg font-bold text-foreground">{item.name}</Text>
        <Text className="text-sm text-muted mt-1">
          📍 {item.distance.toFixed(1)} km di distanza
        </Text>
        {item.tags?.cuisine && (
          <Text className="text-sm text-muted mt-1">🍽️ {item.tags.cuisine}</Text>
        )}
        {item.tags?.['price_range'] && (
          <Text className="text-sm text-muted mt-1">💰 {item.tags['price_range']}</Text>
        )}
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer className="p-4">
      <View className="gap-4 flex-1">
        {/* Header */}
        <View>
          <Text className="text-3xl font-bold text-foreground">Ristoranti</Text>
          <Text className="text-sm text-muted mt-1">Entro 20 km da te</Text>
        </View>

        {/* Location Button */}
        {!location && (
          <Pressable
            onPress={requestPermission}
            disabled={locationLoading}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <View className="bg-primary rounded-lg p-4">
              <Text className="text-white font-semibold text-center">
                {locationLoading ? 'Caricamento...' : 'Abilita Geolocalizzazione'}
              </Text>
            </View>
          </Pressable>
        )}

        {/* Error Messages */}
        {locationError && (
          <View className="bg-error/10 border border-error rounded-lg p-3">
            <Text className="text-error text-sm">{locationError}</Text>
          </View>
        )}

        {error && (
          <View className="bg-error/10 border border-error rounded-lg p-3">
            <Text className="text-error text-sm">{error}</Text>
          </View>
        )}

        {/* Filters */}
        {location && (
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Filtri Prezzo</Text>
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => setMaxPrice(maxPrice === 2 ? undefined : 2)}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <View
                  className={cn(
                    'px-3 py-2 rounded-full border',
                    maxPrice === 2
                      ? 'bg-primary border-primary'
                      : 'bg-surface border-border'
                  )}
                >
                  <Text
                    className={cn(
                      'text-sm font-medium',
                      maxPrice === 2 ? 'text-white' : 'text-foreground'
                    )}
                  >
                    €€
                  </Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() => setMaxPrice(maxPrice === 3 ? undefined : 3)}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <View
                  className={cn(
                    'px-3 py-2 rounded-full border',
                    maxPrice === 3
                      ? 'bg-primary border-primary'
                      : 'bg-surface border-border'
                  )}
                >
                  <Text
                    className={cn(
                      'text-sm font-medium',
                      maxPrice === 3 ? 'text-white' : 'text-foreground'
                    )}
                  >
                    €€€
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        )}

        {/* Loading */}
        {loading && (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#0a7ea4" />
            <Text className="text-muted mt-2">Ricerca ristoranti...</Text>
          </View>
        )}

        {/* Restaurant List */}
        {!loading && location && (
          <>
            {restaurants.length > 0 ? (
              <FlatList
                data={restaurants}
                renderItem={renderRestaurant}
                keyExtractor={(item) => item.id}
                scrollEnabled={true}
                nestedScrollEnabled={true}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            ) : (
              <View className="flex-1 justify-center items-center">
                <Text className="text-muted text-center">
                  Nessun ristorante trovato entro 20 km
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    </ScreenContainer>
  );
}
