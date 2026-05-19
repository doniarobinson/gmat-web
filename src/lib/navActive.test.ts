import { describe, expect, it } from "vitest";
import {
  ASSESSMENT_HREF,
  isActive,
  isAssessmentActive,
  isAssessmentChildActive,
  isNavLinkActive,
  isPracticeActive,
  isStudyActive,
} from "@/lib/navActive";

describe("isActive", () => {
  it("matches home only on exact path", () => {
    expect(isActive("/", "/")).toBe(true);
    expect(isActive("/goals", "/")).toBe(false);
  });

  it("matches exact paths and nested routes", () => {
    expect(isActive("/plan", "/plan")).toBe(true);
    expect(isActive("/assessment/results", "/assessment")).toBe(true);
    expect(isActive("/practice", "/plan")).toBe(false);
  });
});

describe("isStudyActive", () => {
  it("is true on goals and plan", () => {
    expect(isStudyActive("/goals")).toBe(true);
    expect(isStudyActive("/plan")).toBe(true);
    expect(isStudyActive("/practice")).toBe(false);
  });
});

describe("isAssessmentChildActive", () => {
  it("highlights Take Assessment on /assessment and assessment practice mode", () => {
    expect(
      isAssessmentChildActive("/assessment", null, ASSESSMENT_HREF),
    ).toBe(true);
    expect(
      isAssessmentChildActive("/practice", "assessment", ASSESSMENT_HREF),
    ).toBe(true);
    expect(
      isAssessmentChildActive("/assessment/results", null, ASSESSMENT_HREF),
    ).toBe(false);
    expect(
      isAssessmentChildActive("/practice", null, ASSESSMENT_HREF),
    ).toBe(false);
  });

  it("highlights Results only on the results route", () => {
    expect(
      isAssessmentChildActive("/assessment/results", null, "/assessment/results"),
    ).toBe(true);
    expect(
      isAssessmentChildActive("/assessment", null, "/assessment/results"),
    ).toBe(false);
  });
});

describe("isAssessmentActive", () => {
  it("is true when any assessment nav child is active", () => {
    expect(isAssessmentActive("/assessment", null)).toBe(true);
    expect(isAssessmentActive("/assessment/results", null)).toBe(true);
    expect(isAssessmentActive("/practice", "assessment")).toBe(true);
    expect(isAssessmentActive("/practice", null)).toBe(false);
  });
});

describe("isPracticeActive", () => {
  it("is true on practice unless mode is assessment", () => {
    expect(isPracticeActive("/practice", null)).toBe(true);
    expect(isPracticeActive("/practice", "assessment")).toBe(false);
    expect(isPracticeActive("/assessment", null)).toBe(false);
  });
});

describe("isNavLinkActive", () => {
  it("delegates practice link to isPracticeActive", () => {
    expect(isNavLinkActive("/practice", null, "/practice")).toBe(true);
    expect(isNavLinkActive("/practice", "assessment", "/practice")).toBe(false);
  });

  it("uses isActive for other top-level links", () => {
    expect(isNavLinkActive("/", null, "/")).toBe(true);
    expect(isNavLinkActive("/goals", null, "/")).toBe(false);
  });
});
