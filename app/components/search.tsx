"use client";
import { useState, useEffect, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

interface SearchProps {
  placeholder: string;
}

export default function Search({ placeholder }: SearchProps) {
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(
    new Set(["Note", "Log", "Project"])
  );
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const updateSearchParams = useCallback(
    (newTypes: Set<string>) => {
      const params = new URLSearchParams(searchParams);
      // Convert each type to capitalized form before joining
      params.set(
        "type",
        Array.from(newTypes)
          .map((type) => type.charAt(0).toUpperCase() + type.slice(1))
          .join(",")
      );
      replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, replace, pathname]
  );

  useEffect(() => {
    updateSearchParams(selectedTypes); // Update search params on initial render with all types selected
  }, [selectedTypes, updateSearchParams]);

  const handleSearch = useDebouncedCallback((term) => {
    console.log(`Searching... ${term}`);
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleTypeChange = (type: string) => {
    setSelectedTypes((prev) => {
      const newTypes = new Set(prev);
      if (newTypes.has(type)) {
        newTypes.delete(type);
      } else {
        newTypes.add(type);
      }
      // Moved updateSearchParams call to useEffect to prevent direct call during rendering
      return newTypes;
    });
  };

  // Added useEffect to handle search params update after handleTypeChange
  useEffect(() => {
    updateSearchParams(selectedTypes);
  }, [selectedTypes, updateSearchParams]);

  return (
    <div className="w-full">
      <div className="relative flex w-full">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          id="search"
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 outline-2 "
          placeholder={placeholder}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          defaultValue={searchParams.get("query")?.toString()}
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      </div>
      <div className="mt-4 flex justify-between">
        <div className="flex gap-4">
          <button
            className={`rounded-full px-4 py-1 ${
              selectedTypes.has("Note")
                ? "bg-purple-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => handleTypeChange("Note")}
          >
            Notes
          </button>
          <button
            className={`rounded-full px-4 py-1 ${
              selectedTypes.has("Log")
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => handleTypeChange("Log")}
          >
            Logs
          </button>
          <button
            className={`rounded-full px-4 py-1 ${
              selectedTypes.has("Project")
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => handleTypeChange("Project")}
          >
            Projects
          </button>
        </div>
      </div>
    </div>
  );
}
