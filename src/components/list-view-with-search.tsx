"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import ListView from "./list-view";
import { FiSearch, FiX } from "react-icons/fi";

interface ListViewWithSearchProps {
  data: any[];
  variant?: "feed" | "default";
  placeholder?: string;
  showProjectImages?: boolean;
  showFilters?: boolean;
}

export default function ListViewWithSearch({
  data,
  variant = "default",
  placeholder = "Search...",
  showProjectImages = false,
  showFilters = false,
}: ListViewWithSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState(data);

  const normalizeTag = useCallback(
    (tag: string) => tag.replace(/\[\[|\]\]/g, "").trim().toLowerCase(),
    []
  );

  const getItemTagValues = useCallback(
    (item: any) => {
      const itemTags = [...(item.tags || []), ...(item.categories || [])];
      return itemTags
        .filter((tag: string) => typeof tag === "string")
        .map((tag: string) => normalizeTag(tag));
    },
    [normalizeTag]
  );

  const getItemYears = useCallback((item: any) => {
    const itemYears: string[] = [];
    const rawYear = item.year ?? item.metadata?.year;
    const addYear = (value: unknown) => {
      if (value === null || value === undefined) return;
      const valueString = String(value).trim();
      if (!valueString) return;
      const directMatch = valueString.match(/^\d{4}$/);
      if (directMatch) {
        itemYears.push(directMatch[0]);
        return;
      }
      const embeddedMatch = valueString.match(/(\d{4})/);
      if (embeddedMatch) {
        itemYears.push(embeddedMatch[1]);
      }
    };

    if (Array.isArray(rawYear)) {
      rawYear.forEach(addYear);
    } else {
      addYear(rawYear);
    }

    if (itemYears.length === 0 && item.publishedAt) {
      if (typeof item.publishedAt === "string") {
        addYear(item.publishedAt);
      } else {
        const date = new Date(item.publishedAt);
        if (!Number.isNaN(date.getTime())) {
          itemYears.push(String(date.getFullYear()));
        }
      }
    }

    return itemYears;
  }, []);

  const tagOptions = useMemo(() => {
    const tagMap = new Map<string, string>();
    data.forEach((item) => {
      const tags = [...(item.tags || []), ...(item.categories || [])];
      tags.forEach((tag: string) => {
        if (!tag || typeof tag !== "string") return;
        const normalized = normalizeTag(tag);
        if (!normalized) return;
        if (showFilters && normalized === "projects") return;
        if (!tagMap.has(normalized)) {
          tagMap.set(normalized, tag.replace(/\[\[|\]\]/g, "").trim());
        }
      });
    });

    return Array.from(tagMap.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [data, showFilters, normalizeTag]);

  const yearOptions = useMemo(() => {
    const years = new Set<string>();
    data.forEach((item) => {
      getItemYears(item).forEach((year) => years.add(year));
    });

    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [data, getItemYears]);

  // Apply search filter whenever search term or data changes
  useEffect(() => {
    const filtered = data.filter((item) => {
      const itemTagValues = getItemTagValues(item);
      const itemYears = getItemYears(item);

      if (selectedYear !== "all" && !itemYears.includes(selectedYear)) {
        return false;
      }

      if (
        selectedTags.length > 0 &&
        !selectedTags.some((tag) => itemTagValues.includes(tag))
      ) {
        return false;
      }

      if (searchTerm === "") return true;

      const searchLower = searchTerm.toLowerCase();

      // Search in title
      if (item.title && item.title.toLowerCase().includes(searchLower)) {
        return true;
      }

      // Search in description
      if (
        item.description &&
        item.description.toLowerCase().includes(searchLower)
      ) {
        return true;
      }

      // Search in text content
      if (item.text && item.text.toLowerCase().includes(searchLower)) {
        return true;
      }

      // Search in tags
      if (item.tags && Array.isArray(item.tags)) {
        if (
          item.tags.some((tag: string) =>
            tag.toLowerCase().includes(searchLower)
          )
        ) {
          return true;
        }
      }

      // Search in categories
      if (item.categories && Array.isArray(item.categories)) {
        if (
          item.categories.some((cat: string) =>
            cat.toLowerCase().includes(searchLower)
          )
        ) {
          return true;
        }
      }

      // Search in metadata description
      if (
        item.metadata?.description &&
        item.metadata.description.toLowerCase().includes(searchLower)
      ) {
        return true;
      }

      return false;
    });

    setFilteredData(filtered);
  }, [searchTerm, data, selectedYear, selectedTags, getItemTagValues, getItemYears]);

  const hasActiveFilters =
    searchTerm !== "" || selectedYear !== "all" || selectedTags.length > 0;

  return (
    <div className="space-y-6">
      {/* Search and filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-10 py-2 border-2 border-backgroundDark dark:border-backgroundLight bg-transparent rounded-none focus:outline-none focus:ring-0 focus:border-blue-500"
            placeholder={placeholder}
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
        {showFilters && (
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <label className="text-sm text-gray-500 flex items-center gap-2">
              Year
              <select
                className="border-2 border-backgroundDark dark:border-backgroundLight bg-transparent px-2 py-2 text-sm rounded-none"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                aria-label="Filter by year"
              >
                <option value="all">All</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <details className="relative">
                <summary className="cursor-pointer select-none border-2 border-backgroundDark dark:border-backgroundLight bg-transparent px-2 py-2 text-sm rounded-none text-gray-700 dark:text-gray-200 min-w-[120px]">
                  Tags
                  {selectedTags.length > 0 ? ` (${selectedTags.length})` : ""}
                </summary>
                <div className="absolute right-0 z-20 mt-2 w-56 max-h-56 overflow-auto border-2 border-backgroundDark dark:border-backgroundLight bg-white dark:bg-black p-3 shadow-lg">
                  {tagOptions.map((tag) => (
                    <label
                      key={tag.value}
                      className="flex items-center gap-2 py-1 text-sm text-gray-700 dark:text-gray-200"
                    >
                      <input
                        type="checkbox"
                        className="accent-gray-700"
                        checked={selectedTags.includes(tag.value)}
                        onChange={(event) => {
                          if (event.target.checked) {
                            setSelectedTags((prev) => [...prev, tag.value]);
                          } else {
                            setSelectedTags((prev) =>
                              prev.filter((value) => value !== tag.value)
                            );
                          }
                        }}
                      />
                      <span>{tag.label}</span>
                    </label>
                  ))}
                  {tagOptions.length === 0 && (
                    <div className="text-xs text-gray-500">
                      No tags available.
                    </div>
                  )}
                </div>
              </details>
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      {hasActiveFilters && (
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">{filteredData.length}</span> of{" "}
          <span className="font-medium">{data.length}</span> items
        </div>
      )}

      {/* No results message */}
      {hasActiveFilters && filteredData.length === 0 ? (
        <div className="text-center py-12 border-2 border-backgroundDark dark:border-backgroundLight">
          <p className="text-lg">
            No results found
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Try adjusting your search terms
          </p>
        </div>
      ) : (
        <ListView
          data={filteredData}
          variant={variant}
          showProjectImages={showProjectImages}
        />
      )}
    </div>
  );
}
