import Link from "next/link";
import Image from "next/image";
import { getArenagramImages } from "@/queries/arena";
import ListView from "@/components/list-view";
import CollectionHero from "@/components/collection-hero";

export default async function PhotographyPage() {
  const data = await getArenagramImages();
  return (
    <main>
      <CollectionHero name="Photography" projects={data} allProjects={data} />
      <section>
        <div className="gallery flex flex-wrap justify-start">
          {data.map((image, index) => (
            <div
              key={image.id}
              className={`gallery-item mb-4 ${
                index % 2 === 0 ? "mr-2" : "ml-2"
              }`}
            >
              <Link href={image.image_url} passHref>
                <div>
                  <Image
                    src={image.image_url}
                    alt={`Image titled ${image.title}`}
                    className="rounded-lg"
                    width={300}
                    height={300}
                  />
                </div>
                <div className="mt-2">
                  <p>{image.title}</p>
                  <p>Created at: {image.created_at}</p>
                  <p>Updated at: {image.updated_at}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
