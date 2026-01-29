import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import Script from "next/script";
import { getBaseUrl } from "@/lib/site";
import { ThemeProvider } from "@/components/theme";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const firaCode = Fira_Code({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fira-code",
});

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: "gndclouds",
    template: "%s · gndclouds",
  },
  description: "Will's corner of the internet",
  openGraph: {
    type: "website",
    siteName: "gndclouds",
    title: "gndclouds",
    description: "Will's corner of the internet",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "gndclouds",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "gndclouds",
    description: "Will's corner of the internet",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeScript = `
(function() {
  var stored = localStorage.getItem('theme');
  var mode = stored || 'system';
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (mode === 'dark' || (mode === 'system' && systemDark)) document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
  var style = localStorage.getItem('theme-style');
  if (style && ['minimal','glass','retro'].indexOf(style) >= 0) document.documentElement.setAttribute('data-theme', style);
})();
`;

  return (
    <html
      lang="en"
      className={`${inter.className} ${firaCode.variable} bg-backgroundLight text-textLight dark:bg-backgroundDark dark:text-textDark`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        {process.env.NODE_ENV === "production" && (
          <Script
            defer
            src="https://umami.tinyfactories.space/script.js"
            data-website-id="d0310b26-9820-4f75-8939-200ecdfc29a0"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
