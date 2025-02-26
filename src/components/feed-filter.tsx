"use client";
import React, { useState, useEffect } from "react";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";

interface FeedFilterProps {
  data: any[];
  onFilterChange: (filteredData: any[]) => void;
}

export default function FeedFilter({ data, onFilterChange }: FeedFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Extract all unique content types from the data, consolidating Are.na types
  const contentTypes = Array.from(
    new Set(
      data.map((item) => {
        let itemType = "unknown";

        if (item.type && typeof item.type === "string") {
          itemType = item.type.toLowerCase();
        } else if (
          Array.isArray(item.metadata?.type) &&
          item.metadata.type.length > 0
        ) {
          itemType = item.metadata.type[0].toLowerCase();
        } else if (
          typeof item.metadata?.type === "string" &&
          item.metadata.type.length > 0
        ) {
          itemType = item.metadata.type.toLowerCase();
        }

        // Consolidate all arena types to just "arena"
        if (itemType.startsWith("arena-") || itemType === "arena") {
          return "arena";
        }

        return itemType;
      })
    )
  ).sort();

  // Apply filters whenever search term or selected types change
  useEffect(() => {
    const filteredData = data.filter((item) => {
      // Apply search filter
      const searchMatch =
        searchTerm === "" ||
        (item.title &&
          item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.description &&
          item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.text &&
          item.text.toLowerCase().includes(searchTerm.toLowerCase()));

      // Apply type filter
      let itemType = "unknown";
      if (item.type && typeof item.type === "string") {
        itemType = item.type.toLowerCase();
      } else if (
        Array.isArray(item.metadata?.type) &&
        item.metadata.type.length > 0
      ) {
        itemType = item.metadata.type[0].toLowerCase();
      } else if (
        typeof item.metadata?.type === "string" &&
        item.metadata.type.length > 0
      ) {
        itemType = item.metadata.type.toLowerCase();
      }

      // Consolidate all arena types for filtering
      if (itemType.startsWith("arena-") || itemType === "arena") {
        itemType = "arena";
      }

      const typeMatch =
        selectedTypes.length === 0 || selectedTypes.includes(itemType);

      return searchMatch && typeMatch;
    });

    onFilterChange(filteredData);
  }, [searchTerm, selectedTypes, data, onFilterChange]);

  // Toggle a content type in the selected types
  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTypes([]);
  };

  // Format type name for display
  const formatTypeName = (type: string) => {
    switch (type) {
      case "arena":
        return "Are.na";
      case "bluesky":
        return "Bluesky";
      case "photography":
        return "Photography";
      case "github":
        return "GitHub";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search input */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border-2 border-backgroundDark dark:border-backgroundLight bg-transparent rounded-none focus:outline-none focus:ring-0 focus:border-blue-500"
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

        {/* Filter toggle button */}
        <button
          className={`flex items-center gap-2 px-4 py-2 border-2 ${
            showFilters || selectedTypes.length > 0
              ? "bg-backgroundDark text-backgroundLight dark:bg-backgroundLight dark:text-backgroundDark"
              : "border-backgroundDark dark:border-backgroundLight"
          }`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <FiFilter />
          <span>Filter</span>
          {selectedTypes.length > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-blue-500 text-white rounded-full text-xs">
              {selectedTypes.length}
            </span>
          )}
        </button>
      </div>

      {/* Filter options */}
      {showFilters && (
        <div className="p-4 border-2 border-backgroundDark dark:border-backgroundLight">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Filter by type</h3>
            <button
              className="text-sm text-blue-500 hover:text-blue-700"
              onClick={clearFilters}
            >
              Clear all filters
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {contentTypes.map((type) => (
              <button
                key={type}
                className={`px-3 py-1 text-sm border-2 ${
                  selectedTypes.includes(type)
                    ? "bg-backgroundDark text-backgroundLight dark:bg-backgroundLight dark:text-backgroundDark"
                    : "border-backgroundDark dark:border-backgroundLight"
                }`}
                onClick={() => toggleType(type)}
              >
                {formatTypeName(type)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
