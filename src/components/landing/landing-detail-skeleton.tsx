type DetailKind = "journal" | "project";

const KIND_LABEL: Record<DetailKind, string> = {
  journal: "Loading journal…",
  project: "Loading project…",
};

interface LandingDetailSkeletonProps {
  kind: DetailKind;
}

/**
 * Mirrors LandingDetailPage chrome (card shell, header band, article column)
 * for route `loading.tsx` so navigations do not flash the home skeleton.
 */
export default function LandingDetailSkeleton({
  kind,
}: LandingDetailSkeletonProps) {
  return (
    <main className="min-h-screen w-full bg-primary-gray font-inter text-primary-black dark:bg-backgroundDark dark:text-textDark">
      <span className="sr-only">{KIND_LABEL[kind]}</span>
      <div className="w-full px-4 pb-6 pt-4 sm:px-6 sm:pb-8 sm:pt-6 md:pb-10">
        <div className="flex flex-col overflow-hidden rounded-2xl bg-primary-white shadow-sm ring-1 ring-gray-200/90 dark:bg-[#242424] dark:ring-gray-600/50">
          <header
            className="border-b border-gray-200/80 bg-primary-white/95 px-4 py-3 backdrop-blur-md dark:border-gray-600/40 dark:bg-[#242424]/95 sm:px-6 sm:py-3.5"
            aria-hidden
          >
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <div className="h-3 w-14 animate-pulse rounded-sm bg-gray-200 dark:bg-zinc-700" />
              <div className="h-3 w-16 animate-pulse rounded-sm bg-gray-200 dark:bg-zinc-700" />
            </div>
            <div className="flex flex-row items-start justify-between gap-3 sm:gap-4">
              <div className="min-w-0 flex-1 space-y-2 pr-2">
                <div className="h-7 w-[min(100%,24rem)] animate-pulse rounded-sm bg-gray-200 dark:bg-zinc-700 sm:h-8" />
                <div className="h-7 w-[min(100%,18rem)] animate-pulse rounded-sm bg-gray-200/80 dark:bg-zinc-600/80 sm:h-8" />
              </div>
              <div className="h-3 w-16 shrink-0 animate-pulse rounded-sm bg-gray-200 dark:bg-zinc-700 pt-0.5" />
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-6 w-14 animate-pulse rounded-full bg-gray-200 dark:bg-zinc-700"
                />
              ))}
            </div>
          </header>

          <div className="font-inter text-gray-800 dark:text-textDark">
            <div className="w-full max-w-[600px] px-6 py-8 text-left sm:px-8">
              <div className="space-y-3 animate-pulse">
                <div className="h-4 w-full rounded-sm bg-gray-200 dark:bg-zinc-700" />
                <div className="h-4 w-full rounded-sm bg-gray-200 dark:bg-zinc-700" />
                <div className="h-4 w-[94%] rounded-sm bg-gray-200 dark:bg-zinc-700" />
                <div className="h-4 w-full rounded-sm bg-gray-200 dark:bg-zinc-700" />
                <div className="h-4 w-[88%] rounded-sm bg-gray-200 dark:bg-zinc-700" />
                <div className="pt-4">
                  <div className="aspect-video w-full rounded-lg bg-gray-200 dark:bg-zinc-800" />
                </div>
                <div className="h-4 w-full rounded-sm bg-gray-200 dark:bg-zinc-700 pt-2" />
                <div className="h-4 w-[92%] rounded-sm bg-gray-200 dark:bg-zinc-700" />
                <div className="h-4 w-[76%] rounded-sm bg-gray-200 dark:bg-zinc-700" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
