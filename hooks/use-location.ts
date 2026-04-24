import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface UseLocationResult {
  location: LocationCoords | null;
  loading: boolean;
  error: string | null;
  requestPermission: () => Promise<void>;
}

/**
 * Hook per ottenere la geolocalizzazione dell'utente
 * Richiede il permesso di accesso alla posizione
 */
export function useLocation(): UseLocationResult {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestPermission = async () => {
    try {
      setLoading(true);
      setError(null);

      // Richiedi permesso di accesso alla posizione
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setError('Permesso di geolocalizzazione negato');
        return;
      }

      // Ottieni la posizione attuale
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nella geolocalizzazione');
    } finally {
      setLoading(false);
    }
  };

  return { location, loading, error, requestPermission };
}
