import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

/* -------------------- Auth State Control -------------------- */

let mockIsAuthenticated = true;

/* -------------------- Mocks -------------------- */

jest.mock("./components/Header/Header", () => ({
  __esModule: true,
  default: ({ toggleButton }: any) => (
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
  default: ({ searchTerm, viewMode }: any) => (
    <div data-testid="note-manager">
      <span data-testid="viewmode">ViewMode: {viewMode}</span>
      <span data-testid="searchterm">SearchTerm: {searchTerm}</span>
    </div>
  ),
}));

jest.mock("./pages/LoginPage", () => ({
  __esModule: true,
  default: () => <div data-testid="login-page">Login</div>,
}));

jest.mock("./pages/PageNotFound", () => ({
  __esModule: true,
  default: () => <div data-testid="not-found">404</div>,
}));

jest.mock("./context/SnackbarContext", () => ({
  __esModule: true,
  SnackbarProvider: ({ children }: any) => <>{children}</>,
  useSnackbar: () => ({ showSnackbar: jest.fn() }),
}));

jest.mock("./context/AppContext", () => {
  const actual = jest.requireActual("./context/AppContext");
  const React = require("react");

  const MockAppProvider = ({ children }: any) => {
    const mockState = {
      auth: {
        isAuthenticated: mockIsAuthenticated,
        userId: mockIsAuthenticated ? 1 : null,
        user: mockIsAuthenticated
          ? { id: 1, email: "test@example.com" }
          : undefined,
      },
      notes: actual.initialState.notes,
    };
    return React.createElement(
      actual.AppContext.Provider,
      { value: { state: mockState, dispatch: jest.fn() } },
      children
    );
  };

  return {
    ...actual,
    AppProvider: MockAppProvider,
  };
});

/* -------------------- Import App after mocks -------------------- */

import App from "./App";

/* -------------------- Tests -------------------- */

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

    await user.click(
      screen.getByRole("button", { name: /advanced search/i })
    );
    expect(screen.getByTestId("viewmode")).toHaveTextContent("advanced");

    await user.click(
      screen.getByRole("button", { name: /basic search/i })
    );
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