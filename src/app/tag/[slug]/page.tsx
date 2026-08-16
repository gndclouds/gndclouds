import { getContentByTag } from "@/queries/tag";
import ListView from "@/components/list-view";
import CollectionHero from "@/components/collection-hero";

interface Params {
  params: {
    slug: string;
  };
}

export default async function TagPage({ params }: Params) {
  const { slug } = params;
  const data = await getContentByTag(slug);

  return (
    <main>
      <CollectionHero
        name={`Tag: ${slug}`}
        projects={data}
        allProjects={data}
      />
      <section className="flex flex-col gap-4 p-4">
        <ListView data={data} />
      </section>
    </main>
  );
}
