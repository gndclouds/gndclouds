import { createOgImage } from "@/lib/og";

export const runtime = "edge";
export const contentType = "image/png";

export default function OpenGraphImage() {
  return createOgImage({
    title: "Journals",
    subtitle: "Daily reflections, field notes, and personal writing.",
    eyebrow: "Collection",
    accent: "#f97316",
  });
}

