/* Now imports are safe */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

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

/* -------------------- Helper -------------------- */
const renderApp = () => render(<App />);

describe("App Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders Header, Footer, and NoteManager when logged in", () => {
    localStorage.setItem("isLoggedIn", "true");

    renderApp();

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("note-manager")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("toggles between basic and advanced search", async () => {
    localStorage.setItem("isLoggedIn", "true");
    const user = userEvent.setup();

    renderApp();

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
    renderApp();
    expect(await screen.findByTestId("login-page")).toBeInTheDocument();
  });

  it("renders 404 for unknown routes", () => {
    window.history.pushState({}, "", "/random");

    renderApp();

    expect(screen.getByTestId("not-found")).toBeInTheDocument();
  });
});
