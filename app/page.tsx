"use client";
import React, { useState, useEffect } from "react";
import { fetchContentPages } from "@/app/queries/all";
import Hello from "@/app/components/hello";
import Pagination from "@/app/components/pagination";
import Search from "@/app/components/search";
import LoadingSkeleton from "@/app/loading";
import styles from "./page.module.css";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const filter = searchParams.get("filter") || "";
  const selectedTypes = searchParams.get("selectedTypes")?.split(",") || [];
  const currentPage = Number(searchParams.get("page")) || 1;
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      setLoading(true);
      const pages = await fetchContentPages(query, new Set(selectedTypes));
      setTotalPages(pages);
      setLoading(false);
    };

    fetchPages();
  }, [query, selectedTypes, currentPage]);

  return (
    <div className="flex flex-col md:flex-row w-full">
      {/* Hero Section */}
      <section className="md:w-1/2 pt-24 md:pt-0 md:show">
        <Hello />
      </section>
      <section className="md:w-1/2 hidden md:block">
        <Search placeholder="Search structures..." />
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <React.Fragment>
            {/* Implement FeedListView with fetched data */}
            <div>Feed content based on fetched data</div>
            <Pagination totalPages={totalPages} />
          </React.Fragment>
        )}
      </section>
    </div>
  );
}
