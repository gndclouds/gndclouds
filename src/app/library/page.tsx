import { getReadwiseBooksSummary } from "@/queries/readwise";

import Image from "next/image";
import ListView from "@/components/list-view";
import CollectionHero from "@/components/collection-hero";
import ImageWithFallback from "@/components/ImageWithFallback";

export default async function WatchListPage() {
  let data = await getReadwiseBooksSummary();

  // Check if data is not null and is an array, otherwise set to empty array
  const items = data && Array.isArray(data) ? data : [];

  // Filter items with reading_progress >= 0.5
  const filteredItems = items.filter(
    (item: any) => item.reading_progress >= 0.5
  );

  return (
    <main>
      <CollectionHero
        name="Reading List"
        projects={filteredItems}
        allProjects={filteredItems}
      />
      <section
        style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)" }}
      >
        {filteredItems.length > 0 ? (
          filteredItems.map((item: any) => (
            <div key={item.id} style={{ margin: "10px" }}>
              {/* <p>Author: {item.author}</p> */}
              <ImageWithFallback
                src={item.image_url}
                alt={`Cover for ${item.title}`}
                width={250}
                height={375}
              />
              <h2>{item.title}</h2>

              <div style={{ marginTop: "10px" }}>
                <div
                  style={{
                    width: "100%",
                    backgroundColor: "#ddd",
                    borderRadius: "5px",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      height: "5px",
                      width: `${item.reading_progress * 100}%`, // Correctly scale the width
                      backgroundColor: "green",
                      borderRadius: "5px",
                      position: "relative",
                      color: "white",
                      lineHeight: "20px", // Center the text vertically
                      paddingLeft: "5px", // Add padding for left alignment
                      mixBlendMode: "difference", // Use blend mode for text effect
                    }}
                  >
                    {/* {`${(item.reading_progress * 100).toFixed(2)}%`} */}
                  </div>
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
