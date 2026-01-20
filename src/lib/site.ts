export function getBaseUrl() {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    process.env.VERCEL_URL;

  if (!envUrl) return "http://localhost:3000";
  return envUrl.startsWith("http") ? envUrl : `https://${envUrl}`;
}

