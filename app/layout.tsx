import Link from "next/link";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@/components/analytics";
import { ModeToggle } from "@/components/mode-toggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "gndclouds",
  description: "Generated by create next app",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={`antialiased min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 ordinal slashed-zero tabular-nums ss01 ${inter.className}`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="">
            <header>
              <div className="">
                {/* <ModeToggle /> */}
                {/* <nav className="ml-auto text-sm font-medium space-x-6 p-8">
                  <Link href="/">gndclouds</Link>
                  <Link href="/about">About</Link>
                </nav> */}
              </div>
            </header>
            <main className="mx-auto">{children}</main>
          </div>

          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
