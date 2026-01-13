"use client";
import React, { useState, useRef, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import ListView from "./list-view";
import FeedFilter from "./feed-filter";
import FeedTimeline from "./feed-timeline";

interface FeedWithFilterProps {
  data: any[];
}

export default function FeedWithFilter({ data }: FeedWithFilterProps) {
  const [filteredData, setFilteredData] = useState(data);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll to item when clicked from timeline
  const handleTimelineItemClick = (index: number) => {
    if (!scrollContainerRef.current) return;

    // Find the grid container
    const gridContainer = scrollContainerRef.current.querySelector(".grid");
    if (!gridContainer) return;

    // Get all grid items (filter out year break divs)
    const gridItems = Array.from(gridContainer.children).filter(
      (child) =>
        !child.classList.contains("col-span-12") ||
        child.querySelector(".border-2")
    ) as HTMLElement[];

    // Find the actual item at this index (accounting for grid layout)
    const actualItems = Array.from(
      gridContainer.querySelectorAll('[class*="col-span"]')
    ).filter((el) => {
      const classes = el.className;
      return classes.includes("border-2") || classes.includes("relative");
    }) as HTMLElement[];

    const targetItem = actualItems[index];

    if (targetItem) {
      const container = scrollContainerRef.current;
      const elementTop = targetItem.offsetTop;
      const containerTop = container.scrollTop;
      const offset = 100; // Offset from top

      container.scrollTo({
        top: elementTop + containerTop - offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 relative">
      {/* Left Sidebar - Filters */}
      <FeedFilter
        data={data}
        searchTerm={searchTerm}
        selectedTypes={selectedTypes}
        startDate={startDate}
        onSearchChange={setSearchTerm}
        onTypesChange={setSelectedTypes}
        onDateChange={setStartDate}
        onFilterChange={setFilteredData}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-10 py-2 border-2 border-backgroundDark dark:border-backgroundLight bg-transparent rounded-none focus:outline-none focus:ring-0 focus:border-blue-500"
              placeholder="Search feed..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                <FiX className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
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
                Showing{" "}
                <span className="font-medium">{filteredData.length}</span> of{" "}
                <span className="font-medium">{data.length}</span> items
              </p>
            </div>
            <div
              ref={scrollContainerRef}
              className="mt-4 max-h-[calc(100vh-300px)] overflow-y-auto"
            >
              <div className="relative">
                <ListView data={filteredData} variant="feed" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Timeline on the right */}
      {filteredData.length > 0 && (
        <FeedTimeline
          items={filteredData}
          onItemClick={handleTimelineItemClick}
          scrollContainerRef={scrollContainerRef}
        />
      )}
    </div>
  );
}
