import {
  encodedDbAssetsUrlSuffixFromRepoPath,
  resolveArtifactWikiAssetRepoPath,
} from "@/lib/artifacts-paths";

/**
 * Resolve preview/hero URLs for cards and extract the first image from markdown.
 * - `project` wiki mode: same as `project/[slug]/page.tsx` (shared `assets/` at repo root).
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
export function resolveWikiInnerPathToDbAssetsUrl(
  cleanPath: string,
  markdownFilePath?: string
): string {
  const trimmed = cleanPath.trim();
  let resolvedPath: string;
  if (trimmed.startsWith("assets/")) {
    resolvedPath = resolveArtifactWikiAssetRepoPath(
      trimmed,
      markdownFilePath ?? ""
    );
  } else if (trimmed.includes("/")) {
    resolvedPath = `assets/${trimmed}`;
  } else {
    resolvedPath = `assets/${trimmed}`;
  }
  return `/db-assets/${encodedDbAssetsUrlSuffixFromRepoPath(resolvedPath)}`;
}

/** Same rules as `MarkdownContent` resolveImagePath (no artifact prefix). */
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
  return `/db-assets/${encodedDbAssetsUrlSuffixFromRepoPath(resolvedPath)}`;
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
    return `/api/asset-proxy?path=${encodeURIComponent(pathWithoutSlash)}`;
  }
  return trimmed;
}

function normalizeAnyImageRef(
  ref: string,
  wikiMode: WikiImageResolveMode,
  projectMarkdownFilePath?: string
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
        ? resolveWikiInnerPathToDbAssetsUrl(t, projectMarkdownFilePath)
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

/** True when the line is only whitespace and markdown / wikilink images. */
function lineIsImageOnly(line: string): boolean {
  let rest = line.trim();
  if (!rest) return false;
  let prev = "";
  while (rest !== prev) {
    prev = rest;
    rest = rest
      .replace(/!\[\[[^\]]+\]\]/g, "")
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      .trim();
  }
  return rest.length === 0;
}

/**
 * Byte index in `markdown` where “body text” starts (prose), skipping leading
 * blank lines, headings, HRs, and image-only lines. Used for journal covers.
 */
function findIndexOfFirstBodyText(markdown: string): number {
  let lineStart = 0;
  while (lineStart < markdown.length) {
    const nl = markdown.indexOf("\n", lineStart);
    const end = nl === -1 ? markdown.length : nl;
    const line = markdown.slice(lineStart, end);
    const t = line.trim();
    if (!t) {
      lineStart = end < markdown.length ? end + 1 : markdown.length;
      continue;
    }
    if (/^#{1,6}\s/.test(t)) {
      lineStart = end < markdown.length ? end + 1 : markdown.length;
      continue;
    }
    if (/^---+(\s*)$/.test(t) || /^\*{3,}(\s*)$/.test(t)) {
      lineStart = end < markdown.length ? end + 1 : markdown.length;
      continue;
    }
    if (lineIsImageOnly(line)) {
      lineStart = end < markdown.length ? end + 1 : markdown.length;
      continue;
    }
    const rel = line.search(/\S/);
    return lineStart + (rel >= 0 ? rel : 0);
  }
  return -1;
}

/**
 * First non-GIF image in markdown that appears strictly before any body prose
 * (see {@link findIndexOfFirstBodyText}). For `content` wiki mode (journals, logs in repo).
 */
export function extractFirstImageBeforeBodyText(
  markdown: string,
  wikiMode: WikiImageResolveMode,
  projectMarkdownFilePath?: string
): string | null {
  const textStart = findIndexOfFirstBodyText(markdown);
  const matches = collectImageMatches(markdown);
  const projectPath =
    wikiMode === "project" ? projectMarkdownFilePath : undefined;

  for (const match of matches) {
    if (textStart >= 0 && match.index >= textStart) break;
    if (isGifPath(match.raw)) continue;
    const url = matchToUrl(match, wikiMode, projectPath);
    if (url && !isGifPath(url)) return url;
  }
  return null;
}

/**
 * Lead media before first body line: supports static + GIF pairs (poster + hover) and GIF-only leads
 * (poster from another image before body, or full-doc fallback for a static frame).
 */
