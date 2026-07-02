import type { ReactElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { usePathnameMock } = vi.hoisted(() => ({ usePathnameMock: vi.fn() }));

vi.mock("next/navigation", () => ({ usePathname: usePathnameMock }));

import { Navigation } from "@/components/navigation";

type NavigationLink = ReactElement<{ href: string; "aria-current"?: string }>;

function linksFor(pathname: string) {
  usePathnameMock.mockReturnValue(pathname);
  const navigation = Navigation();
  return navigation.props.children as NavigationLink[];
}

describe("Navigation", () => {
  beforeEach(() => usePathnameMock.mockReset());

  it("marks the exact current section as active", () => {
    const links = linksFor("/inventory");

    expect(links.find((link) => link.props.href === "/inventory")?.props["aria-current"]).toBe("page");
    expect(links.filter((link) => link.props["aria-current"] === "page")).toHaveLength(1);
  });

  it("keeps the parent section active on a nested route", () => {
    const links = linksFor("/procurement/orders/42");

    expect(links.find((link) => link.props.href === "/procurement")?.props["aria-current"]).toBe("page");
  });

  it("does not mark a section for an unrelated route", () => {
    const links = linksFor("/login");

    expect(links.every((link) => link.props["aria-current"] === undefined)).toBe(true);
  });
});
