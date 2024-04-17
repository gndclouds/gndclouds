"use client";
import React, { useState, Suspense } from "react";
import { fetchContentPages } from "@/app/queries/all";
import Hello from "@/app/components/hello";
import Pagination from "@/app/components/pagination";
import Search from "@/app/components/search";
import FeedListView from "@/app/components/feel/list";
import styles from "./page.module.css";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    filter?: string;
  };
}) {
  const query = searchParams?.query || "";
  const filter = searchParams?.filter || "";

  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchContentPages(query);

  return (
    <div className="w-full">
      {/* Hero Secrion */}
      <section className="pt-24">Add hello</section>
      <Search placeholder="Search structures..." />

      <Suspense key={query + currentPage + filter}>
        <FeedListView
          query={query}
          currentPage={Number(currentPage) || 1}
          filter={filter}
        />
      </Suspense>
      <Pagination totalPages={totalPages} />
    </div>
  );
}
