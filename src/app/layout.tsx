import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const firaCode = Fira_Code({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fira-code",
});

export const metadata: Metadata = {
  title: "gndclouds",
  description: "Will's corner of the internet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.className} ${firaCode.variable} bg-backgroundLight text-textLight dark:bg-backgroundDark dark:text-textDark`}
    >
      <body>
        {children}
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
