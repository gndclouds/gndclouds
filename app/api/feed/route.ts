import { NextApiRequest, NextApiResponse } from "next";
import { compareDesc } from "date-fns";
import {
  allNotes,
  allLogs,
  allProjects,
  allNewsletters,
} from "@/.contentlayer/generated";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const query = (request.query.query as string) || "";
  const currentPage = parseInt(request.query.currentPage as string) || 1;
  const itemsPerPage = parseInt(request.query.itemsPerPage as string) || 5;

  let combinedItems = [
    ...allNotes,
    ...allLogs,
    ...allProjects,
    ...allNewsletters,
  ];

  // Filter by query if provided
  if (query) {
    combinedItems = combinedItems.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Sort by publishedAt date
  combinedItems.sort((a, b) =>
    compareDesc(new Date(a.publishedAt || ""), new Date(b.publishedAt || ""))
  );

  // Pagination
  const offset = (currentPage - 1) * itemsPerPage;
  const paginatedItems = combinedItems.slice(offset, offset + itemsPerPage);

  response.status(200).json({
    items: paginatedItems,
    currentPage,
    totalPages: Math.ceil(combinedItems.length / itemsPerPage),
  });
}
