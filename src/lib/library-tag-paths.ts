/** Obsidian-style paths: normalize `[[…]]` and Windows slashes. */
export function normalizeLibraryTagPath(tag: string): string {
  return tag.replace(/\[\[|\]\]/g, "").replace(/\\/g, "/").trim();
}

const NAMESPACED_PREFIXES = [
  "skills/",
  "skill/",
  "topics/",
  "topic/",
  "orgs/",
  "org/",
  "portfolio/",
] as const;

export function isNamespacedLibraryTagPath(normalized: string): boolean {
  const lower = normalized.toLowerCase();
  return NAMESPACED_PREFIXES.some((p) => lower.startsWith(p));
}

/** Feed / cards: full paths like `skill/design` so grouping matches article headers. */
export function getProjectCardRawTagPaths(
  tags: readonly unknown[] | undefined,
  categories: readonly unknown[] | undefined,
  max = 3
): string[] {
  const all = [...(tags ?? []), ...(categories ?? [])];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of all) {
    if (typeof raw !== "string") continue;
    const n = normalizeLibraryTagPath(raw);
    if (!n || !isNamespacedLibraryTagPath(n)) continue;
    const k = n.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(n);
    if (out.length >= max) break;
  }
  return out;
}

/** Exact match on normalized path (e.g. `topics/foo`); `needleLower` must be lowercase. */
export function itemHasLibraryTagPath(
  tags: readonly unknown[] | undefined,
  categories: readonly unknown[] | undefined,
  needleLower: string
): boolean {
  const needle = needleLower.trim();
  if (!needle) return true;
  const all = [...(tags ?? []), ...(categories ?? [])];
  for (const raw of all) {
    if (typeof raw !== "string") continue;
    if (normalizeLibraryTagPath(raw).toLowerCase() === needle) return true;
  }
  return false;
}

export function getJournalListingRawTagPaths(
  tags: readonly unknown[] | undefined,
  categories: readonly unknown[] | undefined,
  max = 8
): string[] {
  const raw = [...(tags ?? []), ...(categories ?? [])];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const t of raw) {
    if (typeof t !== "string") continue;
    const n = normalizeLibraryTagPath(t);
    if (!n) continue;
    const k = n.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(n);
    if (out.length >= max) break;
  }
  return out;
}
