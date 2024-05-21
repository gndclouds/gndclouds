import { getAllNewsletters } from "@/queries/newsletters";
import CollectionHero from "@/components/collection-hero";
import { NewsletterList } from "@/components/newsletter-list";

export default async function FeedPage() {
  const data = await getAllNewsletters();

  const sortedData = data.sort((a, b) => {
    const dateA = new Date(a.publishedAt).getTime(); // Ensure you use the correct date field
    const dateB = new Date(b.publishedAt).getTime();
    return dateB - dateA;
  });

  return (
    <main>
      <CollectionHero
        name="Newsletters"
        projects={sortedData}
        allProjects={sortedData}
      />
      <section>
        <NewsletterList newsletters={sortedData} />
      </section>
    </main>
  );
}
