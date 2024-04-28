import Link from "next/link";
import Image from "next/image";
import { getAllUnsplashImages } from "@/queries/all";
import ListView from "@/components/list-view";
import CollectionHero from "@/components/collection-hero";

export default async function PhotographyPage() {
  const data = await getAllUnsplashImages("gndclouds");
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
              <Link href={image.urls.regular} passHref>
                <div>
                  <Image
                    src={image.urls.small}
                    alt={`Image taken by ${image.alt_description}`}
                    className="rounded-lg"
                    width={300}
                    height={300}
                  />
                </div>
                <div className="mt-2">
                  <p>{image.exif.make}</p>
                  <p>{image.exif.model}</p>
                  <p>{image.exif.exposure_time}</p>
                  <p>{image.exif.aperture}</p>
                  <p>{image.exif.focal_length}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
