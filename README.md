# Nua

A Blinkit-style commerce client built with **Expo SDK 57** and TypeScript.

Product listing with infinite scroll and debounced search, product detail with image carousel and discounted pricing, a persisted cart, offline-aware browsing, an in-app analytics event log, and a Return Policy WebView.

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
| `npm test` | Search race-condition unit test |
| `npm run lint` | ESLint via `expo lint` |

**Requirements:** Node 20+, Expo Go or a simulator.

```bash
EXPO_PUBLIC_PRODUCTS_URL=https://dummyjson.com/products
```

---

## How state is split

Two kinds of data, two owners.

**TanStack Query** owns anything that comes from DummyJSON: product pages, categories, product detail. It already knows how to cache by key, paginate, retry, abort, and mark data stale. Reimplementing that in a store would be a worse cache.

**Zustand** owns anything the device is the source of truth for: cart lines, light/dark preference, the in-app event log. Those are sync mutations. A query cache is the wrong shape.

That split is the main trade-off. Context would work for theme, but cart updates from product cards would re-render more of the tree unless you split contexts carefully. Redux is fine; it's just more ceremony than this surface needs. Zustand's selectors keep a product card subscribed only to `quantity` for *that* id, and `persist` maps cart + theme onto AsyncStorage without extra glue.

Analytics is fired from the cart store itself (`addItem` / `increment`), not from each button. The event stays next to the mutation.

Routes in `src/app/` are shells. Screens, queries, and services live under `src/features/`.

```
src/
├── app/                 # Expo Router — thin
├── features/products|cart|events
├── lib/                 # QueryClient, offline flags
├── services/            # shared axios instance
└── theme/               # tokens + persisted preference
```

---

## Caching

Three layers, on purpose. They fail independently.

### 1. In-memory (TanStack Query)

List queries use `staleTime: 60s`. Categories use `5 min` — they almost never change during a session. After staleTime, the UI still shows the last pages while a background refetch runs. `queryKey` is `['products', 'list', { search, category }]`, so “oil” and “All” don’t share a cache with “oil” + Beauty.

`networkMode: 'offlineFirst'` is required for the disk fallback below. Default Query behavior is “don’t run `queryFn` if we think we’re offline.” We *want* the function to run so it can read AsyncStorage.

### 2. Disk (first page only)

On a successful default first page (`search === ''`, category `all`, `skip === 0`), the response is written to AsyncStorage (`nua-products-first-page`).

On a later fetch failure of that same page, the service returns the disk snapshot instead of throwing — unless the request was aborted, or we’re in an API-mock mode (those mocks must still look like failures).

**Why only page 1?** Page 2+ is “load more.” Showing a stale first grid is grocery-app-correct (Zepto/Blinkit still show *something*). Serving a stale page 3 as if it were fresh pagination would lie about `total` / `hasNextPage`. Search and category results are also skipped — they’re too specific to be a useful fallback.

**Trade-off:** prices on that cached page can be stale. The offline banner says so. We don’t persist the whole infinite query to disk; that would need a versioned schema and eviction we don’t have.

### 3. Client persist (not product cache)

| Key | What | Why disk |
| --- | --- | --- |
| `nua-cart` | Cart items | Kill-app shouldn’t empty the bag |
| `nua-theme` | `'light' \| 'dark'` | Preference, then `Appearance.setColorScheme` so native chrome matches |

Events stay in memory. They’re a debug stream, not a ledger.

---

## Retries (exponential backoff)

Transient failures (timeouts, 5xx, network blips) retry up to **5** times. Delay is `min(1000 * 2^attempt, 8000)` — 1s, 2s, 4s, 8s, 8s.

**4xx is not retried.** A 400 from DummyJSON (or our mock) will fail the same way on attempt 2. Retrying it only delays the error UI. The Retry button is an explicit user action; that’s a new query, not a continuation of the backoff loop.

Axios timeout is 15s. Combined with backoff, a truly dead network can sit for a while — that’s why the list uses skeletons, not a spinner that looks frozen, and why 4xx short-circuits.

Pull-to-refresh calls `refetch()`. Infinite scroll calls `fetchNextPage()`. They don’t share a “loading” flag: `refreshing={isRefetching && !isPending}` so a page-2 fetch doesn’t yank the list into a pull spinner.

---

## Search races

Type `o` → `oi` → `oil` fast enough and you get three overlapping HTTP calls. If `oi` is slower than `oil`, a naive `.then(setProducts)` flashes the wrong grid.

Two layers:

1. **Debounce 400ms** — don’t hit the network per keystroke. Cheap, but not sufficient: two *debounced* queries can still overlap if the first is slow.
2. **AbortSignal** — `useInfiniteQuery` keys on `search`. New key → TanStack Query aborts the previous `queryFn`. That signal is passed into axios, so the socket is cancelled, not just ignored in React state.

`npm test` covers this: a hung `"a"` request is aborted; `"iphone"` wins; the stale payload never lands.

DummyJSON has no `?q=&category=` URL. Combined search + category is “search with `limit=0`, then `filter(product.category === category)`.” Wrong, but the API doesn’t offer the right thing. Pagination in that mode is a single page.

---

## Offline

Connectivity is `isConnected !== false`. `isInternetReachable` is a false offline on iOS Simulator even with Wi‑Fi on — we learned that the hard way.

When offline:

- Banner sits in the status-bar strip (header color + dark overlay, not a random error red).
- Load-more, pull-to-refresh, and product-detail navigation toast and no-op. Detail is a network fetch we don’t disk-cache.
- Cart +/− still works. That’s local state.
- First-page cache can still populate the grid via `offlineFirst` + the catch path above.

---

## Theme

`useThemeStore` is the switch (`preference`, `toggle`, persist). `useTheme()` is `Colors[preference]` — paint, not control. `Appearance.setColorScheme` runs on toggle *and* on rehydrate so NativeTabs / status bar don’t stay on the OS scheme after a cold start.

---

## Analytics

In-app Events tab, not a vendor SDK.

| Event | When |
| --- | --- |
| `product_viewed` | Detail has a product |
| `add_to_cart` | Store add / increment |
| `search_performed` | Debounced query changes |
| `app_backgrounded` | `AppState === 'background'` from root layout |

Each row is `{ id, type, metadata, createdAt }`.

---

## Testing

```bash
npm test
```

Jest via `jest-expo`. One test on purpose: the search abort path. That’s the bug that looks like “search is flaky” in production.

Dev flags (keep off unless you’re screenshotting):

| Flag | File |
| --- | --- |
| `MOCK_OFFLINE` | `src/lib/offline-mock.ts` |
| `MOCK_SKELETON` | same |
| `PRODUCTS_API_MOCK` (`'off' \| '400' \| 'timeout'`) | `products-mock.ts` |

---

## What’s next

Checkout is UI-only. Product detail doesn’t have the list’s retry chrome. Events aren’t persisted. A fuller suite would lock debounce, backoff, and cart rehydrate — not just the race.

---

Expo SDK 57 · React Native 0.86 · TypeScript · Expo Router · TanStack Query · Axios · Zustand · AsyncStorage · NetInfo · react-native-webview · jest-expo
