import { getAllMarkdownFiles } from "@/queries/posts";

export default async function Home() {
  const posts = await getAllMarkdownFiles();

  return (
    <main>
      <h1>All Content</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <a href={`/content/${post.slug}`}>{post.title}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
