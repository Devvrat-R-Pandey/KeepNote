import { useState, useEffect } from "react";
import axios from "axios";
import type { Note } from "../types/Note";

const API_URL = "http://localhost:3000/notes";

export function useFetch() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let didRespond = false;
    setLoading(true);

    axios
      .get(API_URL, { timeout: 5000 })
      .then((res) => {
        didRespond = true;

        // ✅ Normalize IDs to numbers
        const normalized = res.data.map((note: any) => ({
          ...note,
          id: Number(note.id),
        }));

        setNotes(normalized);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return; // ✅ ignore cancelled requests

        didRespond = true;
        setError("Unable to load notes. Please start JSON Server.");
        setLoading(false);
      });
    const timer = setTimeout(() => {
      if (!didRespond) {
        setError("⚠️ Timeout. Please check your connection.");
        setLoading(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return { notes, loading, error };
}
