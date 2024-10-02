import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en">
      <body
        className={`${inter.className} bg-backgroundLight text-textLight dark:bg-backgroundDark dark:text-textDark`}
      >
        {children}
      </body>
      <script
        async
        defer
        data-website-id="d0310b26-9820-4f75-8939-200ecdfc29a0"
        src="https://umami.tinyfactories.space/umami.js"
      ></script>
    </html>
  );
}
