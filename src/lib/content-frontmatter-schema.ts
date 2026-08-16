/**
 * Shared front matter for journals, logs, and artifacts / portfolio items (YAML between `---` lines).
 *
 * ## Filtering the home / landing feed
 *
 * - **`facets`** (optional, string[]): Canonical topic IDs used by the landing
 *   filter chips. Use any of:
 *   `design` | `systems` | `ai-tools` | `climate-earth` | `skills` | `companies`
 *   If omitted, legacy matching falls back to **tags** (substring keywords).
 *
 * - **`companies`** (optional, string[]): Organization names or slugs tied to
 *   the piece (e.g. employer, client, collaborator). Implies the **companies**
 *   facet for filtering even when `facets` is not set.
 *
 * - **`tags`** (optional, string[]): Free-form labels; still used for search and
 *   keyword-based facet matching when `facets` is absent.
 *
 * ## Projects only (optional)
 *
 * - **`org`**: Existing wiki-style org links; non-empty `org` implies **companies**
 *   for filtering (same as `companies`).
 *
 * Other fields (`title`, `publishedAt`, `description`, `type`, …) stay as today.
 */

export const LIBRARY_FACET_IDS = [
  "design",
  "systems",
  "ai-tools",
  "climate-earth",
  "skills",
  "companies",
] as const;

export type LibraryFacetId = (typeof LIBRARY_FACET_IDS)[number];

const FACET_ID_SET = new Set<string>(LIBRARY_FACET_IDS);

/** Normalize unknown YAML into a list of valid facet ids. */
export function normalizeLibraryFacets(raw: unknown): string[] {
  if (raw == null) return [];
  const arr = Array.isArray(raw) ? raw : [raw];
  const out: string[] = [];
  for (const v of arr) {
    if (typeof v !== "string") continue;
    const id = v.trim().toLowerCase();
    if (FACET_ID_SET.has(id)) out.push(id);
  }
  return [...new Set(out)];
}

/** Coerce strings, wiki links, or mixed YAML into plain strings for display/filtering. */
export function normalizeCompanyStrings(raw: unknown): string[] {
  if (raw == null) return [];
  const arr = Array.isArray(raw) ? raw : [raw];
  const out: string[] = [];
  for (const v of arr) {
    if (typeof v !== "string") continue;
    const s = v.trim();
    if (!s) continue;
    // Obsidian-style: "[[path|Label]]" or "[[Label]]"
    const wiki = s.match(/^\[\[([^|\]]+)(?:\|([^\]]+))?\]\]$/);
    if (wiki) {
      const label = (wiki[2] ?? wiki[1]).trim();
      if (label) out.push(label);
    } else {
      out.push(s);
    }
  }
  return [...new Set(out)];
}
