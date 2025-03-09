"use client";
import React, { useState } from "react";
import ListView from "./list-view";
import FeedFilter from "./feed-filter";

interface FeedWithFilterProps {
  data: any[];
}

export default function FeedWithFilter({ data }: FeedWithFilterProps) {
  const [filteredData, setFilteredData] = useState(data);

  return (
    <div>
      <FeedFilter data={data} onFilterChange={setFilteredData} />

      {filteredData.length === 0 ? (
        <div className="text-center py-12 border-2 border-backgroundDark dark:border-backgroundLight">
          <p className="text-lg">No results found</p>
          <p className="text-sm text-gray-500 mt-2">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-between items-center">
            <p className="text-sm">
              Showing <span className="font-medium">{filteredData.length}</span>{" "}
              of <span className="font-medium">{data.length}</span> items
            </p>
          </div>
          <div className="mt-4">
            <ListView data={filteredData} variant="feed" />
          </div>
        </>
      )}
    </div>
  );
}
