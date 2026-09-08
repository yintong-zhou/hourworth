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
│   │   ├── components/  # IncomeForm, ProductList, ...
│   │   ├── hooks/        # useLocalStorage, useProducts
│   │   ├── lib/          # workTime.js (core calculation), formatWorkTime.js
│   │   └── App.jsx
│   └── public/
│       └── products.json  # static product catalog
├── directives/        # SOP in Markdown for agent-assisted development
├── execution/         # deterministic utility scripts (if/when needed)
└── .tmp/              # intermediate files, never committed
```
