import {
  allNotes,
  allLogs,
  allProjects,
  allNewsletters,
} from "@/.contentlayer/generated";

export async function fetchFilteredContent(
  query: string,
  currentPage: number,
  filter: string
) {
  const ITEMS_PER_PAGE = 10;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const allContent = [
    ...allNotes,
    ...allLogs,
    ...allProjects,
    ...allNewsletters,
  ];

  let orderBy;
  if (filter === "trending") {
    orderBy = (a, b) => b.views - a.views;
  } else if (filter === "recent") {
    orderBy = (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  } else {
    orderBy = (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  }

  let filteredContent = allContent.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

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

export async function fetchContentPages(query: string) {
  const ITEMS_PER_PAGE = 3;

  const allContent = [
    ...allNotes,
    ...allLogs,
    ...allProjects,
    ...allNewsletters,
  ];

  const filteredContentCount = allContent.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  ).length;

  const totalPages = Math.ceil(filteredContentCount / ITEMS_PER_PAGE);
  return totalPages;
}
