import axios from "axios";
import type { Note } from "../types/Note";

const API_URL = "http://localhost:3000/notes";

export async function fetchNotes(signal?: AbortSignal): Promise<Note[]> {
  try {
    const response = await axios.get<Note[]>(API_URL, { timeout: 5000, signal });
    return response.data.map((note) => ({ ...note, id: Number(note.id) }));
  } catch (err) {
    if (axios.isCancel(err) || (err instanceof Error && err.name === "CanceledError")) {
      const abortErr = new Error("AbortError");
      abortErr.name = "AbortError";
      throw abortErr;
    }
    if (axios.isAxiosError(err)) {
      if (err.code === "ECONNABORTED") throw new Error("Request timed out after 5 seconds");
      if (err.response) throw new Error(`Server error ${err.response.status}: ${err.response.statusText}`);
    }
    throw new Error("Unable to fetch notes. Is JSON Server running?");
  }
}

export async function addNote(note: Omit<Note, "id">): Promise<Note> {
  try {
    const response = await axios.post<Note>(API_URL, note, { timeout: 5000 });
    return { ...response.data, id: Number(response.data.id) };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response) throw new Error(`Failed to add note: ${err.response.statusText}`);
      if (err.code === "ECONNABORTED") throw new Error("Request timed out");
    }
    throw new Error("Unable to add note.");
  }
}

export async function deleteNote(id: number): Promise<void> {
  try {
    await axios.delete(`${API_URL}/${id}`, { timeout: 5000 });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response) throw new Error(`Failed to delete note: ${err.response.statusText}`);
      if (err.code === "ECONNABORTED") throw new Error("Request timed out");
    }
    throw new Error("Unable to delete note.");
  }
}