import AsyncStorage from "@react-native-async-storage/async-storage";

export type RecipeDifficulty = "facile" | "media" | "difficile";

export interface Ingredient {
  name: string;
  quantity: string;
}

export interface RecipeRecord {
  id: number;
  name: string;
  prepTime: number;
  difficulty: RecipeDifficulty;
  ingredients: string;
  instructions: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecipeInput {
  name: string;
  prepTime: number;
  difficulty: RecipeDifficulty;
  ingredients: Ingredient[];
  instructions: string[];
}

export interface RestaurantRecord {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  tags?: Record<string, string>;
}

export interface TravelResult {
  distance: number;
  duration: number;
  cost: number;
  tollCost: number;
  travelType: "auto" | "treno" | "aereo";
}

const RECIPES_STORAGE_KEY = "expo-demo-recipes";

const defaultRecipes: RecipeRecord[] = [
  {
    id: 1,
    name: "Pasta al pesto",
    prepTime: 20,
    difficulty: "facile",
    ingredients: JSON.stringify([
      { name: "Pasta", quantity: "320 g" },
      { name: "Pesto", quantity: "160 g" },
      { name: "Parmigiano", quantity: "q.b." },
    ]),
    instructions: JSON.stringify([
      "Porta a bollore l'acqua e cuoci la pasta.",
      "Conserva un mestolo di acqua di cottura e scola al dente.",
      "Manteca con pesto e parmigiano fino a ottenere una salsa cremosa.",
    ]),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Risotto ai funghi",
    prepTime: 35,
    difficulty: "media",
    ingredients: JSON.stringify([
      { name: "Riso Carnaroli", quantity: "320 g" },
      { name: "Funghi misti", quantity: "300 g" },
      { name: "Brodo vegetale", quantity: "1 l" },
    ]),
    instructions: JSON.stringify([
      "Rosola i funghi in padella e tienili da parte.",
      "Tosta il riso, poi aggiungi il brodo un mestolo alla volta.",
      "Unisci i funghi e manteca il risotto prima di servire.",
    ]),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const cityCoordinates: Record<string, { latitude: number; longitude: number }> = {
  Milano: { latitude: 45.4642, longitude: 9.19 },
  Torino: { latitude: 45.0703, longitude: 7.6869 },
  Bologna: { latitude: 44.4949, longitude: 11.3426 },
  Firenze: { latitude: 43.7696, longitude: 11.2558 },
  Roma: { latitude: 41.9028, longitude: 12.4964 },
  Napoli: { latitude: 40.8518, longitude: 14.2681 },
};

const restaurantsSeed: RestaurantRecord[] = [
  { id: "1", name: "Bistrot Centrale", latitude: 45.468, longitude: 9.191, tags: { cuisine: "Italiana", price_range: "€€" } },
  { id: "2", name: "Sushi District", latitude: 45.462, longitude: 9.184, tags: { cuisine: "Giapponese", price_range: "€€€" } },
  { id: "3", name: "Pane & Vino", latitude: 45.459, longitude: 9.198, tags: { cuisine: "Mediterranea", price_range: "€€" } },
  { id: "4", name: "Urban Grill", latitude: 45.471, longitude: 9.201, tags: { cuisine: "Steakhouse", price_range: "€€€" } },
];

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function getAvailableCities() {
  return Object.keys(cityCoordinates);
}

export function calculateTravel(departure: string, destination: string, travelType: TravelResult["travelType"]): TravelResult {
  const from = cityCoordinates[departure];
  const to = cityCoordinates[destination];

  if (!from || !to) {
    throw new Error("Tratta non disponibile");
  }

  const distance = haversineDistanceKm(from.latitude, from.longitude, to.latitude, to.longitude);
  const config = {
    auto: { speed: 85, rate: 0.19, tollRate: 0.035 },
    treno: { speed: 130, rate: 0.12, tollRate: 0 },
    aereo: { speed: 700, rate: 0.22, tollRate: 0 },
  }[travelType];

  return {
    distance: Math.round(distance),
    duration: Math.max(35, Math.round((distance / config.speed) * 60)),
    cost: Number((distance * config.rate).toFixed(2)),
    tollCost: Number((distance * config.tollRate).toFixed(2)),
    travelType,
  };
}

export function searchRestaurantsByLocation(
  latitude: number,
  longitude: number,
  maxPrice?: number,
) {
  return restaurantsSeed
    .map((restaurant) => ({
      ...restaurant,
      distance: haversineDistanceKm(latitude, longitude, restaurant.latitude, restaurant.longitude),
    }))
    .filter((restaurant) => {
      const price = restaurant.tags?.price_range?.length;
      const priceMatches = maxPrice ? price !== undefined && price <= maxPrice : true;
      return restaurant.distance <= 20 && priceMatches;
    })
    .sort((a, b) => a.distance - b.distance);
}

export async function listRecipes(): Promise<RecipeRecord[]> {
  const stored = await AsyncStorage.getItem(RECIPES_STORAGE_KEY);
  if (!stored) {
    await AsyncStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(defaultRecipes));
    return defaultRecipes;
  }

  try {
    return JSON.parse(stored) as RecipeRecord[];
  } catch {
    await AsyncStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(defaultRecipes));
    return defaultRecipes;
  }
}

export async function getRecipeById(id: number) {
  const recipes = await listRecipes();
  return recipes.find((recipe) => recipe.id === id) ?? null;
}

export async function createRecipe(input: CreateRecipeInput): Promise<RecipeRecord> {
  const recipes = await listRecipes();
  const now = new Date().toISOString();
  const nextRecipe: RecipeRecord = {
    id: recipes.length ? Math.max(...recipes.map((recipe) => recipe.id)) + 1 : 1,
    name: input.name,
    prepTime: input.prepTime,
    difficulty: input.difficulty,
    ingredients: JSON.stringify(input.ingredients),
    instructions: JSON.stringify(input.instructions),
    createdAt: now,
    updatedAt: now,
  };

  const nextRecipes = [nextRecipe, ...recipes];
  await AsyncStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(nextRecipes));
  return nextRecipe;
}

function haversineDistanceKm(latitudeA: number, longitudeA: number, latitudeB: number, longitudeB: number) {
  const earthRadiusKm = 6371;
  const latitudeDelta = toRadians(latitudeB - latitudeA);
  const longitudeDelta = toRadians(longitudeB - longitudeA);
  const a =
    Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
    Math.cos(toRadians(latitudeA)) *
      Math.cos(toRadians(latitudeB)) *
      Math.sin(longitudeDelta / 2) *
      Math.sin(longitudeDelta / 2);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
