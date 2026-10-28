# Celebrare Photo Gallery

A responsive React photo gallery built with Vite and Tailwind CSS for the Celebrare Frontend Intern pre-screening assignment.

## Features

- Fetches 30 photos from the Picsum Photos API on page load.
- Loading spinner and a readable error state.
- Responsive grid: one column on mobile, two on tablet, and four on desktop.
- Real-time author-name search using already-fetched data.
- Favourite toggle managed with `useReducer`.
- Favourites saved in `localStorage` and restored after a refresh.
- Custom `useFetchPhotos` hook.
- `useCallback` for the search handler and favourite handler; `useMemo` for filtered photos and favourite IDs.
- Functional React components only; styling uses Tailwind CSS, without a component library.

## Run locally

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open the local URL Vite prints in the terminal (usually `http://localhost:5173`).

To check the production build:

```bash
npm run build
npm run preview
```

## Project structure

```text
src/
  Gallery.jsx           Main gallery UI, search, reducer wiring and memoization
  favouritesReducer.js  Favourite reducer and localStorage loader
  useFetchPhotos.js     API fetch custom hook
  index.css             Tailwind directives and base styles
  main.jsx              React entry point
```

## How the required React features are used

### `useFetchPhotos`
Returns `{ photos, loading, error }`. It fetches the Picsum list once on mount. A non-success HTTP response or invalid response data becomes an error message. An `AbortController` cancels the request if the component unmounts.

### `useReducer`
The favourites reducer handles the `TOGGLE` action. If a photo is already favourited, it is removed; otherwise it is added. This keeps the add/remove state transition in one place. The initial state is loaded from `localStorage`, and an effect saves changes back to storage.

### `useCallback`
`handleSearchChange` is wrapped in `useCallback` so its function identity remains stable across renders. The favourite toggle handler is also stable. In this small app, the performance benefit is modest; it demonstrates the requested pattern and is useful when passing handlers to memoized child components or hooks that depend on stable callbacks.

### `useMemo`
`filteredPhotos` is recalculated only when the fetched photos or search term changes, rather than on unrelated renders. `favouriteIds` is recalculated only when favourites change. For only 30 photos, the speed benefit is small, but it clearly isolates derived data.