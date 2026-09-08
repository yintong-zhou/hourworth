# HourWorth

A simple, privacy-first web app that shows how many hours, days, months, or years
of work are needed to afford a product or service, based on the user's disposable
monthly income.

## Concept

Instead of just showing a price in currency, WorkPrice reframes it in terms of
**time worked** — a more intuitive and personal way to think about spending
decisions.

The core calculation:

1. `disposable income = monthly income - fixed monthly expenses`
2. `hourly rate = disposable income / (working hours per day × working days per month)`
3. `hours needed = product price / hourly rate`
4. Hours are then converted into days, months, and years for display.

## Key principles

- **No backend, no login.** This is a client-side-only application. All
  calculations happen in the browser.
- **No data leaves the device.** Income and expense data entered by the user
  are never sent to a server — they are stored locally via `localStorage`.
  This is a deliberate privacy/trust decision, not just a technical shortcut.
- **Static product catalog.** The list of products/services is a static JSON
  file (`/public/products.json`), fetched at runtime. It can be updated by
  replacing the file, without rebuilding the app.

## Product catalog

`products.json` is a `{ currency_reference, products: [...] }` object. Each
product carries its own **real** US and EU market price — `price_us_usd`
(federal/state tax excluded) and `price_eu_eur` (VAT included, Euro-area
average) — plus `category`, `model`, and `configuration`. These are genuine
regional prices, not one price converted by a fixed rate, so a MacBook or a
Tesla can (and does) cost proportionally more or less in one region than the
other. `frontend/src/lib/products.js` normalizes each row (stable id, accent
-stripped slug) and provides `getPriceForCurrency`, `filterProducts` (search +
category), `getCategories`, and `groupByCategory`, used to render the catalog
as category-grouped sections with a search box and category-pill filter.

## Currency

English only (no multi-language support). **Currencies:** USD and EUR,
toggled with a pill switch in the header. Product prices come straight from
`products.json` (see above — no conversion). The static exchange rate in
`frontend/src/lib/currency.js` is used **only** to convert the user's own
stored income/expense figures when they switch currency, so their real-world
meaning is preserved — consistent with the no-API-calls principle above, this
is not a live rate.

## Tech stack

- **Frontend:** React (Vite)
- **State/persistence:** Local component state + `localStorage` (custom hook,
  no external state library)
- **Data:** Static JSON catalog, no database, no API calls
- **Hosting:** Static hosting (e.g. Vercel/Netlify) — no server required

## Project structure

```
hourworth/
├── frontend/          # React (Vite) app
│   ├── src/
│   │   ├── components/  # IncomeForm, ProductList, CategoryFilter, SearchInput, PillToggle, ...
│   │   ├── hooks/        # useLocalStorage, useProducts
│   │   ├── lib/          # workTime.js, currency.js, products.js, validateSettings.js, ...
│   │   └── App.jsx
│   └── public/
│       └── products.json  # static product catalog (categories, dual USD/EUR pricing)
├── directives/        # SOP in Markdown for agent-assisted development
├── execution/         # deterministic utility scripts (if/when needed)
└── .tmp/              # intermediate files, never committed
```
