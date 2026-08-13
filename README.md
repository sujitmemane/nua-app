# Nua

A Blinkit-style commerce client built with **Expo SDK 57** and TypeScript.

Product listing with infinite scroll and debounced search, product detail with image carousel and discounted pricing, a persisted cart, offline-aware browsing, an in-app analytics event log, and a Return Policy WebView — the kind of surface area you hit shipping a real grocery app, not a toy CRUD demo.

<table>
<tr>
<td width="50%">

**Listing (dark)**  
Grid, category chips, ADD / qty stepper.

![Product listing](docs/screenshots/01-listing.png)

</td>
<td width="50%">

**Listing (light)**  
Same screen after the theme toggle.

![Light mode](docs/screenshots/11-light-mode.png)

</td>
</tr>
<tr>
<td>

**Loading**  
Grid skeletons while products fetch.

![Loading skeleton](docs/screenshots/02-loading.png)

</td>
<td>

**Search**  
Debounced DummyJSON search (`oil`).

![Search results](docs/screenshots/03-search.png)

</td>
</tr>
<tr>
<td>

**Empty search**  
No matches for a nonsense query.

![Empty search](docs/screenshots/04-empty-search.png)

</td>
<td>

**Error + retry**  
Failed fetch with a Retry action.

![Error retry](docs/screenshots/05-error.png)

</td>
</tr>
<tr>
<td>

**Product detail**  
Discounted price, qty in cart, tags.

![Product detail](docs/screenshots/06-detail.png)

</td>
<td>

**Return Policy**  
In-app WebView (not an external browser).

![Return Policy WebView](docs/screenshots/07-webview.png)

</td>
</tr>
<tr>
<td>

**Cart**  
Persisted items, stepper, discounted subtotal.

![Cart](docs/screenshots/08-cart.png)

</td>
<td>

**Empty cart**

![Empty cart](docs/screenshots/09-cart-empty.png)

</td>
</tr>
<tr>
<td>

**Events**  
In-app analytics log + filter pills.

![Events log](docs/screenshots/10-events.png)

</td>
<td>

**Offline**  
Banner + cached first page.

![Offline](docs/screenshots/12-offline.png)

</td>
</tr>
</table>

---

## Quick start

```bash
npm install
cp .env.example .env   # optional — DummyJSON is the default
npx expo start
```

| Command | What it does |
| --- | --- |
| `npx expo start` | Dev server (iOS / Android / Expo Go / web) |
| `npm test` | Unit tests (includes the search race-condition case) |
| `npm run lint` | ESLint via `expo lint` |

**Requirements:** Node 20+, Expo Go or a simulator.

Optional env:

```bash
EXPO_PUBLIC_PRODUCTS_URL=https://dummyjson.com/products
```

---

## Assignment coverage

| Requirement | Status | Where it lives |
| --- | --- | --- |
| Paginated DummyJSON listing | Done | `products-service` + `useInfiniteQuery` |
| Infinite scroll (no Load More) | Done | `ProductsScreen` `onEndReached` |
| Debounced search → `/products/search?q=` | Done | `useDebouncedValue` (400ms) |
| Product detail + image carousel | Done | `ProductDetailScreen` + `ProductImageCarousel` |
| Discounted price from `discountPercentage` | Done | `getDiscountedPrice` |
| Cart (Zustand) | Done | `features/cart` |
| Cart → AsyncStorage | Done | Zustand `persist` (`nua-cart`) |
| Return Policy WebView | Done | `/return-policy` |
| Analytics: 4 events + metadata | Done | Events tab + `eventsService` |
| Offline support | Done | NetInfo banner, first-page cache, guarded actions |
| **Bonus** retry + exponential backoff | Done | `lib/query-client.ts` |
| **Bonus** pull-to-refresh vs pagination | Done | `onRefresh` / `fetchNextPage` separated |
| **Bonus** dark mode + persist | Done | `theme-store` (`nua-theme`) |
| **Bonus** search race-condition test | Done | `use-products-search-race-test.ts` |

---

## Architecture

```
src/
├── app/                  # Expo Router only — thin route shells
├── features/
│   ├── products/         # list, detail, search, cache, WebView
│   ├── cart/             # Zustand store + cart UI
│   └── events/           # analytics store, AppState listener, log UI
├── components/           # shared UI (tabs, banner, toast, themed primitives)
├── hooks/                # net info, debounce, theme colors
├── lib/                  # QueryClient, offline mock flag
├── services/             # shared axios client
└── theme/                # palette, typography, theme store
```

**Server state → TanStack Query.** Products are remote, paginated, and staleable. Query owns caching, retries, abort, and infinite pages.

