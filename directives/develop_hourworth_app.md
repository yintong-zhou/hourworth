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

## Testing
Vitest + Testing Library (`npm test` dentro `frontend/`), config in `vite.config.js` (campo `test`). Coperti: calcolo puro (`workTime.js`, `formatWorkTime.js`), validazione (`validateSettings.js`), integrazione `App.jsx` (fetch mockato, cambio input, stati di errore). `fetch` va sempre mockato nei test (`vi.stubGlobal`) perché il fetch nativo di Node non risolve URL relativi come `/products.json`.
