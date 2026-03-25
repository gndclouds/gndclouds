/**
 * Shared prompts and image generation for journal hero banners.
 * Uses OpenAI DALL·E 3 only (PNG raster). Anthropic does not offer image generation; we removed the
 * old Claude→SVG workaround because SVG heroes looked poor compared to DALL·E.
 * Used by /api/journals/hero-image and scripts/generate-journal-hero-images.ts.
 *
 * Tuning: edit `HERO_IMAGE_STYLE_PROMPT` below, or set `JOURNAL_HERO_STYLE_PROMPT` in `.env.local`.
 * Query params on `/api/journals/hero-image` are for per-card cache URLs only (not sent to the model).
 * Set `DISABLE_JOURNAL_HERO_GENERATION=1` to turn off live + script generation (e.g. billing paused).
 */

import {
  markdownBodyToCardPlainText,
  stripMarkdownMediaEmbeds,
} from "@/lib/markdown-to-card-plain-text";
import {
  normalizeProjectImageUrlForCard,
  resolveWikiInnerPathForContentRepo,
} from "@/lib/project-card-images";

/**
 * Style only (medium, palette, mood)—no fixed scene. Composition and subject are up to the model.
 * Override with env `JOURNAL_HERO_STYLE_PROMPT` if needed.
 */
export const HERO_IMAGE_STYLE_PROMPT = `Wide horizontal landscape hero banner (16:9). Illustrated in a Japanese woodblock print / Studio Ghibli–adjacent spirit: fine ink linework with soft muted watercolor washes, pastoral naturalism, hand-drawn organic detail. Palette: earthy and restrained—olive greens, golden yellows, slate blues, warm grays, soft umber; no neon or hyper-saturated digital color. Sense of ink on paper: light texture, careful hatching where shadows build, gentle bleed between wash and line. Calm, observational, not photorealistic. No readable text, logos, or photorealistic faces. You choose the landscape content freely within this look—foreground, distance, sky, and focal elements are not prescribed.`;

/** Effective style string for API calls (env override for local tuning). */
export function getHeroImageStylePrompt(): string {
  const fromEnv = process.env.JOURNAL_HERO_STYLE_PROMPT?.trim();
  if (fromEnv) return fromEnv;
  return HERO_IMAGE_STYLE_PROMPT;
}

/** When true, skip DALL·E calls (script exits 0; API redirects to placeholder). */
export function isJournalHeroGenerationDisabled(): boolean {
  const v = process.env.DISABLE_JOURNAL_HERO_GENERATION?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

/** Front matter path under src/app/db/assets/ (PNG from DALL·E). */
export function journalHeroAssetPath(
  slug: string,
  ext: "svg" | "png" = "png"
): string {
  const safe = slug.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-|-$/g, "");
  return `assets/journal-hero-${safe}.${ext}`;
}

/**
 * Query string for `GET /api/journals/hero-image`.
 * Params are only so each preview URL is unique for browser/CDN caching—they are not sent to the image model.
 */
export function journalHeroImageApiQuery(options: {
  summary: string;
  title?: string;
  tags?: string[];
}): string {
  const p = new URLSearchParams();
  p.set("summary", options.summary.trim());
  const t = options.title?.trim();
  if (t) p.set("title", t);
  const tagList = (options.tags ?? [])
    .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
    .map((x) => x.replace(/\[\[|\]\]/g, "").trim())
    .slice(0, 12);
  if (tagList.length) p.set("tags", tagList.join(","));
  return p.toString();
}

/** Full prompt for raster APIs (DALL·E)—style only. */
export function buildHeroImagePrompt(): string {
  return getHeroImageStylePrompt();
}

export interface GeneratedHeroImageResult {
  buffer: ArrayBuffer;
  contentType: string;
}

/**
 * OpenAI Images API (DALL·E 3).
 */
export async function generateHeroImageWithOpenAI(
  apiKey: string
): Promise<GeneratedHeroImageResult> {
  const prompt = buildHeroImagePrompt();
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1792x1024",
      response_format: "url",
      quality: "standard",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    let hint = "";
    try {
      const j = JSON.parse(err) as {
        error?: { code?: string; message?: string };
      };
      if (j?.error?.code === "billing_hard_limit_reached") {
        hint =
          " OpenAI billing hard limit reached — raise your limit at platform.openai.com or add credits.";
      }
    } catch {
      /* use raw err */
    }
    throw new Error(`OpenAI images API error ${res.status}: ${err}${hint}`);
  }

  const json = (await res.json()) as { data?: { url?: string }[] };
  const imageUrl = json.data?.[0]?.url;
  if (!imageUrl) {
    throw new Error("OpenAI images API returned no image URL");
  }

  const imageRes = await fetch(imageUrl);
  if (!imageRes.ok) {
    throw new Error(`Failed to download generated image: ${imageRes.status}`);
  }

  const contentType = imageRes.headers.get("content-type") ?? "image/png";
  const buffer = await imageRes.arrayBuffer();
  return { buffer, contentType };
}

/**
 * DALL·E 3 only. Anthropic has no raster API; SVG fallback was removed.
 */
export async function generateHeroImage(): Promise<GeneratedHeroImageResult> {
  if (isJournalHeroGenerationDisabled()) {
    throw new Error(
      "Journal hero generation is disabled (DISABLE_JOURNAL_HERO_GENERATION=1)."
    );
  }
  const openaiKey = process.env.OPENAI_API_KEY?.trim();
  if (!openaiKey) {
    throw new Error(
      "Set OPENAI_API_KEY for journal hero generation (DALL·E 3). Anthropic cannot output PNG/JPEG; the old SVG path was removed."
    );
  }
  return generateHeroImageWithOpenAI(openaiKey);
}

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i;

/**
 * Resolve `heroImage` front matter to a URL suitable for next/image (db-assets, proxy, or absolute).
 */
export function journalHeroUrlForDisplay(heroImage: unknown): string | null {
  if (typeof heroImage !== "string") return null;
  const candidate = heroImage.trim();
  if (!candidate) return null;
  const isValid =
    IMAGE_EXT.test(candidate) ||
    candidate.startsWith("http") ||
    candidate.startsWith("/");
  if (!isValid) return null;

  if (candidate.startsWith("http") || candidate.startsWith("/db-assets/")) {
    return candidate;
  }
  if (candidate.startsWith("assets/") || !candidate.startsWith("/")) {
    return resolveWikiInnerPathForContentRepo(candidate);
  }
  const normalized = normalizeProjectImageUrlForCard(candidate);
  return normalized ?? candidate;
}

/**
 * Plain-text excerpt for generation / API (matches card preview length).
 */
export function journalExcerptForHero(
  metadata: {
    description?: unknown;
    contentHtml?: unknown;
  },
  maxLength = 200
): string {
  const desc = metadata.description;
  if (typeof desc === "string" && desc.trim()) {
    return stripMarkdownMediaEmbeds(desc)
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, maxLength);
  }
  const raw = metadata.contentHtml;
  if (typeof raw !== "string") return "";
  return markdownBodyToCardPlainText(raw).slice(0, maxLength);
}
