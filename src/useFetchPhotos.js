import { useEffect, useState } from "react";

const PHOTOS_URL = "https://picsum.photos/v2/list?limit=30";

/**
 * Fetches the gallery data once when the component using this hook mounts.
 * The hook exposes the fetched photos and the loading/error states to the UI.
 */
export default function useFetchPhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadPhotos() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(PHOTOS_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`The photo service returned an error (${response.status}).`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("The photo service returned an unexpected response.");
        }

        setPhotos(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unable to load photos. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadPhotos();
    return () => controller.abort();
  }, []);

  return { photos, loading, error };
}