function buildLeadSectionCardImages(
  markdown: string,
  wikiMode: WikiImageResolveMode,
  markdownFilePath?: string
): ProjectCardComputedImages {
  const textStart = findIndexOfFirstBodyText(markdown);
  const projectPath = wikiMode === "project" ? markdownFilePath : undefined;
  const pairs: { match: Match; url: string }[] = [];
  for (const match of collectImageMatches(markdown)) {
    if (textStart >= 0 && match.index >= textStart) break;
    const url = matchToUrl(match, wikiMode, projectPath);
    if (url) pairs.push({ match, url });
  }
  if (pairs.length === 0) {
    return { cardImageDisplayUrl: null, cardImageHoverGifUrl: null };
  }

  const urlIsGif = (p: { match: Match; url: string }) =>
    isGifPath(p.match.raw) || isGifPath(p.url);

  const firstPair = pairs[0];
  if (!urlIsGif(firstPair)) {
    const firstGif = pairs.find(urlIsGif);
    return {
      cardImageDisplayUrl: firstPair.url,
      cardImageHoverGifUrl:
        firstGif && firstGif.url !== firstPair.url ? firstGif.url : null,
    };
  }

  const firstStatic = pairs.find((p) => !urlIsGif(p));
  if (firstStatic) {
    return {
      cardImageDisplayUrl: firstStatic.url,
      cardImageHoverGifUrl: firstPair.url,
    };
  }

  const poster = extractFirstNonGifImageUrlFromMarkdown(
    markdown,
    wikiMode,
    projectPath
  );
  if (poster) {
    return {
      cardImageDisplayUrl: poster,
      cardImageHoverGifUrl: firstPair.url,
    };
  }
  return {
    cardImageDisplayUrl: firstPair.url,
    cardImageHoverGifUrl: null,
  };
}

