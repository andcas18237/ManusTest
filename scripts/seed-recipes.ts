import { drizzle } from "drizzle-orm/mysql2";
import { recipes } from "../drizzle/schema";

const sampleRecipes = [
  {
    name: "Pasta Carbonara",
    prepTime: 20,
    difficulty: "facile" as const,
    ingredients: JSON.stringify([
      { name: "Pasta", quantity: "400g" },
      { name: "Guanciale", quantity: "200g" },
      { name: "Uova", quantity: "4" },
      { name: "Pecorino Romano", quantity: "100g" },
      { name: "Pepe nero", quantity: "q.b." },
    ]),
    instructions: JSON.stringify([
      "Cuocere la pasta in acqua salata",
      "Rosolare il guanciale a cubetti",
      "Mescolare le uova con il pecorino",
      "Scolare la pasta e mescolare con il guanciale",
      "Aggiungere il composto di uova fuori dal fuoco",
      "Servire con pepe nero",
    ]),
  },
  {
    name: "Risotto ai Funghi",
    prepTime: 35,
    difficulty: "media" as const,
    ingredients: JSON.stringify([
      { name: "Riso Arborio", quantity: "300g" },
      { name: "Funghi", quantity: "300g" },
      { name: "Cipolla", quantity: "1" },
      { name: "Vino bianco", quantity: "150ml" },
      { name: "Brodo vegetale", quantity: "1L" },
      { name: "Burro", quantity: "50g" },
      { name: "Parmigiano", quantity: "50g" },
    ]),
    instructions: JSON.stringify([
      "Rosolare la cipolla tritata",
      "Aggiungere il riso e tostarlo",
      "Sfumare con il vino bianco",
      "Aggiungere il brodo poco alla volta",
      "Rosolare i funghi a parte",
      "Manteccare con burro e parmigiano",
      "Aggiungere i funghi e servire",
    ]),
  },
  {
    name: "Osso Buco",
    prepTime: 120,
    difficulty: "difficile" as const,
    ingredients: JSON.stringify([
      { name: "Osso buco", quantity: "4 pezzi" },
      { name: "Carota", quantity: "1" },
      { name: "Sedano", quantity: "1" },
      { name: "Cipolla", quantity: "1" },
      { name: "Vino rosso", quantity: "250ml" },
      { name: "Pomodori pelati", quantity: "400g" },
      { name: "Brodo", quantity: "500ml" },
    ]),
    instructions: JSON.stringify([
      "Rosolare l'osso buco in olio",
      "Aggiungere soffritto di verdure",
      "Sfumare con vino rosso",
      "Aggiungere pomodori e brodo",
      "Cuocere a fuoco lento per 2 ore",
      "Servire con risotto o polenta",
    ]),
  },
  {
    name: "Tiramisu",
    prepTime: 30,
    difficulty: "media" as const,
    ingredients: JSON.stringify([
      { name: "Mascarpone", quantity: "500g" },
      { name: "Uova", quantity: "4" },
      { name: "Zucchero", quantity: "100g" },
      { name: "Caffè", quantity: "300ml" },
      { name: "Cacao", quantity: "q.b." },
      { name: "Biscotti Savoiardi", quantity: "300g" },
    ]),
    instructions: JSON.stringify([
      "Montare i tuorli con lo zucchero",
      "Aggiungere il mascarpone",
      "Montare gli albumi a neve",
      "Incorporare gli albumi al composto",
      "Inzuppare i savoiardi nel caffè",
      "Stendere uno strato di crema",
      "Alternare strati di biscotti e crema",
      "Cospargere di cacao e riposare in frigo",
    ]),
  },
  {
    name: "Lasagne",
    prepTime: 90,
    difficulty: "difficile" as const,
    ingredients: JSON.stringify([
      { name: "Sfoglia lasagne", quantity: "500g" },
      { name: "Carne macinata", quantity: "500g" },
      { name: "Pomodori pelati", quantity: "800g" },
      { name: "Latte", quantity: "500ml" },
      { name: "Burro", quantity: "50g" },
      { name: "Farina", quantity: "50g" },
      { name: "Parmigiano", quantity: "100g" },
    ]),
    instructions: JSON.stringify([
      "Preparare il ragù con la carne",
      "Preparare la besciamella",
      "Stendere uno strato di ragù",
      "Aggiungere la sfoglia",
      "Alternare ragù, sfoglia e besciamella",
      "Terminare con besciamella e parmigiano",
      "Cuocere a 180°C per 30 minuti",
    ]),
  },
  {
    name: "Insalata Caprese",
    prepTime: 10,
    difficulty: "facile" as const,
    ingredients: JSON.stringify([
      { name: "Pomodori", quantity: "2 grandi" },
      { name: "Mozzarella", quantity: "200g" },
      { name: "Basilico", quantity: "q.b." },
      { name: "Olio extravergine", quantity: "q.b." },
      { name: "Sale", quantity: "q.b." },
      { name: "Pepe", quantity: "q.b." },
    ]),
    instructions: JSON.stringify([
      "Affettare i pomodori",
      "Affettare la mozzarella",
      "Alternare pomodori e mozzarella",
      "Aggiungere basilico fresco",
      "Condire con olio, sale e pepe",
      "Servire subito",
    ]),
  },
];

async function seedRecipes() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  try {
    const db = drizzle(process.env.DATABASE_URL);
    console.log("Seeding recipes...");

    for (const recipe of sampleRecipes) {
      await db.insert(recipes).values(recipe);
      console.log(`✓ Created recipe: ${recipe.name}`);
    }

    console.log("✓ All recipes seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding recipes:", error);
    process.exit(1);
  }
}

seedRecipes();
