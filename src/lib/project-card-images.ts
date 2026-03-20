/**
 * Resolve preview/hero URLs for cards and extract the first image from markdown.
 * - `project` wiki mode: same as `project/[slug]/page.tsx` (assets/ → projects/assets/…).
 * - `content` wiki mode: same as `MarkdownContent` resolveImagePath (logs, journals, etc.).
 */

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif|svg)$/i;
const VIDEO_EXT = /\.(mp4|webm|mov|avi|mkv)$/i;

function basenameKey(path: string): string {
  return path.trim().split("?")[0].toLowerCase();
}

function isImagePath(path: string): boolean {
  const key = basenameKey(path);
  return IMAGE_EXT.test(key) && !VIDEO_EXT.test(key);
}

function isGifPath(path: string): boolean {
  return /\.gif(\?|$)/i.test(path.trim());
}

/** Same rules as `project/[slug]/page.tsx` resolveAssetPath + encoding. */
export function resolveWikiInnerPathToDbAssetsUrl(cleanPath: string): string {
  const trimmed = cleanPath.trim();
  let resolvedPath: string;
  if (trimmed.startsWith("assets/")) {
    resolvedPath = `projects/${trimmed}`;
  } else if (trimmed.includes("/")) {
    resolvedPath = `assets/${trimmed}`;
  } else {
    resolvedPath = `assets/${trimmed}`;
  }
  const encodedPath = resolvedPath
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  return `/db-assets/${encodedPath}`;
}

/** Same rules as `MarkdownContent` resolveImagePath (no `projects/` prefix). */
export function resolveWikiInnerPathForContentRepo(cleanPath: string): string {
  const trimmed = cleanPath.trim();
  let resolvedPath: string;
  if (trimmed.startsWith("assets/")) {
    resolvedPath = trimmed;
  } else if (trimmed.includes("/")) {
    resolvedPath = `assets/${trimmed}`;
  } else {
    resolvedPath = `assets/${trimmed}`;
  }
  const encodedPath = resolvedPath
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  return `/db-assets/${encodedPath}`;
}

export type WikiImageResolveMode = "project" | "content";

/**
 * Normalize a front matter or markdown image reference for use in <Image src> / cards.
 * Matches client-side logic in landing-item-card (asset-proxy in production).
 */
export function normalizeProjectImageUrlForCard(candidate: string): string | null {
  const trimmed = candidate.trim();
  if (!trimmed) return null;
  const isValid =
    IMAGE_EXT.test(trimmed) ||
    trimmed.startsWith("http") ||
    trimmed.startsWith("/");
  if (!isValid) return null;

  const isProduction =
    typeof process !== "undefined" && process.env.NODE_ENV === "production";

  if (
    isValid &&
    trimmed.startsWith("/") &&
    !trimmed.startsWith("http") &&
    !trimmed.startsWith("/api/asset-proxy") &&
    !trimmed.startsWith("/db-assets/") &&
    isProduction
  ) {
    const pathWithoutSlash = trimmed.substring(1);
    const assetPath = pathWithoutSlash.startsWith("assets/")
      ? pathWithoutSlash
      : `assets/${pathWithoutSlash}`;
    return `/api/asset-proxy?path=${encodeURIComponent(assetPath)}`;
  }
  return trimmed;
}

function normalizeAnyImageRef(
  ref: string,
  wikiMode: WikiImageResolveMode
): string | null {
  const t = ref.trim();
  if (!t) return null;
  if (t.startsWith("http") || t.startsWith("/db-assets/") || t.startsWith("/api/")) {
    return normalizeProjectImageUrlForCard(t);
  }
  if (t.startsWith("/")) {
    return normalizeProjectImageUrlForCard(t);
  }
  if (isImagePath(t)) {
    const dbUrl =
      wikiMode === "project"
        ? resolveWikiInnerPathToDbAssetsUrl(t)
        : resolveWikiInnerPathForContentRepo(t);
    return normalizeProjectImageUrlForCard(dbUrl);
  }
  return null;
}

const WIKILINK = /!\[\[([^\]]+)\]\]/g;
const MD_IMAGE = /!\[[^\]]*\]\(([^)\s]+)\)/g;

interface Match {
  index: number;
  raw: string;
  kind: "wiki" | "md";
}

