import {
  allNotes,
  allLogs,
  allProjects,
  allNewsletters,
} from "@/.contentlayer/generated";

export async function fetchFilteredContent(
  query: string,
  currentPage: number,
  filter: string,
  selectedTypes: Set<string> = new Set() // Provide a default empty Set
) {
  const ITEMS_PER_PAGE = 10;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  // Combine all content
  const allContent = [
    ...allNotes,
    ...allLogs,
    ...allProjects,
    ...allNewsletters,
  ];

  // Log the types of all items
  console.log(allContent.map((item) => item.type));

  // Filter by selected types first
  let filteredContent = allContent.filter(
    (item) =>
      selectedTypes.has(item.type) &&
      item.title.toLowerCase().includes(query.toLowerCase())
  );

  let orderBy;
  if (filter === "recent") {
    orderBy = (a: { publishedAt: string }, b: { publishedAt: string }) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  } else if (filter === "oldest") {
    orderBy = (a: { publishedAt: string }, b: { publishedAt: string }) =>
      new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
  }

  // Apply sorting
  filteredContent.sort(orderBy);

  const paginatedContent = filteredContent.slice(
    offset,
    offset + ITEMS_PER_PAGE
  );

  return {
    items: paginatedContent,
    currentPage,
    totalPages: Math.ceil(filteredContent.length / ITEMS_PER_PAGE),
  };
}

export async function fetchContentPages(
  query: string,
  selectedTypes: Set<string> = new Set() // Provide a default empty Set
) {
  const ITEMS_PER_PAGE = 3;

  const allContent = [
    ...allNotes,
    ...allLogs,
    ...allProjects,
    ...allNewsletters,
  ].filter((item) => selectedTypes.has(item.type));

  const filteredContentCount = allContent.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  ).length;

  const totalPages = Math.ceil(filteredContentCount / ITEMS_PER_PAGE);
  return totalPages;
}
