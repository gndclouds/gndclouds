import type { LibraryFacetId } from "@/lib/content-frontmatter-schema";

/**
 * Landing “Topics & companies” facets. Each group can match:
 * - explicit **`facets`** in front matter (canonical ids), and/or
 * - **`companies`** / **`org`** lists, and/or
 * - legacy **tags** (case-insensitive substring match on keywords).
 */
export const LIBRARY_FILTERS = [
  {
    id: "design" satisfies LibraryFacetId,
    label: "Design",
    keywords: [
      "design",
      "design-engineer",
      "interaction",
      "figma",
      "ux",
      "ui",
      "product",
      "typography",
    ],
  },
  {
    id: "systems" satisfies LibraryFacetId,
    label: "Systems",
    keywords: ["systems", "architecture", "protocols", "knowledge-graph"],
  },
  {
    id: "ai-tools" satisfies LibraryFacetId,
    label: "AI & tools",
    keywords: ["ai", "llms", "cursor", "tools", "frontier-models"],
  },
  {
    id: "climate-earth" satisfies LibraryFacetId,
    label: "Climate & earth",
    keywords: [
      "climate",
      "earth",
      "energy",
      "nature",
      "soil",
      "climate-change",
      "nature-based",
    ],
  },
  {
    id: "skills" satisfies LibraryFacetId,
    label: "Skills & craft",
    keywords: [
      "hardware",
      "learning-to-learn",
      "learning-how-to-learn",
      "utilities",
      "portfolio",
    ],
  },
  {
    id: "companies" satisfies LibraryFacetId,
    label: "Companies",
    keywords: [
      "company",
      "companies",
      "employer",
      "workplace",
      "organization",
      "org",
      "client",
      "startup",
      "intel",
      "ideo",
      "colab",
      "protocol",
      "par",
      "fjord",
      "ifttt",
      "maker-media",
      "ezra",
      "archetype",
      "interstitial",
      "tiny-factories",
      "tinyfactories",
    ],
  },
] as const;

/** @deprecated Use LIBRARY_FILTERS */
export const DESIGN_SKILL_FILTERS = LIBRARY_FILTERS;

export type LibraryFilterId = (typeof LIBRARY_FILTERS)[number]["id"];
/** @deprecated */
export type DesignSkillFilterId = LibraryFilterId;

function tagMatchesKeyword(tag: string, keyword: string): boolean {
  const t = tag.toLowerCase().trim();
  const k = keyword.toLowerCase().trim();
  if (t === k) return true;
  if (k.length <= 2) return false;
  return t.includes(k);
}

function hasOrgSignal(meta: Record<string, unknown> | undefined): boolean {
  if (!meta) return false;
  const companies = meta.companies;
  const org = meta.org;
  if (Array.isArray(companies) && companies.some((x) => String(x).trim()))
    return true;
  if (Array.isArray(org) && org.some((x) => String(x).trim())) return true;
  return false;
}

export interface FilterableLibraryItem {
  tags: string[];
  facets?: string[];
  companies?: string[];
  metadata?: Record<string, unknown>;
}

/** True if the item matches any selected group (OR across groups and keywords). */
export function itemMatchesLibraryFilters(
  item: FilterableLibraryItem,
  selectedIds: readonly string[]
): boolean {
  if (selectedIds.length === 0) return true;
  const groups = LIBRARY_FILTERS.filter((g) => selectedIds.includes(g.id));
  return groups.some((g) => {
    if (item.facets?.includes(g.id)) return true;
    if (g.id === "companies") {
      if (item.companies && item.companies.length > 0) return true;
      if (hasOrgSignal(item.metadata)) return true;
    }
    return g.keywords.some((kw) =>
      item.tags.some((tag) => tagMatchesKeyword(tag, kw))
    );
  });
}

/** @deprecated Use itemMatchesLibraryFilters */
export function itemMatchesDesignSkillFilters(
  item: FilterableLibraryItem,
  selectedIds: readonly string[]
): boolean {
  return itemMatchesLibraryFilters(item, selectedIds);
}
