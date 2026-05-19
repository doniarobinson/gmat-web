export const ASSESSMENT_HREF = "/assessment";

const STUDY_NAV_HREFS = ["/goals", "/plan"] as const;

const ASSESSMENT_NAV_HREFS = ["/assessment", "/assessment/results"] as const;

export function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function isStudyActive(pathname: string) {
  return STUDY_NAV_HREFS.some((href) => isActive(pathname, href));
}

export function isAssessmentChildActive(
  pathname: string,
  mode: string | null,
  href: string,
) {
  if (href === ASSESSMENT_HREF) {
    return (
      pathname === ASSESSMENT_HREF ||
      (pathname === "/practice" && mode === "assessment")
    );
  }
  return isActive(pathname, href);
}

export function isAssessmentActive(pathname: string, mode: string | null) {
  return ASSESSMENT_NAV_HREFS.some((href) =>
    isAssessmentChildActive(pathname, mode, href),
  );
}

export function isPracticeActive(pathname: string, mode: string | null) {
  return isActive(pathname, "/practice") && mode !== "assessment";
}

export function isNavLinkActive(pathname: string, mode: string | null, href: string) {
  if (href === "/practice") return isPracticeActive(pathname, mode);
  return isActive(pathname, href);
}
