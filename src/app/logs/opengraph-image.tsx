import { createOgImage } from "@/lib/og";

export const runtime = "edge";
export const contentType = "image/png";

export default function OpenGraphImage() {
  return createOgImage({
    title: "Logs",
    subtitle: "Short updates, experiments, and the day-to-day stream.",
    eyebrow: "Collection",
    accent: "#22c55e",
  });
}

