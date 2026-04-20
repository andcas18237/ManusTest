# Smart Assistant App - Design System

## Screen List

1. **Home (Recipes Tab)** - Visualizza ricette dal database
2. **Restaurants Tab** - Ricerca ristoranti per prezzo e piatti
3. **Travels Tab** - Calcolo costi di viaggio
4. **Recipe Detail** - Dettagli completi di una ricetta
5. **Restaurant Detail** - Informazioni complete di un ristorante

## Primary Content and Functionality

### 1. Home Screen (Recipes)
- **Header**: Titolo "Ricette" con icona
- **Search Bar**: Ricerca ricette per nome o ingredienti
- **Recipe List**: Lista di ricette con:
  - Immagine thumbnail (placeholder)
  - Nome ricetta
  - Tempo di preparazione
  - Difficoltà (facile, media, difficile)
  - Tap per vedere dettagli
- **Empty State**: Messaggio se nessuna ricetta trovata

### 2. Restaurants Tab
- **Header**: Titolo "Ristoranti"
- **Filter Section**:
  - Input campo prezzo massimo (€/persona)
  - Input campo piatto desiderato
  - Pulsante "Cerca"
- **Results List**: Ristoranti trovati con:
  - Nome ristorante
  - Prezzo medio
  - Piatti disponibili
  - Distanza (km)
  - Tap per dettagli
- **Empty State**: Nessun risultato trovato

### 3. Travels Tab
- **Header**: Titolo "Costi Viaggio"
- **Input Section**:
  - Partenza (testo)
  - Destinazione (testo)
  - Tipo di viaggio (auto, treno, aereo) - dropdown
  - Pulsante "Calcola"
- **Results Section**:
  - Distanza totale (km)
  - Costo stimato
  - Tempo di viaggio
  - Dettagli pedaggi (se auto)
- **Empty State**: Inserisci i dati per calcolare

### 4. Recipe Detail Screen
- **Back Button**: Ritorna alla lista
- **Image**: Ricetta immagine grande
- **Title**: Nome ricetta
- **Info Section**:
  - Tempo preparazione
  - Difficoltà
  - Porzioni
- **Ingredients List**: Ingredienti con quantità
- **Instructions**: Passaggi di preparazione
- **Notes**: Note aggiuntive

### 5. Restaurant Detail Screen
- **Back Button**: Ritorna alla lista
- **Header Info**:
  - Nome ristorante
  - Valutazione
  - Prezzo medio
- **Contact Section**:
  - Indirizzo
  - Telefono
  - Orari apertura
- **Menu Section**: Piatti disponibili
- **Distance**: Distanza da utente

## Key User Flows

### Flow 1: Visualizzare una Ricetta
1. Utente apre app → Home screen (Ricette)
2. Vede lista di ricette
3. Tap su una ricetta → Recipe Detail screen
4. Legge ingredienti e istruzioni
5. Tap "Back" → torna a lista

### Flow 2: Cercare un Ristorante
1. Utente tap tab "Ristoranti"
2. Inserisce prezzo massimo (es. €20)
3. Inserisce piatto desiderato (es. "lasagne")
4. Tap "Cerca"
5. Vede lista ristoranti che match i criteri
6. Tap su ristorante → Restaurant Detail
7. Vede indirizzo, telefono, menu

### Flow 3: Calcolare Costo Viaggio
1. Utente tap tab "Viaggi"
2. Inserisce partenza (es. "Milano")
3. Inserisce destinazione (es. "Roma")
4. Seleziona tipo viaggio (auto)
5. Tap "Calcola"
6. Vede distanza, costo, tempo
7. Se auto: vede dettagli pedaggi

## Color Choices

| Elemento | Colore | Uso |
|----------|--------|-----|
| **Primary** | #0a7ea4 (Blu teal) | Pulsanti, header, accenti |
| **Background** | #ffffff (Bianco) | Sfondo principale |
| **Surface** | #f5f5f5 (Grigio chiaro) | Card, superfici elevate |
| **Foreground** | #11181C (Nero scuro) | Testo principale |
| **Muted** | #687076 (Grigio) | Testo secondario, sottotitoli |
| **Border** | #E5E7EB (Grigio bordo) | Linee, divisori |
| **Success** | #22C55E (Verde) | Conferme, successi |
| **Warning** | #F59E0B (Arancione) | Avvisi |
| **Error** | #EF4444 (Rosso) | Errori |

## Layout Principles

- **Mobile Portrait (9:16)**: Tutto il design assume orientamento verticale
- **One-Handed Usage**: Elementi interattivi principali nella metà inferiore dello schermo
- **Safe Area**: Rispetta notch e home indicator
- **Spacing**: Padding coerente (16px, 24px, 32px)
- **Typography**: Titoli grandi e leggibili, sottotitoli chiari
- **Feedback**: Press states, loading indicators, success messages

## Design Tokens (from theme.config.js)

Tutti i colori sono già definiti e disponibili tramite Tailwind CSS:
- `bg-background`, `text-foreground`, `bg-surface`, `text-muted`
- `bg-primary`, `border-border`
- `bg-success`, `bg-warning`, `bg-error`

## Notes

- Usare NativeWind (Tailwind CSS) per tutti gli stili
- Componenti riutilizzabili: Card, Button, Input, List
- Animazioni leggere per feedback (scale 0.97 su press)
- Haptics feedback su azioni principali (Light impact)
