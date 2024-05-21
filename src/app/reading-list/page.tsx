import { getReadwiseBooksSummary } from "@/queries/readwise";

import Image from "next/image";
import ListView from "@/components/list-view";
import CollectionHero from "@/components/collection-hero";

export default async function WatchListPage() {
  let data = await getReadwiseBooksSummary();

  // Check if data is not null and is an array, otherwise set to empty array
  const items = data && Array.isArray(data) ? data : [];

  return (
    <main>
      <CollectionHero name="Reading List" projects={data} allProjects={data} />
      <section
        style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}
      >
        {items.length > 0 ? (
          items.map((item: any) => (
            <div key={item.id} style={{ margin: "10px" }}>
              <h2>{item.title}</h2>
              <p>Author: {item.author}</p>
              <Image
                src={item.image_url}
                alt={`Cover for ${item.title}`}
                width={250}
                height={375}
                style={{ width: "100%", height: "auto", maxWidth: "250px" }}
              />
              <div style={{ marginTop: "10px" }}>
                <p>Reading Progress: {item.reading_progress}</p>
                <div style={{ width: "100%", backgroundColor: "#ddd" }}>
                  <div
                    style={{
                      height: "20px",
                      width: `${item.reading_progress}%`,
                      backgroundColor: "green",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No books found.</p>
        )}
      </section>
    </main>
  );
}
