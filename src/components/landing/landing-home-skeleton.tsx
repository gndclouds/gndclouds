/**
 * Shown from `app/loading.tsx` while the home page RSC resolves.
 * Mirrors HomeLanding shell + feed grid so layout does not jump after load.
 */
export default function LandingHomeSkeleton() {
  return (
    <main className="min-h-screen w-full flex flex-col overflow-x-hidden bg-primary-gray font-inter text-primary-black max-md:overflow-y-auto md:h-[100dvh] md:max-h-[100dvh] md:min-h-0 md:overflow-hidden dark:bg-backgroundDark dark:text-textDark">
      <span className="sr-only">Loading home…</span>
      <div className="flex min-h-0 flex-1 flex-col max-md:flex-none md:flex-row">
        <div className="flex w-full max-w-full flex-col bg-primary-gray max-md:min-h-screen md:min-h-0 md:w-1/3 md:min-w-0 md:overflow-hidden px-4 py-4 sm:p-6 md:pt-4 md:pb-4 md:pl-2 md:pr-2 dark:bg-backgroundDark">
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-2xl bg-primary-white max-md:flex-none dark:bg-[#242424] px-6 py-6">
            <div className="flex min-h-0 flex-1 flex-col pb-2">
              <div className="space-y-3 animate-pulse">
                <div className="h-4 w-full rounded-sm bg-gray-200 dark:bg-zinc-700" />
                <div className="h-4 w-[92%] rounded-sm bg-gray-200 dark:bg-zinc-700" />
                <div className="h-4 w-[78%] rounded-sm bg-gray-200 dark:bg-zinc-700" />
              </div>
            </div>
            <div className="mt-8 h-10 w-48 shrink-0 animate-pulse rounded-sm bg-gray-200 dark:bg-zinc-700" />
          </div>
        </div>

        <div className="flex min-h-0 w-full max-w-full flex-1 flex-col px-4 pb-0 pt-0 max-md:min-h-0 sm:px-6 md:w-2/3 md:min-w-0 md:pb-0 md:pl-4 md:pr-4">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain max-md:grow-0 max-md:flex-none max-md:overflow-visible max-md:min-h-0">
              <div className="sticky top-0 z-20 border-b-0 pb-4 pt-[max(1rem,env(safe-area-inset-top))]">
                <div className="rounded-2xl border-0 bg-primary-white/80 px-2 py-2 backdrop-blur-md dark:bg-zinc-900/55 sm:px-3">
                  <div className="flex min-h-[2.75rem] min-w-0 animate-pulse rounded-xl bg-gray-200/90 dark:bg-zinc-800/80" />
                </div>
              </div>
              <section
                aria-hidden
                className="relative z-0 min-w-0 px-2 py-2 sm:px-3"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="min-w-0 overflow-hidden rounded-2xl border border-transparent bg-primary-white shadow-sm shadow-black/[0.04] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/20"
                    >
                      <div className="aspect-square w-full animate-pulse bg-gray-200 dark:bg-zinc-800" />
                      <div className="space-y-2 p-4">
                        <div className="h-4 w-[85%] animate-pulse rounded-sm bg-gray-200 dark:bg-zinc-700" />
                        <div className="h-3 w-1/3 animate-pulse rounded-sm bg-gray-200 dark:bg-zinc-700" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
