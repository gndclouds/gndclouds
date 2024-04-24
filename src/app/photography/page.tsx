import { getAllUnsplashImages } from "@/queries/all";
import CollectionHero from "@/components/CollectionHero";

export default async function Home() {
  const data = await getAllUnsplashImages("gndclouds");

  return (
    <div>
      {/* <CollectionHero projects={data} allProjects={data} /> */}
      <section>
        <div className="gallery flex flex-wrap justify-start">
          {data.map((image, index) => (
            <div
              key={image.id}
              className={`gallery-item mb-4 ${
                index % 2 === 0 ? "mr-2" : "ml-2"
              }`}
            >
              <a
                href={image.urls.regular}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={image.urls.thumb}
                  alt={`Image taken by ${image.user.name}`}
                  className="rounded-lg"
                />
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
