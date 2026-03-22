import React, { useState } from "react";
import type { Note } from "../../types/Note";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import {
  StyledCard,
  CardHeader,
  CardTitle,
  CardDesc,
  Meta,
  CategoryLabel,
  PriorityDot,
  StatusLabel,
  ActionRow,
  EditActionIcon,
  DeleteActionIcon,
} from "./NoteCard.styles";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

interface Props {
  note: Note;
  onDelete?: (id: number) => void;
}

const NoteCard: React.FC<Props> = ({ note, onDelete }) => {
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const priorityLevel = note.priority
    ? (note.priority.toLowerCase() as "high" | "medium" | "low")
    : null;

  const handleDelete = () => {
    onDelete?.(note.id);
    setConfirmOpen(false);
  };

  return (
    <StyledCard role="article">
      <div>
        <CardHeader>
          {priorityLevel && (
            <Tooltip title={`Priority: ${note.priority}`}>
              <PriorityDot level={priorityLevel} />
            </Tooltip>
          )}
          <CardTitle>{note.title}</CardTitle>
        </CardHeader>

        <CardDesc>{note.description}</CardDesc>

        <Meta>
          {note.category && <CategoryLabel>{note.category}</CategoryLabel>}
          <StatusLabel status={note.status}>Status: {note.status}</StatusLabel>
        </Meta>
      </div>

      <ActionRow>
        <Tooltip title="Edit Note">
          <EditActionIcon
            aria-label="Edit Note"
            onClick={() => navigate(`/notes/${note.id}`)}
          >
            <EditIcon fontSize="small" />
          </EditActionIcon>
        </Tooltip>

        <Tooltip title="Delete Note">
          <DeleteActionIcon
            aria-label="Delete Note"
            onClick={() => setConfirmOpen(true)}
          >
            <DeleteIcon fontSize="small" />
          </DeleteActionIcon>
        </Tooltip>
      </ActionRow>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this note?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </StyledCard>
  );
};

export default NoteCard;
