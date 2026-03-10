// src/services/noteService.ts

import axios from "axios";
import type { Note } from "../types/Note";

const API_URL = "http://localhost:3000/notes";

/* -------------------- Fetch Notes -------------------- */
export async function fetchNotes(signal?: AbortSignal): Promise<Note[]> {
  try {

    const response = await axios.get<Note[]>(API_URL, {
      timeout: 5000,
      signal
    });

    // normalize IDs
    const normalized = response.data.map((note: any) => ({
      ...note,
      id: Number(note.id),
    }));

    return normalized;

  } catch (err: any) {

    // ✅ Ignore cancelled requests
    if (axios.isCancel(err) || err.name === "CanceledError") {
      return [];
    }

    if (err.code === "ECONNABORTED") {
      throw new Error("Request timed out after 5 seconds");
    }

    if (err.response) {
      throw new Error(
        `Server error ${err.response.status}: ${err.response.statusText}`
      );
    }

    throw new Error("Unable to fetch notes. Is JSON Server running?");
  }
}


/* -------------------- Add Note -------------------- */
export async function addNote(
  note: Omit<Note, "id">,
  existingNotes: Note[]
): Promise<Note> {

  try {

    const maxId =
      existingNotes.length > 0
        ? Math.max(...existingNotes.map((n) => Number(n.id)))
        : 0;

    const newNote: Note = {
      ...note,
      id: maxId + 1
    };

    const response = await axios.post(API_URL, newNote, {
      timeout: 5000
    });

    return {
      ...response.data,
      id: Number(response.data.id)
    };

  } catch (err: any) {

    if (err.response) {
      throw new Error(`Failed to add note: ${err.response.statusText}`);
    }

    if (err.code === "ECONNABORTED") {
      throw new Error("Request timed out");
    }

    throw new Error("Unable to add note.");
  }
}


/* -------------------- Delete Note -------------------- */
export async function deleteNote(id: number): Promise<void> {

  try {

    await axios.delete(`${API_URL}/${id}`, {
      timeout: 5000
    });

  } catch (err: any) {

    if (err.response) {
      throw new Error(`Failed to delete note: ${err.response.statusText}`);
    }

    if (err.code === "ECONNABORTED") {
      throw new Error("Request timed out");
    }

    throw new Error("Unable to delete note.");
  }
}