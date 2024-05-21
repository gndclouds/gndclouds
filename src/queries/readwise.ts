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
    console.log(data);

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

    let allBooks: any[] = []; // Explicitly typed as an array of any type
    let nextPageUrl = "https://readwise.io/api/v3/list/?category=epub";

    while (nextPageUrl) {
      const response = await fetch(nextPageUrl, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as { results: any[]; next: string };

      // Extract only epubs with image, title, author, and reading progress
      const booksSummary = data.results.map((item) => ({
        id: item.id, // Ensure each item has an id for key purposes in React components
        title: item.title,
        author: item.author,
        image_url: item.image_url,
        reading_progress: item.reading_progress,
      }));

      allBooks = allBooks.concat(booksSummary);
      nextPageUrl = data.next; // Update nextPageUrl with the next page link
    }

    console.log(allBooks);
    if (allBooks.length === 0) {
      console.log("No epubs found.");
    }
    return allBooks; // Ensure data is returned from the function
  } catch (error) {
    console.error("Error fetching Readwise epubs summary:", error);
    return []; // Return an empty array in case of an error to maintain the expected data type
  }
}

export { getReadwiseData, getReadwiseBooksSummary };
