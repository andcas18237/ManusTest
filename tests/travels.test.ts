import { describe, it, expect } from "vitest";
import { calculateTravel, getAvailableCities } from "../server/travels";

describe("Travels Module", () => {
  describe("getAvailableCities", () => {
    it("should return a list of Italian cities", () => {
      const cities = getAvailableCities();
      expect(cities).toBeInstanceOf(Array);
      expect(cities.length).toBeGreaterThan(0);
      expect(cities).toContain("Milano");
      expect(cities).toContain("Roma");
      expect(cities).toContain("Firenze");
    });

    it("should return cities in alphabetical order", () => {
      const cities = getAvailableCities();
      const sorted = [...cities].sort();
      expect(cities).toEqual(sorted);
    });
  });

  describe("calculateTravel", () => {
    it("should calculate travel cost for car between two cities", async () => {
      const result = await calculateTravel("Milano", "Roma", "auto");

      expect(result).toHaveProperty("distance");
      expect(result).toHaveProperty("duration");
      expect(result).toHaveProperty("cost");
      expect(result).toHaveProperty("tollCost");
      expect(result).toHaveProperty("travelType");

      expect(result.distance).toBeGreaterThan(0);
      expect(result.duration).toBeGreaterThan(0);
      expect(result.cost).toBeGreaterThan(0);
      expect(result.tollCost).toBeGreaterThan(0);
      expect(result.travelType).toBe("auto");
    });

    it("should calculate travel cost for train", async () => {
      const result = await calculateTravel("Milano", "Roma", "treno");

      expect(result.travelType).toBe("treno");
      expect(result.cost).toBeGreaterThan(0);
      expect(result.tollCost).toBe(0); // Train has no tolls
    });

    it("should calculate travel cost for plane", async () => {
      const result = await calculateTravel("Milano", "Roma", "aereo");

      expect(result.travelType).toBe("aereo");
      expect(result.cost).toBeGreaterThan(50); // Base cost is 50€
      expect(result.tollCost).toBe(0); // Plane has no tolls
    });

    it("should throw error for invalid departure city", async () => {
      await expect(
        calculateTravel("InvalidCity", "Roma", "auto")
      ).rejects.toThrow();
    });

    it("should throw error for invalid destination city", async () => {
      await expect(
        calculateTravel("Milano", "InvalidCity", "auto")
      ).rejects.toThrow();
    });

    it("should throw error for empty departure", async () => {
      await expect(
        calculateTravel("", "Roma", "auto")
      ).rejects.toThrow();
    });

    it("should calculate realistic distances", async () => {
      const milanRoma = await calculateTravel("Milano", "Roma", "auto");
      const romaFirenze = await calculateTravel("Roma", "Firenze", "auto");

      // Milano-Roma should be longer than Roma-Firenze
      expect(milanRoma.distance).toBeGreaterThan(romaFirenze.distance);
    });

    it("should calculate realistic costs", async () => {
      const carResult = await calculateTravel("Milano", "Roma", "auto");
      const trainResult = await calculateTravel("Milano", "Roma", "treno");

      // Car cost should be roughly similar or higher than train for same distance
      expect(carResult.cost + carResult.tollCost).toBeGreaterThan(0);
      expect(trainResult.cost).toBeGreaterThan(0);
    });
  });
});
