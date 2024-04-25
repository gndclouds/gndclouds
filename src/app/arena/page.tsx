import {
  getArenaUserActivity,
  getArenaBlockData,
  getArenaChannelData,
} from "@/queries/all";
import { Suspense } from "react";
import Image from "next/image";
import ListView from "@/components/list-view";
import CollectionHero from "@/components/collection-hero";

export default async function Home() {
  const userActivity = await getArenaUserActivity("gndclouds");
  const allArenaData = await Promise.all(
    userActivity.map(async (item) => {
      if (item.type === "block") {
        return await getArenaBlockData(item.id);
      } else if (item.type === "channel") {
        return await getArenaChannelData(item.id);
      }
    })
  );
  // console.log(allArenaData);
  return (
    <div>
      <CollectionHero
        name="are.na"
        projects={allArenaData}
        allProjects={allArenaData}
      />
      <Suspense fallback={<p>Loading feed...</p>}>
        <ul>
          {allArenaData.map((block) => (
            <li key={block.id}>
              {block.title}
              <Image
                src={block.images.display}
                alt={block.title}
                width={100}
                height={100}
              />
            </li>
          ))}
        </ul>
      </Suspense>
    </div>
  );
}
