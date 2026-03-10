import type { Note } from "../types/Note";

/**
 * Filters notes based on a search query.
 * Matches against title, description, category, priority, and status.
 * Case-insensitive and supports multi-word queries (all words must match).
 */
export function filterNotes(notes: Note[], query: string): Note[] {
  if (!query.trim()) return notes;

  const words = query.toLowerCase().trim().split(/\s+/);

  return notes.filter((note) => {
    const text = [
      note.title,
      note.description,
      note.category,
      note.priority ?? "",
      note.status,
    ]
      .join(" ")
      .toLowerCase();

    // Require all words to be present
    return words.every((w) => text.includes(w));
  });
}