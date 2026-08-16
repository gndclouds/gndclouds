import type { Metadata } from "next";
import Link from "next/link";
import { DesignBackgroundLab } from "@/components/design/design-background-lab";

export const metadata: Metadata = {
  title: "Background lab",
  description: "Full-viewport blurred gradient mesh with ASCII grain",
};

export default function DesignBackgroundPage() {
  return (
    <div className="relative min-h-dvh">
      <DesignBackgroundLab />
      <main className="relative z-10 mx-auto flex min-h-dvh max-w-xl flex-col justify-center gap-6 px-5 py-16 sm:px-8">
        <div className="rounded-2xl border border-black/[0.08] bg-white/55 p-8 shadow-sm backdrop-blur-xl dark:border-white/[0.1] dark:bg-black/35">
          <p className="text-sm text-textLight/70 dark:text-textDark/70">
            <Link
              href="/"
              className="underline decoration-textLight/30 underline-offset-4 hover:decoration-textLight/60 dark:decoration-textDark/30 dark:hover:decoration-textDark/60"
            >
              Home
            </Link>
            <span className="mx-2 opacity-40">/</span>
            <span>design</span>
            <span className="mx-2 opacity-40">/</span>
            <span>background</span>
          </p>
          <h1 className="mt-4 text-2xl font-medium tracking-tight text-textLight dark:text-textDark">
            Background lab
          </h1>
          <p className="prose-readability mt-3 text-textLight/85 dark:text-textDark/85">
            Full-screen palette mesh (heavy blur) over an ASCII field. Colors
            drift slowly; the grid follows the pointer with eased parallax.
            The layer is fixed and ignores pointer events so this panel stays
            readable and clickable.
          </p>
          <button
            type="button"
            className="mt-6 w-fit rounded-lg border border-black/12 bg-white/90 px-4 py-2.5 text-sm text-textLight shadow-sm transition hover:bg-white dark:border-white/18 dark:bg-white/10 dark:text-textDark dark:hover:bg-white/14"
          >
            Click test — foreground stays usable
          </button>
        </div>
      </main>
    </div>
  );
}
