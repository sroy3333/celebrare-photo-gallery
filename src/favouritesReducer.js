const STORAGE_KEY = "celebrare-photo-gallery-favourites";

export function loadFavourites() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // If localStorage is unavailable or contains invalid JSON, start empty.
    return [];
  }
}

export default function favouritesReducer(state, action) {
  switch (action.type) {
    case "TOGGLE": {
      const alreadyFavourited = state.some((photo) => photo.id === action.photo.id);

      if (alreadyFavourited) {
        return state.filter((photo) => photo.id !== action.photo.id);
      }

      return [...state, action.photo];
    }
    default:
      return state;
  }
}

export { STORAGE_KEY };
