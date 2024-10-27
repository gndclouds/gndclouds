import fetch from "node-fetch";

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

async function getReadwiseBooksSummary() {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${READWISE_TOKEN}`);
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    let allBooks: any[] = [];
    let nextPageUrl = "https://readwise.io/api/v3/list/?category=epub";

    while (nextPageUrl) {
      const response = await fetch(nextPageUrl, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as { results: any[]; next: string };

      // Extract only epubs with image, title, author, and reading progress
      const booksSummary = data.results
        .map((item) => ({
          id: item.id,
          title: item.title,
          author: item.author,
          image_url: item.image_url,
          reading_progress: item.reading_progress,
          category: item.category, // Log category
          tags: item.tags, // Log tags
        }))
        .filter((book) => book.reading_progress > 0); // Filter books with reading progress > 0

      allBooks = allBooks.concat(booksSummary);
      nextPageUrl = data.next; // Update the nextPageUrl to the next page

      // Log category and tags for each item
      booksSummary.forEach((book) => {
        const tags = Array.isArray(book.tags)
          ? book.tags.join(", ")
          : "No tags";
        console.log(`Category: ${book.category}, Tags: ${tags}`);
      });
    }

    console.log(allBooks);
    if (allBooks.length === 0) {
      console.log("No epubs found.");
    }
    return allBooks;
  } catch (error) {
    console.error("Error fetching Readwise epubs summary:", error);
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
