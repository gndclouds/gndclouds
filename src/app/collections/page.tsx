import Link from "next/link";
import Image from "next/image";
import { getCollectionData } from "@/queries/arena";
import ListView from "@/components/list-view";
import CollectionHero from "@/components/collection-hero";

export default async function PhotographyPage() {
  const data = await getCollectionData();
  return (
    <main>
      <CollectionHero name="Photography" projects={data} allProjects={data} />
      <section>
        <div className="gallery flex flex-wrap justify-start">
          {data.map((collection, index) => (
            <div
              key={collection.id}
              className={`gallery-item mb-4 ${
                index % 2 === 0 ? "mr-2" : "ml-2"
              }`}
            >
              <Link href={`/collections/${collection.id}`} passHref>
                <div>
                  <Image
                    src={collection.image_url || "/default-image.jpg"} // Fallback to a default image if none is provided
                    alt={`Collection titled ${collection.title}`}
                    className="rounded-lg"
                    width={300}
                    height={300}
                  />
                </div>
                <div className="mt-2">
                  <p>{collection.title}</p>
                  <p>Created at: {collection.created_at}</p>
                  <p>Updated at: {collection.updated_at}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
