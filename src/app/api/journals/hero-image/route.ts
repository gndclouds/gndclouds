import { NextRequest, NextResponse } from "next/server";
import { generateHeroImage } from "@/lib/journal-hero-image";

/**
 * Live hero generation (style-only prompt). Optional query params (summary, title, tags)
 * may be present on image URLs for per-card cache keys; they are not used in the model prompt.
 */
export async function GET(_request: NextRequest) {
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY?.trim();
  const hasOpenAI = !!process.env.OPENAI_API_KEY?.trim();
  if (!hasAnthropic && !hasOpenAI) {
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
