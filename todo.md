# Smart Assistant App - Project TODO

## Frontend (React Native/Expo)

### Navigation & Layout
- [x] Configurare Tab Navigation (Ricette, Ristoranti, Viaggi)
- [x] Creare ScreenContainer per tutte le schermate
- [x] Implementare SafeArea handling

### Recipes Tab
- [x] Creare schermata Home (Ricette)
- [x] Implementare lista ricette con FlatList
- [x] Creare componente Recipe Card
- [x] Implementare search/filter ricette
- [x] Creare schermata Recipe Detail
- [x] Aggiungere navigazione da lista a dettagli

### Restaurants Tab
- [x] Creare schermata Ristoranti
- [x] Implementare input filtri (prezzo, piatto)
- [x] Creare componente Restaurant Card
- [x] Implementare logica ricerca ristoranti
- [x] Creare schermata Restaurant Detail
- [x] Aggiungere navigazione da lista a dettagli

### Travels Tab
- [x] Creare schermata Viaggi
- [x] Implementare input partenza/destinazione
- [x] Creare dropdown tipo viaggio
- [x] Implementare logica calcolo costi
- [x] Visualizzare risultati viaggio
- [x] Aggiungere dettagli pedaggi (se auto)

### Styling & Polish
- [x] Applicare colori dal theme.config.js
- [x] Aggiungere press feedback (scale, opacity)
- [x] Implementare loading indicators
- [x] Aggiungere empty states
- [x] Implementare error handling UI

## Backend (Node.js/API)

### Database Schema
- [ ] Creare tabella Recipes
- [ ] Creare tabella Restaurants
- [ ] Creare tabella RestaurantDishes
- [ ] Creare tabella Travels (opzionale per cache)

### API Endpoints
- [ ] GET /api/recipes - lista ricette
- [ ] GET /api/recipes/:id - dettagli ricetta
- [ ] GET /api/recipes/search - ricerca ricette
- [ ] GET /api/restaurants - lista ristoranti
- [ ] POST /api/restaurants/search - ricerca con filtri
- [ ] GET /api/restaurants/:id - dettagli ristorante
- [ ] POST /api/travels/calculate - calcolo costi viaggio

### Data Population
- [ ] Popolare database con ricette di esempio
- [ ] Popolare database con ristoranti di esempio
- [ ] Popolare database con piatti di esempio

### Integration
- [ ] Connettere frontend alle API
- [ ] Implementare error handling
- [ ] Aggiungere validazione input

## Database

### Schema Design
- [ ] Definire struttura tabella Recipes
- [ ] Definire struttura tabella Restaurants
- [ ] Definire struttura tabella RestaurantDishes
- [ ] Creare relazioni tra tabelle

### Sample Data
- [ ] Inserire 10+ ricette di esempio
- [ ] Inserire 5+ ristoranti di esempio
- [ ] Inserire piatti per ogni ristorante

## Testing & Deployment

### Testing
- [ ] Testare lista ricette su Expo Go
- [ ] Testare dettagli ricetta
- [ ] Testare ricerca ristoranti
- [ ] Testare calcolo costi viaggio
- [ ] Testare su iOS (se disponibile)
- [ ] Testare su Android (se disponibile)

### Documentation
- [ ] Documentare API endpoints
- [ ] Documentare schema database
- [ ] Creare README per il progetto

### Deployment Prep
- [ ] Creare checkpoint iniziale
- [ ] Preparare file di configurazione
- [ ] Documentare istruzioni per produzione


## Integrazione Backend per Ricette (NUOVO)

### Database Schema
- [x] Creare tabella `recipes` con colonne: id, name, prepTime, difficulty, ingredients (JSON), instructions (JSON)
- [x] Aggiungere indici per ricerche veloci

### API Endpoints
- [x] GET /api/recipes - lista tutte le ricette
- [x] GET /api/recipes/:id - dettagli ricetta
- [x] POST /api/recipes - crea nuova ricetta
- [x] PUT /api/recipes/:id - modifica ricetta
- [x] DELETE /api/recipes/:id - elimina ricetta
- [x] GET /api/recipes/search?q=... - ricerca ricette

### Frontend Integration
- [x] Modificare `app/(tabs)/index.tsx` per caricare da API
- [x] Implementare useEffect con fetch/axios
- [x] Aggiungere error handling e loading states
- [x] Testare su Expo Go

### Data Population
- [x] Popolare database con 6 ricette di esempio


## Aggiunta Funzionalità Creazione Ricette

### Frontend
- [x] Creare schermata add-recipe con form completo
- [x] Aggiungere pulsante "+" nella schermata Ricette
- [x] Implementare input dinamici per ingredienti
- [x] Implementare input dinamici per istruzioni
- [x] Aggiungere validazione form
- [x] Implementare mutazione tRPC per creare ricetta
- [x] Aggiungere loading state durante il salvataggio
- [x] Mostrare messaggio di successo/errore
- [x] Aggiornare lista ricette dopo creazione

### Testing
- [ ] Testare creazione ricetta su Expo Go
- [ ] Verificare che i dati vengono salvati nel database
- [ ] Verificare che la lista si aggiorna automaticamente


## Animated Recipe Cards

### Frontend
- [x] Creare componente RecipeCard con animazioni
- [x] Implementare animazioni di scale (0.95) e opacity (0.8)
- [x] Aggiungere timing di 150ms per feedback istantaneo
- [x] Design moderno con rounded corners e shadow
- [x] Aggiungere CTA "Visualizza →" nel footer della card
- [x] Aggiungere separatore visivo con border-top
- [x] Aggiungere livello "complesso" alla difficoltà

### Branch & PR
- [x] Creare branch feature/animated-recipe-cards
- [x] Fare commit con le modifiche
- [x] Fare pull request su GitHub
- [x] Aggiungere commento per il livello "complesso"
- [x] Fare merge su main
