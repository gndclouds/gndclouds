import { NextRequest, NextResponse } from "next/server";
import {
  generateHeroImage,
  isJournalHeroGenerationDisabled,
} from "@/lib/journal-hero-image";

/**
 * Live hero generation (style-only prompt). Optional query params (summary, title, tags)
 * may be present on image URLs for per-card cache keys; they are not used in the model prompt.
 * Set DISABLE_JOURNAL_HERO_GENERATION=1 to always redirect to the default background.
 */
export async function GET(_request: NextRequest) {
  if (
    isJournalHeroGenerationDisabled() ||
    !process.env.OPENAI_API_KEY?.trim()
  ) {
    return NextResponse.redirect(new URL("/background.jpg", _request.url));
  }

  try {
    const { buffer, contentType } = await generateHeroImage();
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (err) {
    console.error("Hero image generation error:", err);
    return NextResponse.redirect(new URL("/background.jpg", _request.url));
  }
}
