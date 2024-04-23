import React from "react";

const LoadingSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 p-4 border border-gray-200 rounded-md"
          >
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 h-4 bg-gray-300 rounded"></div>
              <div className="col-span-1 h-4 bg-gray-300 rounded"></div>
            </div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
