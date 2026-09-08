# Direttiva: Sviluppo app HourWorth

## Obiettivo
Sviluppare e mantenere HourWorth, una web app client-side che converte i prezzi in tempo di lavoro necessario per permetterseli, in base al reddito disponibile mensile dell'utente.

## Input
- Reddito mensile, spese fisse mensili, ore lavorative al giorno, giorni lavorativi al mese (inseriti dall'utente nel form, persistiti in `localStorage`)
- Catalogo prodotti statico: `frontend/public/products.json`

## Vincoli chiave (da README.md, non modificare senza chiedere)
- Nessun backend, nessun login: tutta la logica gira nel browser
- Nessun dato lascia il dispositivo: niente chiamate API con dati utente
- Stack: React + Vite, nessuna libreria di state management esterna
- Catalogo prodotti aggiornabile sostituendo `products.json`, senza rebuild

## Tool/script da usare
- `frontend/` — progetto Vite+React già scaffoldato
- `frontend/src/lib/workTime.js` — calcolo puro (hourly rate, breakdown ore/giorni/mesi/anni)
- `frontend/src/hooks/useLocalStorage.js` — persistenza impostazioni utente
- `frontend/src/hooks/useProducts.js` — fetch del catalogo statico

## Output
- App funzionante in `npm run dev` (dentro `frontend/`)
- Build statica deployabile su hosting statico (Vercel/Netlify), nessun server richiesto

## Casi limite
- Reddito disponibile <= 0 → hourly rate 0, breakdown deve mostrare "n/a" invece di dividere per zero
- `products.json` non raggiungibile/malformato → mostrare messaggio di errore, non bloccare l'app
- Valori del form negativi o non numerici → validare lato client prima di calcolare (`lib/validateSettings.js`), mostrare l'errore accanto al campo e "—" al posto della tariffa oraria finché non è valida

## Brand (da brand-guidelines.md, non modificare senza chiedere)
Stile "neo-brutalist meets SaaS": palette lime `#CBF042` / near-black `#191A23` / bianco / grigio chiaro `#F3F3F3`, bordi neri sottili sulle card chiare, angoli molto arrotondati, font Space Grotesk, parole chiave con sfondo lime "a evidenziatore" (usato per "Worth" nel logo e per la tariffa oraria). Rotazione a 3 colori (grigio chiaro / lime / near-black) sulle card della lista prodotti così che due card adiacenti non condividano mai lo sfondo. Implementato via Tailwind v4 `@theme` in `src/index.css` (token `--color-accent`, `--color-ink`, `--color-panel`, `--color-muted`, `--color-line`, `--radius-card`, `--radius-pill`) — usare sempre queste utility (`bg-accent`, `text-ink`, `rounded-card`, ecc.) invece di colori hardcoded, per restare coerenti se la palette cambia.

## Lingua e valuta
- Solo inglese: l'italiano era stato aggiunto (dizionario `src/i18n/translations.js` + toggle EN/IT) e poi rimosso su richiesta esplicita dell'utente — non reintrodurre il supporto multi-lingua senza chiedere
- Due valute (USD/EUR), selezionabili con pill toggle nell'header, persistite in `localStorage` (`hourworth-currency`); default **EUR** (reddito mensile predefinito 1500, inteso in euro)
- I prezzi del catalogo NON vengono convertiti: `products.json` ha un prezzo reale per regione (`price_us_usd`, `price_eu_eur`), letti direttamente da `getPriceForCurrency()` in `lib/products.js` — un MacBook o una Tesla costano proporzionalmente di più/meno in una regione rispetto all'altra, un tasso fisso distorcerebbe questo dato reale
- Il tasso di cambio statico in `lib/currency.js` (`UNITS_PER_USD`) serve SOLO a riconvertire reddito/spese inseriti dall'utente quando cambia valuta, cosa diversa dai prezzi di catalogo — non confondere i due usi
- Se si aggiunge un'altra valuta in futuro al catalogo: ogni prodotto in `products.json` deve avere il proprio campo `price_<currency>` reale, non derivarlo via conversione

## Catalogo prodotti
- `products.json` è un oggetto `{ currency_reference, products: [...] }` (non più un array semplice); ogni riga ha `category`, `model`, `configuration`, `price_us_usd`, `price_eu_eur`
- Tutti i contenuti testuali del catalogo (category/model/configuration/currency_reference) sono in inglese, coerentemente con l'app English-only — se si aggiungono nuovi prodotti, scriverli in inglese, non tradurre a metà
- `lib/products.js` normalizza ogni riga (id stabile e univoco via slug senza accenti, generato da categoria+modello+configurazione+indice) ed espone `getCategories`, `filterProducts` (ricerca testuale su model/configuration/category + filtro categoria), `groupByCategory`
- UI: `CategoryFilter.jsx` (pill per ogni categoria + "All") e `SearchInput.jsx` (campo di ricerca) sopra la lista; `App.jsx` raggruppa i prodotti filtrati per categoria con un'intestazione `<h2>` per gruppo, passati a `ProductList`
- Se la ricerca è ambigua nei test con Testing Library: il nome di una categoria appare sia come label del pill sia come intestazione `<h2>` del gruppo — usare `getByRole('heading', {name: ...})` per l'intestazione, non `getByText`, altrimenti il match è multiplo

## Testing
Vitest + Testing Library (`npm test` dentro `frontend/`), config in `vite.config.js` (campo `test`). Coperti: calcolo puro (`workTime.js`, `formatWorkTime.js`), validazione (`validateSettings.js`), integrazione `App.jsx` (fetch mockato, cambio input, stati di errore). `fetch` va sempre mockato nei test (`vi.stubGlobal`) perché il fetch nativo di Node non risolve URL relativi come `/products.json`.
