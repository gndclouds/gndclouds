export async function getArenagramImages(): Promise<any[]> {
  const arenaAccessToken = process.env.ARENA_ACCESS_KEY;
  if (!arenaAccessToken) {
    throw new Error(
      "ARENA_ACCESS_KEY is not set in the environment variables."
    );
  }

  const channelId = "arenagram-iykx83-ruio"; // Channel ID for Arenagram
  let allImages = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(
      `https://api.are.na/v2/channels/${channelId}/contents?access_token=${arenaAccessToken}&page=${page}`
    );
    console.log(response);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Arenagram images from Are.na: ${response.statusText}`
      );
    }

    const data = await response.json();
    const images = data.contents.filter(
      (content: any) => content.class === "Image"
    );
    allImages = allImages.concat(images);
    hasMore = data.contents.length > 0;
    page++;
  }

  // Sort images by newest to oldest
  allImages.sort(
    (a: any, b: any) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return allImages.map((image: any) => ({
    id: image.id,
    title: image.title,
    image_url: image.image.display.url, // Assuming 'display' size is desired
    created_at: image.created_at,
    updated_at: image.updated_at,
  }));
}

export async function getCollectionData(): Promise<any[]> {
  const arenaAccessToken = process.env.ARENA_ACCESS_KEY;
  if (!arenaAccessToken) {
    throw new Error(
      "ARENA_ACCESS_KEY is not set in the environment variables."
    );
  }

  const collectionId = "collections-r3pfcbxeb_q"; // Collection ID for other channels
  const response = await fetch(
    `https://api.are.na/v2/channels/${collectionId}?access_token=${arenaAccessToken}`
  );
  console.log(response);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch collection data from Are.na: ${response.statusText}`
    );
  }

  const data = await response.json();
  const collections = data.contents.filter(
    (content: any) => content.class === "Channel"
  );

  return collections.map((collection: any) => ({
    id: collection.id,
    title: collection.title,
    created_at: collection.created_at,
    updated_at: collection.updated_at,
  }));
}
