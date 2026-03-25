/**
 * Remove Obsidian-style embeds (![[path]]) and markdown images (![alt](url))
 * so asset paths do not appear in card blurbs or search text.
 */
export function stripMarkdownMediaEmbeds(input: string): string {
  return input
    .replace(/!\[\[[\s\S]*?\]\]/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "");
}

/**
 * Obsidian internal links → visible label (same rules as MarkdownContent).
 * Does not touch embeds: `![[…]]` is left unchanged (strip those with {@link stripMarkdownMediaEmbeds} first).
 */
export function stripObsidianWikiLinksForPreview(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/(?<!!)\[\[\s*\]\]/g, "")
    .replace(/(?<!!)\[\[([^\]]+)\|([^\]]+)\]\]/g, (_m, _link, displayText: string) =>
      displayText.trim()
    )
    .replace(/(?<!!)\[\[([^\]]+)\]\]/g, (_m, link: string) => link.trim())
    .replace(
      /\[([^\]]+)\]\((\/\[\[[^\]]+\]\]\/[^)]+)\)/g,
      (_m, text: string) => text
    );
}

/**
 * Front matter titles are sometimes YAML lists (e.g. Obsidian `title:\n  - "[[Note]]"`).
 * Coerce to a single string so wiki-link stripping still keeps the inner label.
 */
export function coerceYamlTitleString(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) {
    const parts: string[] = [];
    for (const el of value) {
      if (typeof el === "string" && el.trim()) parts.push(el.trim());
      else if (typeof el === "number" || typeof el === "boolean")
        parts.push(String(el));
    }
    return parts.join(" ").trim();
  }
  if (typeof value === "number" || typeof value === "boolean")
    return String(value);
  return "";
}

/** Titles and one-line labels on cards (front matter titles may use `[[Note]]`). */
export function formatCardHeading(title: unknown): string {
  return stripObsidianWikiLinksForPreview(coerceYamlTitleString(title)).trim();
}

/**
 * Markdown/HTML body → one line of plain text for short previews (cards, hero excerpts).
 */
export function markdownBodyToCardPlainText(markdown: string): string {
  let s = stripMarkdownMediaEmbeds(markdown);
  s = stripObsidianWikiLinksForPreview(s);
  s = s
    .replace(/<[^>]*>/g, "")
    .replace(/^#+\s*/gm, "")
    .replace(/\*+([^*]*)\*+/g, "$1")
    .replace(/_+([^_]*)_+/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
  return s;
}