**Client state → Zustand.** Cart, theme preference, and the analytics log are local, sync, and (for cart/theme) persisted. No provider spaghetti; stores can be called from hooks *or* plain services via `getState()`.

**Routes stay thin.** `src/app/**` re-exports feature screens. Business logic never lives in the router tree.

---

## Design decisions

### Why Zustand (not Context / Redux)

| | Context | Redux | Zustand (chosen) |
| --- | --- | --- | --- |
| Boilerplate | Low | High | Low |
| Re-renders | Easy to over-subscribe | Fine with selectors | Fine with selectors |
| Call from a non-React service | Awkward | Possible | Natural (`getState()`) |
| Persist to AsyncStorage | Manual | Extra package | Built-in middleware |

Cart mutations also fire `add_to_cart` from the store itself — analytics stays next to the action, not scattered across screens.

### Search race condition

Fast typing without guards = overlapping DummyJSON requests. A slow earlier response can land *after* a newer one and flash the wrong list.

**Mitigation (two layers):**

1. **Debounce (400ms)** — don’t hit the network on every keystroke.
2. **AbortSignal** — `useInfiniteQuery` keys on `search`; when the key changes, TanStack Query aborts the previous `queryFn`. That signal is forwarded into axios so the in-flight HTTP call is cancelled, not just ignored in UI state.

Covered by `npm test` — a stale `"a"` request is aborted; `"iphone"` wins.

### Offline

- Connectivity uses **`isConnected !== false`** only. Relying on `isInternetReachable` false-positives offline on iOS Simulator.
- Query `networkMode: 'offlineFirst'` so `queryFn` still runs offline and can serve the **first-page AsyncStorage cache**.
- Offline: connection banner, toast on load-more / refresh / retry, product detail navigation blocked. Cart add/remove still works (local state).

### Retries

Failed queries retry with exponential backoff (`1s → 2s → 4s…` capped at 8s). **4xx is not retried** — those are client errors, not transient network flakes.

### DummyJSON quirks

There is no combined `search + category` endpoint. When both are set, the app searches with `limit=0` and filters by `category` client-side. Documented here so reviewers don’t assume a missing API.

---

## Features in more detail

### Products

- Paginated fetch (`limit` / `skip`), infinite scroll, pull-to-refresh
- Category chips with themed headers
- Skeleton loading, empty states, error + retry
- Detail: carousel, brand/category, discounted + strikethrough price, tags, reviews, return-policy link

### Cart

- Add / increment / decrement from list and detail
- Persisted across restarts (`nua-cart`)
- Subtotal uses discounted unit prices; “saved” amount vs list price

### Analytics (in-app Events tab)

| Event | Fired when |
| --- | --- |
| `product_viewed` | Product detail mounts with data |
| `add_to_cart` | Cart store add / increment |
| `search_performed` | Debounced search query changes |
| `app_backgrounded` | `AppState` → `background` (root layout) |

Each event stores `id`, `type`, `metadata`, and `createdAt` (ISO). Filter pills on the Events screen.

### Theme

Light / dark preference in Zustand, persisted, and synced to `Appearance.setColorScheme` so native chrome (status bar, tabs) follows the toggle — not only JS-painted surfaces.

---

## Testing

```bash
npm test
```

Jest via [`jest-expo`](https://docs.expo.dev/develop/unit-testing/) (Expo SDK 57).

The race-condition test mocks axios + AsyncStorage and asserts:

- aborting the stale search rejects with cancel
- the newer search resolves to the correct products
- the aborted request never “wins”

---

## Dev-only flags

Leave these **off** for a normal demo / review:

| Flag | File | Purpose |
| --- | --- | --- |
| `MOCK_OFFLINE` | `src/lib/offline-mock.ts` | Fake airplane mode (banner, cache path, Query offline) |
| `MOCK_SKELETON` | `src/lib/offline-mock.ts` | Force products grid skeleton (screenshot) |
| `PRODUCTS_API_MOCK` | `src/features/products/services/products-mock.ts` | `'off'` \| `'400'` \| `'timeout'` for error/retry UX |

---

## Demo

> **Loom:** _[paste 2–3 min walkthrough link here]_

Suggested video order: browse → search → detail → cart → return policy → events → light/dark toggle → offline.

---

## What I’d improve with more time

- Broader test suite: debounce hook, backoff policy, cart persist round-trip
- Product detail error/retry parity with the list screen
- Persist analytics events (currently in-memory)
- Real checkout / order placement (Checkout is UI-only today)
- Maestro E2E for search → detail → cart → background
- Tighter commit history before a production PR

---

## Stack

Expo SDK 57 · React Native 0.86 · TypeScript · Expo Router · TanStack Query · Axios · Zustand · AsyncStorage · NetInfo · react-native-webview · jest-expo
