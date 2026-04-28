import { useCallback, useEffect, useState } from "react";

import {
  calculateTravel,
  createRecipe,
  getAvailableCities,
  getRecipeById,
  listRecipes,
  searchRestaurantsByLocation,
  type CreateRecipeInput,
  type RecipeRecord,
  type TravelResult,
} from "@/lib/app-data";

export function useRecipes() {
  const [data, setData] = useState<RecipeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const recipes = await listRecipes();
      setData(recipes);
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError : new Error("Errore nel caricamento"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}

export function useRecipe(recipeId: number) {
  const [data, setData] = useState<RecipeRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setIsLoading(true);
        setError(null);
        const recipe = await getRecipeById(recipeId);
        if (mounted) {
          setData(recipe);
        }
      } catch (currentError) {
        if (mounted) {
          setError(currentError instanceof Error ? currentError : new Error("Errore nel caricamento"));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [recipeId]);

  return { data, isLoading, error };
}

export function useCreateRecipe() {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = useCallback(async (input: CreateRecipeInput) => {
    setIsPending(true);
    try {
      return await createRecipe(input);
    } finally {
      setIsPending(false);
    }
  }, []);

  return { mutateAsync, isPending };
}

export function useAvailableCities() {
  return { data: getAvailableCities() };
}

export function useTravelCalculator() {
  const [isLoading, setIsLoading] = useState(false);

  const calculate = useCallback(
    async (departure: string, destination: string, travelType: TravelResult["travelType"]) => {
      setIsLoading(true);
      try {
        return calculateTravel(departure, destination, travelType);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { calculate, isLoading };
}

export function useRestaurants(location: { latitude: number; longitude: number } | null, maxPrice?: number) {
  const [data, setData] = useState<Array<ReturnType<typeof searchRestaurantsByLocation>[number]>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!location) {
      setData([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const restaurants = searchRestaurantsByLocation(location.latitude, location.longitude, maxPrice);
      setData(restaurants);
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError : new Error("Errore nel caricamento"));
    } finally {
      setIsLoading(false);
    }
  }, [location, maxPrice]);

  return { data, isLoading, error };
}
