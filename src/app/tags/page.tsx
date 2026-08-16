import Link from "next/link";
import { getAllTagsWithCount } from "@/queries/tags";
import CollectionHero from "@/components/collection-hero";

export default async function TagsPage() {
  const tagsWithCount = await getAllTagsWithCount();

  return (
    <main>
      <CollectionHero
        name="All Tags"
        projects={tagsWithCount}
        allProjects={tagsWithCount}
      />
      <section className="flex flex-col gap-4 p-4">
        <ul>
          {tagsWithCount.map(({ tag, count }) => (
            <li key={tag}>
              <Link href={`/tag/${tag}`}>
                {tag} ({count})
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
