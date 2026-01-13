"use client";
import React, { useState, useEffect } from "react";
import ListView from "./list-view";
import { FiSearch, FiX } from "react-icons/fi";

interface ListViewWithSearchProps {
  data: any[];
  variant?: "feed" | "default";
  placeholder?: string;
}

export default function ListViewWithSearch({
  data,
  variant = "default",
  placeholder = "Search...",
}: ListViewWithSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  // Apply search filter whenever search term or data changes
  useEffect(() => {
    const filtered = data.filter((item) => {
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
  }, [searchTerm, data]);

  return (
    <div className="space-y-6">
      {/* Search input */}
      <div className="relative">
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

      {/* Results count */}
      {searchTerm && (
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">{filteredData.length}</span> of{" "}
          <span className="font-medium">{data.length}</span> items
        </div>
      )}

      {/* No results message */}
      {searchTerm && filteredData.length === 0 ? (
        <div className="text-center py-12 border-2 border-backgroundDark dark:border-backgroundLight">
          <p className="text-lg">
            No results found for &quot;{searchTerm}&quot;
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Try adjusting your search terms
          </p>
        </div>
      ) : (
        <ListView data={filteredData} variant={variant} />
      )}
    </div>
  );
}
