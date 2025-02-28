"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import CollectionHero from "@/components/collection-hero";
import ImageWithFallback from "@/components/ImageWithFallback";
import SortOptions from "@/components/sort-options";

// Define the Book type
interface Book {
  id: string;
  title: string;
  author: string;
  image_url: string;
  reading_progress: number;
  category: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  published_date: string;
  isRecommended: boolean;
}

// Define media types for filtering
type MediaType = "book" | "article" | "paper" | "video";

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [sortBy, setSortBy] = useState("title");
  const [selectedMediaTypes, setSelectedMediaTypes] = useState<MediaType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 24; // Number of items to show per page

  // Media type options
  const mediaTypeOptions: { value: MediaType; label: string }[] = [
    { value: "book", label: "Books" },
    { value: "article", label: "Articles" },
    { value: "paper", label: "Papers" },
    { value: "video", label: "Videos" },
  ];

  useEffect(() => {
    async function fetchBooks() {
      try {
        setIsLoading(true);
        // Always fetch only recommended items
        const url = "/api/readwise?recommended=true";

        const response = await fetch(url);

        if (!response.ok) {
          if (response.status === 404) {
            console.log("No recommended items found");
            setBooks([]);
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Ensure data is an array
        if (Array.isArray(data)) {
          setBooks(data);
        } else if (data && typeof data === "object") {
          // Handle case where API returns an object with a message
          console.error("API returned unexpected format:", data);
          setBooks([]);
        } else {
          setBooks([]);
        }

        // Reset to first page when changing filters
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching books:", error);
        setBooks([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    }

    fetchBooks();
  }, []); // No dependencies since we always fetch recommended items

  // Toggle a media type filter
  const toggleMediaType = (mediaType: MediaType) => {
    setSelectedMediaTypes((prev) =>
      prev.includes(mediaType)
        ? prev.filter((type) => type !== mediaType)
        : [...prev, mediaType]
    );
    // Reset to first page when changing filters
    setCurrentPage(1);
  };

  // Filter books based on tags only
  const filteredBooks = (books || []).filter((book) => {
    // Make sure book has tags array
    const tags = Array.isArray(book.tags) ? book.tags : [];

    // If no media types are selected, show all
    if (selectedMediaTypes.length === 0) {
      return true;
    }

    // Check if the book has any of the selected media type tags
    return selectedMediaTypes.some((mediaType) => tags.includes(mediaType));
  });

  // Sort books based on the selected sort option
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return (a.title || "").localeCompare(b.title || "");
      case "author":
        return (a.author || "").localeCompare(b.author || "");
      case "reading_progress":
        return (b.reading_progress || 0) - (a.reading_progress || 0);
      case "created_at":
        return a.created_at && b.created_at
          ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          : 0;
      case "published_date":
        if (!a.published_date) return 1;
        if (!b.published_date) return -1;
        return (
          new Date(b.published_date).getTime() -
          new Date(a.published_date).getTime()
        );
      default:
        return 0;
    }
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = sortedBooks.slice(startIndex, endIndex);

  // Handle page changes
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main>
      <CollectionHero
        name="Library"
        projects={sortedBooks}
        allProjects={books}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <SortOptions onSortChange={setSortBy} currentSort={sortBy} />

          <div className="flex flex-wrap items-center gap-4">
            {/* Media type tag filters */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium mr-1">Media Tags:</span>
              {mediaTypeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleMediaType(option.value)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedMediaTypes.includes(option.value)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-4 text-sm text-gray-600">
          Displaying {startIndex + 1}-{Math.min(endIndex, sortedBooks.length)}{" "}
          of {sortedBooks.length} recommended items
          {selectedMediaTypes.length > 0 && (
            <span> (filtered by tags: {selectedMediaTypes.join(", ")})</span>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {books.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-4">
                  No recommended items found
                </h3>
                <p className="text-gray-600 mb-6">
                  It looks like you don&apos;t have any items tagged with
                  &apos;recommend&apos; in your Readwise account.
                </p>
                <p className="text-gray-600 mb-6">
                  To see items here, add the &apos;recommend&apos; tag to items
                  in your Readwise library.
                </p>
                <div className="text-gray-600 mb-6">
                  <strong>How to add tags in Readwise:</strong>
                  <ol className="list-decimal list-inside mt-2 text-left max-w-md mx-auto">
                    <li>Go to your Readwise account</li>
                    <li>Open the book or article you want to recommend</li>
                    <li>Click on the &quot;Tags&quot; button</li>
                    <li>Add the tag &quot;recommend&quot;</li>
                    <li>Save your changes</li>
                  </ol>
                </div>
                <p className="text-gray-600">
                  <strong>Troubleshooting:</strong> We check for several
                  variations of the tag including &apos;recommend&apos;,
                  &apos;Recommend&apos;, &apos;RECOMMEND&apos;,
                  &apos;recommended&apos;, and &apos;Recommended&apos;.
                </p>
              </div>
            ) : (
              <>
                <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                  {currentItems.length > 0 ? (
                    currentItems.map((book) => (
                      <div key={book.id} className="flex flex-col">
                        <div className="relative">
                          <ImageWithFallback
                            src={book.image_url}
                            alt={`Cover for ${book.title}`}
                            width={250}
                            height={375}
                          />

                          {/* Star for recommended items */}
                          <div
                            className="absolute top-0 right-0 bg-yellow-400 text-white p-1 rounded-bl-md"
                            title="Recommended item"
                          >
                            ★
                          </div>

                          {/* Media type tag badge */}
                          {book.tags &&
                            book.tags.some((tag) =>
                              mediaTypeOptions.some((opt) => opt.value === tag)
                            ) && (
                              <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 text-white px-2 py-1 text-xs">
                                {mediaTypeOptions.find((opt) =>
                                  book.tags.includes(opt.value)
                                )?.label || ""}
                              </div>
                            )}

                          {/* Reading progress indicator */}
                          <div className="mt-2">
                            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  book.reading_progress >= 1
                                    ? "bg-green-500"
                                    : book.reading_progress >= 0.9
                                    ? "bg-yellow-500"
                                    : "bg-blue-500"
                                }`}
                                style={{
                                  width: `${Math.min(
                                    book.reading_progress * 100,
                                    100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {book.reading_progress >= 1
                                ? "Completed"
                                : `${Math.round(book.reading_progress * 100)}%`}
                            </div>
                          </div>
                        </div>

                        <h3 className="font-medium mt-2 line-clamp-2">
                          {book.title}
                        </h3>
                        <p className="text-sm text-gray-600">{book.author}</p>
                      </div>
                    ))
                  ) : (
                    <p className="col-span-full text-center py-8">
                      No items found matching the selected filters.
                    </p>
                  )}
                </section>

                {/* Pagination controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <nav className="flex items-center gap-1">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Previous page"
                      >
                        &laquo;
                      </button>

                      {/* Show page numbers with ellipsis for many pages */}
                      {Array.from(
                        { length: Math.min(totalPages, 5) },
                        (_, i) => {
                          // Logic to show pages around current page
                          let pageNum;
                          if (totalPages <= 5) {
                            // Show all pages if 5 or fewer
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            // Near the start
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            // Near the end
                            pageNum = totalPages - 4 + i;
                          } else {
                            // In the middle
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => goToPage(pageNum)}
                              className={`w-8 h-8 flex items-center justify-center rounded ${
                                currentPage === pageNum
                                  ? "bg-blue-600 text-white"
                                  : "border border-gray-300 hover:bg-gray-100"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}

                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Next page"
                      >
                        &raquo;
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}
