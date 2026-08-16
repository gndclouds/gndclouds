import { ImageResponse } from "next/og";

export const ogImageSize = {
  width: 1200,
  height: 630,
};

type OgImageOptions = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  accent?: string;
};

export function createOgImage({
  title,
  subtitle,
  eyebrow,
  accent = "#7c3aed",
}: OgImageOptions) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          color: "#f8fafc",
          backgroundColor: "#0b1120",
          backgroundImage: `radial-gradient(circle at top left, ${accent}55, transparent 55%), radial-gradient(circle at bottom right, #22d3ee33, transparent 60%)`,
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          {eyebrow ? (
            <div
              style={{
                alignSelf: "flex-start",
                padding: "6px 14px",
                fontSize: 20,
                letterSpacing: 2,
                textTransform: "uppercase",
                borderRadius: 999,
                border: "1px solid rgba(248, 250, 252, 0.25)",
                backgroundColor: "rgba(15, 23, 42, 0.6)",
              }}
            >
              {eyebrow}
            </div>
          ) : null}
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -1.5,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                fontSize: 32,
                fontWeight: 500,
                color: "rgba(248, 250, 252, 0.8)",
                maxWidth: 900,
                lineHeight: 1.3,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "rgba(248, 250, 252, 0.75)",
          }}
        >
          <span>gndclouds</span>
          <span style={{ fontSize: 18, letterSpacing: 1.5 }}>
            journals · logs · projects
          </span>
        </div>
      </div>
    ),
    ogImageSize
  );
}

