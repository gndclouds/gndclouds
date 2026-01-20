import { createOgImage } from "@/lib/og";

export const runtime = "edge";
export const contentType = "image/png";

export default function OpenGraphImage() {
  return createOgImage({
    title: "gndclouds",
    subtitle: "Will's corner of the internet for notes, journals, and systems.",
    eyebrow: "Homepage",
    accent: "#38bdf8",
  });
}

