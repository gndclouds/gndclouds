/**
 * Maps content `type` front-matter values to the detail-route prefix that
 * renders them (e.g. type "journals" → /journal/[slug]). Shared by the
 * sitemap and the RSS feeds so URL construction stays in one place.
 */
const typeToRoute: Record<string, string> = {
  project: "project",
  projects: "project",
  note: "note",
  notes: "note",
  log: "log",
  logs: "log",
  journal: "journal",
  journals: "journal",
  fragment: "fragment",
  fragments: "fragment",
  study: "study",
  studies: "study",
  system: "system",
  systems: "system",
  research: "research",
  researches: "research",
  newsletter: "newsletter",
  newsletters: "newsletter",
};

export function normalizeType(value: string) {
  return value
    .toLowerCase()
    .replace(/\[\[/g, "")
    .replace(/\]\]/g, "")
    .trim();
}

/**
 * Site-relative path for a content item's detail page, or null when no type
 * maps to a route (e.g. cv, artifacts sub-pages without a type).
 */
export function contentUrlPath(
  types: string[] | undefined,
  slug: string
): string | null {
  const match = (types || []).find((type) =>
    Boolean(typeToRoute[normalizeType(type)])
  );
  if (!match) return null;
  return `/${typeToRoute[normalizeType(match)]}/${encodeURIComponent(slug)}`;
}
