import { NextRequest, NextResponse } from "next/server";

const HERO_STYLE_PROMPT = `Duotone isometric cutaway illustration, coral and blue-gray palette, risograph-inspired flat vector style. Based on a core theme to the post, create a minimalistic illustration. or a texture for no core theme is aparent. Clean geometric shapes, no gradients, overlapping colors creating third tones. Editorial infographic aesthetic.`;

export async function GET(request: NextRequest) {
  const summary = request.nextUrl.searchParams.get("summary") ?? "";
  const topic = summary.trim() || "journal entry";
  const prompt = `${HERO_STYLE_PROMPT} Topic: ${topic}`;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.redirect(new URL("/background.jpg", request.url));
  }

  try {
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
      console.error("OpenAI images API error:", res.status, err);
      return NextResponse.redirect(new URL("/background.jpg", request.url));
    }

    const json = (await res.json()) as { data?: { url?: string }[] };
    const imageUrl = json.data?.[0]?.url;
    if (!imageUrl) {
      return NextResponse.redirect(new URL("/background.jpg", request.url));
    }

    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) {
      return NextResponse.redirect(new URL("/background.jpg", request.url));
    }

    const contentType = imageRes.headers.get("content-type") ?? "image/png";
    const bytes = await imageRes.arrayBuffer();
    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (err) {
    console.error("Hero image generation error:", err);
    return NextResponse.redirect(new URL("/background.jpg", request.url));
  }
}
