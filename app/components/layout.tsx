"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import "../app/globals.css";
import { ThemeProvider } from "@/app/components/theme-provider";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div>
      <div
        className={`antialiased min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 ordinal slashed-zero tabular-nums ss01`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="">
            <header>
              <nav className="text-sm font-medium space-x-6 p-8">
                <Link href="/">gndclouds</Link>
                <Link href="/">notes</Link>
              </nav>
            </header>
            <main className="mx-auto">{children}</main>
          </div>
        </ThemeProvider>
      </div>
    </div>
  );
}
