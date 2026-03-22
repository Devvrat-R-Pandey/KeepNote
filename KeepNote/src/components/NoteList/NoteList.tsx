import React from "react";
import NoteCard from "../NoteCard/NoteCard";
import type { Note } from "../../types/Note";
import styles from "./NoteList.module.css";

interface Props {
  notes: Note[];
  onDelete?: (id: number) => void;
}

const NoteList: React.FC<Props> = ({ notes, onDelete }) => {
  if (!notes || notes.length === 0) {
    return (
      <p className={styles.emptyMessage} aria-live="polite">
        No notes found. Try adjusting your search or sort filters.
      </p>
    );
  }

  return (
    <ul className={styles.grid} aria-label="Notes list">
      {notes.map((note) => (
        <li key={note.id}>
          <NoteCard note={note} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  );
};

export default NoteList;
