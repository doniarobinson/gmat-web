import type { AnchorHTMLAttributes, ImgHTMLAttributes } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DesktopMenuBar } from "@/components/layout/Menu";

const { mockPathname, mockSearchParamsGet } = vi.hoisted(() => ({
  mockPathname: vi.fn(() => "/"),
  mockSearchParamsGet: vi.fn((_key: string) => null as string | null),
}));

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

vi.mock("next/image", () => ({
  default: function MockImage({
    alt,
    src,
    ...rest
  }: ImgHTMLAttributes<HTMLImageElement>) {
    return <img alt={alt ?? ""} src={typeof src === "string" ? src : ""} {...rest} />;
  },
}));

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
  useSearchParams: () => ({
    get: (key: string) => mockSearchParamsGet(key),
  }),
}));

function renderDesktopMenu() {
  const view = render(<DesktopMenuBar />);
  const nav = within(view.getByRole("navigation", { name: "Main navigation" }));
  return { ...view, nav };
}

function linkCurrent(nav: ReturnType<typeof within>, name: string) {
  return nav.getByRole("link", { name }).getAttribute("aria-current");
}

describe("DesktopMenuBar", () => {
  beforeEach(() => {
    mockPathname.mockReturnValue("/");
    mockSearchParamsGet.mockReturnValue(null);
  });

  it("marks Home active on the root path", () => {
    const { nav } = renderDesktopMenu();
    expect(linkCurrent(nav, "Home")).toBe("page");
    expect(linkCurrent(nav, "Practice")).toBeNull();
  });

  it("marks Assess active on /assessment", () => {
    mockPathname.mockReturnValue("/assessment");
    const { nav } = renderDesktopMenu();
    expect(linkCurrent(nav, "Assess")).toBe("page");
    expect(linkCurrent(nav, "Take Assessment")).toBe("page");
    expect(linkCurrent(nav, "Results")).toBeNull();
  });

  it("marks Results active on /assessment/results", () => {
    mockPathname.mockReturnValue("/assessment/results");
    const { nav } = renderDesktopMenu();
    expect(linkCurrent(nav, "Assess")).toBe("page");
    expect(linkCurrent(nav, "Results")).toBe("page");
    expect(linkCurrent(nav, "Take Assessment")).toBeNull();
  });

  it("marks Practice inactive during assessment practice mode", () => {
    mockPathname.mockReturnValue("/practice");
    mockSearchParamsGet.mockImplementation((key) =>
      key === "mode" ? "assessment" : null,
    );
    const { nav } = renderDesktopMenu();
    expect(linkCurrent(nav, "Practice")).toBeNull();
    expect(linkCurrent(nav, "Assess")).toBe("page");
    expect(linkCurrent(nav, "Take Assessment")).toBe("page");
  });

  it("marks Practice active on normal practice", () => {
    mockPathname.mockReturnValue("/practice");
    const { nav } = renderDesktopMenu();
    expect(linkCurrent(nav, "Practice")).toBe("page");
    expect(linkCurrent(nav, "Take Assessment")).toBeNull();
  });

  it("marks Plan active on study routes", () => {
    mockPathname.mockReturnValue("/goals");
    const { nav } = renderDesktopMenu();
    expect(nav.getByRole("link", { name: "Plan" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(linkCurrent(nav, "Your Goals")).toBe("page");
  });
});

describe("MobileMenu", () => {
  beforeEach(() => {
    mockPathname.mockReturnValue("/assessment/results");
    mockSearchParamsGet.mockReturnValue(null);
  });

  it("shows active states in the drawer after opening", async () => {
    const { MobileMenu } = await import("@/components/layout/Menu");
    render(<MobileMenu />);
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const dialog = screen.getByRole("dialog", { name: "Main navigation" });
    expect(within(dialog).getByRole("link", { name: "Results" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(within(dialog).getByRole("link", { name: "Take Assessment" })).not.toHaveAttribute(
      "aria-current",
    );
  });
});
