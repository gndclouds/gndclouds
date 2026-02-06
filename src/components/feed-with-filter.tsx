"use client";
import React, { useState, useRef, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import ListView from "./list-view";
import FeedFilter from "./feed-filter";
import FeedTimeline from "./feed-timeline";

interface FeedWithFilterProps {
  data: any[];
  /** When true, render filters in one card and feed items in another card */
  cardLayout?: boolean;
}

const CARD_CLASS =
  "rounded-2xl overflow-hidden bg-primary-white flex flex-col px-6 py-6";

export default function FeedWithFilter({
  data,
  cardLayout = false,
}: FeedWithFilterProps) {
  const [filteredData, setFilteredData] = useState(data);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to item when clicked from timeline (scrolls the page so item is in view)
  const handleTimelineItemClick = (index: number) => {
    if (!scrollContainerRef.current) return;

    const gridContainer = scrollContainerRef.current.querySelector(".grid");
    if (!gridContainer) return;

    const actualItems = Array.from(
      gridContainer.querySelectorAll('[class*="col-span"]')
    ).filter((el) => {
      const classes = el.className;
      return classes.includes("border-2") || classes.includes("relative");
    }) as HTMLElement[];

    const targetItem = actualItems[index];
    if (targetItem) {
      targetItem.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const filtersSection = (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
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
      <div className="flex-1 min-w-0">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 bg-white rounded-xl text-primary-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-gray-300"
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
    </div>
  );

  const itemsSection = (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 flex-1">
      <div className="flex-1 min-w-0 flex flex-col">
        {filteredData.length === 0 ? (
          <div className="text-center py-12 rounded-xl border border-gray-200 bg-gray-50/50">
            <p className="text-lg text-gray-800">No results found</p>
            <p className="text-sm text-gray-500 mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <>
            <div className="mb-3 flex justify-between items-center shrink-0">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-medium text-primary-black">{filteredData.length}</span> of{" "}
                <span className="font-medium text-primary-black">{data.length}</span> items
              </p>
            </div>
            <div ref={scrollContainerRef} className="mt-2">
              <div className="relative">
                <ListView data={filteredData} variant="feed" />
              </div>
            </div>
          </>
        )}
      </div>
      {filteredData.length > 0 && (
        <FeedTimeline
          items={filteredData}
          onItemClick={handleTimelineItemClick}
          scrollContainerRef={scrollContainerRef}
        />
      )}
    </div>
  );

  if (cardLayout) {
    return (
      <div className="flex flex-col gap-4 sm:gap-6 flex-1">
        {/* Card 2: Filters */}
        <div className={`${CARD_CLASS} shrink-0`}>{filtersSection}</div>
        {/* Feed items — all in page flow, footer below */}
        <div className="flex-1 flex flex-col">
          {itemsSection}
        </div>
      </div>
    );
  }

  /* Single-card / original layout: sidebar | search + results | timeline */
  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 relative">
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
      <div className="flex-1 min-w-0">
        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 bg-white rounded-xl text-primary-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-gray-300"
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
        {filteredData.length === 0 ? (
          <div className="text-center py-12 rounded-xl border border-gray-200 bg-gray-50/50">
            <p className="text-lg text-gray-800">No results found</p>
            <p className="text-sm text-gray-500 mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <>
            <div className="mb-3 flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-medium text-primary-black">{filteredData.length}</span> of{" "}
                <span className="font-medium text-primary-black">{data.length}</span> items
              </p>
            </div>
            <div ref={scrollContainerRef} className="mt-2">
              <div className="relative">
                <ListView data={filteredData} variant="feed" />
              </div>
            </div>
          </>
        )}
      </div>
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
