import { useRouter } from "next/router";

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ["latin"] });
// import { Analytics } from "@vercel/analytics/react";
import Nav from "./nav";

import "../styles/index.css";
import { Inter } from "next/font/google";

export const metadata = {
  title: "gndclouds",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <div className={inter.className}>
        <body className="bg-backgroundlightmode text-textlightmode dark:bg-backgrounddarkmode dark:text-textdarkmode">
          <Nav />
          <div className="mx-auto p-8 py-50 min-h-screen max-w-screen-xl">
            {" "}
            {children}
          </div>
        </body>
      </div>
    </html>
  );
}
