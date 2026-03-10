import { render, screen, fireEvent, act } from "@testing-library/react";
import SearchNote from "./SearchNote";
import "@testing-library/jest-dom";

describe("SearchNote Component", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  /* 1️⃣ Verify placeholder text */
  it("shows placeholder text", () => {
    render(<SearchNote onSearch={() => {}} />);
    expect(screen.getByPlaceholderText("Search notes...")).toBeInTheDocument();
  });

  /* 2️⃣ Verify input reflects controlled value */
  it("displays controlled searchText value", () => {
    render(<SearchNote onSearch={() => {}} searchText="meeting notes" />);
    expect(screen.getByDisplayValue("meeting notes")).toBeInTheDocument();
  });

  /* 3️⃣ Verify clear button hidden when input empty */
  it("does not show clear button when input is empty", () => {
    render(<SearchNote onSearch={() => {}} />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  /* 4️⃣ Verify clear button visible when input has text */
  it("shows clear button when input has text", () => {
    render(<SearchNote onSearch={() => {}} searchText="draft" />);
    // Adjust to match your actual implementation: if you render a button with text "×"
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  /* 5️⃣ Verify handler is called when typing */
  it("calls handler when typing in search box", () => {
    const handleSearch = jest.fn();
    render(<SearchNote onSearch={handleSearch} />);
    const input = screen.getByLabelText(/search notes/i);

    fireEvent.change(input, { target: { value: "test" } });
    expect(input).toHaveValue("test");

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(handleSearch).toHaveBeenCalledWith("test");
  });

  /* 6️⃣ Verify clear button resets input and calls handler */
  it("resets input and calls handler when clear button is clicked", () => {
    const handleSearch = jest.fn();
    render(<SearchNote onSearch={handleSearch} searchText="test" />);
    const input = screen.getByLabelText(/search notes/i);

    const clearButton = screen.getByRole("button");
    fireEvent.click(clearButton);

    expect(input).toHaveValue("");
    expect(handleSearch).toHaveBeenCalledWith("");
  });
});