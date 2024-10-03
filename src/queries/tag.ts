import { getAllMarkdownFiles } from "@/queries/all";
import { Post } from "@/queries/all";

export async function getContentByTag(tag: string): Promise<Post[]> {
  const allContent = await getAllMarkdownFiles();
  return allContent.filter((item) => item.tags.includes(tag));
}
