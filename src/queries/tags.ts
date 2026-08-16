import { getAllMarkdownFiles } from "@/queries/all";
import { Post } from "@/queries/all";

interface TagCount {
  tag: string;
  count: number;
}

export async function getAllTagsWithCount(): Promise<TagCount[]> {
  const allContent = await getAllMarkdownFiles();
  const tagCountMap: { [key: string]: number } = {};

  allContent.forEach((item) => {
    item.tags.forEach((tag) => {
      if (tagCountMap[tag]) {
        tagCountMap[tag]++;
      } else {
        tagCountMap[tag] = 1;
      }
    });
  });

  return Object.keys(tagCountMap).map((tag) => ({
    tag,
    count: tagCountMap[tag],
  }));
}
