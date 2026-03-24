/**
 * Generate static journal hero art: OpenAI DALL·E 3 (PNG) is used when OPENAI_API_KEY is set;
 * otherwise Claude (Anthropic → SVG). Prompt is style-only (HERO_IMAGE_STYLE_PROMPT).
 *
 * Requires OPENAI_API_KEY (preferred) and/or ANTHROPIC_API_KEY in .env.local.
 *
 * Usage:
 *   npm run generate-journal-heroes                           # only if no heroImage + no hero file
 *   npm run generate-journal-heroes:force                     # regenerate every journal (override)
 *   npm run generate-journal-heroes -- --force                 # same (--force or -f)
 *   npm run generate-journal-heroes -- --slug=my-slug --force  # one post, overwrite
 *
 * Afterward: commit markdown + assets, and run `node move-assets.js` (or `npm run build`) so
 * public/db-assets includes the new files for local preview.
 */

import { config } from "dotenv";
import { resolve, join } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

import { readFile, writeFile, mkdir, unlink } from "fs/promises";
import matter from "gray-matter";
import { glob } from "glob";
import {
  generateHeroImage,
  journalHeroAssetPath,
} from "@/lib/journal-hero-image";

const DB_ROOT = join(process.cwd(), "src/app/db");
const JOURNALS_GLOB = "journals/**/*.md";

function parseArgs() {
  const argv = process.argv.slice(2);
  let force = false;
  let slug: string | null = null;
  for (const a of argv) {
    if (a === "--force" || a === "-f") force = true;
    const m = a.match(/^--slug=(.+)$/);
    if (m) slug = m[1].trim().replace(/\.md$/i, "") || null;
  }
  return { force, slug };
}

function slugFromPath(relativePath: string): string {
  const base = relativePath.split("/").pop() ?? "";
  return base.replace(/\.md$/i, "");
}

async function fileExists(p: string): Promise<boolean> {
  try {
    await readFile(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const { force, slug: slugFilter } = parseArgs();
  if (force) {
    console.log("Force mode: regenerating heroes (overrides heroImage + existing files).\n");
  }
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY?.trim();
  const hasOpenAI = !!process.env.OPENAI_API_KEY?.trim();
  if (!hasAnthropic && !hasOpenAI) {
    console.error(
      "Set OPENAI_API_KEY (DALL·E, preferred) and/or ANTHROPIC_API_KEY (Claude SVG fallback) in .env.local."
    );
    process.exit(1);
  }

  const pattern = join(DB_ROOT, JOURNALS_GLOB).replace(/\\/g, "/");
  const files = await glob(pattern, { nodir: true });
  files.sort();

  let done = 0;
  let skipped = 0;

  for (const filePath of files) {
    const rel = filePath.replace(DB_ROOT + "/", "").replace(/\\/g, "/");
    const slug = slugFromPath(rel);
    if (slugFilter && slug !== slugFilter) continue;

    const raw = await readFile(filePath, "utf8");
    const { data: frontmatter, content: body } = matter(raw);
    const meta = frontmatter as Record<string, unknown>;

    const safe = slug.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-|-$/g, "");
    const svgPath = join(DB_ROOT, "assets", `journal-hero-${safe}.svg`);
    const pngPath = join(DB_ROOT, "assets", `journal-hero-${safe}.png`);

    const existingHero =
      typeof meta.heroImage === "string" ? meta.heroImage.trim() : "";
    if (existingHero && !force) {
      console.log(`Skip ${slug}: heroImage already set (${existingHero})`);
      skipped++;
      continue;
    }

    try {
      await mkdir(join(DB_ROOT, "assets"), { recursive: true });
    } catch {
      /* exists */
    }

    if (!force) {
      const hasAnyFile =
        (await fileExists(svgPath)) || (await fileExists(pngPath));
      if (hasAnyFile) {
        console.log(
          `Skip ${slug}: hero file already exists (use --force to replace)`
        );
        skipped++;
        continue;
      }
    }

    console.log(`Generating hero for "${slug}"…`);
    const { buffer, contentType } = await generateHeroImage();
    const ext: "svg" | "png" = contentType.includes("svg") ? "svg" : "png";
    const assetRel = journalHeroAssetPath(slug, ext);
    const filename = assetRel.replace(/^assets\//, "");
    const outPath = join(DB_ROOT, "assets", filename);

    const otherPath = ext === "svg" ? pngPath : svgPath;
    try {
      await unlink(otherPath);
    } catch {
      /* no sibling file */
    }

    await writeFile(outPath, Buffer.from(buffer));

    meta.heroImage = assetRel;
    const outMd = matter.stringify(body, frontmatter);
    await writeFile(filePath, outMd, "utf8");

    console.log(`  wrote ${outPath}`);
    console.log(`  updated heroImage: ${assetRel}`);
    done++;
  }

  console.log(`\nDone. Generated: ${done}, skipped: ${skipped}`);
  if (done > 0) {
    console.log(
      "Run `node move-assets.js` (or `npm run build`) to copy assets into public/db-assets/."
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
