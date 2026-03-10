import { render, screen, fireEvent } from "@testing-library/react";
import AdvancedNoteSearch from "./AdvancedNoteSearch";
import type { Note } from "../../types/Note";

describe("AdvancedNoteSearch Component", () => {
  const mockOnFilter = jest.fn();

  const defaultProps = {
    notes: [] as Note[],
    onFilter: mockOnFilter,
    searchCount: 0,
    searchUrl: "",
  };

  beforeEach(() => {
    mockOnFilter.mockClear();
  });

  it("disables Search Notes button initially", () => {
    render(<AdvancedNoteSearch {...defaultProps} />);
    expect(screen.getByRole("button", { name: /search notes/i })).toBeDisabled();
  });

  it("enables search button when input or priority is selected", () => {
    render(<AdvancedNoteSearch {...defaultProps} />);
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: "Work" },
    });
    expect(screen.getByRole("button", { name: /search notes/i })).toBeEnabled();
  });

  it("calls onFilter with criteria on successful search", () => {
    render(<AdvancedNoteSearch {...defaultProps} />);
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: "Work" },
    });
    fireEvent.click(screen.getByRole("button", { name: /search notes/i }));

    expect(mockOnFilter).toHaveBeenCalledWith({
      category: "Work",
      priority: "",
    });
  });

  it("does not call onFilter when no input provided", () => {
    render(<AdvancedNoteSearch {...defaultProps} />);
    const searchBtn = screen.getByRole("button", { name: /search notes/i });
    expect(searchBtn).toBeDisabled();
    fireEvent.click(searchBtn);
    expect(mockOnFilter).not.toHaveBeenCalled();
  });

  it("resets inputs and clears search results on clear", () => {
    render(<AdvancedNoteSearch {...defaultProps} />);
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: "Academic" },
    });
    fireEvent.click(screen.getByRole("button", { name: /clear/i }));

    expect(mockOnFilter).toHaveBeenCalledWith({ __clear: true });
    expect(
      (screen.getByLabelText(/category/i) as HTMLInputElement).value
    ).toBe("");
  });
});