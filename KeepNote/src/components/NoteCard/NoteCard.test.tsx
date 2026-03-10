import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NoteCard from "./NoteCard";
import type { Note } from "../../types/Note";
import "jest-styled-components";

/* -------------------- Mock react-router -------------------- */
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("NoteCard Component", () => {
  const baseNote: Note = {
    id: 1,
    title: "Test Title",
    description: "Test Description",
    priority: "high",
    category: "Work",
    status: "completed",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* 1️⃣ Verify title and description render */
  it("renders title and description", () => {
    render(<NoteCard note={baseNote} />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  /* 2️⃣ Verify priority icon and tooltip */
  it("renders priority icon and shows tooltip on hover", async () => {
    const user = userEvent.setup();
    render(<NoteCard note={baseNote} />);

    const priorityIcon = screen.getByLabelText("Priority: high");
    expect(priorityIcon).toBeInTheDocument();

    await user.hover(priorityIcon);
    expect(await screen.findByText("Priority: high")).toBeInTheDocument();
  });

  /* 3️⃣ Verify category display */
  it("renders category label when category is provided", () => {
    render(<NoteCard note={baseNote} />);
    expect(screen.getByText("Work")).toBeInTheDocument();
  });

  /* 4️⃣ Verify status text and color */
  it("shows correct status text and color for completed and yet-to-start", () => {
    const { rerender } = render(<NoteCard note={baseNote} />);

    const completedStatus = screen.getByText(/status:\s*completed/i);
    expect(completedStatus).toBeInTheDocument();
    expect(completedStatus).toHaveStyleRule(
      "color",
      "var(--status-completed, #22c55e)"
    );

    rerender(<NoteCard note={{ ...baseNote, status: "yet-to-start" }} />);
    const pendingStatus = screen.getByText(/status:\s*yet-to-start/i);
    expect(pendingStatus).toBeInTheDocument();
    expect(pendingStatus).toHaveStyleRule(
      "color",
      "var(--status-yet, #facc15)"
    );
  });

  /* 5️⃣ Verify edit button navigates */
  it("navigates to edit page when edit icon is clicked", async () => {
    const user = userEvent.setup();
    render(<NoteCard note={baseNote} />);

    await user.click(screen.getByRole("button", { name: /edit note/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/notes/1");
  });

  /* 6️⃣ Verify delete confirmation dialog opens */
  it("opens delete confirmation dialog when delete icon is clicked", async () => {
    const user = userEvent.setup();
    render(<NoteCard note={baseNote} />);

    await user.click(screen.getByRole("button", { name: /delete note/i }));

    expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();
    expect(
      screen.getByText(/are you sure you want to delete/i)
    ).toBeInTheDocument();
  });

  /* 7️⃣ Verify delete handler is called on confirm */
  it("calls onDelete with note id when delete is confirmed", async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();

    render(<NoteCard note={baseNote} onDelete={onDelete} />);

    await user.click(screen.getByRole("button", { name: /delete note/i }));
    await user.click(screen.getByRole("button", { name: /^delete$/i }));

    expect(onDelete).toHaveBeenCalledWith(1);
  });

  /* 8️⃣ Verify cancel closes dialog */
  it("closes delete dialog when cancel is clicked", async () => {
    const user = userEvent.setup();
    render(<NoteCard note={baseNote} />);

    await user.click(screen.getByRole("button", { name: /delete note/i }));
    expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    // wait for MUI dialog transition to finish
    await waitFor(() => {
      expect(screen.queryByText("Confirm Deletion")).not.toBeInTheDocument();
    });
  });
});