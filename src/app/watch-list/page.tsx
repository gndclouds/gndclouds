import { parseStringPromise } from "xml2js";
import { getPublicPlexWatchList } from "@/queries/plex";

export default async function WatchListPage() {
  let data: any = await getPublicPlexWatchList();

  // Check if data is a string and try to parse it as XML
  if (typeof data === "string" && data.startsWith("<?xml")) {
    try {
      const result = await parseStringPromise(data);
      data = result; // Assuming the XML is converted to a suitable JS object
    } catch (error) {
      console.error("Error parsing XML:", error);
      return <div>Error loading data</div>;
    }
  }

  // Assuming data is now an object with a property 'item' which is an array
  const items = (data as any)?.rss?.channel?.[0]?.item || [];

  return (
    <main>
      {/* <CollectionHero name="Watch List" projects={data} allProjects={data} /> */}
      <section className="grid grid-cols-1 gap-4">
        {items.map((item: any) => (
          <div key={item.guid[0]._} className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-lg font-bold">{item.title[0]}</h2>
            <p className="text-gray-600">{item.description[0]}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
