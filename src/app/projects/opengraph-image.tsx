import { createOgImage } from "@/lib/og";

export const runtime = "edge";
export const contentType = "image/png";

export default function OpenGraphImage() {
  return createOgImage({
    title: "Projects",
    subtitle: "Selected work, experiments, and ongoing builds.",
    eyebrow: "Collection",
    accent: "#6366f1",
  });
}