function collectImageMatches(markdown: string): Match[] {
  const out: Match[] = [];
  let m: RegExpExecArray | null;
  const w = new RegExp(WIKILINK.source, "g");
  while ((m = w.exec(markdown)) !== null) {
    const inner = m[1].trim();
    if (isImagePath(inner)) {
      out.push({ index: m.index, raw: inner, kind: "wiki" });
    }
  }
  const md = new RegExp(MD_IMAGE.source, "g");
  while ((m = md.exec(markdown)) !== null) {
    const url = m[1].trim().replace(/^<|>$/g, "");
    if (isImagePath(url) || url.startsWith("/") || url.startsWith("http")) {
      out.push({ index: m.index, raw: url, kind: "md" });
    }
  }
  out.sort((a, b) => a.index - b.index);
  return out;
}

function matchToUrl(
  match: Match,
  wikiMode: WikiImageResolveMode
): string | null {
  if (match.kind === "wiki") {
    const dbUrl =
      wikiMode === "project"
        ? resolveWikiInnerPathToDbAssetsUrl(match.raw)
        : resolveWikiInnerPathForContentRepo(match.raw);
    return normalizeProjectImageUrlForCard(dbUrl);
  }
  // Standard markdown image
  const url = match.raw;
  if (url.startsWith("/db-assets/") || url.startsWith("http") || url.startsWith("/")) {
    return normalizeProjectImageUrlForCard(url);
  }
  if (url.startsWith("assets/media/")) {
    const rest = url.replace(/^assets\/media\//, "");
    const encoded = rest
      .split("/")
      .map((p) => encodeURIComponent(p))
      .join("/");
    return normalizeProjectImageUrlForCard(`/db-assets/media/${encoded}`);
  }
  return normalizeAnyImageRef(url, wikiMode);
}

export function extractFirstImageUrlFromMarkdown(
  markdown: string,
  wikiMode: WikiImageResolveMode
): string | null {
  const matches = collectImageMatches(markdown);
  for (const match of matches) {
    const url = matchToUrl(match, wikiMode);
    if (url) return url;
  }
  return null;
}

export function extractFirstNonGifImageUrlFromMarkdown(
  markdown: string,
  wikiMode: WikiImageResolveMode
): string | null {
  const matches = collectImageMatches(markdown);
  for (const match of matches) {
    if (isGifPath(match.raw)) continue;
    const url = matchToUrl(match, wikiMode);
    if (url && !isGifPath(url)) return url;
  }
  return null;
}

/** @deprecated Use extractFirstImageUrlFromMarkdown(md, "project") */
export function extractFirstImageUrlFromProjectMarkdown(
  markdown: string
): string | null {
  return extractFirstImageUrlFromMarkdown(markdown, "project");
}

/** @deprecated Use extractFirstNonGifImageUrlFromMarkdown(md, "project") */
export function extractFirstNonGifImageUrlFromProjectMarkdown(
  markdown: string
): string | null {
  return extractFirstNonGifImageUrlFromMarkdown(markdown, "project");
}

function normalizeFrontMatterHero(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  return normalizeProjectImageUrlForCard(raw);
}

export interface ProjectCardComputedImages {
  cardImageDisplayUrl: string | null;
  cardImageHoverGifUrl: string | null;
}

function buildCardImageFieldsWithWikiMode(input: {
  heroImage: unknown;
  heroImagePoster?: unknown;
  markdownBody: string;
  wikiMode: WikiImageResolveMode;
}): ProjectCardComputedImages {
  const fromFm = normalizeFrontMatterHero(input.heroImage);
  const fromMd = extractFirstImageUrlFromMarkdown(
    input.markdownBody,
    input.wikiMode
  );
  const primary = fromFm ?? fromMd ?? null;

  if (!primary) {
    return { cardImageDisplayUrl: null, cardImageHoverGifUrl: null };
  }

  if (!isGifPath(primary)) {
    return { cardImageDisplayUrl: primary, cardImageHoverGifUrl: null };
  }

  const posterFm = normalizeFrontMatterHero(input.heroImagePoster);
  const posterMd = extractFirstNonGifImageUrlFromMarkdown(
    input.markdownBody,
    input.wikiMode
  );
  const poster = posterFm ?? posterMd ?? null;

  if (poster) {
    return { cardImageDisplayUrl: poster, cardImageHoverGifUrl: primary };
  }

  return { cardImageDisplayUrl: primary, cardImageHoverGifUrl: null };
}

export function buildProjectCardImageFields(input: {
  heroImage: unknown;
  heroImagePoster?: unknown;
  markdownBody: string;
}): ProjectCardComputedImages {
  return buildCardImageFieldsWithWikiMode({ ...input, wikiMode: "project" });
}

export function buildLogCardImageFields(input: {
  heroImage: unknown;
  heroImagePoster?: unknown;
  markdownBody: string;
}): ProjectCardComputedImages {
  return buildCardImageFieldsWithWikiMode({ ...input, wikiMode: "content" });
}
