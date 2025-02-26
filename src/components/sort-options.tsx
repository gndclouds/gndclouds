"use client";

import { useState } from "react";

interface SortOptionsProps {
  onSortChange: (sortBy: string) => void;
  currentSort: string;
}

const SortOptions = ({ onSortChange, currentSort }: SortOptionsProps) => {
  const sortOptions = [
    { value: "title", label: "Title" },
    { value: "author", label: "Author" },
    { value: "reading_progress", label: "Reading Progress" },
    { value: "created_at", label: "Date Added" },
    { value: "published_date", label: "Publication Date" },
  ];

  return (
    <div className="flex items-center space-x-2 mb-4">
      <span className="font-medium">Sort by:</span>
      <select
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value)}
        className="border rounded-md px-2 py-1 bg-white"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortOptions;
