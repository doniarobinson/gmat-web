import type { AnchorHTMLAttributes } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PageHero } from "@/components/layout/PageHero";

vi.mock("next/link", () => ({
  default: function MockLink({
    children,
    href,
    ...rest
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  },
}));

describe("PageHero", () => {
  it("renders title and optional subtitle", () => {
    render(
      <PageHero title="Assessment Results" subtitle="Your latest scores." />,
    );
    expect(screen.getByRole("heading", { name: "Assessment Results" })).toBeInTheDocument();
    expect(screen.getByText("Your latest scores.")).toBeInTheDocument();
  });

  it("renders a link action when href is provided", () => {
    render(
      <PageHero
        title="Plan"
        action={{ label: "Generate study plan", href: "/plan" }}
      />,
    );
    const link = screen.getByRole("link", { name: "Generate study plan" });
    expect(link).toHaveAttribute("href", "/plan");
  });

  it("renders a button action when onClick is provided", () => {
    const onClick = vi.fn();
    render(
      <PageHero title="Goals" action={{ label: "Save", onClick }} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders primary and secondary actions together", () => {
    render(
      <PageHero
        title="Assessment"
        action={{ label: "Begin", href: "/practice?mode=assessment" }}
        secondaryAction={{ label: "View results", href: "/assessment/results" }}
      />,
    );
    expect(screen.getByRole("link", { name: "Begin" })).toHaveAttribute(
      "href",
      "/practice?mode=assessment",
    );
    expect(screen.getByRole("link", { name: "View results" })).toHaveAttribute(
      "href",
      "/assessment/results",
    );
  });
});
