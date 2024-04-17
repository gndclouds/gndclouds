import Link from "next/link";
import "./globals.css";
import { ThemeProvider } from "@/app/components/theme-provider";
import { Analytics } from "@/app/components/analytics";
import { ModeToggle } from "@/app/components/mode-toggle";

export const metadata = {
  title: "gndclouds",
  description: "Generated by create next app",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div>
      <script
        async
        defer
        data-website-id="d0310b26-9820-4f75-8939-200ecdfc29a0"
        src="https://umami.tinyfactories.space/umami.js"
      ></script>
      <div
        className={`antialiased min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 ordinal slashed-zero tabular-nums ss01`}
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
      </div>
    </div>
  );
}
