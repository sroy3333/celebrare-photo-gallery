import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import useFetchPhotos from "./useFetchPhotos.js";
import favouritesReducer, {
  loadFavourites,
  STORAGE_KEY,
} from "./favouritesReducer.js";

function HeartIcon({ filled }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    </svg>
  );
}

function PhotoCard({ photo, isFavourite, onToggleFavourite }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={`https://picsum.photos/id/${photo.id}/600/450`}
          alt={`Photo by ${photo.author}`}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        <button
          type="button"
          onClick={() => onToggleFavourite(photo)}
          aria-label={isFavourite ? `Remove ${photo.author} from favourites` : `Add ${photo.author} to favourites`}
          aria-pressed={isFavourite}
          title={isFavourite ? "Remove from favourites" : "Add to favourites"}
          className={`absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-md transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 ${
            isFavourite ? "text-rose-600" : "text-slate-500 hover:text-rose-600"
          }`}
        >
          <HeartIcon filled={isFavourite} />
        </button>
      </div>
      <div className="flex min-h-16 items-center justify-between gap-3 px-4 py-3">
        <p className="truncate text-sm font-semibold text-slate-800" title={photo.author}>
          {photo.author}
        </p>
        <span className="shrink-0 text-xs text-slate-400">#{photo.id}</span>
      </div>
    </article>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4 text-slate-500" role="status" aria-live="polite">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-rose-500" />
      <p className="text-sm font-medium">Loading photos…</p>
    </div>
  );
}

export default function Gallery() {
  const { photos, loading, error } = useFetchPhotos();
  const [favourites, dispatch] = useReducer(favouritesReducer, undefined, loadFavourites);
  const [searchTerm, setSearchTerm] = useState("");

  // Keep the saved favourites in sync whenever the reducer updates them.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
    } catch {
      // The gallery remains usable if browser storage is disabled or full.
    }
  }, [favourites]);

  // useCallback keeps this handler's function identity stable between renders.
  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  // useMemo recalculates the filtered list only when photos or the query change.
  const filteredPhotos = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return photos;
    return photos.filter((photo) => photo.author.toLowerCase().includes(query));
  }, [photos, searchTerm]);

  const favouriteIds = useMemo(
    () => new Set(favourites.map((photo) => photo.id)),
    [favourites]
  );

  const handleToggleFavourite = useCallback((photo) => {
    dispatch({ type: "TOGGLE", photo });
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 lg:px-8">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-rose-600">
              Celebrare · Frontend Intern
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Photo Gallery</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              A little inspiration, one photograph at a time.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative block w-full sm:max-w-md">
              <span className="sr-only">Search photos by author</span>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400">
                <circle cx="10.8" cy="10.8" r="6.8" />
                <path d="m16 16 4.2 4.2" />
              </svg>
              <input
                type="search"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by author name…"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-100"
              />
            </label>
            <p className="text-sm text-slate-500 sm:ml-auto">
              <span className="font-semibold text-slate-800">{favourites.length}</span>{" "}
              {favourites.length === 1 ? "favourite" : "favourites"}
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Discover photos</h2>
            <p className="mt-1 text-sm text-slate-500">
              {loading ? "Getting the gallery ready…" : `${filteredPhotos.length} ${filteredPhotos.length === 1 ? "photo" : "photos"} shown`}
            </p>
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-8 text-center" role="alert">
            <p className="font-semibold text-rose-800">We couldn’t load the photos.</p>
            <p className="mt-2 text-sm text-rose-700">{error}</p>
            <p className="mt-1 text-sm text-rose-700">Check your internet connection and refresh the page.</p>
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
            <p className="font-semibold text-slate-800">No photos found</p>
            <p className="mt-2 text-sm text-slate-500">Try another author name.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredPhotos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                isFavourite={favouriteIds.has(photo.id)}
                onToggleFavourite={handleToggleFavourite}
              />
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-slate-200 py-5 text-center text-xs text-slate-400">
        Photos provided by Picsum Photos
      </footer>
    </main>
  );
}
