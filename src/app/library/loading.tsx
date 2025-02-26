export default function Loading() {
  return (
    <main>
      {/* Hero Skeleton */}
      <div className="min-w-screen flex">
        <div className="relative flex-1 h-[200px] overflow-hidden bg-gray-300 animate-pulse">
          <div className="absolute top-0 left-0 p-4">
            <div className="h-6 w-40 bg-gray-400 rounded"></div>
          </div>
          <div className="absolute bottom-0 p-4 w-full">
            <div className="grid grid-cols-3">
              <div className="flex justify-start items-center">
                <div className="h-4 w-20 bg-gray-400 rounded"></div>
              </div>
              <div className="flex justify-center items-center">
                <div className="h-4 w-24 bg-gray-400 rounded"></div>
              </div>
              <div className="flex justify-end items-center">
                <div className="h-4 w-10 bg-gray-400 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Library Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        {/* Skeleton for sort options and filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="h-10 w-40 bg-gray-200 rounded animate-pulse"></div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }, (_, i) => (
                <div
                  key={i}
                  className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Skeleton for item count */}
        <div className="mb-4 h-5 w-60 bg-gray-200 rounded animate-pulse"></div>

        {/* Skeleton grid for items */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i} className="flex flex-col">
              <div className="relative">
                {/* Book cover skeleton */}
                <div className="w-full aspect-[2/3] bg-gray-200 rounded animate-pulse"></div>

                {/* Reading progress skeleton */}
                <div className="mt-2">
                  <div className="w-full h-1.5 bg-gray-200 rounded-full"></div>
                  <div className="h-4 w-12 bg-gray-200 rounded mt-1 animate-pulse"></div>
                </div>
              </div>

              {/* Title skeleton */}
              <div className="h-5 w-full bg-gray-200 rounded mt-2 animate-pulse"></div>

              {/* Author skeleton */}
              <div className="h-4 w-3/4 bg-gray-200 rounded mt-1 animate-pulse"></div>
            </div>
          ))}
        </section>

        {/* Pagination skeleton */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className="w-8 h-8 bg-gray-200 rounded animate-pulse"
              ></div>
            ))}
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
