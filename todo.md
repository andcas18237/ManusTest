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
