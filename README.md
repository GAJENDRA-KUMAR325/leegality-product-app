# 🛒 ShopKart — Product Listing & Detail App

An Amazon-style e-commerce product catalogue built for the **Leegality Frontend Engineer Assessment**, powered by the public [DummyJSON Products API](https://dummyjson.com/docs/products).

It demonstrates working with APIs, reusable components, state management, combined filtering, routing and clean, maintainable structure.

---

## ✨ Features

**Product Listing Page**
- Responsive product grid (image, title, price, rating, discount badge)
- Left-hand filter rail with **combined filtering**:
  - **Category** — fetched dynamically from `/products/categories` (single-select)
  - **Price range** — Min / Max inputs (apply on click or Enter)
  - **Brand** — multi-select, extracted live from the fetched products
  - **Search** — debounced title search (bonus)
- Filters work **together** and update the list **immediately**
- **Pagination resets** automatically whenever a filter changes
- Numbered pagination with Previous / Next and ellipsis collapsing
- Proper **loading** (skeleton grid + spinner), **error** (with retry) and **empty** states

**Product Detail Page** (`/product/:id`)
- Image gallery with thumbnails, name, price, rating
- Brand, category, availability, full description and customer reviews
- **Back** button that returns to the listing **with all previous filters & page still applied**

**Internationalization (i18n)**
- Country picker in the navbar covering 10 countries / 9 languages (English, Hindi, German, French, Spanish, Portuguese, Japanese, Chinese, Arabic)
- Switches **UI language**, **currency** (converted from USD + locale-aware `Intl` formatting, e.g. `₹58,157`, `643,08 €`, `¥5,068`) and **text direction** (RTL for Arabic)
- **Product content is also translated** — titles, descriptions and category names are machine-translated at runtime (MyMemory, no API key), cached in memory + localStorage, with a fail-soft fallback to English
- Selection persists across reloads (localStorage) and is reflected on `<html lang/dir>`

---

## 🚀 Setup

**Prerequisites:** Node.js ≥ 18

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server  → http://localhost:5173
npm run dev

# 3. Production build + local preview
npm run build
npm run preview
```

No environment variables or API keys are required — the DummyJSON API is public.

---

## 🧱 Tech Stack

| Concern        | Choice                                  |
| -------------- | --------------------------------------- |
| Framework      | React 18 (functional components + hooks) |
| Build tool     | Vite 5                                  |
| Routing        | React Router v6                         |
| State          | Context API + local component state     |
| Styling        | Hand-written CSS (no UI library)        |

> Per the brief, no heavy UI library was used — styling is a single, token-driven stylesheet.

---

## 🗂 Project Structure

```
src/
├── api/
│   └── products.js          # Single network layer over DummyJSON
├── components/
│   ├── Navbar.jsx
│   ├── Filters.jsx          # Category / price / brand / search rail
│   ├── ProductCard.jsx      # Reusable product tile (links to detail)
│   ├── ProductGrid.jsx
│   ├── Pagination.jsx       # Numbered pagination w/ ellipses
│   ├── StarRating.jsx       # Reusable half-star rating
│   └── States.jsx           # Loader / Skeleton / Error / Empty
├── context/
│   └── FilterContext.jsx    # Filter + page state held above the router
├── hooks/
│   ├── useProducts.js       # Loads product scope for a category
│   ├── useCategories.js     # Loads category list once
│   └── useDebounce.js       # Debounces the search input
├── pages/
│   ├── ProductListPage.jsx  # Listing: data flow + filter pipeline
│   └── ProductDetailPage.jsx
├── utils/
│   ├── filtering.js         # Pure filter / brand / pagination helpers
│   └── format.js            # Price formatting
├── App.jsx                  # Shell + routes
├── main.jsx                 # Providers (Router → FilterProvider → App)
└── index.css                # Design tokens + all styling
```

---

## 🏛 Architectural Decisions

**1. One API module.**
All `fetch` calls live in `src/api/products.js` with a shared `request()` helper for JSON parsing and consistent error messages. The rest of the app never touches `fetch` directly, so the data source can be swapped or cached in one place.

**2. Filter state lives above the router.**
`FilterProvider` wraps `<Routes>`, so filter selections and the current page survive navigation. This is what makes *"previously selected filters remain applied when navigating back"* work for free — the listing page simply re-reads the same context when you return from a product.

**3. Fetch the category scope once, filter & paginate on the client.**
The catalogue is small (~194 products). When a category is selected the app fetches that whole category (`limit=0`); otherwise it fetches the full catalogue once. **Only a category change triggers a network request** — price, brand and search filtering plus pagination then run in memory.

This is a deliberate trade-off:
- ✅ Combined filters are always **correct** — brand/price never operate on a partial page.
- ✅ The brand list always reflects the actual fetched scope (`extractBrands`).
- ✅ Filtering and paging feel instant (no loading flash on every tweak).
- ⚠️ It assumes a small dataset. The scaling path is documented below.

**4. Pure, testable logic.**
`utils/filtering.js` (`applyFilters`, `extractBrands`, `paginate`, `totalPages`) is plain, side-effect-free JavaScript — easy to reason about and unit-test independently of React.

**5. Every async surface has three states.**
Loading (skeleton/spinner), error (with a retry that re-triggers the fetch), and empty (with a clear-filters action) are handled on both pages.

**6. Locale as its own context, no i18n library.**
`LocaleContext` is the single source of truth for language, currency and direction. It exposes `t(key, vars)` (dictionary lookup with English fallback) and `formatPrice(usd)` (convert + `Intl.NumberFormat`). Adding a country is one row in `i18n/locales.js`; adding a language is one block in `i18n/translations.js`. Currency uses a **static USD rate table** (`utils/currency.js`) — swapping it for a live FX fetch is a one-function change.

---

## 📌 Assumptions

- **Category is single-select.** The DummyJSON `category/{slug}` endpoint serves one category, so categories are modelled as radio options with an *"All categories"* default. Brands remain multi-select as allowed by the brief.
- **Brands are derived per scope.** Only ~half of DummyJSON products carry a `brand`; the brand list shows the unique brands present in the currently fetched scope. Selecting a brand excludes products that have no brand.
- **Price applies explicitly.** Min/Max commit on **Apply** or **Enter** (not on every keystroke) to avoid filtering on half-typed numbers — matching the mockup's Apply button. Category, brand and search apply instantly.
- **Page size** is fixed at 8 cards per page (matches the mockup's 2×4 grid).
- **Search** (by title) is an added convenience consistent with the mockup's search bar; it composes with the other filters.
- **i18n scope:** the app's own UI is fully translated, **all prices are localized**, and product **content (titles/descriptions/categories) is machine-translated at runtime** with caching. Machine translation is best-effort — quality varies by language and the first view of a new product in a new language streams in (then caches). Brand names are intentionally left untranslated (proper nouns). FX rates are a static table — see decision #6.

---

## 🔭 Improvements With More Time

- **Sync filters to the URL** (query params) so a filtered view is shareable/bookmarkable and survives a refresh.
- **Server-side filtering & pagination** for large catalogues — push category/search to the API via `limit`/`skip`, with cursor handling. (Current client-side approach is intentional for this dataset size.)
- **Caching** (React Query / SWR) for dedupe, background refresh and retry/back-off.
- **Live FX rates + product-content translation** — replace the static rate table with a cached FX feed, and machine-translate API titles/descriptions (e.g. via a translation API) so product content is localized too, not just the UI.
- **Tests** — unit tests for `utils/filtering.js` and component tests (Vitest + React Testing Library) for the filter interactions.
- **Accessibility polish** — focus management on route change, keyboard-navigable gallery, ARIA live region wiring.
- **Skeletons on the detail page** and image `srcset` for performance.
- **TypeScript** for end-to-end type safety on the API models.

---

## 📡 API Endpoints Used

| Purpose            | Endpoint                                    |
| ------------------ | ------------------------------------------- |
| Catalogue / scope  | `GET /products?limit=0`                     |
| Category scope     | `GET /products/category/{slug}?limit=0`     |
| Category list      | `GET /products/categories`                  |
| Product detail     | `GET /products/{id}`                        |

---

Built with care for the Leegality Frontend Assessment.
