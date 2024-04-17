"use client";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function Search({ placeholder }: { placeholder: string }) {
  const [selectedFilter, setSelectedFilter] = useState<string>("trending");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

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

  const handleFilterChange = (filter: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("filter", filter);
    replace(`${pathname}?${params.toString()}`);
    setSelectedFilter(filter);
  };

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
            className={`rounded-md  ${
              selectedFilter === "trending"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => handleFilterChange("trending")}
          >
            Notes
          </button>
          <button
            className={`rounded-md text-gray-700 ${
              selectedFilter === "recent"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => handleFilterChange("recent")}
          >
            Logs
          </button>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <select className="block w-full rounded-md border border-gray-200 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm">
              <option>Updated</option>
              <option>Trending</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
