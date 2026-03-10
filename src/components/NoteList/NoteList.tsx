import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import NoteCard from "../NoteCard/NoteCard";
import type { Note } from "../../types/Note";

interface Props {
  notes: Note[];
  onDelete?: (id: number) => void; // ✅ forward delete handler
}

const NoteList: React.FC<Props> = ({ notes, onDelete }) => {
  if (!notes || notes.length === 0) {
    return (
      <Typography
        variant="h6"
        align="center"
        sx={{ mt: 4, color: "var(--muted)" }}
        aria-live="polite"
      >
        No notes found. Try adjusting your search or sort filters.
      </Typography>
    );
  }

  return (
<Box
  component="ul"
  sx={{
    display: "grid",
    gridTemplateColumns: "repeat(5, 260px)", // ✅ fixed width per card
    justifyContent: "center",                // ✅ center the grid
    gap: 1,
    listStyle: "none",
    p: 0,
    m: 0,
    maxHeight: "80vh",
    overflowY: "auto",
  }}
  aria-label="Notes list"
>
  {notes.map((note) => (
    <Box component="li" key={note.id}>
      <NoteCard note={note} onDelete={onDelete} />
    </Box>
  ))}
</Box>
  );
};

export default NoteList;