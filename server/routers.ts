import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { COOKIE_NAME } from "../shared/const";
import { searchRestaurantsByLocation, filterByPrice, filterByCuisine } from "./overpass";
import { calculateTravel, getAvailableCities } from "./travels";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  recipes: router({
    list: publicProcedure.query(() => db.getAllRecipes()),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getRecipeById(input.id)),

    search: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(({ input }) => db.searchRecipes(input.query)),

    create: publicProcedure
      .input(
        z.object({
          name: z.string().min(1).max(255),
          prepTime: z.number().int().positive(),
          difficulty: z.enum(["facile", "media", "difficile"]),
          ingredients: z.array(
            z.object({
              name: z.string(),
              quantity: z.string(),
            })
          ),
          instructions: z.array(z.string()),
        })
      )
      .mutation(({ input }) => {
        return db.createRecipe({
          name: input.name,
          prepTime: input.prepTime,
          difficulty: input.difficulty,
          ingredients: JSON.stringify(input.ingredients),
          instructions: JSON.stringify(input.instructions),
        });
      }),

    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          prepTime: z.number().int().positive().optional(),
          difficulty: z.enum(["facile", "media", "difficile"]).optional(),
          ingredients: z
            .array(
              z.object({
                name: z.string(),
                quantity: z.string(),
              })
            )
            .optional(),
          instructions: z.array(z.string()).optional(),
        })
      )
      .mutation(({ input }) => {
        const { id, ...data } = input;
        const updateData: Record<string, unknown> = {};

        if (data.name !== undefined) updateData.name = data.name;
        if (data.prepTime !== undefined) updateData.prepTime = data.prepTime;
        if (data.difficulty !== undefined) updateData.difficulty = data.difficulty;
        if (data.ingredients !== undefined)
          updateData.ingredients = JSON.stringify(data.ingredients);
        if (data.instructions !== undefined)
          updateData.instructions = JSON.stringify(data.instructions);

        return db.updateRecipe(id, updateData as any);
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => db.deleteRecipe(input.id)),
  }),

  restaurants: router({
    searchByLocation: publicProcedure
      .input(
        z.object({
          latitude: z.number(),
          longitude: z.number(),
          radiusKm: z.number().optional().default(20),
          maxPrice: z.number().optional(),
          cuisine: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        try {
          let restaurants = await searchRestaurantsByLocation(
            input.latitude,
            input.longitude,
            input.radiusKm
          );

          if (input.maxPrice) {
            restaurants = filterByPrice(restaurants, input.maxPrice);
          }
          if (input.cuisine) {
            restaurants = filterByCuisine(restaurants, input.cuisine);
          }

          return restaurants;
        } catch (error) {
          throw new Error(
            `Errore nella ricerca di ristoranti: ${error instanceof Error ? error.message : "Errore sconosciuto"}`
          );
        }
      }),
  }),

  travels: router({
    calculate: publicProcedure
      .input(
        z.object({
          departure: z.string().min(1),
          destination: z.string().min(1),
          travelType: z.enum(["auto", "treno", "aereo"]),
        })
      )
      .query(async ({ input }) => {
        try {
          return await calculateTravel(
            input.departure,
            input.destination,
            input.travelType
          );
        } catch (error) {
          throw new Error(
            `Errore nel calcolo del viaggio: ${error instanceof Error ? error.message : "Errore sconosciuto"}`
          );
        }
      }),

    availableCities: publicProcedure.query(() => {
      return getAvailableCities();
    }),
  }),
});

export type AppRouter = typeof appRouter;
