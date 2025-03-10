import { getArenaUserActivity, getArenaBlockData } from "@/queries/arena";
import { Suspense } from "react";
import Image from "next/image";
import ListView from "@/components/list-view";
import CollectionHero from "@/components/collection-hero";

export default async function Home() {
  const userActivity = await getArenaUserActivity("gndclouds");
  if (!userActivity) {
    // Handle the case where userActivity is void or null
    return <p>No activity found.</p>;
  }
  const allArenaData = await Promise.all(
    userActivity.map(async (item: any) => {
      if (item.type === "block") {
        return await getArenaBlockData(item.id);
      } else if (item.type === "channel") {
        // return await getArenaChannelData(item.id);
      }
    })
  );
  // console.log(allArenaData);
  return (
    <div className="flex flex-col p-5">
      <Suspense fallback={<p>Loading feed...</p>}>
        <ul className="space-y-5">
          {allArenaData.map((block: any) => (
            <li
              key={block.id}
              className="flex rounded-lg shadow overflow-hidden"
            >
              <div className="w-24 h-24 relative">
                <Image
                  src={block.images.display}
                  alt={block.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="flex flex-col p-4 flex-grow">
                <h3 className="text-lg font-semibold text-gray-900">
                  {block.title}
                </h3>
                <p className="text-gray-600">{block.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </Suspense>
    </div>
  );
}
