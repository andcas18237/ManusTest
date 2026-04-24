/**
 * Funzioni per interrogare Overpass API e trovare ristoranti entro una distanza
 */

export interface Restaurant {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distance: number; // in km
  tags?: Record<string, string>;
}

/**
 * Calcola la distanza tra due coordinate usando la formula di Haversine
 * @param lat1 Latitudine punto 1
 * @param lon1 Longitudine punto 1
 * @param lat2 Latitudine punto 2
 * @param lon2 Longitudine punto 2
 * @returns Distanza in km
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Raggio della Terra in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Cerca ristoranti entro una distanza specificata usando Overpass API
 * @param latitude Latitudine dell'utente
 * @param longitude Longitudine dell'utente
 * @param radiusKm Raggio di ricerca in km (default: 20)
 * @returns Array di ristoranti trovati
 */
export async function searchRestaurantsByLocation(
  latitude: number,
  longitude: number,
  radiusKm: number = 20
): Promise<Restaurant[]> {
  try {
    // Costruisci la query Overpass per cercare ristoranti
    const query = `
      [bbox:${latitude - radiusKm / 111},${longitude - radiusKm / 111},${latitude + radiusKm / 111},${longitude + radiusKm / 111}];
      (
        node["amenity"="restaurant"];
        way["amenity"="restaurant"];
      );
      out center;
    `;

    // Interroga Overpass API
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Processa i risultati
    const restaurants: Restaurant[] = [];

    if (data.elements) {
      for (const element of data.elements) {
        let lat = element.lat;
        let lon = element.lon;

        // Se è un way, usa il centro
        if (element.center) {
          lat = element.center.lat;
          lon = element.center.lon;
        }

        if (lat && lon) {
          const distance = calculateDistance(latitude, longitude, lat, lon);

          // Filtra solo i ristoranti entro il raggio
          if (distance <= radiusKm) {
            restaurants.push({
              id: `osm_${element.id}`,
              name: element.tags?.name || 'Ristorante senza nome',
              latitude: lat,
              longitude: lon,
              distance: Math.round(distance * 10) / 10, // Arrotonda a 1 decimale
              tags: element.tags,
            });
          }
        }
      }
    }

    // Ordina per distanza
    restaurants.sort((a, b) => a.distance - b.distance);

    return restaurants;
  } catch (error) {
    console.error('Errore nella ricerca di ristoranti:', error);
    throw error;
  }
}

/**
 * Filtra ristoranti per prezzo (basato su tag OSM)
 * @param restaurants Array di ristoranti
 * @param maxPrice Prezzo massimo (numero di €)
 * @returns Ristoranti filtrati
 */
export function filterByPrice(restaurants: Restaurant[], maxPrice: number): Restaurant[] {
  return restaurants.filter((restaurant) => {
    const priceTag = restaurant.tags?.['price_range'];
    if (!priceTag) return true; // Se non ha tag prezzo, includi

    // Mappa i tag di prezzo OSM a numeri
    const priceMap: Record<string, number> = {
      '€': 1,
      '€€': 2,
      '€€€': 3,
      '€€€€': 4,
    };

    const priceLevel = priceMap[priceTag] || 0;
    return priceLevel <= maxPrice;
  });
}

/**
 * Filtra ristoranti per tipo di cucina
 * @param restaurants Array di ristoranti
 * @param cuisine Tipo di cucina desiderato
 * @returns Ristoranti filtrati
 */
export function filterByCuisine(restaurants: Restaurant[], cuisine: string): Restaurant[] {
  const cuisineLower = cuisine.toLowerCase();
  return restaurants.filter((restaurant) => {
    const cuisineTag = restaurant.tags?.['cuisine'] || '';
    return cuisineTag.toLowerCase().includes(cuisineLower);
  });
}
