"use client";

export default function HeroSkeleton() {
  return (
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
  );
}
