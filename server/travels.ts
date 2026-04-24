import axios from "axios";

export interface TravelCalculation {
  distance: number; // km
  duration: number; // minutes
  cost: number; // euros
  tollCost: number; // euros (for car only)
  travelType: "auto" | "treno" | "aereo";
}

interface RouteResponse {
  features: Array<{
    properties: {
      segments: Array<{
        distance: number; // meters
        duration: number; // seconds
      }>;
      summary: {
        distance: number; // meters
        duration: number; // seconds
      };
    };
  }>;
}

// Italian city coordinates (latitude, longitude)
const ITALIAN_CITIES: Record<string, [number, number]> = {
  Milano: [45.4642, 9.1900],
  Roma: [41.9028, 12.4964],
  Firenze: [43.7696, 11.2558],
  Napoli: [40.8518, 14.2681],
  Torino: [45.0703, 7.6869],
  Venezia: [45.4408, 12.3155],
  Bologna: [44.4949, 11.3426],
  Palermo: [38.1157, 13.3615],
  Genova: [44.4056, 8.9463],
  Verona: [45.4384, 10.9916],
  Padova: [45.4064, 11.8768],
  Trieste: [45.6452, 13.7777],
  Perugia: [43.1122, 12.3888],
  Ancona: [43.6158, 13.5189],
  Bari: [41.1171, 16.8718],
};

/**
 * Get coordinates for an Italian city
 */
function getCityCoordinates(city: string): [number, number] | null {
  const normalized = city.trim().charAt(0).toUpperCase() + city.trim().slice(1).toLowerCase();
  return ITALIAN_CITIES[normalized] || null;
}

/**
 * Calculate distance and duration using OpenRouteService
 * Falls back to Haversine + estimates if API fails
 */
async function getRouteData(
  departure: string,
  destination: string,
  travelType: "auto" | "treno" | "aereo"
): Promise<{ distance: number; duration: number } | null> {
  const startCoords = getCityCoordinates(departure);
  const endCoords = getCityCoordinates(destination);

  if (!startCoords || !endCoords) {
    return null;
  }

  // For train and plane, use Haversine distance + estimates
  // For car, try OpenRouteService first
  if (travelType === "auto") {
    try {
      const response = await axios.post<RouteResponse>(
        "https://api.openrouteservice.org/v2/directions/driving-car",
        {
          coordinates: [[startCoords[1], startCoords[0]], [endCoords[1], endCoords[0]]],
        },
        {
          headers: {
            Authorization: process.env.OPENROUTESERVICE_API_KEY || "",
            "Content-Type": "application/json",
          },
          timeout: 5000,
        }
      );

      if (response.data.features && response.data.features.length > 0) {
        const summary = response.data.features[0].properties.summary;
        return {
          distance: Math.round(summary.distance / 1000), // convert to km
          duration: Math.round(summary.duration / 60), // convert to minutes
        };
      }
    } catch (error) {
      console.warn("OpenRouteService API error, falling back to Haversine:", error);
      // Fall through to Haversine calculation
    }
  }

  // Fallback: Haversine distance + estimates based on travel type
  const distance = haversineDistance(startCoords, endCoords);

  let duration = 0;
  if (travelType === "auto") {
    duration = Math.round((distance / 100) * 60); // ~100 km/h average
  } else if (travelType === "treno") {
    duration = Math.round((distance / 120) * 60); // ~120 km/h average
  } else if (travelType === "aereo") {
    duration = 120 + Math.round((distance / 800) * 60); // 2h base + flight time
  }

  return { distance, duration };
}

/**
 * Haversine formula to calculate distance between two coordinates
 */
function haversineDistance(
  [lat1, lon1]: [number, number],
  [lat2, lon2]: [number, number]
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Calculate travel cost based on distance, duration, and travel type
 */
function calculateCost(
  distance: number,
  duration: number,
  travelType: "auto" | "treno" | "aereo"
): { cost: number; tollCost: number } {
  let cost = 0;
  let tollCost = 0;

  if (travelType === "auto") {
    // Fuel cost: ~0.15€/km (based on current Italian fuel prices)
    cost = distance * 0.15;
    // Tolls: ~0.10€/km for highways
    tollCost = distance * 0.1;
  } else if (travelType === "treno") {
    // Train cost: ~0.08€/km (Trenitalia regional average)
    cost = distance * 0.08;
    tollCost = 0;
  } else if (travelType === "aereo") {
    // Flight cost: base 50€ + 0.05€/km
    cost = 50 + distance * 0.05;
    tollCost = 0;
  }

  return {
    cost: Math.round(cost * 100) / 100,
    tollCost: Math.round(tollCost * 100) / 100,
  };
}

/**
 * Calculate travel cost between two Italian cities
 */
export async function calculateTravel(
  departure: string,
  destination: string,
  travelType: "auto" | "treno" | "aereo"
): Promise<TravelCalculation> {
  // Validate inputs
  if (!departure.trim() || !destination.trim()) {
    throw new Error("Partenza e destinazione sono obbligatorie");
  }

  // Get route data
  const routeData = await getRouteData(departure, destination, travelType);

  if (!routeData) {
    const availableCities = Object.keys(ITALIAN_CITIES).join(", ");
    throw new Error(`Città non trovata. Città disponibili: ${availableCities}`);
  }

  // Calculate cost
  const { cost, tollCost } = calculateCost(routeData.distance, routeData.duration, travelType);

  return {
    distance: routeData.distance,
    duration: routeData.duration,
    cost,
    tollCost,
    travelType,
  };
}

/**
 * Get list of available Italian cities
 */
export function getAvailableCities(): string[] {
  return Object.keys(ITALIAN_CITIES).sort();
}
