import fetch from "node-fetch";

// Define interfaces for book data
interface ReadwiseBook {
  id: string;
  title: string;
  author: string;
  cover_image_url?: string;
  category: string;
  updated: string;
  tags?: string[];
}

interface BookWithTags extends ReadwiseBook {
  tags: string[];
}

interface BookSummary {
  id: string;
  title: string;
  author: string;
  image_url?: string;
  reading_progress: number;
  category: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  published_date: string | null;
  isRecommended: boolean;
}

const READWISE_TOKEN = process.env.READWISE_ACCESS_TOKEN; // Ensure you have READWISE_ACCESS_TOKEN in your environment variables
const READWISE_ENDPOINT = "https://readwise.io/api/v3/list/?category=epub";

async function getReadwiseData() {
  try {
    const response = await fetch(READWISE_ENDPOINT, {
      method: "GET",
      headers: {
        Authorization: `Token ${READWISE_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as { results: any[] };

    // Log category and tags for each item
    data.results.forEach((item) => {
      console.log(`Category: ${item.category}, Tags: ${item.tags}`);
    });

    // Extract relevant data fields
    const formattedData = data.results.map((item) => ({
      id: item.id,
      url: item.url,
      title: item.title,
      author: item.author,
      source: item.source,
      category: item.category,
      location: item.location,
      tags: item.tags,
      site_name: item.site_name,
      word_count: item.word_count,
      created_at: item.created_at,
      updated_at: item.updated_at,
      published_date: item.published_date,
      summary: item.summary,
      image_url: item.image_url,
      content: item.content,
      source_url: item.source_url,
      notes: item.notes,
      parent_id: item.parent_id,
      reading_progress: item.reading_progress,
    }));

    console.log(formattedData);
    return formattedData;
  } catch (error) {
    console.error("Error fetching Readwise data:", error);
    return null;
  }
}

async function getReadwiseBooksSummary(options = { recommendedOnly: false }): Promise<BookSummary[]> {
  try {
    console.log(
      `getReadwiseBooksSummary called with recommendedOnly=${options.recommendedOnly}`
    );
    console.log(`READWISE_TOKEN exists: ${!!READWISE_TOKEN}`);

    if (!READWISE_TOKEN) {
      console.error(
        "READWISE_ACCESS_TOKEN is not set in environment variables"
      );
      return [];
    }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${READWISE_TOKEN}`);
    myHeaders.append("Content-Type", "application/json");

    // Switch to using the books endpoint which includes tags
    const apiUrl = "https://readwise.io/api/v2/books/";
    let allItems: any[] = [];
    let pageCount = 0;
    const MAX_PAGES = 20; // Limit to prevent infinite loops
    let recommendedCount = 0;
    let nextUrl: string | null = apiUrl;

    // Define possible variations of the recommend tag
    const recommendTagVariations = [
      "recommend",
      "Recommend",
      "RECOMMEND",
      "recommended",
      "Recommended",
    ];

    // First, get all books
    while (nextUrl && pageCount < MAX_PAGES) {
      pageCount++;
      console.log(`Fetching page ${pageCount} from Readwise API: ${nextUrl}`);

      try {
        const response = await fetch(nextUrl, {
          method: "GET",
          headers: myHeaders,
        });

        if (!response.ok) {
          console.error(
            `HTTP error from Readwise API: ${response.status} ${response.statusText}`
          );
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = (await response.json()) as {
          results: ReadwiseBook[];
          next: string | null;
        };
        console.log(
          `Page ${pageCount}: Received ${data.results.length} books from Readwise API`
        );

        // Process each book to get its tags
        const booksWithTags = await Promise.all(
          data.results.map(async (book) => {
            try {
              // Get tags for this book
              const tagsResponse = await fetch(
                `https://readwise.io/api/v2/books/${book.id}/tags`,
                {
                  method: "GET",
                  headers: myHeaders,
                }
              );

              if (!tagsResponse.ok) {
                console.error(
                  `Error fetching tags for book ${book.id}: ${tagsResponse.status}`
                );
                return { ...book, tags: [] };
              }

              const tagsData = (await tagsResponse.json()) as {
                results?: Array<{ name: string }>;
              };
              
              // Safely handle potentially undefined results array
              let tags: string[] = [];
              try {
                if (tagsData && tagsData.results && Array.isArray(tagsData.results)) {
                  tags = tagsData.results.map((tag) => tag.name || "");
                }
              } catch (tagError) {
                console.error(`Error processing tags for book ${book.id}:`, tagError);
              }

              console.log(
                `Book ${book.id} (${book.title}) has tags: ${
                  tags.length > 0 ? tags.join(", ") : "none"
                }`
              );

              return { ...book, tags };
            } catch (error) {
              console.error(
                `Error processing tags for book ${book.id}:`,
                error
              );
              return { ...book, tags: [] };
            }
          })
        );

        // Log all tags for debugging
        console.log("Tags found in this batch:");
        const allTags = new Set<string>();
        booksWithTags.forEach((book: BookWithTags) => {
          try {
            if (book && book.tags && Array.isArray(book.tags)) {
              book.tags.forEach((tag: string) => {
                if (tag) allTags.add(tag);
              });
            }
          } catch (tagError) {
            console.error("Error processing tags for book summary:", tagError);
          }
        });
        console.log([...allTags]);

        // Count items with any variation of 'recommend' tag before filtering
        if (options.recommendedOnly) {
          const recommendedItemsOnPage = booksWithTags.filter(
            (book: any) => {
              try {
                if (!book || !book.tags || !Array.isArray(book.tags)) {
                  return false;
                }
                return book.tags.some((tag: string) => {
                  if (typeof tag !== 'string') return false;
                  return recommendTagVariations.some(
                    (variation) => tag.toLowerCase() === variation.toLowerCase()
                  );
                });
              } catch (error) {
                console.error("Error filtering recommended items:", error);
                return false;
              }
            }
          ).length;
          console.log(
            `Page ${pageCount}: Found ${recommendedItemsOnPage} books with any variation of 'recommend' tag`
          );
          recommendedCount += recommendedItemsOnPage;
        }

        // Extract items with additional fields for sorting and filtering
        const itemsSummary = booksWithTags
          .map((book: BookWithTags): BookSummary | null => {
            // Ensure reading_progress is a number between 0 and 1
            const progress = 0; // Reading progress not available in this endpoint

            // Determine media type based on category
            let mediaType = "";
            if (book.category === "books") {
              mediaType = "book";
            } else if (book.category === "articles") {
              mediaType = "article";
            } else if (Array.isArray(book.tags)) {
              if (book.tags.includes("paper")) {
                mediaType = "paper";
              } else if (book.tags.includes("video")) {
                mediaType = "video";
              }
            }

            // Ensure tags array includes the media type if determined
            const tags: string[] = Array.isArray(book.tags) ? [...book.tags] : [];
            if (mediaType && !tags.includes(mediaType)) {
              tags.push(mediaType);
            }

            // Check if the item has any variation of the 'recommend' tag
            let isRecommended = false;
            try {
              if (Array.isArray(tags)) {
                isRecommended = tags.some((tag: string) => {
                  if (typeof tag !== 'string') return false;
                  return recommendTagVariations.some(
                    (variation) => tag.toLowerCase() === variation.toLowerCase()
                  );
                });
              }
            } catch (tagError) {
              console.error("Error checking recommendation tags:", tagError);
            }

            // If we're only looking for recommended items and this isn't one, return null
            if (options.recommendedOnly && !isRecommended) {
              return null;
            }

            return {
              id: book.id,
              title: book.title || "Untitled",
              author: book.author || "Unknown Author",
              image_url: book.cover_image_url,
              reading_progress: progress,
              category: book.category,
              tags: tags,
              created_at: book.updated, // Using updated as created_at
              updated_at: book.updated,
              published_date: null, // Not available in this endpoint
              isRecommended,
            };
          })
          .filter(Boolean); // Remove null items (non-recommended when filtering)

        allItems = allItems.concat(itemsSummary);

        // Get the next page URL
        nextUrl = data.next;

        // Log summary for this page
        console.log(
          `Page ${pageCount}: Added ${itemsSummary.length} items after filtering`
        );

        // If we're only looking for recommended items and we have a decent number, we can stop
        if (options.recommendedOnly && allItems.length >= 100) {
          console.log(
            `Found ${allItems.length} recommended items, stopping pagination`
          );
          break;
        }
      } catch (error) {
        console.error(`Error fetching page ${pageCount}:`, error);
        break; // Stop pagination on error
      }
    }

    console.log(`Total items found: ${allItems.length}`);
    if (options.recommendedOnly) {
      console.log(`Total recommended items found: ${recommendedCount}`);
    }

    if (allItems.length === 0) {
      console.log("No items found after filtering.");
      if (options.recommendedOnly) {
        console.log(
          "Check if any items are tagged with variations of 'recommend' in your Readwise account."
        );
        console.log(
          "We checked for these variations: " +
            recommendTagVariations.join(", ")
        );
      }
    }

    return allItems;
  } catch (error) {
    console.error("Error fetching Readwise items summary:", error);
    return [];
  }
}

async function getReadwiseRecommendations() {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${READWISE_TOKEN}`);
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    let allRecommendations: any[] = [];
    let nextPageCursor: string | null = null;
    const apiUrl = "https://readwise.io/api/v2/export/";

    do {
      const queryParams = new URLSearchParams();
      if (nextPageCursor) {
        queryParams.append("pageCursor", nextPageCursor);
      }

      const response = await fetch(
        `${apiUrl}?${queryParams.toString()}`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as {
        results: any[];
        nextPageCursor: string;
      };

      // Filter items tagged as "recommend"
      const recommendations = data.results
        .filter(
          (item) => Array.isArray(item.tags) && item.tags.includes("recommend")
        )
        .map((item) => ({
          id: item.id,
          title: item.title,
          author: item.author,
          image_url: item.image_url,
          reading_progress: item.reading_progress,
          category: item.category,
          tags: item.tags,
        }));

      allRecommendations = allRecommendations.concat(recommendations);
      nextPageCursor = data.nextPageCursor || null; // Update the nextPageCursor to the next page

      // Log category and tags for each item
      recommendations.forEach((item) => {
        const tags = Array.isArray(item.tags)
          ? item.tags.join(", ")
          : "No tags";
        console.log(`Category: ${item.category}, Tags: ${tags}`);
      });
    } while (nextPageCursor);

    console.log(allRecommendations);
    if (allRecommendations.length === 0) {
      console.log("No recommendations found.");
    }
    return allRecommendations;
  } catch (error) {
    console.error("Error fetching Readwise recommendations:", error);
    return [];
  }
}

export { getReadwiseData, getReadwiseBooksSummary, getReadwiseRecommendations };
