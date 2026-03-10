import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import NoteList from "./NoteList";
import type { Note } from "../../types/Note";

/* Mock Notes */
const mockNotes: Note[] = [
  { id: 1, title: "Note A", description: "Desc A", priority: "low", category: "Work", status: "completed" },
  { id: 2, title: "Note B", description: "Desc B", priority: "high", category: "Home", status: "yet-to-start" },
  { id: 3, title: "Note C", description: "Desc C", priority: "medium", category: "Study", status: "completed" },
];

/* ✅ Mock NoteCard to simplify onDelete testing */
jest.mock("../NoteCard/NoteCard", () => ({
  __esModule: true,
  default: ({ note, onDelete }: { note: Note; onDelete?: (id: number) => void }) => (
    <div data-testid={`note-${note.id}`}>
      <span>{note.title}</span>
      <button onClick={() => onDelete?.(note.id)}>Delete</button>
    </div>
  ),
}));

describe("NoteList Component", () => {
  const renderWithRouter = (ui: React.ReactNode) =>
    render(<MemoryRouter>{ui}</MemoryRouter>);

  it("renders all notes as NoteCards", () => {
    renderWithRouter(<NoteList notes={mockNotes} />);
    const notes = screen.getAllByTestId(/note-/);
    expect(notes).toHaveLength(mockNotes.length);
  });

  it("renders notes in given order", () => {
    renderWithRouter(<NoteList notes={mockNotes} />);
    const titles = screen.getAllByText(/Note [A-C]/).map(el => el.textContent);
    expect(titles).toEqual(["Note A", "Note B", "Note C"]);
  });

  it("renders notes sorted by priority", () => {
    const priorityWeight: Record<string, number> = { high: 3, medium: 2, low: 1 };
    const sortedByPriority = [...mockNotes].sort(
      (a, b) => priorityWeight[b.priority!] - priorityWeight[a.priority!]
    );

    renderWithRouter(<NoteList notes={sortedByPriority} />);
    const titles = screen.getAllByText(/Note [A-C]/).map(el => el.textContent);
    expect(titles).toEqual(["Note B", "Note C", "Note A"]);
  });

  it("renders notes sorted by status", () => {
    const statusWeight: Record<string, number> = { completed: 2, "yet-to-start": 1 };
    const sortedByStatus = [...mockNotes].sort(
      (a, b) => statusWeight[b.status] - statusWeight[a.status]
    );

    renderWithRouter(<NoteList notes={sortedByStatus} />);
    const titles = screen.getAllByText(/Note [A-C]/).map(el => el.textContent);
    expect(titles).toEqual(["Note A", "Note C", "Note B"]);
  });

  it("shows empty state message when no notes", () => {
    renderWithRouter(<NoteList notes={[]} />);
    expect(screen.getByText(/No notes found/i)).toBeInTheDocument();
  });

  it("calls onDelete when delete button is clicked in a NoteCard", async () => {
    const user = userEvent.setup();
    const onDeleteMock = jest.fn();

    renderWithRouter(<NoteList notes={mockNotes} onDelete={onDeleteMock} />);

    const deleteButtons = screen.getAllByText("Delete");
    await user.click(deleteButtons[0]);

    expect(onDeleteMock).toHaveBeenCalledWith(mockNotes[0].id);
  });
});