function matchToUrl(
  match: Match,
  wikiMode: WikiImageResolveMode,
  projectMarkdownFilePath?: string
): string | null {
  if (match.kind === "wiki") {
    const dbUrl =
      wikiMode === "project"
        ? resolveWikiInnerPathToDbAssetsUrl(match.raw, projectMarkdownFilePath)
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
  return normalizeAnyImageRef(url, wikiMode, projectMarkdownFilePath);
}

export function extractFirstImageUrlFromMarkdown(
  markdown: string,
  wikiMode: WikiImageResolveMode,
  projectMarkdownFilePath?: string
): string | null {
  const matches = collectImageMatches(markdown);
  for (const match of matches) {
    const url = matchToUrl(match, wikiMode, projectMarkdownFilePath);
    if (url) return url;
  }
  return null;
}

export function extractFirstNonGifImageUrlFromMarkdown(
  markdown: string,
  wikiMode: WikiImageResolveMode,
  projectMarkdownFilePath?: string
): string | null {
  const matches = collectImageMatches(markdown);
  for (const match of matches) {
    if (isGifPath(match.raw)) continue;
    const url = matchToUrl(match, wikiMode, projectMarkdownFilePath);
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
  markdownFilePath?: string;
}): ProjectCardComputedImages {
  const projectMarkdownFilePath =
    input.wikiMode === "project" ? input.markdownFilePath : undefined;
  const fromFm = normalizeFrontMatterHero(input.heroImage);
  const fromMd = extractFirstImageUrlFromMarkdown(
    input.markdownBody,
    input.wikiMode,
    projectMarkdownFilePath
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
    input.wikiMode,
    projectMarkdownFilePath
  );
  const poster = posterFm ?? posterMd ?? null;

  if (poster) {
    return { cardImageDisplayUrl: poster, cardImageHoverGifUrl: primary };
  }

  return { cardImageDisplayUrl: primary, cardImageHoverGifUrl: null };
}

/**
 * Project / artifact listing previews: first non-GIF image in the body before any prose,
 * with artifact asset resolution (`markdownFilePath`). No `heroImage` fallback.
 */
export function buildProjectCardImageFields(input: {
  markdownBody: string;
  markdownFilePath?: string;
  /** @deprecated Ignored; kept for call-site compatibility. */
  heroImage?: unknown;
  heroImagePoster?: unknown;
}): ProjectCardComputedImages {
  return buildLeadSectionCardImages(
    input.markdownBody,
    "project",
    input.markdownFilePath
  );
}

export function buildLogCardImageFields(input: {
  heroImage: unknown;
  heroImagePoster?: unknown;
  markdownBody: string;
}): ProjectCardComputedImages {
  return buildCardImageFieldsWithWikiMode({ ...input, wikiMode: "content" });
}

/**
 * Journal listing previews: prefer first non-GIF image before any prose (headings / image-only
 * lines / blanks skipped). If none, use the first image anywhere in the post (same GIF + poster
 * behavior as logs). Front matter `heroImage` is not used — only markdown body.
 */
export function buildJournalCardImageFields(input: {
  markdownBody: string;
  /** @deprecated Ignored; kept for call-site compatibility. */
  heroImage?: unknown;
  heroImagePoster?: unknown;
}): ProjectCardComputedImages {
  const lead = buildLeadSectionCardImages(
    input.markdownBody,
    "content",
    undefined
  );
  if (lead.cardImageDisplayUrl) {
    return lead;
  }
  return buildCardImageFieldsWithWikiMode({
    heroImage: undefined,
    heroImagePoster: undefined,
    markdownBody: input.markdownBody,
    wikiMode: "content",
  });
}

/** Prefer server-computed journal card URLs; otherwise derive from markdown (client-safe). */
export function getJournalCardMediaUrls(metadata: {
  heroImage?: unknown;
  heroImagePoster?: unknown;
  contentHtml?: unknown;
  cardImageDisplayUrl?: unknown;
  cardImageHoverGifUrl?: unknown;
}): { displayUrl: string | null; hoverGifUrl: string | null } {
  const m = metadata as Record<string, unknown>;
  const fromServerDisplay =
    typeof m.cardImageDisplayUrl === "string"
      ? m.cardImageDisplayUrl.trim()
      : "";
  const fromServerHover =
    typeof m.cardImageHoverGifUrl === "string"
      ? m.cardImageHoverGifUrl.trim()
      : "";
  if (fromServerDisplay) {
    return {
      displayUrl: fromServerDisplay,
      hoverGifUrl: fromServerHover || null,
    };
  }
  const md = typeof m.contentHtml === "string" ? m.contentHtml : "";
  const c = buildJournalCardImageFields({ markdownBody: md });
  return {
    displayUrl: c.cardImageDisplayUrl,
    hoverGifUrl: c.cardImageHoverGifUrl,
  };
}

/** Prefer server-computed log card URLs; otherwise derive from markdown (client-safe). */
export function getLogCardMediaUrls(metadata: {
  heroImage?: unknown;
  heroImagePoster?: unknown;
  contentHtml?: unknown;
  cardImageDisplayUrl?: unknown;
  cardImageHoverGifUrl?: unknown;
}): { displayUrl: string | null; hoverGifUrl: string | null } {
  const m = metadata as Record<string, unknown>;
  const fromServerDisplay =
    typeof m.cardImageDisplayUrl === "string"
      ? m.cardImageDisplayUrl.trim()
      : "";
  const fromServerHover =
    typeof m.cardImageHoverGifUrl === "string"
      ? m.cardImageHoverGifUrl.trim()
      : "";
  if (fromServerDisplay) {
    return {
      displayUrl: fromServerDisplay,
      hoverGifUrl: fromServerHover || null,
    };
  }
  const md = typeof m.contentHtml === "string" ? m.contentHtml : "";
  const c = buildLogCardImageFields({
    heroImage: m.heroImage,
    heroImagePoster: m.heroImagePoster,
    markdownBody: md,
  });
  return {
    displayUrl: c.cardImageDisplayUrl,
    hoverGifUrl: c.cardImageHoverGifUrl,
  };
}

/** Prefer server-computed project card URLs; otherwise derive from markdown (client-safe). */
export function getProjectCardMediaUrls(
  metadata: {
    heroImage?: unknown;
    heroImagePoster?: unknown;
    contentHtml?: unknown;
    cardImageDisplayUrl?: unknown;
    cardImageHoverGifUrl?: unknown;
  },
  markdownFilePath?: string
): { displayUrl: string | null; hoverGifUrl: string | null } {
  const m = metadata as Record<string, unknown>;
  const fromServerDisplay =
    typeof m.cardImageDisplayUrl === "string"
      ? m.cardImageDisplayUrl.trim()
      : "";
  const fromServerHover =
    typeof m.cardImageHoverGifUrl === "string"
      ? m.cardImageHoverGifUrl.trim()
      : "";
  if (fromServerDisplay) {
    return {
      displayUrl: fromServerDisplay,
      hoverGifUrl: fromServerHover || null,
    };
  }
  const md = typeof m.contentHtml === "string" ? m.contentHtml : "";
  const c = buildProjectCardImageFields({
    markdownBody: md,
    markdownFilePath,
  });
  return {
    displayUrl: c.cardImageDisplayUrl,
    hoverGifUrl: c.cardImageHoverGifUrl,
  };
}
