import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";

let mockIsAuthenticated = true;

jest.mock("./components/Header/Header", () => ({
  __esModule: true,
  default: ({ toggleButton }: { toggleButton: ReactNode }) => (
    <header data-testid="header">
      Header Component
      {toggleButton}
    </header>
  ),
}));

jest.mock("./components/Footer/Footer", () => ({
  __esModule: true,
  default: () => <footer data-testid="footer">Footer Component</footer>,
}));

jest.mock("./components/NoteManager/NoteManager", () => ({
  __esModule: true,
  default: ({ searchTerm, viewMode }: { searchTerm: string; viewMode: string }) => (
    <div data-testid="note-manager">
      <span data-testid="viewmode">ViewMode: {viewMode}</span>
      <span data-testid="searchterm">SearchTerm: {searchTerm}</span>
    </div>
  ),
}));

jest.mock("./pages/LoginPage/LoginPage", () => ({
  __esModule: true,
  default: () => <div data-testid="login-page">Login</div>,
}));

jest.mock("./pages/Registration/RegistrationPage", () => ({
  __esModule: true,
  default: () => <div data-testid="register-page">Register</div>,
}));

jest.mock("./pages/PageNotFound/PageNotFound", () => ({
  __esModule: true,
  default: () => <div data-testid="not-found">404</div>,
}));

jest.mock("./context/SnackbarProvider", () => ({
  __esModule: true,
  SnackbarProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

jest.mock("./hooks/useSnackbar", () => ({
  __esModule: true,
  useSnackbar: () => ({ showSnackbar: jest.fn() }),
}));

jest.mock("./context/AppProvider", () => ({
  __esModule: true,
  AppProvider: ({ children }: { children: ReactNode }) => {
    const { AppContext } = jest.requireActual("./context/AppContext");

    return (
      <AppContext.Provider
        value={{
          state: {
            auth: {
              isAuthenticated: mockIsAuthenticated,
              userId: mockIsAuthenticated ? 1 : null,
              user: mockIsAuthenticated
                ? { id: 1, email: "test@example.com" }
                : undefined,
            },
            notes: {
              notes: [],
              filteredNotes: [],
              advancedFilteredNotes: [],
              sortBy: "",
              searchCount: 0,
              searchesPerformed: 0,
              searchUrl: "",
              errorMessage: "",
              hasSearched: false,
              activeSearchTerm: "",
            },
          },
          dispatch: jest.fn(),
        }}
      >
        {children}
      </AppContext.Provider>
    );
  },
}));

import App from "./App";

describe("App Component", () => {
  beforeEach(() => {
    mockIsAuthenticated = true;
    localStorage.clear();
    window.history.pushState({}, "", "/");
  });

  it("renders Header, Footer, and NoteManager when logged in", () => {
    render(<App />);
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("note-manager")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("toggles between basic and advanced search", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /advanced search/i }));
    expect(screen.getByTestId("viewmode")).toHaveTextContent("advanced");

    await user.click(screen.getByRole("button", { name: /basic search/i }));
    expect(screen.getByTestId("viewmode")).toHaveTextContent("basic");
  });

  it("redirects unauthenticated users to login", async () => {
    mockIsAuthenticated = false;
    render(<App />);
    expect(await screen.findByTestId("login-page")).toBeInTheDocument();
  });

  it("renders 404 for unknown routes", () => {
    window.history.pushState({}, "", "/random");
    render(<App />);
    expect(screen.getByTestId("not-found")).toBeInTheDocument();
  });
});