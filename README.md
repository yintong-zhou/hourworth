# HourWorth

**See prices in hours of work, not just currency.**

HourWorth reframes the price of a product or service as the amount of *time*
you have to work to afford it — hours, days, months or years — based on your own
disposable income. A €1,200 laptop means little on its own; "three weeks of your
life" is a decision you can actually make.

Everything runs in the browser. No account, no backend, no data leaving your
device.

## Why

A price tag is an abstract number. Work time is not. Converting one into the
other makes the trade-off behind a purchase explicit, and it does so with data
that is far too personal to hand to a server — which is why this app doesn't
have one.

## How it works

1. `disposable income = monthly income − fixed monthly expenses`
2. `hourly rate = disposable income ÷ (working hours per day × working days per month)`
3. `hours needed = product price ÷ hourly rate`
4. Hours roll up into days, months and years, and the largest sensible unit is
   shown (`3.4 months`, not `598.4 hours`).

The calculation lives in [`frontend/src/lib/workTime.js`](frontend/src/lib/workTime.js)
and the unit selection in [`frontend/src/lib/formatWorkTime.js`](frontend/src/lib/formatWorkTime.js),
both covered by unit tests.

## Features

- **34 real products** across 16 categories — from a litre of milk to a premium
  SUV — grouped into sections, searchable, filterable by category pill.
- **USD / EUR toggle** with genuine regional prices, not one price divided by an
  exchange rate.
- **Persistent settings.** Income, expenses, schedule and currency survive a
  reload via `localStorage`.
- **Input validation** with inline errors; an invalid or zero hourly rate shows
  `n/a` rather than `Infinity`.

## Getting started

Requires **Node.js 20.19+ or 22.12+** (Vite 8).

```bash
cd frontend
npm install
npm run dev
```

The dev server prints a local URL (Vite defaults to <http://localhost:5173>).

### Scripts

All commands run from `frontend/`:

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run the Vitest suite once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Lint with Oxlint |

## Design decisions

These are deliberate constraints, not gaps to be filled in later.

**No backend, no login.** The app is client-side only. Income and expense
figures are stored in `localStorage` and never transmitted anywhere. This is the
trust model, not a shortcut — adding a server would mean asking users to upload
their salary.

**No network calls beyond the static catalog.** The only `fetch` in the app
loads `/products.json` from the same origin. There is no analytics, no live
exchange-rate API, no telemetry.

**Two real price columns, no FX conversion.** Each product carries both
`price_us_usd` (federal/state tax excluded) and `price_eu_eur` (VAT included,
Euro-area average). A MacBook and a Tesla genuinely cost proportionally
different amounts in each region, and a single converted price would hide that.

**The static exchange rate is for user data only.** `currency.js` holds a
hardcoded USD↔EUR rate used *solely* to convert the user's own stored income and
expenses when they flip the currency toggle, so those figures keep their
real-world meaning. It is never applied to product prices, and it is not a live
rate.

**English only.** No i18n layer.

## Product catalog

`frontend/public/products.json` is a static file fetched at runtime, so the
catalog can be updated by replacing the file — no rebuild required, as long as
the deployed copy is replaced too.

```json
{
  "currency_reference": {
    "us": "USD (federal/state taxes excluded)",
    "eu": "EUR (VAT included, Euro-area average)"
  },
  "products": [
    {
      "category": "Fresh groceries",
      "model": "Whole fresh milk",
      "configuration": "1 liter",
      "price_us_usd": 1.15,
      "price_eu_eur": 1.45
    }
  ]
}
```

Every field is required. [`frontend/src/lib/products.js`](frontend/src/lib/products.js)
normalizes each row — assigning a stable, accent-stripped slug id — and exposes
`getPriceForCurrency`, `filterProducts`, `getCategories` and `groupByCategory`.
Category order in the UI follows first appearance in the file, so grouping
related products together keeps the page readable.

## Deployment

Static hosting. Build and publish `frontend/dist/`:

```bash
cd frontend
npm run build
```

> [!IMPORTANT]
> The catalog is fetched from the absolute path `/products.json`, so the app
> must be served from the root of its domain. To host it under a sub-path, set
> Vite's `base` option and update the `fetch` URL in
> [`frontend/src/hooks/useProducts.js`](frontend/src/hooks/useProducts.js).

## Tech stack

- **React 19** with **Vite 8**
- **Tailwind CSS 4** (`@tailwindcss/vite`), theme tokens defined in
  `src/index.css` from [`brand-guidelines.md`](brand-guidelines.md)
- **Space Grotesk** via `@fontsource`
- **Vitest** + **Testing Library** (jsdom), **Oxlint**
- State: local component state and a `useLocalStorage` hook — no state library

## Project structure

```
hourworth/
├── frontend/
│   ├── public/
│   │   └── products.json    # static catalog, dual USD/EUR pricing
│   └── src/
│       ├── components/      # IncomeForm, ProductList, CategoryFilter, SearchInput, PillToggle, Logo, Footer, Sparkle
│       ├── hooks/           # useLocalStorage, useProducts
│       ├── lib/             # workTime, formatWorkTime, currency, products, validateSettings, fields (+ .test.js)
│       └── App.jsx
├── directives/              # SOP in Markdown for agent-assisted development
├── execution/               # deterministic Python utility scripts
├── brand-guidelines.md      # colors, typography, component style
└── .tmp/                    # intermediate files, never committed
```

> [!NOTE]
> This repository follows the three-layer workflow described in
> [`CLAUDE.md`](CLAUDE.md): directives (`directives/`) state *what* to do,
> the agent orchestrates, and `execution/` scripts do deterministic work.
> See [`directives/develop_hourworth_app.md`](directives/develop_hourworth_app.md)
> before extending the app.
