/**
 * Shared prompts and image generation for journal hero banners.
 * Primary: OpenAI DALL·E 3 (PNG raster).
 * Fallback: Claude (Anthropic Messages API → SVG) when OpenAI fails or OPENAI_API_KEY is unset.
 * Used by /api/journals/hero-image and scripts/generate-journal-hero-images.ts.
 *
 * Tuning the look:
 * - Style (both Claude + DALL·E): edit `HERO_IMAGE_STYLE_PROMPT` below, or set env
 *   `JOURNAL_HERO_STYLE_PROMPT` in `.env.local` to override without code changes (one line, or use \n for breaks).
 * - Claude-only (SVG rules, viewBox, “no script” constraints): edit the `userPrompt` template in
 *   `generateHeroImageWithClaude`.
 * - Only this style string is sent to the models (no article text). Query params on `/api/journals/hero-image`
 *   are for per-card cache URLs only.
 */

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

/** Front matter path under src/app/db/assets/ (OpenAI → .png default; Claude fallback → .svg). */
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

const DEFAULT_CLAUDE_MODEL = "claude-sonnet-4-20250514";

function extractSvgFromClaudeText(text: string): string {
  const t = text.trim();
  const fence = t.match(/```(?:svg)?\s*([\s\S]*?)```/);
  if (fence) return fence[1].trim();
  const start = t.indexOf("<svg");
  const end = t.lastIndexOf("</svg>");
  if (start >= 0 && end > start) return t.slice(start, end + 6);
  throw new Error("Claude response did not contain a valid <svg> document");
}

/** Strip obvious script vectors from generated SVG before serving or saving. */
export function sanitizeHeroSvg(svg: string): string {
  return svg
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<\?[\s\S]*?\?>/g, "")
    .replace(/\s(on\w+)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
}

/**
 * Claude (Anthropic) has no raster image API; we ask for a single 16:9 SVG banner.
 */
export async function generateHeroImageWithClaude(
  apiKey: string
): Promise<GeneratedHeroImageResult> {
  const model =
    process.env.ANTHROPIC_MODEL?.trim() || DEFAULT_CLAUDE_MODEL;
  const style = getHeroImageStylePrompt();
  const userPrompt = `Create ONE standalone SVG file for a website hero banner.

Requirements:
- Root element: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1792 1008" width="1792" height="1008"> (16:9).
- Visual style (medium and palette only; choose any peaceful landscape composition that fits): ${style}
- Evoke ink line + watercolor with paths, layered transparency, soft gradients, and optional subtle paper grain (e.g. feTurbulence at low opacity). Avoid flat vector poster fills with no wash or line character.
- Do not include <script>, animation that loads remote resources, or embedded raster images (no <image href="http...">). Use only vector shapes, paths, gradients, and filters if needed.
- Output ONLY the raw SVG markup. No markdown fences, no commentary before or after.

`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 8192,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic Messages API error ${res.status}: ${err}`);
  }

  const json = (await res.json()) as {
    content?: { type: string; text?: string }[];
  };
  const block = json.content?.find((c) => c.type === "text");
  const text = block?.text;
  if (!text) {
    throw new Error("Anthropic returned no text block");
  }

  let svg = extractSvgFromClaudeText(text);
  svg = sanitizeHeroSvg(svg);
  if (!svg.includes("<svg")) {
    throw new Error("Sanitized output lost SVG root");
  }

  const u8 = new TextEncoder().encode(svg);
  const buffer = u8.buffer.slice(
    u8.byteOffset,
    u8.byteOffset + u8.byteLength
  ) as ArrayBuffer;
  return {
    buffer,
    contentType: "image/svg+xml; charset=utf-8",
  };
}

/**
 * OpenAI Images API (DALL·E 3) — primary raster path.
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
    throw new Error(`OpenAI images API error ${res.status}: ${err}`);
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
 * Prefer OpenAI (DALL·E PNG); fall back to Claude (SVG) if OpenAI fails or key is missing.
 */
export async function generateHeroImage(): Promise<GeneratedHeroImageResult> {
  const openaiKey = process.env.OPENAI_API_KEY?.trim();
  const anthropicKey = process.env.ANTHROPIC_API_KEY?.trim();

  if (openaiKey) {
    try {
      return await generateHeroImageWithOpenAI(openaiKey);
    } catch (e) {
      console.error("OpenAI hero generation failed, trying Claude fallback:", e);
      if (!anthropicKey) throw e;
      return generateHeroImageWithClaude(anthropicKey);
    }
  }

  if (anthropicKey) {
    return generateHeroImageWithClaude(anthropicKey);
  }

  throw new Error(
    "Set OPENAI_API_KEY (DALL·E, preferred) or ANTHROPIC_API_KEY (Claude SVG fallback) in the environment"
  );
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
    return desc.slice(0, maxLength);
  }
  const raw = metadata.contentHtml;
  if (typeof raw !== "string") return "";
  return raw
    .replace(/<[^>]*>/g, "")
    .replace(/^#+\s*/gm, "")
    .replace(/\*+([^*]*)\*+/g, "$1")
    .replace(/_+([^_]*)_+/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}
