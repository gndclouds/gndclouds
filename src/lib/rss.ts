/**
 * Shared RSS 2.0 feed builder used by /feed.xml, /journals/feed.xml, and
 * /projects/feed.xml. Keeps escaping, date formatting, and channel boilerplate
 * in one place so the three feeds stay consistent.
 */

export interface RssItem {
  title: string;
  /** Absolute URL of the item's canonical page; doubles as the guid. */
  url: string;
  description?: string;
  /** A Date or any string `new Date()` can parse (YAML front matter may yield either). Items with unparseable dates are kept but emit no pubDate. */
  publishedAt?: string | Date;
}

export interface RssChannel {
  title: string;
  description: string;
  /** Absolute URL of the HTML page this feed mirrors. */
  siteUrl: string;
  /** Absolute URL of the feed itself, for the atom:link self reference. */
  feedUrl: string;
  items: RssItem[];
  /** Cap on the number of items emitted (after sorting newest-first). */
  limit?: number;
}

/** Front matter titles are sometimes YAML lists (`title:\n  - Foo`); flatten to a plain string. */
export function normalizeTitle(value: unknown, fallback = "Untitled"): string {
  const raw = Array.isArray(value) ? value[0] : value;
  const title = typeof raw === "string" ? raw.trim() : "";
  return title || fallback;
}

export function escapeXml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toValidDate(value?: string | Date): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value !== "string" || !value.trim()) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Plain-text excerpt from raw markdown for use as an item description:
 * strips frontmatter remnants, wiki links, images, inline markup, and code fences.
 */
export function markdownExcerpt(markdown: string, wordLimit = 50): string {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[\[[^\]]*\]\]/g, " ") // Obsidian image embeds
    .replace(/\[\[([^\]|]*)(\|([^\]]*))?\]\]/g, (_m, target, _p, alias) =>
      String(alias || target)
    )
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_`>~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return "";
  const words = text.split(" ");
  return words.length <= wordLimit
    ? text
    : words.slice(0, wordLimit).join(" ") + "…";
}

export function buildRssFeed(channel: RssChannel): string {
  const limit = channel.limit ?? 100;

  const sorted = [...channel.items].sort((a, b) => {
    const aTime = toValidDate(a.publishedAt)?.getTime() ?? 0;
    const bTime = toValidDate(b.publishedAt)?.getTime() ?? 0;
    return bTime - aTime;
  });

  const items = sorted
    .slice(0, limit)
    .map((item) => {
      const date = toValidDate(item.publishedAt);
      const lines = [
        "    <item>",
        `      <title>${escapeXml(item.title)}</title>`,
        `      <link>${escapeXml(item.url)}</link>`,
        `      <guid>${escapeXml(item.url)}</guid>`,
      ];
      if (item.description) {
        lines.push(
          `      <description>${escapeXml(item.description)}</description>`
        );
      }
      if (date) {
        lines.push(`      <pubDate>${date.toUTCString()}</pubDate>`);
      }
      lines.push("    </item>");
      return lines.join("\n");
    })
    .join("\n");

  const newestDate = sorted
    .map((item) => toValidDate(item.publishedAt))
    .find(Boolean);

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(channel.title)}</title>
    <link>${escapeXml(channel.siteUrl)}</link>
    <description>${escapeXml(channel.description)}</description>
    <language>en-us</language>
    ${newestDate ? `<lastBuildDate>${newestDate.toUTCString()}</lastBuildDate>` : ""}
    <atom:link href="${escapeXml(channel.feedUrl)}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
}

export function rssResponse(xml: string): Response {
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
