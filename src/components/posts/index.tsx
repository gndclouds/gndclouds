import { type Post } from "@/queries/posts";
import Link from "next/link";

export function Posts({ posts }: { posts: Post[] }) {
  return (
    <ol>
      {posts.map(({ slug, title, categories }) => (
        <li key={slug}>
          post!
          <h2>
            <Link href={`/${slug}`}>{title}</Link>
          </h2>
          <p></p>
        </li>
      ))}
    </ol>
  );
}
