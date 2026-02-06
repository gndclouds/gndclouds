"use client";
import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { track } from "@/lib/umami";

interface FeedFilterProps {
  data: any[];
  searchTerm: string;
  selectedTypes: string[];
  startDate: string;
  onSearchChange: (term: string) => void;
  onTypesChange: (types: string[]) => void;
  onDateChange: (date: string) => void;
  onFilterChange: (filteredData: any[]) => void;
}

export default function FeedFilter({
  data,
  searchTerm,
  selectedTypes,
  startDate,
  onSearchChange,
  onTypesChange,
  onDateChange,
  onFilterChange,
}: FeedFilterProps) {
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
      }),
    ),
  ).sort();

  // Apply filters whenever search term, selected types, or date change
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

      // Apply date filter
      let dateMatch = true;
      if (startDate && item.publishedAt) {
        const itemDate = new Date(item.publishedAt);
        const filterDate = new Date(startDate);
        dateMatch = itemDate >= filterDate;
      }

      return searchMatch && typeMatch && dateMatch;
    });

    onFilterChange(filteredData);
  }, [searchTerm, selectedTypes, startDate, data, onFilterChange]);

  // Toggle a content type in the selected types
  const toggleType = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    onTypesChange(newTypes);
    track("feed-filter-type", { type, selected: !selectedTypes.includes(type) });
  };

  // Clear all filters
  const clearFilters = () => {
    onSearchChange("");
    onTypesChange([]);
    onDateChange("");
    track("feed-filter-clear");
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
      case "fragment":
        return "Fragment";
      case "log":
        return "Log";
      case "study":
        return "Study";
      case "system":
        return "System";
      case "journal":
        return "Journal";
      case "note":
        return "Note";
      case "project":
        return "Project";
      case "research":
        return "Research";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  // Get count of items for each type
  const getTypeCount = (type: string) => {
    return data.filter((item) => {
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
      if (itemType.startsWith("arena-") || itemType === "arena") {
        itemType = "arena";
      }
      return itemType === type;
    }).length;
  };

  const hasActiveFilters = selectedTypes.length > 0 || startDate !== "";

  return (
    <div className="w-full lg:w-56 flex-shrink-0">
      <div className="lg:sticky lg:top-8 space-y-5">
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-700">Filters</h3>
            {hasActiveFilters && (
              <button
                type="button"
                className="text-sm text-gray-500 hover:text-primary-black transition-colors"
                onClick={clearFilters}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Type Filter */}
        <div>
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Type</h4>
          <div className="space-y-1.5">
            {contentTypes.map((type) => {
              const isSelected = selectedTypes.includes(type);
              const count = getTypeCount(type);
              return (
                <label
                  key={type}
                  className="flex items-center gap-2 cursor-pointer group py-1 rounded-lg hover:bg-gray-50 px-1.5 -mx-1.5 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleType(type)}
                    className="w-4 h-4 border border-gray-300 rounded text-gray-600 focus:ring-gray-200 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-sm flex-1 text-gray-700 group-hover:text-primary-black">
                    {formatTypeName(type)}
                  </span>
                  <span className="text-xs text-gray-400 tabular-nums">{count}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Date Filter */}
        <div>
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Start date</h4>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              const value = e.target.value;
              onDateChange(value);
              track("feed-filter-date", { date: value || "cleared" });
            }}
            className="w-full px-3 py-2 border border-gray-200 bg-white rounded-xl text-sm text-primary-black focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-gray-300"
          />
          {startDate && (
            <button
              onClick={() => onDateChange("")}
              className="mt-1.5 text-xs text-gray-500 hover:text-primary-black transition-colors"
              aria-label="Clear date filter"
            >
              Clear date
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
