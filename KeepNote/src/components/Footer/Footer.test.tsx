import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Footer from "./Footer";

describe("Footer Component", () => {
  test("Verify footer text is visible", () => {
    render(<Footer />);

    const copyright =
      screen.getByText(/© 2024 keep note — all rights reserved/i);

    expect(copyright).toBeInTheDocument();
  });

  test("Verify footer social links exist with correct URLs", () => {
    render(<Footer />);

    const facebookLink = screen.getByRole("link", { name: /facebook/i });
    const instagramLink = screen.getByRole("link", { name: /instagram/i });
    const linkedinLink = screen.getByRole("link", { name: /linkedin/i });

    expect(facebookLink).toHaveAttribute("href", "https://facebook.com");
    expect(instagramLink).toHaveAttribute("href", "https://instagram.com");
    expect(linkedinLink).toHaveAttribute("href", "https://linkedin.com");
  });

  test("Verify footer links open in new tab", () => {
    render(<Footer />);

    const links = screen.getAllByRole("link");

    links.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
    });
  });
});
